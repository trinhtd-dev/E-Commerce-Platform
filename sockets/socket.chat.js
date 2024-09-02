const uploadToCloudinary = require("../helpers/uploadToCLoudinary");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const moment = require('moment');

module.exports.chat = (req, res) => {
    _io.once('connection', (socket) => {
        const roomId = req.params.roomId;
        socket.join(roomId);
        socket.on("CLIENT_SEND_DATA", async (messageData) => {
            try {
                //save images to upload
                const images = [];
                for (const file of messageData.files) {
                    const url = await uploadToCloudinary(file);
                    images.push(url);
                }
                const message = new Message({
                    userId: res.locals.user.id,
                    content: messageData.message,
                    images: images,
                    roomId: roomId
                });
        
                await message.save();
                
                const data = {
                    userId: res.locals.user.id,
                    content: messageData.message,
                    images: images,
                    roomId: roomId,
                    userInfo: res.locals.user,
                    time: moment(message.createdAt).format('HH:mm'),
                };
                _io.to(roomId).emit("SERVER_SEND_DATA", data);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Typing
        socket.on("CLIENT_TYPING", async (userId) => {
            const user = await User.findOne({_id: userId});
            socket.broadcast.to(roomId).emit("SERVER_TYPING", user);
        });
    });
}