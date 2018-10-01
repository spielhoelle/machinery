const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");

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
const StaticPagesController = require("../controllers/StaticPagesController");
const SettingController = require("../controllers/SettingController");

// USER ROUTES
router.post("/users/update", passportAuthenticate, AuthController.updateUser);
router.post("/users/logout", passportAuthenticate, AuthController.logout);
router.post(
  "/users/updatepassword",
  passportAuthenticate,
  AuthController.updatePassword
);
router.get("/users/refresh_token", passportAuthenticate, AuthController.refreshtoken);
router.post("/users/delete", passportAuthenticate, UserController.deleteUser);

// post ROUTES
router.get("/posts", passportAuthenticate, PostController.getPosts);

router.get("/posts/:id", passportAuthenticate, PostController.getSinglePost);

router.post(
  "/posts/add",
  passportAuthenticate,
  //PostController.UploadAndResize,
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
// STATIC PAGES ROUTES
router.post(
  "/generate",
  passportAuthenticate,
  StaticPagesController.generateStaticPages
);
// SETTING ROUTES

router.get(
  "/setting",
  passportAuthenticate,
  SettingController.getSetting
);
router.post(
  "/setting",
  passportAuthenticate,
  SettingController.saveSetting
);
module.exports = router;
