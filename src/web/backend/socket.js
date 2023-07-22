// Main websocket server. Needs to be port forwarded
require("dotenv").config()

const ws = require("ws");
const fs = require("fs")
const path = require("path")
const server = new ws.Server({host: process.env.WEBSOCKET_IP, port: 8000});

var heading = fs.readFileSync(path.resolve(__dirname, "../json/heading.json"), (err, data) => {return data}).toString()
var coords, turtle_heading, RAWturtle, turtle, turtle_pos, turtle_pos, write_data

server.on("connection", (ws) => {
    console.log("\nConnection established!")

    // Refactor this
    ws.on("message", (msg) => {
        heading = fs.readFileSync(path.resolve(__dirname, "../json/heading.json"), (err, data) => {return data}).toString()
        console.log(`\nIncoming Message: ${msg}`)
        server.broadcast(JSON.stringify({func: msg.toString()}))
        try {
            obj = JSON.parse(msg.data)['func']
        } catch {
            obj = msg.toString()
        }
        heading_temp = JSON.parse(heading)
        if (obj == 'left') {
            heading_temp[1] == "x" ?
            (heading_temp[0] == "+" ? heading = "-z" : heading = "+z") : (heading_temp[0] == "+" ? heading = "+x" : heading = "-x")
            fs.writeFile(path.resolve(__dirname, "../json/heading.json"), JSON.stringify(heading), (err) => {
                if (err) throw err
            })
        } else if (obj == 'right') {
            heading_temp[1] == "z" ?
            (heading_temp[0] == "+" ? heading = "-x" : heading = "+x") : (heading_temp[0] == "+" ? heading = "+z" : heading = "-z")
            fs.writeFile(path.resolve(__dirname, "../json/heading.json"), JSON.stringify(heading), (err) => {
                if (err) throw err
            })
        } else if (obj == 'forward' || obj == 'back') {
            _movementInitializer()
            if (obj == 'forward') {
                turtle_heading[1] == "x" ?
                (turtle_heading[0] == "+" ? turtle_pos[0] += 1 : turtle_pos[0] -= 1) : (turtle_heading[0] == "+" ? turtle_pos[2] += 1 : turtle_pos[2] -= 1)
            } else if (obj == 'back') {
                turtle_heading[1] == "x" ?
                (turtle_heading[0] == "+" ? turtle_pos[0] -= 1 : turtle_pos[0] += 1) : (turtle_heading[0] == "+" ? turtle_pos[2] -= 1 : turtle_pos[2] += 1)
            }
            delete coords[RAWturtle]
            coords[turtle_pos.toString()] = 'Self'
            fs.writeFile(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords), (err) => {
                if (err) throw err
            })
        } else if (obj == 'up' || obj == 'down') {
            _movementInitializer()
            obj == "up" ? turtle_pos[1] += 1 : turtle_pos[1] -= 1
            delete coords[RAWturtle]
            coords[turtle_pos.toString()] = 'Self'
            fs.writeFile(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords), (err) => {
                if (err) throw err
            })
        } else if (obj.includes('FRONT')) {
            _movementInitializer()
            turtle_pos = turtle_pos.join(',')
            write_data = obj.split(' ')[0]
            coords[turtle_pos] = write_data
            fs.writeFileSync(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords))
        } else if (obj.includes('BOTTOM')) {
            verticalMove(-1)
        } else if (obj.includes('TOP')) {
            verticalMove(+1)
        } else if (obj.includes('FUEL')) {
            fuel_level = obj.split('FUEL')[0]
            fs.writeFileSync(path.resolve(__dirname, "../json/fuelLevel.json"), JSON.stringify(fuel_level))
        }
    })
});

server.broadcast = (msg) => {
    server.clients.forEach((client) => {
        client.send(msg);
    });
};


// Functions
function verticalMove(direction) {
    _movementInitializer()
    turtle_pos[1] += direction
    turtle_pos = turtle_pos.join(',')
    write_data = obj.split(' ')[0]
    coords[turtle_pos] = write_data
    fs.writeFileSync(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords))
}

function _movementInitializer() {
    coords = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
    RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
    turtle_heading = heading_temp.split('')
    turtle = RAWturtle.split(',')
    turtle_pos = []
    for (let i = 0; i < turtle.length; i++) {
        turtle_pos.push(parseInt(turtle[i]))
    }
}