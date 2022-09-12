let AuthRoutes = require('express').Router();
const { check, validationResult, header } = require('express-validator');
let User = require('../users/user.model');

AuthRoutes.post('/login', [
    check('userName', 'userName is required').exists(),
    check('userName', 'userName should be of string type').isString(),

    check('password', 'password is required').exists(),
    check('password', 'password should be of string type').isString()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    User.findOne({ userName: req.body.userName }, function (err, userDetail) {
        if (err) {
            res.status(500).send({ msg: "Something went wrong." });
        } else {
            if (!userDetail) {
                res.status(401).send({ msg: "Please enter a correct userName or Password." });
            } else if (!userDetail.comparePassword(req.body.password)) {
                res.status(401).send({ msg: "Please enter a correct userName or Password." });
            } else {
                res.status(200).send({ msg: "Login Successful!" });
                //api-domain -> //www.example.com 
                //JSON WEB TOKEN 
                // part_1 - header
                // part_2 - payload/claims
                // part_3 - signature
                // sample JWT separated by period(.)-> part_1.part2_part3 (XXXXX.XXXXX.XXXX)

                // header: {
                //     alg: 'HS256', //signing algorithm
                //     type: 'JWT'
                // }

                // payload: {
                //     iss: 'https://www.api.com ',
                //     sub: userName, //for whom issued
                //     iat: issued_at //token issued time
                //     exp: expiry, //token expiry time
                //     isAdmin: true //custom claim of your app
                // }

            }
        }
    });
});

module.exports = AuthRoutes;