const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        max: 500,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports=Comment;