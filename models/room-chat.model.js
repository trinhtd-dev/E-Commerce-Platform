const mongoose = require('mongoose');

const roomChatSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'https://png.pngtree.com/element_our/png_detail/20181021/group-avatar-icon-design-vector-png_141882.jpg'
    },
    type: {
        type: String,
        enum: ['group', 'private'],
        default: 'private'
    },
    participants: [{
        userId: String,
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        },
    }],
    lastMessageId: String,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const RoomChat = mongoose.model('RoomChat', roomChatSchema);

module.exports = RoomChat;
