const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const moment = require('moment');

// fucntion to handle client send data
const handleClientSendData = async (socket, user, content) => {
    try {
        const message = new Message({
            userId: user.id,
            content: content
        });
        await message.save();
        const data = {
            userId: user.id,
            content: content,
            userInfo: user,
            time: moment(message.createdAt).format('HH:mm')
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
            socket.on("CLIENT_SEND_DATA", (content) => {
                handleClientSendData(socket, res.locals.user, content);
            });
        });

        const messages = await Message.find({}).sort({ createdAt: -1 }).limit(10)

        for (const message of messages) {
            message.userInfo = res.locals.user;
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