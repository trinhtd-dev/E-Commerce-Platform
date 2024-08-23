const User = require("../../models/user.model");
const Message = require("../../models/message.model");

const socketChat = require("../../sockets/socket.chat");

const moment = require('moment');

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        
        await socketChat.chat(res);
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