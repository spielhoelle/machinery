const http = require('http');
const { parse } = require('querystring');
var pug = require('pug');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';

    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

function handleGetRequests (req, cb){
  var html = "";
  if (req.url == "/") {
    html = pug.renderFile('pages/index.pug' );
  }
  else if (req.url == "/about") {
    html = pug.renderFile('about.pug' );
  }
  else if (req.url == "/contact") {
    html = "Welcome to the contact page!"
  }
  else {
    html =  "404 error! File not found."
  }
  cb(html)
}

const server = http.createServer((req, res) => {
  
    if (req.method === 'POST') {
      collectRequestData(req, result => {
        console.log(result);
        res.end(`Parsed data belonging to ${result.fname}`);
      });
    }
    //else {
      //handleGetRequests(req, html => {
        //res.writeHead(200, { "Content-Type": "text/html" });
        //res.end(html);
      //})
    //}
});

server.listen(3000);
