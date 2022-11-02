const User = require('../../models/User');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');


function addSport(req, res) {
    
}
function viewSportById(req, res) {
    var user_id = req.user._id;
     User.findById({ _id: user_id }).then(user => {
        if (!user) return res.json( { success: true, message: 'Invalid account.' });

        User.findById({_id:user_id}).then(userinfo => {

            return res.json({ success: true, message: 'My Profile', Users: userinfo });

        }).catch((err) => {
            fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            return res.json({ success: false, message: err });
        }); 
    }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.json({ success: false, message: err });
    });

}
function updateSport(req, res) {

    var user_id = req.user._id;
    User.findById({ _id: user_id }).then(user => {
    if (!user) return res.json( { success: true, message: 'Invalid account.' });
    let updateData = {};

    updateData.first_name = (req.body.fname!='')? req.body.fname: (user.first_name)?user.first_name:'';
    updateData.last_name = (req.body.lname)? req.body.lname : (user.last_name)?user.last_name:'';
    updateData.gender = (req.body.gender) ? req.body.gender: (user.gender)?user.gender:'';
    updateData.mobile = (req.body.mobile)? req.body.mobile : (user.mobile)?user.mobile:'';
    updateData.bio = (req.body.bio) ? req.body.bio: (user.bio)?user.bio:'';    
    updateData.user_role = (req.body.role) ? req.body.role: (user.user_role)?user.user_role:'user';    
 
    User.findByIdAndUpdate({ _id:user_id }, { $set: updateData },{upsert: true})
            .then(() => {  
                      User.findById({_id:user_id}).then(userinfo => {

                        return res.json({ success: true, message: 'Profile updated successfully', Users: userinfo });

                    }).catch((err) => {
                        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                        return res.json({ success: false, message: err });
                    }); 
            }).catch((err) => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                return res.json({ success: false, message: err });
            });
    }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.json({ success: false, message: err });
    });
}

function deleteSport(req, res) {
    var user_id = req.user._id;
    User.findById({ _id: user_id }).then(user => {
    if (!user) return res.json( { success: true, message: 'Invalid account.' });
    let updateData = {};
    updateData.status = 'D';
    
        User.findByIdAndUpdate({ _id:user_id }, { $set: updateData })
                .then(() => {
                    return res.json({ success: true, message: 'Account deleted temporarily!' });
        }).catch((err) => {
            fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            return res.json({ success: false, message: err });
        });

    }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.json({ success: false, message: err });
    });

}


module.exports = {
    addSport,
    viewSportById,
    updateSport,
    deleteSport
}
