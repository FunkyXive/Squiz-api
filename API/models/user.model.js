const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Post
let User = new Schema({
    email: {
        type: String,
        required: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'restricted', 'normal'],
        required: true
    },
}, {
    collection: "users",
})

module.exports = mongoose.model("User", User);