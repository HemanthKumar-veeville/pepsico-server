const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Idea = sequelize.define("Idea", {
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
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supporting_documents: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submission_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Validated", "Rejected"),
    defaultValue: "Pending",
  },
  department_id: {
    type: DataTypes.UUID,
    references: {
      model: "Departments",
      key: "id",
    },
  },
  validation_result: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Idea;
