module.exports = (sequelize, DataTypes) => {
  const UsersSubscriptions = sequelize.define('UsersSubscriptions', {
    subscriberId: DataTypes.BIGINT,
    subscriptionId: DataTypes.BIGINT,
  },);

  return UsersSubscriptions;
};