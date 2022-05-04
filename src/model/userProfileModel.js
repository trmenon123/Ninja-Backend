const mongoose = require('mongoose');
const {Schema}= mongoose;

const UserProfileSchema= new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("UserProfile", UserProfileSchema);