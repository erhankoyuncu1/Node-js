const { raw } = require('express');
const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');
const authentication = require('../middleware/authentication');

//login
router.get('/login', accountController.getLogin);

router.post('/login', accountController.postLogin);

//logout
router.get('/logout', authentication, accountController.getLogout);

//register
router.get('/register', accountController.getRegister);

router.post('/register', accountController.postRegister);

//reset Password
router.get('/reset-password', accountController.getResetPassword);

router.post('/reset-password', accountController.postResetPassword);

router.get('/reset-password/:token', accountController.getNewPassword);

router.post('/new-password', accountController.postNewPassword);

module.exports = router;