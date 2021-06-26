var { User } = require("../models/User");

var emailAuth = async function emailValidation(req, res, next) {
    var user_email = req.body.email;
    User.findOne({ email: user_email }, function (err, userDetails) {
        if (userDetails && userDetails._id) {
            res.status(500).json({
                error: 1,
                message: "email already used",
                data: null,
            });
        } else {
            next();
        }
    });
};

var usernameAuth = async function usernameValidation(req, res, next) {
    var username = req.body.username;
    User.findOne({ username: username }, function (err, userDetails) {
        if (userDetails && userDetails._id) {
            res.status(500).json({
                error: 1,
                message: "username already used",
                data: null,
            });
        } else {
            next();
        }
    });
};

exports.emailAuth = emailAuth;
exports.usernameAuth = usernameAuth;