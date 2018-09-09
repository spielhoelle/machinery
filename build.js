var chokidar = require('chokidar');
const run = require('./helpers/generate');

if(process.env.NODE_ENV !== 'production') {
  console.log('Developement watch');
  run().then((res) => {
    console.log('run finied');
    chokidar.watch('views', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
      run()
    });
  })
} else {
  console.log('Production build');
  run().then(() => {
    mongoose.disconnect()
    console.log('Production build');
  })
}


