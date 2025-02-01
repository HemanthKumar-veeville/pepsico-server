const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NotificationPolicy = sequelize.define("NotificationPolicy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = NotificationPolicy;
