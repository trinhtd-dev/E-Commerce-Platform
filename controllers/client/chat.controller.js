const User = require("../../models/user.model");
const Message = require("../../models/message.model");


// [GET] /chat
module.exports.index = async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 }).limit(10);

    for(const message of messages) {
        message.userInfo = await User.findById(message.userId);
    };
    res.render('client/pages/chat/index', {
        title: 'Chat',  
        messages: messages
    })
};

// [POST] /
module.exports.sendPost = async (req, res) => {
   
};
