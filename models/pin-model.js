const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = new Schema({
    pinName: String,
    pinDesc: String,
    pinUId: String,
    pinUser: String,
    thumbnail: String
});

const Pin = mongoose.model('pin', pinSchema);

module.exports = Pin;