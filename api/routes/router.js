const passport = require('passport');
require('../config/passport')(passport);

var checkAuth = require('../config/check-auth');
const express = require('express');
const router = express.Router();


const authRouter = require('./auth.router');
const userRouter = require('./user.router');

router.get('/v1/', (req, res) => {
    res.send('Welcome!')
});

//router.use('/v1/common', commonRouter);
router.use('/v1/auth', authRouter);
router.use('/v1/user', checkAuth, userRouter);

module.exports = router;