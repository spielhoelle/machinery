const mongoose = require("mongoose");
const settingSchema = require("../models/Setting");
const Setting = mongoose.model("Setting", settingSchema);

exports.getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.find({});
    res.json(200, {
      code: 200,
      message: `Setting found`,
      setting: setting
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No setting available, create one first`,
      error: err
    });
  }
  next();
};

exports.saveSetting = async (req, res, next) => {
  try {
    let setting = await Setting.find({}).exec();
    if(setting.length === 0){
      var action = 'created'
      setting = await Setting.create({
        title: req.body.title,
        image: req.body.image
      })
    } else {
      var action = 'updated'
      setting = {
        title: req.body.title,
        image: req.body.image
      }
      await Setting.update(setting)
    }
    console.log(`Setting ${action}`, setting.title);
    res.json(200, {
      code: 200,
      message: `Successfully ${action} to: '${setting.title}'`,
      setting: setting
    });
  } catch (err) {
    console.log("Problem while creating/updating Setting");
    res.json(503, {
      code: 503,
      message: "Problem while creating/updating Setting",
      error: err
    });
    next(false);
    return;
  }
};

