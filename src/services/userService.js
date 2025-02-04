const { User, Department } = require("../models");

class UserService {
  async createUser(userData) {
    try {
      if (!userData?.email || !userData?.name || !userData?.google_id) {
        throw new Error("Missing required user data");
      }

      // First try to find if user exists
      const existingUser = await User.findOne({
        where: { google_id: userData.google_id },
      });

      // If user exists, return the existing user (login flow)
      if (existingUser) {
        // Optionally update user data if needed
        await existingUser.update({
          name: userData.name, // Update name in case it changed
          email: userData.email, // Update email in case it changed
        });
        return existingUser;
      }

      // If user doesn't exist, create new user (signup flow)
      // Validate role if provided
      if (
        userData.role &&
        !["CEO", "Admin", "Member"].includes(userData.role)
      ) {
        throw new Error("Invalid role specified");
      }

      const user = await User.create({
        ...userData,
        role: userData.role || "Member",
      });
      return user;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Email or Google ID already exists");
      }
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await User.findAll({
        include: [
          {
            model: Department,
            attributes: ["id", "name"],
            // If you have defined the association as belongsToMany, use:
            // through: { attributes: [] }, // This will exclude junction table attributes
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      if (!id) throw new Error("User ID is required");

      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      if (!id) throw new Error("User ID is required");

      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      // Prevent role escalation if not allowed
      if (
        userData.role &&
        !["CEO", "Admin", "Member"].includes(userData.role)
      ) {
        throw new Error("Invalid role specified");
      }

      return await user.update(userData);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      if (!id) throw new Error("User ID is required");

      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      await user.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

module.exports = new UserService();
