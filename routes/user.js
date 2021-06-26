var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
const { emailAuth, usernameAuth } = require("../config/validation");
var { User } = require("../models/User");
const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.TOKEN_SECRET);
}

app.post("/register", emailAuth, usernameAuth, async (req, res) => {
  const salt = await bcrypt.genSalt();
  const userPassword = await bcrypt.hash(req.body.password, salt);
  if (req.body.password !== req.body.confirmpassword) {
    res.status(500).json({
      error: 1,
      message: "password not matched",
      data: null,
    });
  } else {
    const userData = new User({
      username: req.body.username,
      dob: req.body.dob,
      password: userPassword,
      email: req.body.email,
    });
    userData.save(function (err, row) {
      if (err) {
        res.status(500).json({
          error: 1,
          message: err.message,
          data: null,
        });
      } else {
        res.status(200).json({
          error: 0,
          message: "user saved successfully",
          data: null,
        });
      }
    });
  }
});

app.post("/login", async function (req, res) {
  username = req.body.username;
  User.findOne(
    { username: { $regex: new RegExp("^" + username + "$", "i") } },
    async function (err, userDetails) {
      var pass = userDetails.password;
      var userId = userDetails._id;
      var input_password = pass;
      var user_password = req.body.password;
      if (await bcrypt.compare(user_password, input_password)) {
        const token = generateAccessToken({ userId: userId });
        res.status(200).json({
          error: 0,
          message: "user login successfully",
          data: token,
        });
      } else {
        res.status(200).json({
          error: 0,
          message: "Incorrect Password",
          data: null,
        });
      }
    }
  );
});

module.exports = app;
