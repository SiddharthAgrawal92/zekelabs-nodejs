let { query, validationResult } = require('express-validator');
let validationMessages = require('../commons/validationMessages');

const getAllPostsValidator = async (req, res, next) => {
    await query('sortBy').optional().isIn(['updated']).run(req);
    await query('sortOrder').optional().isIn(['1', '-1']).run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send({ errors: errors.array() })
    } else {
        next();
    }
}

module.exports = {
    getAllPostsValidator
}

