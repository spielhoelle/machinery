const { parse, stringify } = require("flatted/cjs");
const mongoose = require("mongoose");
const scanSchema = require("../models/Scan");
const Scan = mongoose.model("Scan", scanSchema);
const jimp = require("jimp");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const { createRecursiveFolderPath } = require("../handlers/helpers");
const FILE_PATH = "./temp/uploads/scans/";

exports.getScans = async (req, res, next) => {
  const user = req.user;
  try {
    const scans = await Scan.find({ user: req.user._id });

    // scans.forEach(scan => {
    //   let imagePath = fs.statSync(
    //     path.join(process.env.PWD, "temp", "uploads", "scans", scan.image)
    //   );
    //   console.log(imagePath);
    //   scan.file = imagePath;
    // });

    res.json(200, {
      code: 200,
      message: `All scans for '${user.name}'`,
      user: user,
      scans: scans
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No scans were found for '${user.name}'`
    });
  }
  next();
};

exports.getSingleScan = async (req, res, next) => {
  const user = req.user;
  try {
    const scan = await Scan.findOne({ _id: req.params.id });
    // const imagePath = path.join(
    //   process.env.PWD,
    //   "temp",
    //   "uploads",
    //   "scans",
    //   scan.image
    // );
    // // console.log("image path");
    // // console.log(imagePath);
    // const image = fs.readFileSync(imagePath);
    // const base64 = new Buffer(image).toString("base64");

    res.json(200, {
      code: 200,
      message: `Single scan for '${user.name}' `,
      scan: scan
      // file: base64
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: `Scan not found for '${user.name}' or Error: ${err}`
    });
    next(false);
    return;
  }
};

exports.UploadAndResize = async (req, res, next) => {
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


exports.createScan = async (req, res, next) => {
  try {
    const foundScan = await Scan.findOne(
      { title: req._body.title },
      req.body
    ).exec();

    if (foundScan) {
      res.json(401, {
        code: 401,
        message: "This scan is already existed , Please choose another name"
      });
      console.log(`This scan is already existed , Please choose another name`);
      next(false);
      return;
    }

    // console.log(req.base64);
    let scanObject = {
      user: req.user._id,
      title: req._body.title,
      category: req._body.category,
      imageName: req.image.name,
      date: req._body.date,
      image: req.base64
    };

    const scan = await new Scan(scanObject).save();

    res.json(200, {
      code: 200,
      message: `Successfully created '${scan.title}'`,
      scan: scanObject
    });
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.updateScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id }).exec();
    // console.log("===================FOUND SCAN===============================");
    // console.log(foundScan);
    if (scan.title === req.body.title) {
      res.json(401, {
        code: 401,
        message: "This scan is already existed , Please choose another name"
      });
      console.log(`Please choose another name`);
      next(false);
      return;
    }
  } catch {
    console.log("NOT FOUND ");
    res.json(404, {
      code: 404,
      message: "scan not found"
    });
    next(false);
    return;
  }

  try {
    const scan = await Scan.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    }).exec();

    console.log(scan);
    console.log(`Successfully updated to: '${scan.title}'`);
    res.json(200, {
      code: 200,
      message: `Successfully updated to: '${scan.title}'`,
      scan: {
        user_name: req.user.name,
        user_id: req.user._id,
        scan_title: req.body.title,
        scan_id: scan._id,
        scan_category: req.body.category,
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

exports.deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id });

    if (!scan) {
      res.json(404, {
        code: 404,
        message: `Scan not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json(404, {
      code: 404,
      message: "Scan not found "
    });
  }

  try {
    const scan = await Scan.findOne({ _id: req.params.id });

    if (req.params.id === scan.id) {
      console.log("=============scan=============");
      console.log(scan);
      scan.remove();

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

exports.deleteAllScans = async (req, res, next) => {
  Scan.remove({}, function(err) {
    console.log("All SCANS are removed");
    res.send("Successfully deleted all SCANS");
    next();
  });
};
