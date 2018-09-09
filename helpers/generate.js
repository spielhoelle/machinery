const fse = require('fs-extra');
const path = require('path');
var pug = require('pug');
const glob = require('glob');
const files = glob.sync('**/*.pug', { cwd: `views/pages` });
fse.ensureDirSync('dist');
console.log('#####', files);


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nanostatic');

var Schema       = mongoose.Schema;

const PostSchema = require("../server/models/Post");

var Post = mongoose.model('Post', PostSchema);

var getPosts = async () => {
  var posts = await Post.find().exec({});
  return posts
}

var run = async() => {
  try{
    var posts = await getPosts()
    return files.forEach((file, i) => {
      const fileData = path.parse(file);
      console.log(`Generated: dist/${fileData.name}.html`);
      return fse.writeFile(`dist/${fileData.name}.html`, pug.renderFile(`views/pages/${fileData.base}`, {posts}));
    })
  }
  catch(e){
    console.error(e)
  }
}

module.exports = run
