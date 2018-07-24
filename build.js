const fse = require('fs-extra');
const path = require('path');
var pug = require('pug');
const glob = require('glob');
const files = glob.sync('**/*.pug', { cwd: `pages` });

fse.ensureDirSync('dist');
console.log('#####', files);
files.forEach((file, i) => {
  const fileData = path.parse(file);
  console.log('#####', fileData);
  fse.writeFileSync(`dist/${fileData.name}.html`, pug.renderFile(`pages/${fileData.base}`));
})
