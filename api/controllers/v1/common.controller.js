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

            return res.status(200).send({ success: true, categories: results, message:'Sport Categories' });

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
    sports.find(query, {sport_name:1, sport_icon:1, sport_slug:1})
        .then(results => {
            if (results.length === 0) return res.status(200).send({ success: false, 'sports': [], message:'Sports' });
            return res.status(200).send({ success: true, sports: results, message:'Sports' });

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        });

}
function getsportsbycategory(req, res) {
    
    /* sportCategories.find({status: 'Y'}, {_id: 1}, function(err, docs) {

        // Map the docs into an array of just the _ids
        var ids = docs.map(function(doc) { return doc._id; });

       

        // Get the companies whose founders are in that set.
        //let dis = {query, categories: {$all: ids}};
      //  console.log(query);

         sports.find({query}, function(err, docs) {
            // docs contains your answer
            console.log(docs);
            return res.status(200).send({ success: true, sports: docs, message:'Sports' });
        }); 
    }); */
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
    /* sports.find(query).populate('sportcategories').then(results => {

        console.log('The cat_name is %s', results);

    }).catch(() => {
        return res.status(400).send({ success: false, message: 'Server error' });
    }); */

    sportCategories.find(query, {cat_name:1}).then(results => {

        sports
        .findOne({status:'Y'},{ _id:0, sport_name:1, sport_icon:1, sport_slug:1})
        .populate({
                path : 'categories',
                select:'cat_name',
        })
        .then(results => {
                console.log(results);
                res.json(results); 
        });

    });

    


    /* sportCategories.find(query, {cat_name:1})
        .then(results => {

            if (results.length === 0) return res.status(200).send({ success: false, 'catsports': [], message:'Sports' });

            let query1 = { 'status': 'Y'};

            sports.find({
                query1          
            }, {sport_name:1, sport_icon:1, sport_slug:1,categories:1})
            .then(results1 => {
                if (results1.length === 0) return res.status(200).send({ success: false, 'catsports': [], message:'Sports' });
                
                return res.status(200).send({ success: true, sports: results1, message:'Sports' });

            }).catch(() => {
                return res.status(400).send({ success: false, message: 'Server error' });
            });

            
            

        }).catch(() => {
            return res.status(400).send({ success: false, message: 'Server error' });
        }); */

}


module.exports = {
    getsportCategories,
    getsportFormats,
    getsports,
    getsportsbycategory
}
