const fse = require('fs-extra');
const path = require('path');
var pug = require('pug');
const glob = require('glob');
const files = glob.sync('**/*.pug', { cwd: `views/pages` });
fse.ensureDirSync('dist');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nanostatic');

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
    return files.forEach((file, i) => {
      const fileData = path.parse(file);
      console.log(`Generated: dist/${fileData.name}.html`);
      return fse.writeFile(`dist/${fileData.name}.html`, pug.renderFile(`views/pages/${fileData.base}`, {posts, settings}));
    })
  }
  catch(e){
    console.error(e)
  }
}

module.exports = run
