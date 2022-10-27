const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const router = express.Router();
const {
    checkAuthentication,
    createUserAccount,
    userLogin,
    forgotPass,
    resetPass,
    createUserAccountByOTP,
    createUserAccountSocialmedia,
    verifyOTP,
    verifyEmail,
    resendOTP
} = require('../controllers/v1/auth.controller');

router.get('/check-auth', passport.authenticate('jwt', {
    session: false
}), checkAuthentication);

router.post('/register', createUserAccount);
router.post('/register-otp', createUserAccountByOTP);
router.post('/register-media', createUserAccountSocialmedia);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPass);
router.post('/reset-password', resetPass);
router.post('/verify-otp', verifyOTP);
router.post('/verifyemail', verifyEmail);
router.post('/resend-otp', resendOTP);

/* router.get('/dashboard', checkAuth , { session: false }), function(req, res) {
    res.send('It worked! User id is: ' );
};
 */
router.get('/dashboard', function(req, res) {
    res.send('It worked! User id is: ' );
});

module.exports = router;