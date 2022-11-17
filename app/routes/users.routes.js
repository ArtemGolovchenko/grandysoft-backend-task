module.exports = app => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  router.get("/", users.findAllUsers);

  app.use('/users', router);
};