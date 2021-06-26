var mongoose = require("mongoose");

var conn = mongoose.createConnection(
    "mongodb://localhost:27017/user",
    {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    },
    function (err, db) {
        if (err) {
            console.log("connection not established");
        }
    }
);

exports.conn = conn;