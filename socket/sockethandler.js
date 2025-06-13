const jwt = require("jsonwebtoken");
const message = require('../models/messagemodel');
const code = require('../utils/statuscodemessage');

require('dotenv').config();

module.exports = function (io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        // console.log("Received token:", token);

        if (!token) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            socket.userId = decoded.userId;
            // console.log(socket.userId);
            
            next();
        } catch (err) {
            console.error("Invalid token", err.message);
            return next(new Error("Authentication error"));
        }
    });

    // When client connects
    io.on("connection", (socket) => {
        // console.log(socket);
        
        console.log(`Client connected: ${socket.id}, userId: ${socket.userId}`);

        // Join personal room
        // console.log(socket.userId);
        
        // socket.on('join', () => {
            socket.join(socket.userId); 
            console.log(`User ${socket.userId} joined personal room`);
        // }); 

        // Handle message event
        socket.on('message', async ({ senderId, receiverId, content, isGroup }) => {
            try {
                const newMsg = await message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    isGroup: isGroup || false,
                });

                io.to(receiverId).emit('receiveMessage', newMsg); // send to specific user room
            } catch (err) {
                console.error("Error saving message:", err);
                socket.emit('error', { message: 'Message failed to send' });
            }
        });

        // On disconnect
        socket.on('disconnecting', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
};
