const http = require('http')
const fs = require('fs')

const port = 8080
var coords = require('./coords.json')

const server = http.createServer((req,res)=>{
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(coords));
    fs.readFile('./coords.json', (err, data) =>{
        if (err) throw err;
        coords = data.toString()
    })
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`)

  var options = {
    port: 8080,
    host: '127.0.0.1',
  };

  var request = http.request(options);
  request.setHeader('Content-Type', 'application/json')

  request.end();
})