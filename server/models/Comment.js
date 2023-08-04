const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
}, {timestamps: true});

module.exports = mongoose.model("Comment", CommentSchema);