'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsToMany(models.Users, {
        through: 'UsersSubscriptions',
        as: 'subscriptions',
        foreignKey: 'subscriberId',
      });
    
      Users.belongsToMany(models.Users, {
        through: 'UsersSubscriptions',
        as: 'subscribers',
        foreignKey: 'subscriptionId',
      });
    }
  }
  Users.init({
    first_name: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};