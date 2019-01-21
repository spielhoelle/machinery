const path = require("path");
require('dotenv').config({ path: path.join(__dirname + '/../.env') });

let mongooseOptions = {};

if (
  process.env.DATABASE_USERNAME &&
  process.env.DATABASE_PASSWORD &&
  process.env.DATABASE_USERNAME.trim() !== "" &&
  process.env.DATABASE_PASSWORD.trim() !== ""
) {
  mongooseOptions = {
    useNewUrlParser: true,
    auth: {
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    }
  };
}
var database_to_use = process.env.NODE_ENV == "test" ? process.env.DATABASE_NAME_TEST : process.env.DATABASE_NAME;
var login = (process.env.DATABASE_USERNAME && process.env.DATABASE_PASSWORD) ? `${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}` : "";
var host = process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "localhost";
var port = process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 27017;

var url = `mongodb://${process.env.MONGOHOST}`

module.exports = { url: url, mongooseOptions: mongooseOptions }
