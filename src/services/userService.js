const { User } = require("../models");

class UserService {
  async findOrCreateGoogleUser(googleData) {
    const [user, created] = await User.findOrCreate({
      where: { google_id: googleData.google_id },
      defaults: {
        email: googleData.email,
        name: googleData.name,
        role: "Member", // Default role
      },
    });
    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return await user.update(userData);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
