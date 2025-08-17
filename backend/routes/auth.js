const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middlewares/validateMiddlewares');

router.post('/login',validateLogin, authController.login);

module.exports = router;