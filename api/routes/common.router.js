const express = require('express');
const router = express.Router();
const {
    getsportCategories,
    getsportFormats,
    getsports,
    getsportsbycategory
} = require('../controllers/v1/common.controller');

router.get('/sportcategories', getsportCategories);
router.get('/sportformats', getsportFormats);
router.get('/sports', getsports);
router.get('/catsports', getsportsbycategory);

module.exports = router;