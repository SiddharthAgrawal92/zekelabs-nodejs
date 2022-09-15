const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    comment: {
        type: String,
        max: [200, 'Maximum limit exceeded'],
        required: [true, 'Comment is required']
    },
    userName: {
        type: String,
        required: [true, 'userName is required']
    },
    updated: {
        type: Date,
        default: () => new Date()
    }
});

module.exports = mongoose.model('Posts', PostsSchema);