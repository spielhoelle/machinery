var chokidar = require('chokidar');
const run = require('./helpers/generate');

const path = require("path");
require('dotenv').config({ path: path.join(__dirname + '/.env') });

console.log('#####', process.env.NODE_ENV);
if(process.env.NODE_ENV !== 'production') {
  console.log('Developement watch');
  run().then((res) => {
    console.log('run finied');
    //TODO this invokes it self
    chokidar.watch('views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
      run()
    });
  })
} else {
  console.log('Production build');
  run().then((result) => {
    console.log('Production build:' + result);
  })
}


