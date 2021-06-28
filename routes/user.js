var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
var { User } = require("../models/User");
var { user_address } = require("../models/UserAddress");
var { jwtAuth } = require("../config/auth")
const jwt = require("jsonwebtoken");
const { emailAuth, usernameAuth } = require("../config/validation");

function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.TOKEN_SECRET);
}

app.post("/register", async (req, res) => {
  var valid = new Date(req.body.dob).getTime() > 0;
  const salt = await bcrypt.genSalt();
  const userPassword = await bcrypt.hash(req.body.password, salt);
  if (req.body.password !== req.body.confirmpassword) {
    res.status(500).json({
      error: 1,
      message: "password not matched",
      data: null,
    });
  } else {
    if (valid == true) {
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
    } else {
      res.status(500).json({
        error: 1,
        message: "date format should be in mm-dd-yyyy",
        data: null,
      });
    }
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

app.get("/get", jwtAuth, async function (req, res) {
  await User
    .findOne({ _id: req.user._id })
    .populate("address")
    .then((user) => {
      res.status(200).json({
        error: 0,
        message: "user list",
        data: user,
      });
    });
});

app.post("/address",jwtAuth, async function (req, res) {
  var userId = req.user._id;
  var address = req.body.address;
  var city = req.body.city;
  var state = req.body.state;
  var address_post = new user_address({
    user_id: userId,
    city: city,
    state: state,
  });
  address_post.save(function (err) {
    if (err) {
      res.status(500).json({
        error: 1,
        message: err.message,
        data: null,
      });
    } else {
      User.update(
        { _id: userId },
        { $push: { address: address_post._id } },
        function (err, result) {
          if (err) {
            res.status(500).json({
              error: 1,
              message: err.message,
              data: null,
            });
          } else {
            res.status(200).json({
              error: 0,
              message: "address saved",
              data: null,
            });
          }
        }
      );
    }
  });
});

app.put("/delete", jwtAuth, async function (req, res) {
  var user_id = req.user._id;
  await User.deleteOne({ _id: user_id });
  await user_address.deleteOne({ user_id : user_id })
  res.status(200).json({
    error: 0,
    message: "user deleted",
    data: null,
  });
});

module.exports = app;
