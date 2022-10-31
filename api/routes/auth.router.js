const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const router = express.Router();
const {
    createUserAccount,
    userLogin,
    forgotPass,
    resetPass,
    createUserAccountByOTP,
    createUserAccountSocialmedia,
    verifyOTP,
    verifyEmail,
    resendOTP,
    signOut
} = require('../controllers/v1/auth.controller');

router.post('/register', createUserAccount);
router.post('/register-otp', createUserAccountByOTP);
router.post('/register-media', createUserAccountSocialmedia);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPass);
router.post('/reset-password', resetPass);
router.post('/verify-otp', verifyOTP);
router.post('/verifyemail', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/logout', signOut);

router.get('/dashboard', function(req, res) {
    res.send('It worked! User id is: ' );
});

module.exports = router;