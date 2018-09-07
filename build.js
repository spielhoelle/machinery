const fse = require('fs-extra');
const path = require('path');
var pug = require('pug');
const glob = require('glob');
const files = glob.sync('**/*.pug', { cwd: `views/pages` });
var chokidar = require('chokidar');

fse.ensureDirSync('dist');
console.log('#####', files);


var mongoose = require('mongoose');
mongoose.connect('mongodb://tommy:password@ds247499.mlab.com:47499/superblog');

var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    name: String,
    content: String,
    order: Number
});

var Post = mongoose.model('Post', PostSchema);

var getPosts = async () => {
  var posts = await Post.find().exec({});
  return posts
}

var run = async() => {
  try{
    console.log('#####', "run");
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

run().then(() => {
  mongoose.disconnect()
})
if(process.env.NODE_ENV !== 'production') {
  console.log('is watching');
  chokidar.watch('./views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
    run()
  });

} else {
  return console.log('Production build');
}


