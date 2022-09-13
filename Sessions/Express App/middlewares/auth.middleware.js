const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // const token = req.headers['x-access-token'];
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).send({ msg: 'Token is required' });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ msg: 'Invalid token' });
        }
    }
    return next();
}

module.exports = verifyToken;