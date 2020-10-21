const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 128,
        trim: true
    },
    created_by: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;