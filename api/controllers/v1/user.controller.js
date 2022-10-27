const User = require('../../models/User');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

function index(req, res) {
    
    return res.json({ success: true, message:"Index" });

}

function getUserInfo(req, res) {

    return res.json({ success: true, message:"Profile" });

}
function profileUpdate(req, res) {

    return res.json({ success: true, message:"Profile Update" });

}
function profileImageUpdate(req, res) {

    return res.json({ success: true, message:"Profile Image Update" });

}
function changeEmail(req, res) {

    return res.json({ success: true, message:"ChangeEmail" });

}
function changePassword(req, res) {

    return res.json({ success: true, message:"ChangePassword" });

}
function socialAccount(req, res) {

    return res.json({ success: true, message:"SocialAccount" });

}


module.exports = {
    index,
    getUserInfo,
    profileUpdate,
    profileImageUpdate,
    changeEmail,
    changePassword,
    socialAccount
}
