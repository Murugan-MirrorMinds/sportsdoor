const express = require('express');
const router = express.Router();

const {
    index,
    getUserInfo,
    profileUpdate,
    profileImageUpdate,
    changeEmail,
    changePassword,
    deleteAccount
} = require('../controllers/v1/user.controller');

const upload = require('../services/upload');

router.get('/', index);
router.get('/me', getUserInfo);
router.put('/profile', profileUpdate);
router.post('/profileimage', upload, profileImageUpdate);
router.post('/changeemail', changeEmail);
router.post('/changepassword', changePassword);
router.post('/deleteaccount', deleteAccount);

module.exports = router;