const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const settingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "You must provide a name",
    unique: true
  },
  image: {
    type: String
  }
});

settingSchema.plugin(mongodbErrorHandler);

module.exports = settingSchema;
