const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserDepartment = sequelize.define("UserDepartment", {
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
  department_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Departments",
      key: "id",
    },
  },
});

module.exports = UserDepartment;
