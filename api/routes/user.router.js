const express = require('express');
const router = express.Router();

const {
    getUserInfo,
    profileUpdate,
    profileImageUpdate,
    changeEmail,
    changePassword,
    deleteAccount,
    addMySportsById,
    mySports
} = require('../controllers/v1/user.controller');

router.get('/me', getUserInfo);
router.put('/profile', profileUpdate);
router.post('/profileimage', profileImageUpdate);
router.post('/changeemail', changeEmail);
router.post('/changepassword', changePassword);
router.post('/deleteaccount', deleteAccount);
router.post('/addmysport', addMySportsById);
router.get('/mysports', mySports);

module.exports = router;