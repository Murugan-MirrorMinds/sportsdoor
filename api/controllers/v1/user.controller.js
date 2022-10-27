const User = require('../../models/User');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

function loggedIn(req, res) {
    console.log(req.user);
    if (req.user) {
        console.log(req.user);
    } else {
        console.log("Go to Login");
    }
}

function index(req, res) {
    let query = {};

    return res.json({ success: true, message:"User Controller" });

}


module.exports = {
    loggedIn,
    index
}
