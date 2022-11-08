const User = require('../../models/User');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');

function getUserInfo(req, res) {
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
function profileUpdate(req, res) {

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
function profileImageUpdate(req, res) {

   var user_id = req.userId;
    User.findById({ _id: user_id }).then(user => {
    if (!user) return res.json( { success: true, message: 'Invalid account.' });
    let updateData = {};

    let newFileName = '';
    if (req.files) {
        let imageFile = req.files.profile;
        let imageName = req.files.profile.name;
        let imageExt = imageName.split('.').pop();
        newFileName = Date.now() + '.' + imageExt;
        let filename = path.join(__dirname, '../../uploads/user/' + newFileName);
        imageFile.mv(filename);
        User.profile_image = newFileName;
    }

    if (newFileName) {
      updateData.profile_image = newFileName || user.profile_image;

            User.findByIdAndUpdate({ _id:user_id }, { $set: updateData },{upsert: true})
            .then(() => {  
                User.findById({_id:user_id}).then(userinfo => {

                    return res.json({ success: true, message: 'Profile image updated successfully', Users: userinfo });

                }).catch((err) => {
                    fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                    return res.json({ success: false, message: err });
                }); 
        }).catch((err) => {
            fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            return res.json({ success: false, message: err });
        });
    }  
 
    
    }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.json({ success: false, message: err });
    });

}
function changeEmail(req, res) {

    return res.json({ success: true, message:"ChangeEmail" });

}
function changePassword(req, res) {

    return res.json({ success: true, message:"ChangePassword" });

}
function socialAccount(req, res) {

    return res.json({ success: true, message:"SocialAccount" });

}
function deleteAccount(req, res) {
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

function addMySportsById(req, res) {

    var user_id = req.user._id;

    let sports = req.body.sport;

   // let mysports 
/* const elementToPush = { a: 1, b: 2 };
const body = { $push: { arrayField: elementToPush } };
model.patch(id, body); */
    //db.collection.updateOne({ _id : <SOME ID>}, {$push : { name : "john" }});
    //User.updateOne({ _id:user_id }, { $push: { "my_sports": { "sportId": sportId, "level": level } } })

    /*  const updateDocument = {
      $push: { "items.$[].toppings": "fresh mozzarella" }
    };
    const result = await pizza.updateOne(query, updateDocument);

 */

    /* let sports = [];

        sport.forEach(function(u) {
        let intr = {
            "sportId": (u.sportId)?u.sportId:'',
            "level": (u.level)?u.level:''
        };
        sports.push(intr);
    });  */
    
    User.findOneAndUpdate({ _id: user_id }, {$push: { "$.my_sports": { sports }  }}, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        return res.json(data);   
    }, { new: true });

    /* User.updateOne({ _id: user_id }, { $push: { my_sports: { sportId: sportId } } }).then(() => {
        User.findById({_id:user_id}).then(userinfo => {

            return res.json({ success: true, message: 'Sport added into my list successfully', Users: userinfo });

        }).catch((err) => {
            fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            return res.json({ success: false, message: err });
        }); 
    }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.json({ success: false, message: err });
    });  */  
}
function addMyLocationById(req, res) {

   
}

function mySports(req, res) {
   var user_id = req.user._id;
     User.findById({ _id: user_id }).then(user => {
        if (!user) return res.json( { success: true, message: 'Invalid account.' });

        User.findById({_id:user_id},{_id:0, my_sports:1}).populate({
                path : 'my_sports',
                select:'my_sports.sport_name',
            }).then(sportslist => {

            return res.json({ success: true, message: 'My Sports', mysports: sportslist.my_sports });

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
    getUserInfo,
    profileUpdate,
    profileImageUpdate,
    changeEmail,
    changePassword,
    socialAccount,
    deleteAccount,
    addMySportsById,
    addMyLocationById,
    mySports

}
