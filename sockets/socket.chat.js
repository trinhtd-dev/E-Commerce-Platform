const uploadToCloudinary = require("../helpers/uploadToCLoudinary");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const moment = require('moment');

// Function to handle client send data
const handleClientSendData = async (socket, user, messageData) => {
    try {
        //save images to upload
        const images = [];
        for (const file of messageData.files) {
            const url = await uploadToCloudinary(file);
            images.push(url);
        }
        const message = new Message({
            userId: user.id,
            content: messageData.message,
            images: images
        });

        await message.save();
        
        const data = {
            userId: user.id,
            content: messageData.message,
            images: images,
            userInfo: user,
            time: moment(message.createdAt).format('HH:mm'),
        };
        _io.emit("SERVER_SEND_DATA", data);
    } catch (error) {
        console.error('Error saving message:', error);
    }
};

module.exports.chat = (res) => {
    _io.once('connection', (socket) => {
        console.log('a user connected');
        socket.on("CLIENT_SEND_DATA", (messageData) => {
            handleClientSendData(socket, res.locals.user, messageData);
        });

        // Typing
        socket.on("CLIENT_TYPING", async (userId) => {
            const user = await User.findOne({_id: userId});
            socket.broadcast.emit("SERVER_TYPING", user);
        });
    });
}