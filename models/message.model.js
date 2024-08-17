const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Message
const messageSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
    }, { 
    timestamps: true
});

// Tạo model từ schema
const Message = mongoose.model('Message', messageSchema, 'messages');

// Xuất model để sử dụng ở nơi khác
module.exports = Message;