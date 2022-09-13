let AuthRoutes = require('express').Router();
const { check, validationResult, header } = require('express-validator');
let User = require('../users/user.model');
let jwt = require('jsonwebtoken');

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
                // res.status(200).send({ msg: "Login Successful!" });
                let claims = {
                    iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
                    sub: userDetail.userName,
                    scope: userDetail.role
                }
                let token = jwt.sign(claims, process.env.JWT_PRIVATE_KEY, {
                    algorithm: 'HS256',
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                //token set as object in response
                // res.status(200).send({ msg: 'Login Successful', access_token: token, expiresIn: process.env.JWT_EXPIRES_IN });

                //jwt token set as cookie in response
                res.cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: process.env.JWT_EXPIRES_IN
                }).status(200).send({ msg: 'Login Successful' });
            }
        }
    });
});

module.exports = AuthRoutes;