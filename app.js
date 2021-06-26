var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.json());
app.use(urlencodedParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config();

app.use('/user', require('./routes/user'));

var server = app.listen(2200, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
