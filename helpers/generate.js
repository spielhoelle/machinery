const fse = require('fs-extra');
const path = require('path');
var pug = require('pug');
const glob = require('glob');
const files = glob.sync('**/*.pug', { cwd: `views/pages` });
fse.ensureDirSync('dist');

const {url, mongooseOptions} =  require('./db')

var mongoose = require('mongoose');
mongoose.connect(url);

var Schema       = mongoose.Schema;

const PostSchema = require("../server/models/Post");
var Post = mongoose.model('Post', PostSchema);

const SettingSchema = require("../server/models/Setting");
var Setting = mongoose.model('Setting', SettingSchema);

var getPosts = async () => {
  var posts = await Post.find().exec({});
  return posts
}
var getSettings = async () => {
  var settings = await Setting.find().exec({});
  return settings
}

var run = async() => {
  try{
    var posts = await getPosts();
    var settings = await getSettings();
    settings = settings[0]
    files.forEach((file, i) => {
      const fileData = path.parse(file);
      console.log(`Generated: dist/${fileData.name}.html`);
      return fse.writeFile(`dist/${fileData.name}.html`, pug.renderFile(`views/pages/${fileData.base}`, {posts, settings}));
    })
    return mongoose.disconnect()
  }
  catch(e){
    console.error(e)
  }
}

module.exports = run
