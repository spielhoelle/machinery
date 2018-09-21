const { parse, stringify } = require("flatted/cjs");
const mongoose = require("mongoose");
const postSchema = require("../models/Post");
const Post = mongoose.model("Post", postSchema);
const jimp = require("jimp");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const { createRecursiveFolderPath } = require("../handlers/helpers");
const FILE_PATH = "./temp/uploads/posts/";

exports.getPosts = async (req, res, next) => {
  const user = req.user;
  try {
    const posts = await Post.find({ user: req.user._id });

    // posts.forEach(post => {
    //   let imagePath = fs.statSync(
    //     path.join(process.env.PWD, "temp", "uploads", "posts", post.image)
    //   );
    //   console.log(imagePath);
    //   post.file = imagePath;
    // });

    res.json(200, {
      code: 200,
      message: `All posts for '${user.name}'`,
      user: user,
      posts: posts
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No posts were found for '${user.name}'`
    });
  }
  next();
};

exports.getSinglePost = async (req, res, next) => {
  const user = req.user;
  try {
    const post = await Post.findOne({ _id: req.params.id });
     const imagePath = path.join(
       process.env.PWD,
       "temp",
       "uploads",
       "posts",
       post.imageName
     );
     const image = fs.readFileSync(imagePath);
     const base64 = new Buffer(image).toString("base64");

    res.json(200, {
      code: 200,
      message: `Single post for '${user.name}' `,
      post: post,
      file: base64
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: `Post not found for '${user.name}' or Error: ${err}`
    });
    next(false);
    return;
  }
};

exports.UploadAndResize = async (req, res, next) => {
  ////Make image required
  if (!req.files || !req.files.image) {
    return res.json(404, {
      code: 404,
      message: "NO IMAGE PROVIDED"
    });
    next(false);
  }

  const filename = `${uuid.v4()}`;
  const extension = req.files.image.type.split("/")[1];

  const files = {
    original: {
      name: `${filename}.${extension}`,
      path: FILE_PATH,
      file: `${FILE_PATH}${filename}.${extension}`
    },
    thumbnail: {
      name: `${filename}-400x400.${extension}`,
      path: FILE_PATH,
      file: `${FILE_PATH}${filename}-400x400.${extension}`
    }
  };

  createRecursiveFolderPath(FILE_PATH);

  // move the original image
  fs.renameSync(req.files.image.path, files.original.file);

  // create thumbnail
  const thumbnailImage = await jimp.read(files.original.file);
  await thumbnailImage.cover(400, 400).quality(70);
  await thumbnailImage.write(files.thumbnail.file);

  // console.log("this should be the image");
  // console.log(files.original.file);

  const image = fs.readFileSync(files.original.file);
  const base64 = new Buffer(image).toString("base64");
  req.base64 = base64;
  // console.log(base64);

  req.image = files.original;

  next();
};


exports.createPost = async (req, res, next) => {
  try {
    const foundPost = await Post.findOne(
      { title: req._body.title },
      req.body
    ).exec();

    if (foundPost) {
      res.json(401, {
        code: 401,
        message: "This post is already existed , Please choose another name"
      });
      console.log(`This post is already existed , Please choose another name`);
      next(false);
      return;
    }

    // console.log(req.base64);
    let postObject = {
      user: req.user._id,
      title: req._body.title,
      category: req._body.category,
      imageName: req.image.name,
      date: new Date(),
      image: req.base64
    };

    const post = await new Post(postObject).save();

    res.json(200, {
      code: 200,
      message: `Successfully created '${post.title}'`,
      post: postObject
    });
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).exec();
    // console.log("===================FOUND post===============================");
    // console.log(foundPost);
    if (post.title === req.body.title) {
      res.json(401, {
        code: 401,
        message: "This post is already existed , Please choose another name"
      });
      console.log(`Please choose another name`);
      next(false);
      return;
    }
  } catch {
    console.log("NOT FOUND ");
    res.json(404, {
      code: 404,
      message: "post not found"
    });
    next(false);
    return;
  }

  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    }).exec();

    console.log(post);
    console.log(`Successfully updated to: '${post.title}'`);
    res.json(200, {
      code: 200,
      message: `Successfully updated to: '${post.title}'`,
      post: {
        user_name: req.user.name,
        user_id: req.user._id,
        post_title: req.body.title,
        post_id: post._id,
        post_category: req.body.category,
        image: req.body.image,
        content: req.body.content,
        date: req.body.date
      }
    });
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      res.json(404, {
        code: 404,
        message: `Post not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json(404, {
      code: 404,
      message: "Post not found "
    });
  }

  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.params.id === post.id) {
      console.log("=============post=============");
      console.log(post);
      post.remove();

      console.log(`Successfully removed`);
      res.json(200, {
        code: 200,
        message: `Successfully removed`
      });
    }
  } catch (message) {
    res.json(403, {
      code: 403,
      message: "ERROR FORBIDDEN"
    });
  }
};

exports.deleteAllPosts = async (req, res, next) => {
  Post.remove({}, function(err) {
    console.log("All postS are removed");
    res.send("Successfully deleted all postS");
    next();
  });
};
