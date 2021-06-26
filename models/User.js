var mongoose = require("mongoose");
var { conn } = require("../config/db");

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
  },
  {
    strict: true,
    collection: "newuserdata",
  }
);
usersprofile_schema.pre("save", function (next) {
  User.findOne({ email: this.email }, async function (err, userDetails) {
    if (userDetails && userDetails._id) {
      const err = new Error("Email is already saved");
      next(err);
    } else {
      next();
    }
  });
});

usersprofile_schema.pre("save", function (next) {
  User.findOne({ username: this.username }, async function (err, userDetails) {
    if (userDetails && userDetails._id) {
      const err = new Error("Username is already saved ");
      next(err);
    } else {
      next();
    }
  });
});

var User = conn.model("newuserdata", usersprofile_schema);

exports.User = User;
