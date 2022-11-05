const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const router = express.Router();
const {
    createUserAccount,
    userLogin,
    forgotPass,
    resetPass,
    verifyOTP,
    resendOTP,
    signOut
} = require('../controllers/v1/auth.controller');

router.post('/register', createUserAccount);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPass);
router.post('/reset-password', resetPass);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/logout', signOut);

router.get('/dashboard', function(req, res) {
    res.send('It worked! User id is: ' );
});

module.exports = router;