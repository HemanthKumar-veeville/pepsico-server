const User = require("./User");
const Idea = require("./Idea");
const Department = require("./Department");
const UserDepartment = require("./UserDepartment");
const NotificationPolicy = require("./NotificationPolicy");
const Notification = require("./Notification");

// User - Idea associations
User.hasMany(Idea);
Idea.belongsTo(User);

// Department associations
Department.hasMany(Idea);
Idea.belongsTo(Department);

// User-Department many-to-many relationship
User.belongsToMany(Department, { through: UserDepartment });
Department.belongsToMany(User, { through: UserDepartment });

// Department-NotificationPolicy association
Department.hasMany(NotificationPolicy);
NotificationPolicy.belongsTo(Department);

// Notification associations
Idea.hasMany(Notification);
Notification.belongsTo(Idea);

User.hasMany(Notification);
Notification.belongsTo(User);

module.exports = {
  User,
  Idea,
  Department,
  UserDepartment,
  NotificationPolicy,
  Notification,
};
