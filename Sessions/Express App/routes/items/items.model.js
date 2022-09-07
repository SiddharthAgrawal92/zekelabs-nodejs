let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ItemsSchema = new Schema({
    name: String,
    type: String,
    quantity: Number,
    price: Number,
    tags: [""]
});

module.exports = mongoose.model('Items', ItemsSchema);
