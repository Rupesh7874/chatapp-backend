const message = require('../models/messagemodel');
const code = require('../utils/statuscodemessage');

module.exports = function (io) {
    try {
        io.on("connection", (socket) => {
            // console.log("New client connected:", socket.id);

            socket.on('join', (data) => {
                socket.join(data.userId);
                console.log(`User ${data.userId} joined personal room`);

            });
            socket.on('message', async ({ senderId, receiverId, content, isGroup }) => {
                // console.log(senderId, receiverId, content, isGroup);
                const newMsg = await message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    isGroup: isGroup || false,
                });
                // Send to personal or group room
                io.to(receiverId).emit('receiveMessage', newMsg);
            });


            socket.on('disconnecting', () => {
                console.log("user disconnect");
            })
        });
    }
    catch (error) {
        console.log(error);
        res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}