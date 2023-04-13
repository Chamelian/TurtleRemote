const http = require("http")
const fs = require("fs")
const path = require("path")

const port = 8001
const host = "127.0.0.1"

const server = http.createServer((req, res) => {
    res.statusCode = 200

    if (req.url == "/") {
        res.write(fs.readFileSync(path.resolve(__dirname, "../index.html")))
    } else {
        try {
            res.write(fs.readFileSync(path.resolve(__dirname, `../${req.url}`)))
        } catch {
            res.statusCode = 404
        }
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