const sportCategories = require('../../models/sportCategories');
const sportsformats = require('../../models/sportsFormats');
const sports = require('../../models/sports');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');


function getsportCategories(req, res) {
    let query = { status: 'Y' };
    if (req.body.keywords) {
        query.$or = [
        {
           cat_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }

    sportCategories.find(query, { cat_name : 1 })
        .then(results => {
            if (results.length === 0) return res.status(200).send({ success: false, 'categories': [] });
            return res.status(200).send({ success: true, categories: results });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}

function getsportFormats(req, res) {
    let query = { status: 'Y' };
    if (req.body.keywords) {
        query.$or = [
        {
           format_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }
    sportsformats.find(query, { format_name : 1 })
        .then(results => {
            if (results.length === 0) return res.status(200).send({ success: false, 'formats': [] });
            return res.status(200).send({ success: true, formats: results });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
function getsports(req, res) {
    let query = { status: 'Y' };
    if (req.body.keywords) {
        query.$or = [
        {
           sport_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }
    sports.find(query)
        .then(results => {
            if (results.length === 0) return res.status(200).send({ success: false, 'sports': [] });
            return res.status(200).send({ success: true, sports: results });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
function getsportsbycategory(req, res) {
    let query = { status: 'Y' };
    if (req.body.keywords) {
        query.$or = [
        {
           sport_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }
    sportCategories.find(query)
        .then(results => {

            if (results.length === 0) return res.status(200).send({ success: false, 'sports': [] });

            sports.find(query)
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'sports': [] });
                return res.status(200).send({ success: true, sports: results });

            }).catch(() => {
                return res.status(400).send({ success: false, message: 'Server error' });
            });

            
            

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}


module.exports = {
    getsportCategories,
    getsportFormats,
    getsports,
    getsportsbycategory
}
