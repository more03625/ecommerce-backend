const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true
    },
    lastname: {
        type: String,
        required: false,
    },
    profileImage:{
        type: String,
        required: false,
        unique: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
        unique: false,
    },
    addressOne: {
        type: String,
        required: false
    },
    addressTwo: {
        type: String,
        required: false,
    },
    zipcode: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);