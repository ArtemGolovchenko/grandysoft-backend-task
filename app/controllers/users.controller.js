const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.findAllUsers = async (req, res) => {
  try {
    const dbUser = await User.findAll();
    await res.send(dbUser);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};