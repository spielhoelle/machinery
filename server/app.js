const restify = require("restify");
const util = require("util");
const mongoose = require("mongoose");
const validator = require("validator");
const passport = require("passport");
const promisify = require("es6-promisify");
const expressValidator = require("express-validator");
const restifyValidator = require("restify-validator");
const errorHandlers = require("./handlers/errorHandlers");
const JWTAuthenticatedUser = require("./handlers/JWTAuthenticatedUser");
const path = require("path");
const {url, mongooseOptions} =  require('../helpers/db')

require("./handlers/passport");
require("dotenv").config({ path: path.join(__dirname + "/../.env") });
//const requireAuth = passport.authenticate("jwt", { session: false });

const routes = {
  public: require("./routes/public"),
  private: require("./routes/private")
};

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.urlEncodedBodyParser());

//TODO this enables CORS for the webinterface.
//It would be better to make this work without external library
//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:5000', 'http://machinery.tmy.io'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
})

server.pre(cors.preflight)
server.use(cors.actual)


// server.use(function crossOrigin(req, res, next) {
//   //TODO Limit cors Access to production domain
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
//   res.header('Access-Control-Max-Age', '1000');
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
//   return next();
// });

server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

mongoose.Promise = global.Promise;

mongoose
  .connect(
    url,
    mongooseOptions
  )
  .catch(error => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`);
    process.exit(1);
  });

server.use(function logger(req, res, next) {
  console.log(new Date(), req.method, req.url);
  next();
});

server.on("uncaughtException", function(req, res, route, error) {
  console.error(error.stack);
  res.send(error);
});

routes.public.applyRoutes(server, "/api");
routes.private.applyRoutes(server, "/api");

module.exports = server;
