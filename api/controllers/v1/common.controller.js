const sportCategories = require('../../models/sportCategories');
const sportsformats = require('../../models/sportsFormats');
const sports = require('../../models/sports');
const intro = require('../../models/Intro');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

function getsportCategories(req, res) {
    let query = { status: 'Y' };
    if (req.body.keywords) {
        query.$or = [
        {
           cat_name: {
                $regex: '.*' + req.body.keywords + '.*',
            },
           sport_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }

    sportCategories.find(query, { cat_name : 1 }).populate({
                path : 'sports',
                select:'sport_name',
        })
        .then(results => {

            if (results.length === 0) return res.status(200).send({ success: false, categories: [], message:'Sport Categories' });

            let categoryarr = [];

             results.forEach(function(u) {
                let intr = {
                    "_id": (u._id)?u._id:'',
                    "cat_name": (u.cat_name)?u.cat_name:'',
                    "sports": (u.sports)?u.sports:[]
                };
                categoryarr.push(intr);
            });

            return res.status(200).send({ success: true, categories: categoryarr, message:'Sport Categories' });

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
            if (results.length === 0) return res.status(200).send({ success: false, 'formats': [], message:'Sport Formats' });
            return res.status(200).send({ success: true, formats: results, message:'Sport Formats' });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
function getsports(req, res) {
    let status = (req.body.status)?req.body.status:'Y';
    let query = { status: status };
    if (req.body.keywords) {
        query.$or = [
        {
           sport_name: {
                $regex: '.*' + req.body.keywords + '.*',
            }
        }
        ];
    }
    sports.find(query, {sport_name:1, sport_icon:1, sport_slug:1}).populate({
                path : 'formats',
                select:'format_name'
        })
        .then(results => {
            if (results.length === 0) return res.status(200).send({ success: false, 'sports': [], message:'Sports' });

            let sportsarr = [];

             results.forEach(function(u) {
                let rootdir = config.UPLOAD_DIR;
                let fpath = rootdir + '/sports/' + u.sport_icon;
                let filepath = fpath.replaceAll('\\', '/'); 

                let intr = {
                    "_id": (u._id)?u._id:'',
                    "sport_name": (u.sport_name)?u.sport_name:'',
                    "sport_icon": (u.sport_icon)?filepath:'',
                    "formats": (u.formats)?u.formats:[]
                };
                sportsarr.push(intr);
            });

            return res.status(200).send({ success: true, sports: sportsarr, message:'Sports' });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
function getintro(req, res) {
    let status = (req.body.status)?req.body.status:'Y';
    let query = { status: status };

    intro.find(query, {_id:0, image_name:1, image_title:1, image_desc:1}).sort({ image_pos : 1})
        .then(results => {
            if (results.length === 0) 
            return res.status(200).send({ success: false, 'intro': [], message:'Intro' });

            
            let introarr = [];

             results.forEach(function(u) {
                let rootdir = config.UPLOAD_DIR;
                let fpath = rootdir + '/intro/' + u.image_name;
                let filepath = fpath.replaceAll('\\', '/'); 

                let intr = {
                    "image_title": (u.image_title)?u.image_title:'',
                    "image_name": (u.image_name)? filepath : '',
                    "image_desc": (u.image_desc)?u.image_desc:''
                };
                introarr.push(intr);
            });

            return res.status(200).send({ success: true, intro: introarr, message:'Intro' });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
module.exports = {
    getsportCategories,
    getsportFormats,
    getsports,
    getintro
}
