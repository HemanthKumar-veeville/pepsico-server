const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserTeam = sequelize.define("UserTeam", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Teams",
      key: "id",
    },
  },
});

module.exports = UserTeam;
