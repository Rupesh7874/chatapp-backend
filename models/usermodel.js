const mongoose = require('mongoose');



const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    isActive: {
        type: String
    },
    profileimage: {
        type: String
    },
    createdAt: Date
}, { timestamps: true });


const User = mongoose.model('user', userschema);

module.exports = User;