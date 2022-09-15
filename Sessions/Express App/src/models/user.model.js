let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let UserSchema = new Schema({
    userName: String,
    password: String,
    name: String,
    mobile: Number,
    role: String
});

//create a hash password
UserSchema.methods.generateEncryptedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//create a hash password
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);