const mongoose = require('mongoose');

const messageschema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }, 
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    content: {
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
})

const message = mongoose.model('message', messageschema);

module.exports = message;