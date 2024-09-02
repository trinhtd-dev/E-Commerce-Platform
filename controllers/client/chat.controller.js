const User = require("../../models/user.model");
const Message = require("../../models/message.model");
const RoomChat = require("../../models/room-chat.model");
const socketChat = require("../../sockets/socket.chat");


const moment = require('moment');

// [GET] /chat/rooms
module.exports.rooms = async (req, res) => {
    try {
      const userId = res.locals.user.id;
      const rooms = await RoomChat.find({
        'participants.userId': userId,
        deleted: false
      }).sort({ updatedAt: -1 });
  
      for (let room of rooms) {
        if (room.type === 'private') {
          const otherParticipant = room.participants.find(p => p.userId.toString() !== userId);
          const userInfo = await User.findById(otherParticipant.userId).select('fullName avatar status');
          room.title = userInfo.fullName;
          room.avatar = userInfo.avatar;
          room.participants = [userInfo];
          room.isOnline = userInfo.status === 'online';
        } else {
          room.participants = await User.find({
            _id: { $in: room.participants.map(p => p.userId) }
          }).select('fullName avatar status');
          room.isOnline = room.participants.some(p => p.status === 'online');
        }
  
        const lastMessage = await Message.findOne({ roomId: room._id }).sort({ createdAt: -1 });
        room.lastMessage = lastMessage ? lastMessage.content : null;
        room.lastActivity = lastMessage ? moment(lastMessage.createdAt).fromNow() : 'No messages yet';
      }
  
      const users = await User.find({ _id: { $ne: userId } }).select('fullName avatar');
  
      res.render('client/pages/chat/rooms', {
        title: 'Đoạn chat',
        rooms: rooms,
        users: users
      });
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      res.status(500).send('Internal Server Error');
    }
  };
// [GET] /chat/rooms/:roomId

module.exports.chat = async (req, res) => {
    try {
        await socketChat.chat(req, res);
        const roomId = req.params.roomId;
        const roomChat = await RoomChat.findOne({ _id: roomId });
        const messages = await Message.find({ roomId: roomId }).sort({ createdAt: -1 }).limit(10);

        for (const message of messages) {
            message.userInfo = await User.findOne({ _id: message.userId });
            message.time = moment(message.createdAt).format('HH:mm');
        }

        await Promise.all(roomChat.participants.map( async (user) => {
            user.userInfo = await User.findOne({ _id: user.userId });
        }));

        res.render('client/pages/chat/index', {
            title: "chat",
            messages: messages.reverse(),
            roomChat: roomChat,
        });
    } catch (error) {
        console.error('Error loading chat page:', error);
        res.status(500).send('Internal Server Error');
    }
};

// [POST] /chat/rooms/create
module.exports.createGroup = async (req, res) => {
    console.log(req.body);
      const participants = req.body.participants.map(p => {
        return {
          userId: p,
          role: 'member'
        }
    });
    participants.push({
      userId: res.locals.user.id,
      role: 'admin'
    });
    const roomChatObject = {
      title: req.body.title,
      type: 'group',
      participants: participants,
    }
    const roomChat = await new RoomChat(roomChatObject).save();
    res.redirect(`/chat/room/${roomChat.id}`);
  };
