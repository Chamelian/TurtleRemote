// Main websocket server. Needs to be port forwarded

const ws = require("ws");
const fs = require("fs")
const path = require("path")
const server = new ws.Server({host: "127.0.0.1", port: 8000});

var heading = fs.readFileSync(path.resolve(__dirname, "../json/heading.json"), (err, data) => {return data}).toString()

server.on("connection", (ws) => {
    console.log("\nConnection established!")
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
            if (heading_temp == '+x') {
                heading = '-z'
            } else if (heading_temp == '-z') {
                heading = '-x'
            } else if (heading_temp == '-x') {
                heading = '+z'
            } else if (heading_temp == '+z') {
                heading = '+x'
            }
            fs.writeFile(path.resolve(__dirname, "../json/heading.json"), JSON.stringify(heading), (err) => {
                if (err) throw err
            })
            // http.get('http://localhost:8100', (res) => {})
        } else if (obj == 'right') {
            if (heading_temp == '+x') {
                heading = '+z'
            } else if (heading_temp == '+z') {
                heading = '-x'
            } else if (heading_temp == '-x') {
                heading = '-z'
            } else if (heading_temp == '-z') {
                heading = '+x'
            }
            fs.writeFile(path.resolve(__dirname, "../json/heading.json"), JSON.stringify(heading), (err) => {
                if (err) throw err
            })
            // http.get('http://localhost:8100', (res) => {})
        } else if (obj == 'forward' || obj == 'back') {
            var coord_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
            var turtle_heading = heading_temp.split('')
            var RAWturtle = Object.keys(coord_data).find(key => coord_data[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var turtle_pos = []
            for (let i = 0; i < turtle.length; i++) {
                turtle_pos.push(parseInt(turtle[i]))
            }
            if (obj == 'forward') {
                if (turtle_heading[1] == 'x') {
                    if (turtle_heading[0] == '+') {
                        turtle_pos[0] += 1
                    } else if (turtle_heading[0] == '-') {
                        turtle_pos[0] -= 1
                    }
                } else if (turtle_heading[1] == 'z') {
                    if (turtle_heading[0] == '+') {
                        turtle_pos[2] += 1
                    } else if (turtle_heading[0] == '-') {
                        turtle_pos[2] -= 1
                    }
                }
            } else if (obj == 'back') {
                if (turtle_heading[1] == 'x') {
                    if (turtle_heading[0] == '+') {
                        turtle_pos[0] -= 1
                    } else if (turtle_heading[0] == '-') {
                        turtle_pos[0] += 1
                    }
                } else if (turtle_heading[1] == 'z') {
                    if (turtle_heading[0] == '+') {
                        turtle_pos[2] -= 1
                    } else if (turtle_heading[0] == '-') {
                        turtle_pos[2] += 1
                    }
                }
            }
            delete coord_data[RAWturtle]
            coord_data[turtle_pos.toString()] = 'Self'
            fs.writeFile(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coord_data), (err) => {
                if (err) throw err
            })
        } else if (obj == 'up' || obj == 'down') {
            var coord_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
            var RAWturtle = Object.keys(coord_data).find(key => coord_data[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var turtle_pos = []
            for (let i = 0; i < turtle.length; i++) {
                turtle_pos.push(parseInt(turtle[i]))
            }
            if (obj == 'up') {
                turtle_pos[1] += 1
            } else if (obj == 'down') {
                turtle_pos[1] -= 1
            }
            delete coord_data[RAWturtle]
            coord_data[turtle_pos.toString()] = 'Self'
            fs.writeFile(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coord_data), (err) => {
                if (err) throw err
            })
        } else if (obj.includes('FRONT')) {
            var coords = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
            var turtle_heading = heading_temp.split('')
            var RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var block_pos = []
            for (let i = 0; i < turtle.length; i++) {
                block_pos.push(parseInt(turtle[i]))
            }
            if (turtle_heading[1] == 'x') {
                if (turtle_heading[0] == '-') {
                    block_pos[0] -= 1
                } else if (turtle_heading[0] == '+') {
                    block_pos[0] += 1
                }
            } else if (turtle_heading[1] == 'z') {
                if (turtle_heading[0] == '-') {
                    block_pos[2] -= 1
                } else if (turtle_heading[0] == '+') {
                    block_pos[2] += 1
                }
            }
            block_pos = block_pos.join(',')
            var write_data = obj.split(' ')[0]
            coords[block_pos] = write_data
            fs.writeFileSync(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords))
        } else if (obj.includes('BOTTOM')) {
            var coords = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
            var RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var block_pos = []
            for (let i = 0; i < turtle.length; i++) {
                block_pos.push(parseInt(turtle[i]))
            }
            block_pos[1] -= 1
            block_pos = block_pos.join(',')
            var write_data = obj.split(' ')[0]
            coords[block_pos] = write_data
            fs.writeFileSync(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords))
        } else if (obj.includes('TOP')) {
            var coords = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../json/coords.json")).toString())
            var turtle_heading = heading_temp.split('')
            var RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var block_pos = []
            for (let i = 0; i < turtle.length; i++) {
                block_pos.push(parseInt(turtle[i]))
            }
            block_pos[1] += 1
            block_pos = block_pos.join(',')
            var write_data = obj.split(' ')[0]
            coords[block_pos] = write_data
            fs.writeFileSync(path.resolve(__dirname, "../json/coords.json"), JSON.stringify(coords))
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