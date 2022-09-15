let AuthRoutes = require('express').Router();
let auth = require('../middlewares/auth.middleware');
const { loginValidator } = require('../validators/auth.validators')
const { login, refreshToken } = require('../controllers/auth.controllers');

AuthRoutes.post('/login', loginValidator, login);

AuthRoutes.get('/refresh', auth, refreshToken);

module.exports = AuthRoutes;