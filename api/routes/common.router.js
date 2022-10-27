const express = require('express');
const router = express.Router();
const {
    Access,
    getSports,
} = require('../controllers/common.controller');

router.post('/Access', Access);
router.get('/sports', getSports);
module.exports = router;