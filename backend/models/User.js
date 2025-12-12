const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim : true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim : true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim : true,
    },
    phone: String,
    profilePic: {
        type: String,
        default: "https://avatar.iran.liara.run/public",
    },
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
}, 
{timestamps: true, versionKey: false}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
