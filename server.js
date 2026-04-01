const express=require('express');
const {WebSocketServer}=require('ws');
const path=require('path');

const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// initalizing websocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected!');

    // Listen for messages from the client
    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        
        // Broadcast the message to EVERY connected client
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // 1 means OPEN
                client.send(`Server says: ${data}`);
            }
        });
    });
    // The server starts "talking" on its own every 5 seconds
const heartbeat = setInterval(() => {
    if (ws.readyState === 1) {
        ws.send("Server Heartbeat: I am still alive!");
    }
}, 5000);

ws.on('close', () => clearInterval(heartbeat));

    ws.on('close', () => console.log('Client disconnected'));
});