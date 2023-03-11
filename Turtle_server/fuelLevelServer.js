const http = require('http')
const fs = require('fs')

const port = 8200
var fuel_level = require('./fuelLevel.json')

const server = http.createServer((req,res)=>{
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(fuel_level));
    fs.readFile('./fuelLevel.json', (err, data) =>{
        if (err) throw err;
        fuel_level = data.toString()
    })
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`)

  var options = {
    port: 8200,
    host: '127.0.0.1',
  };

  var request = http.request(options);
  request.setHeader('Content-Type', 'application/json')

  request.end();
})