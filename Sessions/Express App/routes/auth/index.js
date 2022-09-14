let AuthRoutes = require('express').Router();
const { check, validationResult, header } = require('express-validator');
let User = require('../users/user.model');
let jwt = require('jsonwebtoken');
let auth = require('../../middlewares/auth.middleware');

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


                const tokenDetails = getTokenDetails(userDetail);

                //token set as object in response
                // res.status(200).send({
                //     msg: 'Login Successful',
                //     access_token: tokenDetails.accessToken,
                //     refresh_token: tokenDetails.refreshToken,
                //     expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

                // });

                // jwt token set as cookie in response
                res.cookie('access_token', tokenDetails.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
                }).status(200).send({ msg: 'Login Successful', expiry: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
            }
        }
    });
});

AuthRoutes.get('/refresh', auth, (req, res) => {

    const currentTimeInSecs = Math.round(Number(new Date() / 1000));
    if (req.user.exp - currentTimeInSecs > 30) {
        return res.status(401).send('Request for a new token is received before before 30 secs of expiry of access_token');
    }

    let userDetail = {
        userName: req.user.sub,
        role: req.user.scope
    }
    const newTokenDetails = getTokenDetails(userDetail);
    res.cookie('access_token', newTokenDetails.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    }).status(200).send({ msg: 'Login Successful' });
});

//Problem
//I have 3 devices
//Logged in to all devices
//all my devices are stolen so robber will have access to my login sessions for an indefinite time

//Solution
//storage of refresh token in db
//We can use redis package in node js  - it is a nosql db that's fast to persist the data in key-value pair.
//introduce an endpoint to revoke access from all devices
//on user authorization to above request we should remove all the refresh token where they are persisted

const getTokenDetails = (userDetail) => {
    let claims = {
        iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
        sub: userDetail.userName,
        scope: userDetail.role
    }
    let accessToken = jwt.sign(claims, process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY, {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    });
    // let refreshToken = jwt.sign(claims, process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY, {
    //     algorithm: 'HS256',
    //     expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    // });
    return {
        accessToken: accessToken,
        // refreshToken: refreshToken
    }
}

module.exports = AuthRoutes;