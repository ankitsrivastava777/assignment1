var mongoose = require("mongoose");
var { conn } = require("../config/db");
var { user_address } = require("../models/UserAddress");

var usersprofile_schema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User_address'
    }]
  },
  {
    strict: true,
    collection: "newuserdata",
  }
);

usersprofile_schema.pre("save", async function(next) {
  try {
      const userEmail = await User.findOne({
          email: this.email
      }).exec();
      if (userEmail) {
          const err = new Error("Email is already saved");
          next(err);
      } else {
          const userName = await User.findOne({
              username: this.username
          }).exec();
          if (userName) {
              const err = new Error("Username is already saved");
              next(err);
          }
      }
  } catch (err) {
      next();
  }
});

var User = conn.model("newuserdata", usersprofile_schema);

exports.User = User;
