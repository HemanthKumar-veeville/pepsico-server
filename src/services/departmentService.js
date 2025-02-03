const { Department, User } = require("../models");

class DepartmentService {
  async createDepartment(departmentData) {
    try {
      const existingDepartment = await Department.findOne({
        where: { name: departmentData.name },
      });

      if (existingDepartment) {
        throw new Error("Department with this name already exists");
      }

      return await Department.create(departmentData);
    } catch (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }
  }

  async getAllDepartments() {
    try {
      return await Department.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email", "role"],
            through: { attributes: [] }, // Excludes junction table attributes
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
  }

  async getDepartmentById(id) {
    try {
      const department = await Department.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email", "role"],
            through: { attributes: [] },
          },
        ],
      });

      if (!department) {
        throw new Error("Department not found");
      }

      return department;
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment(id, updateData) {
    try {
      const department = await Department.findByPk(id);

      if (!department) {
        throw new Error("Department not found");
      }

      if (updateData.name) {
        const existingDepartment = await Department.findOne({
          where: { name: updateData.name },
        });

        if (existingDepartment && existingDepartment.id !== id) {
          throw new Error("Department with this name already exists");
        }
      }

      return await department.update(updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartment(id) {
    try {
      const department = await Department.findByPk(id);

      if (!department) {
        throw new Error("Department not found");
      }

      // Check if department has any users
      const users = await department.getUsers();
      if (users.length > 0) {
        throw new Error("Cannot delete department with existing users");
      }

      await department.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DepartmentService();
