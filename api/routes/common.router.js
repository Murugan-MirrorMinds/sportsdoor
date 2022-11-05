const express = require('express');
const router = express.Router();
const {
    getintro,
    getsportCategories,
    getsportFormats,
    getsports
} = require('../controllers/v1/common.controller');


router.get('/intro', getintro);
router.get('/sportcategories', getsportCategories);
router.get('/sportformats', getsportFormats);
router.get('/sports', getsports);

module.exports = router;