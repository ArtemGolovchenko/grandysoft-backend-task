module.exports = app => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  router.get("/", users.findAllUsers);
  router.get("/:userId/friends", users.findUserWithFriends);
  router.post("/:userId/subscribe/:friendId", users.subscribeTo);
  router.delete("/:userId/unsubscribe/:friendId", users.unsubscribeFrom);
  router.get("/max-following", users.findMaxFollowingUsers);
  router.get("/no-following", users.findNoFollowingUsers);

  app.use('/users', router);
};