const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister } = require('../middlewares/validateMiddlewares');

router.post('/register', validateRegister, userController.register);

module.exports = router;