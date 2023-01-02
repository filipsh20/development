const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    wallet: {type: Number, unique: false, required: true}
});

module.exports = mongoose.model('Users', userSchema);