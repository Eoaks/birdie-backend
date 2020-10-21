const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 12
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    tweets: [
        { type: Schema.Types.ObjectId, ref: 'Tweet' }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;