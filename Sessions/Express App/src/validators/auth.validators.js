let { check, validationResult } = require('express-validator');
let validationMessages = require('../commons/validationMessages');

const loginValidator = async (req, res, next) => {
    await check('userName', validationMessages.REQUIRED_USERNAME).exists().run(req);
    await check('userName', validationMessages.STRING_USERNAME).isString().run(req);

    await check('password', validationMessages.REQUIRED_PASSWORD).exists().run(req);
    await check('password', validationMessages.STRING_PASSWORD).isString().run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ err: errors.array() });
    } else {
        next();
    }
}

module.exports = {
    loginValidator
}