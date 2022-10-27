const express = require('express');
const router = express.Router();

const {
    index,
    getUserInfo,
    profileUpdate,
    profileImageUpdate,
    changeEmail,
    changePassword,
    socialAccount
} = require('../controllers/v1/user.controller');

router.get('/', index);
router.get('/me', getUserInfo);
router.post('/profile', profileUpdate);
router.post('/profileimage', profileImageUpdate);
router.post('/changeemail', changeEmail);
router.post('/changepassword', changePassword);
router.post('/socialaccount', socialAccount);

module.exports = router;