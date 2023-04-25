const http = require("http")
const fs = require("fs")
const path = require("path")

const port = 8001
const host = "127.0.0.1"

const server = http.createServer((req, res) => {
    res.statusCode = 200

    // URL's
    if (req.url == "/") {
        res.setHeader("Content-Type", "text/html")
        res.write(fs.readFileSync(path.resolve(__dirname, "../frontend/index.html")))
    } else if (req.url.includes(".json")) {
        res.setHeader("Content-Type", "application/json")
        res.write(fs.readFileSync(path.resolve(__dirname, `../json/${req.url}`)))
    } else  if (req.url.includes(".js")) {
        res.setHeader("Content-Type", "text/javascript")
        res.write(fs.readFileSync(path.resolve(__dirname, `../frontend/${req.url}`)))
    }  else {
        res.statusCode = 404
    }

    console.log(`\nHTTP: ${req.method} | ${req.url} ${res.statusCode}`)
    res.end()
})

server.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`)

    var options = {
      port: port,
      host: host,
    };

    var request = http.request(options);

    request.end();
})