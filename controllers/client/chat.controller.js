const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// Function to handle client send data
const handleClientSendData = async (socket, user, messageData) => {
    try {
        const files = [];

        // Lưu trữ các tệp ảnh
        for (const file of messageData.files) {
            const base64Data = file.data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filePath = path.join(__dirname, '../../uploads', file.name);
            fs.writeFileSync(filePath, buffer);
            files.push(`/uploads/${file.name}`);
        }

        const message = new Message({
            userId: user.id,
            content: messageData.message,
            files: files
        });
        await message.save();

        const data = {
            userId: user.id,
            content: messageData.message,
            userInfo: user,
            time: moment(message.createdAt).format('HH:mm'),
            files: files
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