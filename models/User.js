var mongoose = require("mongoose");
var { conn } = require("../config/db");

var usersprofile_schema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        dob: {
            type: String,
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
        collection: "userdata",
    }
);

var User = conn.model("userdata", usersprofile_schema);

exports.User = User;
