const { Idea, Department, User, Notification } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const { OpenAI } = require("openai");
const departmentService = require("./departmentService");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class IdeaService {
  async createIdea(ideaData, userId) {
    try {
      // 1. First create the idea with initial data
      const idea = await Idea.create({
        user_id: userId,
        title: ideaData.title,
        description: ideaData.description,
        content: ideaData.content,
        supporting_documents: ideaData.supporting_documents || [],
      });

      // 2. Use ChatGPT to analyze the idea and determine department
      const department = await this.analyzeDepartment(idea);
      const departmentName = await departmentService.getDepartmentById(
        department.id
      );

      // 3. Update idea with department
      await idea.update({
        department_id: department.id,
        department_name: departmentName.name,
      });

      // 4. Notify relevant department users
      //   await this.notifyDepartmentUsers(idea, department);

      return idea;
    } catch (error) {
      throw new Error(`Failed to create idea: ${error.message}`);
    }
  }

  async analyzeDepartment(idea) {
    try {
      // Get all available departments
      const departments = await Department.findAll({
        attributes: ["id", "name"],
      });

      // Create a list of departments with their IDs for ChatGPT
      const departmentInfo = departments
        .map((dept) => `${dept.name} (ID: ${dept.id})`)
        .join(", ");

      const prompt = `You are a department classifier. Given a list of departments with their IDs, analyze the idea and respond ONLY with the most appropriate department's ID number. No other text, just the ID.

Available departments: ${departmentInfo}

Idea to classify:
Title: ${idea.title}
Description: ${idea.description}

Remember: Respond only with the department ID number, nothing else.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: 0.3, // Lower temperature for more focused responses
      });

      const suggestedDepartmentId =
        completion.choices[0].message.content.trim();

      // Verify if the suggested ID exists in our departments
      const departmentExists = departments.some(
        (dept) => dept.id === suggestedDepartmentId
      );

      if (departmentExists) {
        return { id: suggestedDepartmentId };
      }

      // If the suggested ID is invalid, find the "Other" department
      const otherDepartment = departments.find((dept) => dept.name === "Other");
      return { id: otherDepartment.id };
    } catch (error) {
      // In case of any error, find and return the "Other" department ID
      const otherDepartment = await Department.findOne({
        where: { name: "Other" },
        attributes: ["id"],
      });
      return { id: otherDepartment.id };
    }
  }

  async notifyDepartmentUsers(idea, department) {
    try {
      // Get all users in the department
      const departmentUsers = await User.findAll({
        include: [
          {
            model: Department,
            where: { id: department.id },
            through: { attributes: [] },
          },
        ],
      });

      // Create notifications for each user
      const notifications = departmentUsers.map((user) => ({
        user_id: user.id,
        idea_id: idea.id,
        content: `New idea submission: ${idea.title} requires your attention.`,
      }));

      await Notification.bulkCreate(notifications);
    } catch (error) {
      throw new Error(`Failed to notify users: ${error.message}`);
    }
  }

  async getAllIdeas(userId) {
    try {
      // First get the user with their department_ids
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If user is CEO or Admin, show all ideas
      const showAllIdeas = ["CEO", "Admin"].includes(user.role);

      // Build the query
      const query = {
        include: [
          { model: User, attributes: ["id", "name", "email"] },
          { model: Department, attributes: ["id", "name"] },
        ],
        order: [["createdAt", "DESC"]],
      };

      // Add department filter if user is not CEO or Admin
      if (!showAllIdeas) {
        query.where = {
          department_id: {
            [Op.in]: user.department_ids,
          },
        };
      }
      const ideas = await Idea.findAll(query);

      return ideas;
    } catch (error) {
      throw new Error(`Failed to fetch ideas: ${error.message}`);
    }
  }

  async getIdeaById(id) {
    const idea = await Idea.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Department, attributes: ["id", "name"] },
      ],
    });
    if (!idea) throw new Error("Idea not found");
    return idea;
  }

  async updateIdea(id, updateData) {
    const idea = await Idea.findByPk(id);
    if (!idea) throw new Error("Idea not found");
    return await idea.update(updateData);
  }

  async deleteIdea(id) {
    const idea = await Idea.findByPk(id);
    if (!idea) throw new Error("Idea not found");
    await idea.destroy();
    return true;
  }
}

module.exports = new IdeaService();
