const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// Function to handle client send data
const handleClientSendData = async (socket, user, messageData) => {
    try {
        //save images to upload
        const images = [];
        for (const file of messageData.files) {
            fileName = `${Date.now()}.png`;
            const filePath = path.join(__dirname, '../../public/uploads', fileName);
            fs.writeFileSync(filePath, file);
            images.push(`/uploads/${fileName}`);
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

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
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

        const messages = await Message.find({}).sort({ createdAt: -1 }).limit(10);

        for (const message of messages) {
            message.userInfo = await User.findOne({ _id: message.userId });
            message.time = moment(message.createdAt).format('HH:mm');
        }

        res.render('client/pages/chat/index', {
            title: 'Chat',
            messages: messages.reverse(),
        });
    } catch (error) {
        console.error('Error loading chat page:', error);
        res.status(500).send('Internal Server Error');
    }
};