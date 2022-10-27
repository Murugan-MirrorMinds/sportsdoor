const express = require('express');
const router = express.Router();
const {
    getsportCategories,
    getsportFormats,
    getsports
} = require('../controllers/v1/common.controller');

router.get('/sportcategories', getsportCategories);
router.get('/sportformats', getsportFormats);
router.get('/sports', getsports);

module.exports = router;