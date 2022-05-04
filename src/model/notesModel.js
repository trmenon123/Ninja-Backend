const mongoose = require('mongoose');
const {Schema}= mongoose;

const NotesSchema= new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    userProfileId: {
        type: Schema.ObjectId,
        ref: "UserProfile",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mediaPresent: {
        type: Boolean,
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Notes", NotesSchema);