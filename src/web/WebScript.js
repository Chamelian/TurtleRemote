const IP = prompt("Enter websocket IP address")

const ws = new WebSocket(`ws://${IP}:8000`)

function turtlePrint() {
    ws.send('Test Connection')
}
function turtleForward() {
    ws.send('forward')
}
function turtleBack() {
    ws.send('back')
}
function turtleLeft() {
    ws.send('left')
}
function turtleRight() {
    ws.send('right')
}
function turtleUp() {
    ws.send('up')
}
function turtleDown() {
    ws.send('down')
}
function turtleFuel() {
    ws.send('getFuel')
}

function decoder(obj, key) {
    obj = JSON.parse(obj.split(key)[0].replace(/=/g, ':')
        .replace(/(\,)(?=\s*})/g, '').replace(/(\s[a-zA-Z_]+\s)/g, '"$1"')
        .replace(/(\n)/g, '').replace(/\[(.*?)\]/g, "$1"))[" name "]
    obj = obj + ` ${key.toUpperCase()}`
    return obj
}

ws.addEventListener("message", msg=> {
    if ((msg.data).includes("name")) {
        var object = JSON.parse(msg.data)['func']
        if (object.includes('}front')) {
            ws.send(decoder(object, "front"))
        } else if (object.includes('}top')) {
            ws.send(decoder(object, "top"))
        } else if (object.includes('}bottom')) {
            ws.send(decoder(object, "bottom"))
        }
    } else if (JSON.parse(msg.data)['func'] == 'front air') {
        console.log('air ->')
    } else if (JSON.parse(msg.data)['func'] == 'up air') {
        console.log('air /\\')
    } else if (JSON.parse(msg.data)['func'] == 'bottom air') {
        console.log('air \\/')
    }
})