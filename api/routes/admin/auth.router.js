const passport = require('passport');
require('../../config/admin-passport')(passport);
const express = require('express');
const router = express.Router();
const {
    createNewAdmin,
    adminLogin,
    forgotPass,
    resetPass
} = require('../../controllers/admin/auth.controller');

router.post('/register', createNewAdmin);

router.post('/login', adminLogin);

router.post('/forgot-password', forgotPass);

router.post('/reset-password', resetPass);

module.exports = router;