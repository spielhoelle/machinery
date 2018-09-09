const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");

const generate = require('../../helpers/generate');
const passportAuthenticate = function(req, res, next) {
  passport.authenticate("jwt", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json(403, {
        code: 403,
        message: "Unauthorized",
        url: `http://${req.headers.host}/login`
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      next();
    });
  })(req, res, next);
};

const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const PostController = require("../controllers/PostController");
const CategoryController = require("../controllers/CategoryController");

// USER ROUTES
router.post("/users/update", passportAuthenticate, AuthController.updateUser);
router.post("/users/logout", passportAuthenticate, AuthController.logout);
router.post(
  "/users/updatepassword",
  passportAuthenticate,
  AuthController.updatePassword
);

router.post("/users/delete", passportAuthenticate, UserController.deleteUser);

// post ROUTES
router.get("/posts", passportAuthenticate, PostController.getPosts);

router.get("/posts/:id", passportAuthenticate, PostController.getSinglePost);

router.post(
  "/posts/add",
  passportAuthenticate,
  PostController.UploadAndResize,
  //PostController.recognizeText,
  PostController.createPost
);

router.post(
  "/posts/:id/update",
  passportAuthenticate,
  PostController.updatePost
);

router.post(
  "/posts/:id/delete",
  passportAuthenticate,
  PostController.deletePost
);

// CATEGORY ROUTES

router.get(
  "/categories",
  passportAuthenticate,
  CategoryController.getCategories
);

router.get(
  "/categories/:id",
  passportAuthenticate,
  CategoryController.getSingleCategory
);

router.post(
  "/categories/add",
  passportAuthenticate,
  CategoryController.createCategory
);

router.post(
  "/categories/:id/update",
  passportAuthenticate,
  CategoryController.updateCategory
);

router.post(
  "/categories/:id/delete",
  passportAuthenticate,
  CategoryController.deleteCategory
);
router.post(
  "/generate",
  passportAuthenticate,
   async (req, res, next) => {
    const user = req.user;
    try {
      var result = generate();
      res.json(200, {
        code: 200,
        message: `Pages created`,
      });
    } catch (err) {
      res.json(404, {
        code: 404,
        message: `Post not found for '${user.name}' or Error: ${err}`
      });
      next(false);
      return;
    }
  }
);

module.exports = router;
