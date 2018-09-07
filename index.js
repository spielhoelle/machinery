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


const server = http.createServer((req, res) => {
  
    if (req.method === 'POST') {
      collectRequestData(req, result => {
        console.log(result);
        res.end(`Parsed data belonging to ${result.fname}`);
      });
    }
});

server.listen(3000);
