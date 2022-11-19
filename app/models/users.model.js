module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("Users", {
    first_name: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
  });

  Users.belongsToMany(Users, {
    through: 'UsersSubscriptions',
    as: 'subscriptions',
    foreignKey: 'subscriberId',
  });

  Users.belongsToMany(Users, {
    through: 'UsersSubscriptions',
    as: 'subscribers',
    foreignKey: 'subscriptionId',
  });

  return Users;
};
