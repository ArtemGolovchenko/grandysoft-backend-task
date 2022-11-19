const e = require("cors");
const db = require("../models");
const Users = db.users;
const UsersSubscriptions = db.usersSubscriptions;
const Op = db.Sequelize.Op;
const seqCol = db.sequelize.col;
const seqFn = db.sequelize.fn;

exports.findAllUsers = async (req, res) => {
  try {
    const dbUser = await Users.findAll({
      include: [
        { model: Users, as: "subscriptions", through: { attributes: [] } },
        { model: Users, as: "subscribers", through: { attributes: [] } }
      ],
    });
    await res.send(dbUser);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

exports.findOneUser = async (userId) => {
  try {
    return Users.findOne({ where: { id: userId } });
  }
  catch (err) {
    return err.message || "Some error occurred while retrieving user.";
  }
}

exports.checkIfSubscribed = async (userId, friendId) => {
  try {
    const dbSub = await UsersSubscriptions.findOne({ where: { subscriberId: userId, subscriptionId: friendId } });
    if (dbSub) return true;
    else return false;
  }
  catch (err) {
    return err.message || "Some error occurred while retrieving user.";
  }
}

exports.haveFriends = async (userId) => {
  try {
    const dbSub = await UsersSubscriptions.findOne({
      where: {
        subscriptionId: userId,
      }
    });

    if (dbSub) return true;
    else return false;
  }
  catch (err) {
    return err.message || "Some error occurred while retrieving user.";
  }
}

exports.findSubscription = async (userId, friendId) => {
  try {
    return UsersSubscriptions.findOne({
      where: {
        subscriberId: userId,
        subscriptionId: friendId,
      }
    });
  }
  catch (err) {
    return err.message || "Some error occurred while retrieving user.";
  }
}

exports.findUserWithFriends = async (req, res) => {
  try {
    let order = [];
    const haveFriends = await this.haveFriends(req.params.userId);
    const user = await this.findOneUser(req.params.userId);
    if (!user) {
      res.status(404).send("User not found!");
      return;
    }

    if (!haveFriends) {
      res.status(404).send("Friends not found!");
      return;
    }

    if (req.query.order_type == 'desc') {
      order = [
        [
          'subscribers',
          req.query.order_by,
          'DESC'
        ],
      ]
    } else if (req.query.order_type == 'asc') {
      order = [
        [
          'subscribers',
          req.query.order_by,
          'ASC'
        ],
      ]
    }

    const dbUser = await Users.findAll({
      include: [
        { model: Users, as: "subscriptions", through: { attributes: [] } },
        { model: Users, as: "subscribers", through: { attributes: [] } }
      ],
      where: {
        [Op.and]: {
          id: req.params.userId,
          '$subscriptions.id$': seqFn('', seqCol('subscribers.id')),
        }
      }, order,
    });

    if (dbUser.length > 0) {
      let friends = 0;
      for (let i = 0; i < dbUser[0].subscribers.length; i++) {
        friends++;
      }
      dbUser[0].setDataValue('friends', friends);
      await res.send(dbUser[0]);
    } else {
      res.status(404).send("Friends not found!");
      return;
    }

  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

exports.findMaxFollowingUsers = async (req, res) => {
  try {
    const dbUser = await Users.findAll({
      subQuery: false,
      limit: 5,
      order: [[seqFn('COUNT', seqCol('subscriptions.id')), 'DESC']],
      attributes: [
        'id',
        'first_name',
        'gender',
        [seqFn('COUNT', seqCol('subscriptions.id')), 'subs'],
      ],
      include: [
        { model: Users, as: "subscriptions", attributes: [], required: true, through: { attributes: [] } },
      ], group: ['Users.id'],
    });
    await res.send(dbUser);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

exports.findNoFollowingUsers = async (req, res) => {
  try {
    const dbUser = await Users.findAll({
      include: [
        { model: Users, as: "subscriptions", required: false, through: { attributes: [] } },
      ], where: {
        '$subscriptions.id$': null,
      },
    });
    await res.send(dbUser);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

exports.subscribeTo = async (req, res) => {
  try {
    const dbUser = await this.findOneUser(req.params.userId);
    const dbFriend = await this.findOneUser(req.params.friendId);

    if (!dbUser || !dbFriend) {
      res.status(404).send("Users not found!");
      return;
    }

    if (req.params.userId === req.params.friendId) {
      res.send("You can't subscribe to yourself!");
      return;
    }

    const isFriend = await this.checkIfSubscribed(req.params.userId, req.params.friendId);
    if (isFriend) {
      res.send("You are already subscribed to this user!");
      return;
    }

    const subCount = await UsersSubscriptions.count({
      where: { subscriberId: req.params.userId }
    });

    if (subCount > 149) {
      res.send("You can't subscribe to more than 150 users!");
      return;
    } else {
      await UsersSubscriptions.create({
        subscriberId: req.params.userId,
        subscriptionId: req.params.friendId,
      });
      res.send("Subscribed successfully!");
    }
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while subscribing to user."
    });
  }
};

exports.unsubscribeFrom = async (req, res) => {
  try {
    const dbSub = await this.findSubscription(req.params.userId, req.params.friendId);

    if (!dbSub) {
      res.status(404).send("Subscription not found!");
      return;
    }

    await UsersSubscriptions.destroy({
      where: {
        subscriberId: req.params.userId,
        subscriptionId: req.params.friendId,
      }
    });
    res.send("Unsubscribed successfully!");
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while unsubscribing from user."
    });
  }
};