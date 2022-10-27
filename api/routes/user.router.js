const express = require('express');
const router = express.Router();
const {
    loggedIn,
} = require('../controllers/v1/user.controller');

//router.get('/me',loggedIn, index);

/* router.get('/', loggedIn, function(req, res, next) {
    // req.user - will exist
    // load user orders and render them
     res.send('User Controller!')
});
 */
router.get('/', (req, res) => {
    res.send('About User!')
});

module.exports = router;