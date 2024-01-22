const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');  // Agregar esta línea

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'cliente', 'chat.html');
    res.sendFile(filePath);
});

// Long Polling endpoint
app.get('/longpolling', (req, res) => {
    setTimeout(() => {
        res.send('Data from Long Polling');
    }, 5000);
});

// Short Polling endpoint
app.get('/shortpolling', (req, res) => {
    res.send('Data from Short Polling');
});

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
