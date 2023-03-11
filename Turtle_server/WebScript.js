const ws = new WebSocket("ws://localhost:8000")


function turtlePrint() {
    ws.send('Test Connection')
    obj = ws.receive()
    msg = obj["func"]
    console.log(msg)
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


ws.addEventListener("message", msg=> {
    if ((msg.data).includes("name")) {
        var obj = JSON.parse(msg.data)['func']
        if (obj.includes('}front')) {
            obj = JSON.parse(obj.split('front')[0].replace(/=/g, ':'
            ).replace(/(\,)(?=\s*})/g, '').replace(/(\s[a-zA-Z_]+\s)/g, '"$1"'
            ).replace(/(\n)/g, ''))[" name "]
            obj = obj + ' FRONT'
            ws.send(obj)
        } else if (obj.includes('}top')) {
            obj = JSON.parse(obj.split('top')[0].replace(/=/g, ':'
            ).replace(/(\,)(?=\s*})/g, '').replace(/(\s[a-zA-Z_]+\s)/g, '"$1"'
            ).replace(/(\n)/g, ''))[" name "]
            obj = obj + ' TOP'
            ws.send(obj)
        } else if (obj.includes('}bottom')) {
            obj = JSON.parse(obj.split('bottom')[0].replace(/=/g, ':'
            ).replace(/(\,)(?=\s*})/g, '').replace(/(\s[a-zA-Z_]+\s)/g, '"$1"'
            ).replace(/(\n)/g, ''))[" name "]
            obj = obj + ' BOTTOM'
            ws.send(obj)
        }
    } else if (JSON.parse(msg.data)['func'] == 'front air') {
        console.log('air ->')
    } else if (JSON.parse(msg.data)['func'] == 'up air') {
        console.log('air /\\')
    } else if (JSON.parse(msg.data)['func'] == 'bottom air') {
        console.log('air \\/')
    }
})