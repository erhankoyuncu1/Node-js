const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');

//login
router.get('/login', accountController.getLogin);

router.post('/login', accountController.postLogin);

//register
router.get('/register', accountController.getRegister);

router.post('/register', accountController.postRegister);

//reset Password
router.get('/reset-password', accountController.getRegister);

router.post('/reset-password', accountController.postRegister);

module.exports = router;