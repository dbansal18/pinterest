const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    githubID: String,
    githubUserName: String,
    name: String,
    email: String,
    thumbnail: String,
    bio: String,
    pinID: [String]
});

const User = mongoose.model('user', userSchema);

module.exports = User;