const passport = require('passport');
require('../config/admin-passport')(passport);

const { isAdmin } = require('../services/utils');

const express = require('express');
const router = express.Router();


const authRouter = require('./admin/auth.router');
const userRouter = require('./admin/user.router');

router.get('/v1/admin/', (req, res) => {
    res.send('Welcome Admin!')
});

router.use('/v1/auth', authRouter);
router.use('/v1/user', isAdmin, userRouter);

module.exports = router;