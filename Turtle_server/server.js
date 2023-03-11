// Main websocket server. Needs to be port forwarded with ngrok

const ws = require("ws");
const server = new ws.Server({port: 8000});

server.on("connection", ws=>{
    ws.on("message", msg=>{
        server.broadcast(JSON.stringify({func:msg.toString()}))
    })
});

server.broadcast = function broadcast(msg) {
    server.clients.forEach(function each(client){
        client.send(msg);
    });
};