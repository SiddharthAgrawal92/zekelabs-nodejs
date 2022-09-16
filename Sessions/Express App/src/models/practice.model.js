const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    temperature: Number,
    batteryLevel: Number,
    timeStamp: Date
});

module.exports = mongoose.model('Device', deviceSchema);