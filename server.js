const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for drawing events
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data); // Broadcast to all other clients
    });

    // Listen for clear events
    socket.on('clear', () => {
        io.emit('clear'); // Notify all clients to clear their canvas
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5421;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
