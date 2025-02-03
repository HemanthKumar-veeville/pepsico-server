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
  department_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validation_result: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Idea;

// send idea to chatgpt to get the department name
// based on the department name, get the department id
// save the department id in the idea
// send the idea to the department users with the department id
