const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const userSchema = require("../models/User");
const User = mongoose.model("User", userSchema);
const Post = require("../models/Post");
const Category = require("../models/Category");

const passport = require("passport");
const promisify = require("es6-promisify");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname + "/.env") });
require("../handlers/passport");

const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const CategorySeedLoader = require("../modules/CategorySeedLoader");

exports.register = async (req, res, next) => {
  const register = promisify(User.register, User);

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  register(user, req.body.password)
    .then(user => {

      user.save();

      CategorySeedLoader.loadSeed(user);

      let transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPW
        }
      });

      let mailOptions = {
        from: `"Nanostatic" <info@nanostatic.tmy.io>`,
        to: req.body.email,
        subject: "Registration complete",
        text: `Hey, thanks for registering with Nanostatic. Your password is: ${
          req.body.password
        }`,
        html: `Hey, thanks "${
          req.body.name
        }" for registering with <b>Nanostatic.</b> <br>
              Your password is: <br/> <b>${req.body.password}</b> `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);

          res.send({
            ERROR: error,
            UserInfo: `Your password is:  '${req.body.password}'`
          });
          return;
        }

        res.json(200, {
          code: 200,
          message: "User registered successfully. Please check the email.",
          user: {
            name: req.body.name,
            email: req.body.email,
            id: user._id
            //token: user.token
          }
        });
        next();
      });
    })
    .catch(error => {
      res.json(422, {
        code: 422,
        message: "Unprocessable entity",
        error
      });
    });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).exec();

    console.log("------------Deleted user--------------");
    console.log(user);
    if (!user) {
      res.json(404, {
        code: 404,
        message: "user not found"
      });
      next(false);
    }

    user.remove();

    return res.json(200, {
      code: 200,
      message: `Successfully Deleted`
    });
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.deleteAllUsers = async (req, res, next) => {
  User.remove({}, function(err) {
    console.log("All users are removed");
    res.send("Successfully deleted all users");
    next();
  });
};

// exports.registerLocal = (req, res, next) => {
//   passport.use(
//     "local-signup",
//     new LocalStrategy(
//       {
//         // by default, local strategy uses username and password, we will override with email
//         usernameField: "email",
//         passwordField: "password",
//         passReqToCallback: true // allows us to pass back the entire request to the callback
//       },

//       function(req, email, password, done) {
//         console.log("I'm PASSPORT");
//         // asynchronous
//         // User.findOne wont fire unless data is sent back
//         process.nextTick(function() {
//           // find a user whose email is the same as the forms email
//           // we are checking to see if the user trying to login already exists
//           User.findOne({ "local.email": email }, function(err, user) {
//             // if there are any errors, return the error
//             if (err) return done(err);

//             // check to see if theres already a user with that email
//             if (user) {
//               return done(
//                 null,
//                 false,
//                 req.flash("signupMessage", "That email is already taken.")
//               );
//             } else {
//               // if there is no user with that email
//               // create the user
//               var newUser = new User();

//               // set the user's local credentials
//               newUser.local.email = email;
//               newUser.local.password = newUser.generateHash(password);

//               // save the user
//               newUser.save(function(err) {
//                 if (err) throw err;
//                 return done(null, newUser);
//               });
//             }
//           });
//         });
//       }
//     )
//   );
// };
