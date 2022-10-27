var md5 = require('md5');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const User = require('../models/User');
const getToken = (headers) => {
  console.log(headers);
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const formatInDescDate = (arr) => {
  return arr.sort((a, b) => {
    a = new Date(moment(a.periodId.slice(0, 10).split('/').join('-')).format())
    b = new Date(moment(b.periodId.slice(0, 10).split('/').join('-')).format())
    return b - a;
  })
}


const convertToSlug = (Text) => {

  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    ;
}

const formatBrandName = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
const genRandomPassword = (length) => {
  var makepass = "";
  var salt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < length; i++)
    makepass += salt.charAt(Math.floor(Math.random() * salt.length));

  return makepass;
}

const sendCustomMail = (toname, to, html, subject) => {
   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.nodeMailerUser,
      pass: config.nodeMailerPass
    }
  });
  var mailOptions = {
    from: ' "Tester" <testnewemail2021@gmail.com>',
    to: to,
    subject: subject,
    html: html
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return false;
    } else {
      //console.log('Email sent: ' + info.response);
      return true;
    }
  });

}

const getCryptedPassword = (password, salt) => {

  return (salt) ? md5(password + salt) : md5(password);

}

const YouTubeGetID = (url) => {
  var ID = '';
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
  return ID;
}
const generateOTP = (otp_length) => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        req.userId = decode._id;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};


module.exports = {
  isAuth,
  getToken,
  formatInDescDate,
  formatBrandName,
  genRandomPassword,
  getCryptedPassword,
  sendCustomMail,
  convertToSlug,
  YouTubeGetID,
  generateOTP
}

