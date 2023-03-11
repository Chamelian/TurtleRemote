const http = require('http')
const fs = require('fs')
const ws = require('ws')

const port = 8100
var heading = (require('./heading.json')).toString()
var listeners = 0

const websocket = new ws.WebSocket('ws://localhost:8000')

// note: DO NOT FUCK WITH THIS FUNCTION!
function HeadingListener() {
    websocket.addEventListener('message', msg => {
        try {
            obj = JSON.parse(msg.data)['func']
        } catch {

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
            fs.writeFile('./heading.json', JSON.stringify(heading), (err) => {
                if (err) throw err
            })
            http.get('http://localhost:8100', (res) => {})
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
            fs.writeFile('./heading.json', JSON.stringify(heading), (err) => {
                if (err) throw err
            })
            http.get('http://localhost:8100', (res) => {})
        } else if (obj == 'forward' || obj == 'back') {
            var coord_data = JSON.parse(fs.readFileSync('./coords.json').toString())
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
            fs.writeFile('./coords.json', JSON.stringify(coord_data), (err) => {
                if (err) throw err
            })
        } else if (obj == 'up' || obj == 'down') {
            var coord_data = JSON.parse(fs.readFileSync('./coords.json').toString())
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
            fs.writeFile('./coords.json', JSON.stringify(coord_data), (err) => {
                if (err) throw err
            })
        } else if (msg.data.includes('FRONT')) {
            var coords = JSON.parse(fs.readFileSync('./coords.json').toString())
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
            var write_data = JSON.parse(msg.data.split(' ')[0] + '"}')['func']
            coords[block_pos] = write_data
            fs.writeFileSync('./coords.json', JSON.stringify(coords))
        } else if (msg.data.includes('BOTTOM')) {
            var coords = JSON.parse(fs.readFileSync('./coords.json').toString())
            var RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var block_pos = []
            for (let i = 0; i < turtle.length; i++) {
                block_pos.push(parseInt(turtle[i]))
            }
            block_pos[1] -= 1
            block_pos = block_pos.join(',')
            var write_data = JSON.parse(msg.data.split(' ')[0] + '"}')['func']
            coords[block_pos] = write_data
            fs.writeFileSync('./coords.json', JSON.stringify(coords))
        } else if (msg.data.includes('TOP')) {
            var coords = JSON.parse(fs.readFileSync('./coords.json').toString())
            var turtle_heading = heading_temp.split('')
            var RAWturtle = Object.keys(coords).find(key => coords[key] === 'Self')
            var turtle = RAWturtle.split(',')
            var block_pos = []
            for (let i = 0; i < turtle.length; i++) {
                block_pos.push(parseInt(turtle[i]))
            }
            block_pos[1] += 1
            block_pos = block_pos.join(',')
            var write_data = JSON.parse(msg.data.split(' ')[0] + '"}')['func']
            coords[block_pos] = write_data
            fs.writeFileSync('./coords.json', JSON.stringify(coords))
        } else if (msg.data.includes('FUEL')) {
            fuel_level = JSON.parse(msg.data)['func'].split('FUEL')[0]
            fs.writeFileSync('./fuelLevel.json', JSON.stringify(fuel_level))
        }
    });
    listeners += 1
    return true
}

const server = http.createServer((req,res)=>{
    if (listeners < 1) {
        HeadingListener()
    }
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/json')
    fs.readFile('./heading.json', (err, data) =>{
        if (err) throw err;
        heading = data.toString()
    })
    res.end(JSON.stringify(heading));
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`)

  var options = {
    port: 8100,
    host: '127.0.0.1',
  };

  var request = http.request(options);
  request.setHeader('Content-Type', 'application/json')

  request.end();
})