const User = require("./User");
const Idea = require("./Idea");
const Department = require("./Department");
const Team = require("./Team");
const UserTeam = require("./UserTeam");
const NotificationPolicy = require("./NotificationPolicy");
const Notification = require("./Notification");

// User - Idea associations
User.hasMany(Idea);
Idea.belongsTo(User);

// Department associations
Department.hasMany(Idea);
Idea.belongsTo(Department);

Department.hasMany(Team);
Team.belongsTo(Department);

Department.hasMany(NotificationPolicy);
NotificationPolicy.belongsTo(Department);

// Team associations
Team.hasMany(NotificationPolicy);
NotificationPolicy.belongsTo(Team);

// User-Team many-to-many relationship
User.belongsToMany(Team, { through: UserTeam });
Team.belongsToMany(User, { through: UserTeam });

// Notification associations
Idea.hasMany(Notification);
Notification.belongsTo(Idea);

User.hasMany(Notification);
Notification.belongsTo(User);

module.exports = {
  User,
  Idea,
  Department,
  Team,
  UserTeam,
  NotificationPolicy,
  Notification,
};
