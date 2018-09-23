const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "user ID is needed"
  },
  //category: [
    //{
      //type: mongoose.Schema.ObjectId,
      //ref: "Category"
    //}
  //],
  title: {
    type: String,
    trim: true,
    required: "You must provide a name",
    unique: true
  },
  imageName: {
    type: String,
    trim: true
    // required: "You must provide an image"
    /* image base 64 */
  },
  content: {
    type: String,
    trim: true
    // required: "There must be a content"
    /* "long string" includes the text of the image */
  },
  date: {
    type: Date
  },
  image: {
    //type: Buffer
    type: String
    // contentType: String
  }
  // date_from_post : {
  //   content:
  //   }
});

postSchema.plugin(mongodbErrorHandler);

module.exports = postSchema;
