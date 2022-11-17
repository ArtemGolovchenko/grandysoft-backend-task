module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    first_name: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
  });

  return User;
};
