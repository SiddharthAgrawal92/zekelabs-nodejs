const UserRoutes = require('express').Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user.model');

UserRoutes.post('/register', [
    check('userName', 'userName is required').exists(),
    check('userName', 'userName should be of string type').isString(),
    check('userName', 'userName should be of string type').isLength({ min: 6, max: 15 }),
    check('userName', 'userName should be alpha numeric').isAlphanumeric(),


    check('password', 'password is required').exists(),
    check('password', 'password should be of string type').isString(),
    check('password', 'password should contain at least 1 uppercase, 1 lowercase, 1 special character and have a minimum length of 8.').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1 }),

    check('name', 'name is required').exists(),
    check('name', 'name should be of string type').isString(),
    check('name', 'name should be of string type').isLength({ min: 2, max: 30 }),


    check('mobile', 'mobile is required').exists(),
    check('mobile', 'mobile should be of string type').isNumeric(),
    check('mobile', 'mobile should be of string type').isLength({ min: 10, max: 10 }),

    check('role', 'role is required').exists(),
    check('role', 'role should be of string type').isString(),
    check('role', 'role is invalid').isIn(process.env.ROLES)

], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    User.findOne({ userName: req.body.userName }).exec((err, userDetail) => {
        if (err) {
            res.status(500).send({ msg: "Something went wrong." });
        } else if (userDetail) {
            res.status(406).send({ msg: "This username already exists" });
        } else {
            let userData = new User(req.body);
            userData.password = userData.generateEncryptedPassword(req.body.password);
            userData.save((err, result) => {
                if (err) {
                    res.status(500).send({ msg: "Something went wrong." });
                } else {
                    res.status(201).send({ msg: 'User registered successfully' });
                }
            })
        }
    });
});

module.exports = UserRoutes;