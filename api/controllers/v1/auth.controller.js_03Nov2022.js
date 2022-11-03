const Access = require('../../models/Access');
const User = require('../../models/User');
const gcmRegister = require('../../models/GcmRegister');
const config = require('../../config//config');
const EmailTemplates = require('../../models/Email_template');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
var ip = require('ip');
const fs = require('fs');
const path = require('path');
/* ,generateOTP */
const {
    sendCustomMail,
    getToken,
    genRandomPassword,
    getCryptedPassword
 } = require('../../utils/api.helpers');

 const { generateToken } = require('../../services/utils');


function createUserAccount(req, res) {

    const { body } = req;
    const { name, email, mobile, password, user_type, gcmkey } = body.userData;

    if(name && email && mobile && password && user_type && gcmkey){

        User.find({ email: email, status: 'Y' }).then(existsEmail => {
        if (existsEmail.length > 0) return res.status(400).send({ success: false, message: 'Email address already exists.' });
        User.find({ mobile: mobile, status: 'Y' }).then(existsMobile => {
        if (existsMobile.length > 0) return res.status(400).send({ success: false, message: 'Mobile Number already exists.' });

        let query = {};
        User.countDocuments(query)
            .then(() => {
                const newUser = new User();
                newUser.email = email;
                newUser.first_name = name;
                newUser.mobile = mobile;
                newUser.user_role = 'user';
                newUser.address.location = '';
                newUser.address.location = '';
                var passwordSalt = genRandomPassword(32);
                var userPassword = getCryptedPassword(password, passwordSalt);
                newUser.password = userPassword + ':' + passwordSalt;

                let otp='1111';
                let emailotp='1111';

                newUser.otp=otp;
			    newUser.email_verify_code=emailotp;

                
                newUser.save((err) => {
                    if (err) {
                        return res.status(400).send({ success: true, message: 'Server error!' });
                    }
                  //  const token = jwt.sign(newUser.toJSON(), config.secret);

                    const token = generateToken(newUser);

                    let users = {};

                    const Access_Tab = new Access();

                    var username = newUser.first_name;
                    if(newUser.last_name){
                        username = newUser.first_name+ ' ' + newUser.last_name;
                    }

                    EmailTemplates.findOne({ template_name: 'otp_verification' })
                    .then(emailRow => {
                        var subject = emailRow.template_subject;
                        var htmlStr = emailRow.template_content;
                        var resultHtml = htmlStr.replace(/{USER_NAME}/g, username);
                        resultHtml = resultHtml.replace(/{logo_path}/g, config.logo_path);
                        resultHtml = resultHtml.replace(/{OTP}/g, emailotp);
                        var toEmail = newUser.email;
                        
                        sendCustomMail(username, toEmail, resultHtml, subject);
                        
                    })

                    if(token){
                        Access_Tab.access_key = token;
                        Access_Tab.user_id = newUser._id;
                        Access_Tab.access_status = 'Y';
                        Access_Tab.access_ip = ip.address();
                    }

                    Access_Tab.save();
                    
                    let gcmRegister_tab = new gcmRegister();

                    if(gcmRegister_tab){
                        gcmRegister_tab.user_id = newUser._id;
                        gcmRegister_tab.user_type = user_type;
                        gcmRegister_tab.gcm_id = gcmkey;
                        gcmRegister_tab.gcm_status = 'Y';
                    }
                    gcmRegister_tab.save();

                    let rootdir = config.UPLOAD_DIR;
                    let fpath = rootdir + '/' + newUser.profile_image;
                    let filepath = fpath.replaceAll('\\', '/');

                    if(newUser){
                        users = {
                            userId: newUser._id,
                            firstName: newUser.first_name ? newUser.first_name : '',
                            lastName: newUser.last_name ? newUser.last_name : '',
                            email: newUser.email ? newUser.email : '',
                            mobile: newUser.mobile  ? newUser.mobile : '',
                            image: newUser.profile_image  ? filepath : '',
                            role: newUser.user_role  ? newUser.user_role : 'user',
                            gender: newUser.gender ? newUser.gender : '',
                            bio: newUser.bio  ? newUser.bio : '',
                            address: {
                                address1: newUser.address1  ?newUser.address.address1 : '',
                                city: newUser.address.city  ? newUser.address.city : '',
                                state: newUser.address.state  ? newUser.address.state : '',
                                country: newUser.address.country  ? newUser.address.country : 'India',
                                zip: newUser.address.zip  ? newUser.address.zip : '',
                                location: {                                    
                                    latitude: newUser.address.location.latitude  ? newUser.address.location.latitude : '',
                                    longitude: newUser.address.location.longitude  ? newUser.address.location.longitude : '',
                                }
                            },
                            loginBy: newUser.user_oauth_provider  ? newUser.user_oauth_provider : 'EMAIL',
                            oauthId: newUser.user_oauth_id  ? newUser.user_oauth_id : '',
                            mobile_verify: newUser.otp_verify  ? newUser.otp_verify : false,
                            email_verify: newUser.email_verify  ? newUser.email_verify : false,
                            status: newUser.status  ? newUser.status : 'Y',
                        };

                    } 
                    return res.json({ users: users, success: true, token: token });

                });
            }).catch((err) => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            });

     }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.status(400).send({ success: false, message: 'Server error 22' });
        
    });

    }).catch((err) => {
         fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.status(400).send({ success: false, message: 'Server error 22' });
    });

    }else {        
        return res.json({ success: false, message:"FIELD MISSING" });
    }
    
}
function createUserAccountByOTP(req, res) {

    const { body } = req;
    const { name, mobile, user_type, gcmkey } = body.userData;

    if(name && mobile && user_type && gcmkey){

    User.find({ mobile: mobile, status: 'Y' }).then(existsMobile => {
        if (existsMobile.length > 0) return res.status(400).send({ success: false, message: 'Mobile Number already exists.' });

        let query = {};
        User.countDocuments(query)
            .then(() => {
                const newUser = new User();                
                newUser.mobile = mobile;
                newUser.first_name = name;
                newUser.user_role = 'user';                
                newUser.address.location = '';
                newUser.address.location = '';
                newUser.otp='1111';
                
                newUser.save((err) => {
                    if (err) {
                        return res.status(400).send({ success: true, message: 'Server error!' });
                    }
                   // const token = jwt.sign(newUser.toJSON(), config.secret);
                   const token = generateToken(newUser);

                    let users = {};

                    var username = newUser.first_name;
                    if(newUser.last_name){
                        username = newUser.first_name+ ' ' + newUser.last_name;
                    }

                    EmailTemplates.findOne({ template_name: 'otp_verification' })
                    .then(emailRow => {
                        var subject = emailRow.template_subject;
                        var htmlStr = emailRow.template_content;
                        var resultHtml = htmlStr.replace(/{USER_NAME}/g, username);
                        resultHtml = resultHtml.replace(/{logo_path}/g, config.logo_path);
                        resultHtml = resultHtml.replace(/{OTP}/g, otp);
                        var toEmail = newUser.email;
                        
                        sendCustomMail(username, toEmail, resultHtml, subject);
                        
                    }).catch((err) => {
                        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                    });

                    const Access_Tab = new Access();

                    if(token){
                        Access_Tab.access_key = token;
                        Access_Tab.user_id = newUser._id;
                        Access_Tab.access_status = 'Y';
                        Access_Tab.access_ip = ip.address();
                    }

                    Access_Tab.save();

                    let gcmRegister_tab = new gcmRegister();

                    if(gcmRegister_tab){
                        gcmRegister_tab.user_id = newUser._id;
                        gcmRegister_tab.user_type = user_type;
                        gcmRegister_tab.gcm_id = gcmkey;
                        gcmRegister_tab.gcm_status = 'Y';
                    }
                    gcmRegister_tab.save();
                    

                    let rootdir = config.UPLOAD_DIR;
                    let fpath = rootdir + '/' + newUser.profile_image;
                    let filepath = fpath.replaceAll('\\', '/');

                    if(newUser){
                        users = {
                            userId: newUser._id,
                            firstName: newUser.first_name ? newUser.first_name : '',
                            lastName: newUser.last_name ? newUser.last_name : '',
                            email: newUser.email ? newUser.email : '',
                            mobile: newUser.mobile  ? newUser.mobile : '',
                            image: newUser.profile_image  ? filepath : '',
                            role: newUser.user_role  ? newUser.user_role : 'user',
                            gender: newUser.gender ? newUser.gender : '',
                            bio: newUser.bio  ? newUser.bio : '',
                            address: {
                                address1: newUser.address1  ?newUser.address.address1 : '',
                                city: newUser.address.city  ? newUser.address.city : '',
                                state: newUser.address.state  ? newUser.address.state : '',
                                country: newUser.address.country  ? newUser.address.country : 'India',
                                zip: newUser.address.zip  ? newUser.address.zip : '',
                                location: {                                    
                                    latitude: newUser.address.location.latitude  ? newUser.address.location.latitude : '',
                                    longitude: newUser.address.location.longitude  ? newUser.address.location.longitude : '',
                                }
                            },
                            loginBy: newUser.user_oauth_provider  ? newUser.user_oauth_provider : 'MOBILE',
                            oauthId: newUser.user_oauth_id  ? newUser.user_oauth_id : '',
                            mobile_verify: newUser.otp_verify  ? newUser.otp_verify : false,
                            email_verify: newUser.email_verify  ? newUser.email_verify : false,
                            status: newUser.status  ? newUser.status : 'Y',
                        };

                    } 
                    return res.json({ users: users, success: true, token: token });

                });
            }).catch((err) => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            });

     }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.status(400).send({ success: false, message: 'Server error 22' });
    });

     }else {
        return res.json({ success: false, message:"FIELD MISSING" });
    }
}

function createUserAccountSocialmedia(req, res) {

    const { body } = req;

    const { unique_id, loginby, user_type, gcmkey } = body;

    if(unique_id && loginby && user_type && gcmkey){
        

        User.find({ user_oauth_id: unique_id, user_oauth_provider: loginby, status: 'Y' }).then(user => {
            if (user.length > 0) {
                        //const token = jwt.sign(user.toJSON(), config.secret);

                        const token = generateToken(user);

                        let users = {};

                        const Access_Tab = new Access();

                        if(token){
                            Access_Tab.access_key = token;
                            Access_Tab.user_id = user._id;
                            Access_Tab.access_status = 'Y';
                            Access_Tab.access_ip = ip.address();
                        }

                        Access_Tab.save();

                        let rootdir = config.UPLOAD_DIR;
                        let fpath = rootdir + '/' + user.profile_image;
                        let filepath = fpath.replaceAll('\\', '/');

                        if(user){
                            users = {
                                userId: user._id,
                                firstName: user.first_name ? user.first_name : '',
                                lastName: user.last_name ? user.last_name : '',
                                email: user.email ? user.email : '',
                                mobile: user.mobile  ? user.mobile : '',
                                image: user.profile_image  ? filepath : '',
                                role: user.user_role  ? user.user_role : 'user',
                                gender: user.gender ? user.gender : '',
                                bio: user.bio  ? user.bio : '',
                                address: {
                                    address1: user.address.address1  ? user.address.address1 : '',
                                    city: user.address.city  ? user.address.city : '',
                                    state: user.address.state  ? user.address.state : '',
                                    country: user.address.country  ? user.address.country : 'India',
                                    zip: user.address.zip  ? user.address.zip : '',
                                    location: {                                    
                                        latitude: user.address.location.latitude  ? user.address.location.latitude : '',
                                        longitude: user.address.location.longitude  ? user.address.location.longitude : '',
                                    }
                                },
                                loginBy: user.user_oauth_provider  ? user.user_oauth_provider : 'SOCIALMEDIA',
                                oauthId: user.user_oauth_id  ? user.user_oauth_id : '',            
                                mobile_verify: user.otp_verify  ? user.otp_verify : false,
                                email_verify: user.email_verify  ? user.email_verify : false,
                                status: user.status  ? user.status : 'Y',
                            };

                        }
                        return res.json({ users: users, success: true, token: token });

        }else{
            let query = {};
            User.countDocuments(query)
            .then(() => {
                const newUser = new User();                
                newUser.user_oauth_id = unique_id;
                newUser.user_oauth_provider = loginby;
                
                newUser.save((err) => {
                    if (err) {
                        return res.status(400).send({ success: true, message: 'Server error!' });
                    }
                    //const token = jwt.sign(newUser.toJSON(), config.secret);

                    const token = generateToken(newUser);

                    let users = {};

                    const Access_Tab = new Access();

                    if(token){
                        Access_Tab.access_key = token;
                        Access_Tab.user_id = newUser._id;
                        Access_Tab.access_status = 'Y';
                        Access_Tab.access_ip = ip.address();
                    }

                    Access_Tab.save();

                    let gcmRegister_tab = new gcmRegister();

                    if(gcmRegister_tab){
                        gcmRegister_tab.user_id = newUser._id;
                        gcmRegister_tab.user_type = user_type;
                        gcmRegister_tab.gcm_id = gcmkey;
                        gcmRegister_tab.gcm_status = 'Y';
                    }
                    gcmRegister_tab.save();
                    

                    let rootdir = config.UPLOAD_DIR;
                    let fpath = rootdir + '/' + newUser.profile_image;
                    let filepath = fpath.replaceAll('\\', '/');

                    if(newUser){
                        users = {
                            userId: newUser._id,
                            firstName: newUser.first_name ? newUser.first_name : '',
                            lastName: newUser.last_name ? newUser.last_name : '',
                            email: newUser.email ? newUser.email : '',
                            mobile: newUser.mobile  ? newUser.mobile : '',
                            image: newUser.profile_image  ? filepath : '',
                            role: newUser.user_role  ? newUser.user_role : 'user',
                            gender: newUser.gender ? newUser.gender : '',
                            bio: newUser.bio  ? newUser.bio : '',
                            address: {
                                address1: newUser.address1  ?newUser.address.address1 : '',
                                city: newUser.address.city  ? newUser.address.city : '',
                                state: newUser.address.state  ? newUser.address.state : '',
                                country: newUser.address.country  ? newUser.address.country : 'India',
                                zip: newUser.address.zip  ? newUser.address.zip : '',
                                location: {                                    
                                    latitude: newUser.address.location.latitude  ? newUser.address.location.latitude : '',
                                    longitude: newUser.address.location.longitude  ? newUser.address.location.longitude : '',
                                }
                            },
                            loginBy: newUser.user_oauth_provider  ? newUser.user_oauth_provider : 'EMAIL',
                            oauthId: newUser.user_oauth_id  ? newUser.user_oauth_id : '',
                            mobile_verify: newUser.otp_verify  ? newUser.otp_verify : false,
                            email_verify: newUser.email_verify  ? newUser.email_verify : false,
                            status: newUser.status  ? newUser.status : 'Y',
                        };

                    } 
                    return res.json({ users: users, success: true, token: token });

                });
            }).catch((err) => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            });
        }
        

     }).catch((err) => {
        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        return res.status(400).send({ success: false, message: 'Account already registered' });
    });
    }else {
        return res.json({ success: false, message:"FIELD MISSING" });
    }
}

function checkAuthentication(req, res, next) {
    console.log(req);
    const token = getToken(req.headers);
    
    if (token) {
        return User.findOne({ _id: req.user._id }, { status: 'Y' })
            .then(accounts => {
                if (accounts.length === 0) throw { success: false, status: 404, message: 'Unauthorised' };
                return res.status(200).send(accounts);
            })
            .catch(err => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                if (err.status === 404) res.status(404).send({ success: false, message: err.msg });
                else return next({ success: false, status: 500, message: 'server error' });
            });
    } else {
        return res.status(403).send({ success: false, message: 'Unauthorised' });
    }
}

function userLogin(req, res, next) {
    const { body } = req;
    const {
        email,
        mobile,
        password,
        user_type,
        gcmkey,
        loginby,
        unique_id
    } = body;

    if(loginby=='EMAIL'){

        if(email && password && user_type && gcmkey){
        User.findOne({
            email: email,
            status: 'Y',
            
        }, function (err, user) {
        if (err) return next(err);
        else if (!user) {
            return res.status(401).send({ success: false, message: 'Invalid email address' });
        } else { 
            var userpassword = (user.password).split(':');
            var getPassword = getCryptedPassword(password, userpassword[1]);
            var uPassword = getPassword + ':' + userpassword[1];
            if (md5(uPassword) !== md5(user.password)) {
                return res.status(401).send({ success: false, message: ' Invalid password' });
            }
            if(user.status !== 'Y'){
                return res.status(401).send({ success: false, message: ' Your account has been disabled or removed. Please contact admin' });
            }
            //const token = jwt.sign(user.toJSON(), config.secret);

            const token = generateToken(user);

            let users = {};

             const Access_Tab = new Access();

            if(token){
                Access_Tab.access_key = token;
                Access_Tab.user_id = user._id;
                Access_Tab.access_status = 'Y';
                Access_Tab.access_ip = ip.address();
            }

            Access_Tab.save();
            let updateData = {};
            updateData.gcm_status = 'D';

            gcmRegister.findOneAndUpdate({ gcm_id: gcmkey, gcm_status: 'Y', user_id:user._id }, { $set: updateData })            
            .then(() => {
                console.log('GCM Removed temporarily!');
            });

            let gcmRegister_tab = new gcmRegister();

            if(gcmRegister_tab){
                gcmRegister_tab.user_id = user._id;
                gcmRegister_tab.user_type = user_type;
                gcmRegister_tab.gcm_id = gcmkey;
                gcmRegister_tab.gcm_status = 'Y';
            }
            gcmRegister_tab.save();

            let rootdir = config.UPLOAD_DIR;
            let fpath = rootdir + '/' + user.profile_image;
            let filepath = fpath.replaceAll('\\', '/');

            if(user){
                users = {
                    userId: user._id,
                    firstName: user.first_name ? user.first_name : '',
                    lastName: user.last_name ? user.last_name : '',
                    email: user.email ? user.email : '',
                    mobile: user.mobile  ? user.mobile : '',
                    image: user.profile_image  ? filepath : '',
                    role: user.user_role  ? user.user_role : 'user',
                    gender: user.gender ? user.gender : '',
                    bio: user.bio  ? user.bio : '',
                    address: {
                      address1: user.address.address1  ? user.address.address1 : '',
                      city: user.address.city  ? user.address.city : '',
                      state: user.address.state  ? user.address.state : '',
                      country: user.address.country  ? user.address.country : 'India',
                      zip: user.address.zip  ? user.address.zip : '',
                      location: {                                    
                            latitude: user.address.location  ? (user.address.location.latitude)?user.address.location.latitude:'' : '',
                            longitude: user.address.location  ? (user.address.location.longitude)?user.address.location.longitude:'' : '',
                        }
                    },
                    loginBy: user.user_oauth_provider  ? user.user_oauth_provider : 'EMAIL',
                    oauthId: user.user_oauth_id  ? user.user_oauth_id : '',            
                    mobile_verify: user.otp_verify  ? user.otp_verify : false,
                    email_verify: user.email_verify  ? user.email_verify : false,
                    status: user.status  ? user.status : 'Y',
                  };

            }
            return res.json({ users: users, success: true, token: token });
        }
    });
        }else {
            return res.json({ success: false, message:"FIELD MISSING" });
        }
        
    }
    else if(loginby=='MOBILE'){
        if(mobile && user_type && gcmkey){
            User.findOne({
                mobile: mobile,
                status: 'Y',
                
            }, function (err, user) {
                if (err) return next(err);
                else if (!user) {
                    return res.status(401).send({ success: false, message: 'Mobile number is not found' });
                } else { 
                    
                   // const token = jwt.sign(user.toJSON(), config.secret);

                   const token = generateToken(user);

                    let users = {};

                    const Access_Tab = new Access();

                    if(token){
                        Access_Tab.access_key = token;
                        Access_Tab.user_id = user._id;
                        Access_Tab.access_status = 'Y';
                        Access_Tab.access_ip = ip.address();
                    }

                    Access_Tab.save();
                    let updateData = {};
                    updateData.gcm_status = 'D';

                    gcmRegister.findOneAndUpdate({ gcm_id: gcmkey, gcm_status: 'Y', user_id:user._id }, { $set: updateData })            
                    .then(() => {
                        console.log('GCM Removed temporarily!');
                    });

                    let gcmRegister_tab = new gcmRegister();

                    if(gcmRegister_tab){
                        gcmRegister_tab.user_id = user._id;
                        gcmRegister_tab.user_type = user_type;
                        gcmRegister_tab.gcm_id = gcmkey;
                        gcmRegister_tab.gcm_status = 'Y';
                    }
                    gcmRegister_tab.save();

                    let rootdir = config.UPLOAD_DIR;
                    let fpath = rootdir + '/' + user.profile_image;
                    let filepath = fpath.replaceAll('\\', '/');

                    if(user){
                        users = {
                            userId: user._id,
                            firstName: user.first_name ? user.first_name : '',
                            lastName: user.last_name ? user.last_name : '',
                            email: user.email ? user.email : '',
                            mobile: user.mobile  ? user.mobile : '',
                            image: user.profile_image  ? filepath : '',
                            role: user.user_role  ? user.user_role : 'user',
                            gender: user.gender ? user.gender : '',
                            bio: user.bio  ? user.bio : '',
                            address: {
                                address1: user.address.address1  ? user.address.address1 : '',
                                city: user.address.city  ? user.address.city : '',
                                state: user.address.state  ? user.address.state : '',
                                country: user.address.country  ? user.address.country : 'India',
                                zip: user.address.zip  ? user.address.zip : '',
                                location: {                                    
                                    latitude: user.address.location  ? (user.address.location.latitude)?user.address.location.latitude:'' : '',
                                    longitude: user.address.location  ? (user.address.location.longitude)?user.address.location.longitude:'' : '',
                                }
                            },
                            loginBy: user.user_oauth_provider  ? user.user_oauth_provider : 'MOBILE',
                            oauthId: user.user_oauth_id  ? user.user_oauth_id : '',            
                            mobile_verify: user.otp_verify  ? user.otp_verify : false,
                            email_verify: user.email_verify  ? user.email_verify : false,
                            status: user.status  ? user.status : 'Y',
                        };

                    }
                    return res.json({ users: users, success: true, token: token });
                }
            });

        }else {
                return res.json({ success: false, message:"FIELD MISSING" });
            }
            
    }else{
        if(unique_id && loginby && user_type && gcmkey){
            User.findOne({
                user_oauth_id: unique_id,
                user_oauth_provider: loginby,
                status: 'Y',
                
            }, function (err, user) {
                if (err) return next(err);
                else if (!user) {
                    return res.status(401).send({ success: false, message: 'Account not registered yet' });
                } else { 
                    
                    //const token = jwt.sign(user.toJSON(), config.secret);

                    const token = generateToken(user);

                    let users = {};

                    const Access_Tab = new Access();

                    if(token){
                        Access_Tab.access_key = token;
                        Access_Tab.user_id = user._id;
                        Access_Tab.access_status = 'Y';
                        Access_Tab.access_ip = ip.address();
                    }

                    Access_Tab.save();

                    gcmRegister.updateOne({ gcm_id: gcmkey, gcm_status: 'Y',user_id: user._id },{ $set : { gcm_status : 'D'} });

                    let gcmRegister_tab = new gcmRegister();

                    if(gcmRegister_tab){
                        gcmRegister_tab.user_id = user._id;
                        gcmRegister_tab.user_type = user_type;
                        gcmRegister_tab.gcm_id = gcmkey;
                        gcmRegister_tab.gcm_status = 'Y';
                    }
                    gcmRegister_tab.save();

                    let rootdir = config.UPLOAD_DIR;
                    let fpath = rootdir + '/' + user.profile_image;
                    let filepath = fpath.replaceAll('\\', '/');

                    if(user){
                        users = {
                            userId: user._id,
                            firstName: user.first_name ? user.first_name : '',
                            lastName: user.last_name ? user.last_name : '',
                            email: user.email ? user.email : '',
                            mobile: user.mobile  ? user.mobile : '',
                            image: user.profile_image  ? filepath : '',
                            role: user.user_role  ? user.user_role : 'user',
                            gender: user.gender ? user.gender : '',
                            bio: user.bio  ? user.bio : '',
                            address: {
                            address1: user.address.address1  ? user.address.address1 : '',
                            city: user.address.city  ? user.address.city : '',
                            state: user.address.state  ? user.address.state : '',
                            country: user.address.country  ? user.address.country : 'India',
                            zip: user.address.zip  ? user.address.zip : '',
                            location: {                                    
                                latitude: user.address.location  ? (user.address.location.latitude)?user.address.location.latitude:'' : '',
                                longitude: user.address.location  ? (user.address.location.longitude)?user.address.location.longitude:'' : '',
                            }
                            },
                            loginBy: user.user_oauth_provider  ? user.user_oauth_provider : 'SOCIALMEDIA',
                            oauthId: user.user_oauth_id  ? user.user_oauth_id : '',            
                            mobile_verify: user.otp_verify  ? user.otp_verify : false,
                            email_verify: user.email_verify  ? user.email_verify : false,
                            status: user.status  ? user.status : 'Y',
                        };

                    }
                    return res.json({ users: users, success: true, token: token });
                }
            });

        }else {
                return res.json({ success: false, message:"FIELD MISSING" });
            }
    }

    



}
function forgotPass(req, res, next) {
    if (!req.body.email) {
        return res.status(401).send({ success: false, message: 'Please enter your email' });
    }

    User.findOne({ email: req.body.email, status: 'Y'})
            .then(user => {
                if (!user) return res.status(201).send({ success: false, message: 'Account not found.' });
                return Promise.all([user, md5(genRandomPassword(32))])
                    .then(([user, buffer]) => {
                        const token = buffer.toString('hex');
                        return Promise.all([user, token])
                    })
                    .then(([user, token]) => {
                        return Promise.all([token, User.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true })])
                    })
                    .then(([token,user]) => {
                        EmailTemplates.findOne({ template_name: 'admin_forgot_password_email' })
                            .then(emailRow => {
                                var subject = emailRow.template_subject;
                                var htmlStr = emailRow.template_content;
                                var resultHtml = htmlStr.replace(/{USER_NAME}/g, user.username);
                                resultHtml = resultHtml.replace(/{logo_path}/g, config.logo_path);
                                resultHtml = resultHtml.replace(/{SITE_NAME}/g, config.site_name);
                                resultHtml = resultHtml.replace(/{VERIFY_URL}/g, config.site_base_url + 'change-password/' + user.resetPasswordToken);
                                var toEmail = user.email;
                                var username = user.first_name;

                                if(user.last_name){
                                    username = user.first_name+ ' ' + user.last_name;
                                }
                                sendCustomMail(username, toEmail, resultHtml, subject);
                                return res.status(201).send({ success: true, message: 'Kindly check your email for further instructions' });
                            }).catch(err => {
                              fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                                return res.json({ success: true, message: err })
                            })

                    }).catch((err) => {
                        fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                        return res.json({ success: false, message: 'server error sd' })
                    })
            }).catch(err => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                if (err.status === 404) res.status(400).send({ success: false, message: err.msg });
                else return next({ status: 500, message: 'server erro dsds r' });
            })
}

function resetPass(req, res, next) {
          
        var passwordSalt = genRandomPassword(32);

        User.findOne({
            resetPasswordToken: req.body.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }).then(user => {
            if (!user) return res.status(400).send({ success: false, message: 'Password reset token is invalid or has expired!' });
            var uPassword = getCryptedPassword(req.body.password, passwordSalt);
            var newPassword = uPassword + ':' + passwordSalt;
            User.findByIdAndUpdate({ _id: user._id }, { $set: { password: newPassword, resetPasswordExpires: undefined, resetPasswordToken: undefined } })
                .then(() => {
                    return res.status(201).send({ success: true, message: 'Your password was reset successfully. Please login!' });
                })
                .catch((err) => {
                    console.log(err);
                    return  res.status(401).send({ success: false, message: ' server error 11' });
                })

        })
            .catch(err => {
                console.log(err);
                if (err.status === 400) res.status(400).send({ success: false, message: err.msg });
                else return next({ status: 500, message: 'server error 333' });
            })
}
function verifyOTP(req, res) {

    const { mobile, otp } = req.body;

    if(mobile && otp){
        User.findOne({ mobile: mobile, status: 'Y' }).then(user => {
            
           if(user.otp != otp){
                return res.status(400).send({ success: false, message: 'Invalid OTP' });
           }else{
                user.otp ='';
                user.otp_verify = true;
                user.save();
                return res.status(400).send({ success: true, message: 'OTP Verified Successfuly' });
           }

        });
    }else {
        return res.json({ success: false, message:"FIELD MISSING" });
    }
}
function verifyEmail(req, res) {

    const { email, otp } = req.body;

    if(email && otp){
        User.findOne({ email: email, status: 'Y' }).then(user => {
            
           if(user.email_verify_code != otp){
                return res.status(400).send({ success: false, message: 'Invalid OTP' });
           }else{
                user.email_verify_code ='';
                user.email_verify = true;
                user.save();
                return res.status(400).send({ success: true, message: 'Email Address Verified Successfuly' });
           }

        });
    }else {
        return res.json({ success: false, message:"FIELD MISSING" });
    }
}
function resendOTP(req, res) {

    const { email, mobile } = req.body;

    if(email){
        User.findOne({ email: email, status: 'Y' }).then(user => {

            let otp ='1111';
           // let otp = generateOTP(4);

            user.email_verify_code = otp;
            user.email_verify = false;
            user.save();

            var username = user.first_name;
            if(user.last_name){
                username = user.first_name+ ' ' + user.last_name;
            }

            EmailTemplates.findOne({ template_name: 'otp_verification' })
            .then(emailRow => {
                var subject = emailRow.template_subject;
                var htmlStr = emailRow.template_content;
                var resultHtml = htmlStr.replace(/{USER_NAME}/g, username);
                resultHtml = resultHtml.replace(/{logo_path}/g, config.logo_path);
                resultHtml = resultHtml.replace(/{OTP}/g, otp);
                var toEmail = user.email;
                
                sendCustomMail(username, toEmail, resultHtml, subject);
                return res.status(201).send({ success: true, message: 'Kindly check your email for further instructions' });
            }).catch(err => {
                console.log(err);
                return res.json({ success: true, message: err })
            })
        });
    }
    else if(mobile){
        User.findOne({ mobile: mobile, status: 'Y' }).then(user => {

            let otp ='1111';

            //let otp = generateOTP(4);

            user.otp = otp;
            user.otp_verify = false;
            user.save();

            var username = user.first_name;
            if(user.last_name){
                username = user.first_name+ ' ' + user.last_name;
            }

            EmailTemplates.findOne({ template_name: 'otp_verification' })
            .then(emailRow => {
                var subject = emailRow.template_subject;
                var htmlStr = emailRow.template_content;
                var resultHtml = htmlStr.replace(/{USER_NAME}/g, username);
                resultHtml = resultHtml.replace(/{logo_path}/g, config.logo_path);
                resultHtml = resultHtml.replace(/{OTP}/g, otp);
                var toEmail = user.email;
                
                sendCustomMail(username, toEmail, resultHtml, subject);
                return res.status(201).send({ success: true, message: 'Kindly check your email for further instructions' });
            }).catch((err) => {
                fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                return res.json({ success: true, message: err })
            });
        }).catch((err) => {
            fs.appendFileSync(path.join(__dirname, '../../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
        });
    }
    else {
        return res.json({ success: false, message:"FIELD MISSING" });
    }
}
function signOut(req, res) {

    const authHeader = req.headers["authorization"];
    /* jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
    if (logout) {
         return res.json({ success: true, message:"You have been Logged Out" });
    } else {
        res.send({ success: true, message:"Something Went wrong"});
    }
    });   */

    jwt.verify(token, config.secret, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = "";
        req.userId = "";
        next();
      }
    });

}


module.exports = {
    createUserAccount,
    createUserAccountByOTP,
    createUserAccountSocialmedia,
    checkAuthentication,
    userLogin,
    forgotPass,
    resetPass,
    verifyOTP,
    verifyEmail,
    resendOTP,
    signOut
};