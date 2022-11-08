if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const LOCAL_DB_URL = `mongodb://localhost:27017/sportsdoor`;
 
const secret = 'XX4478HDNDnsndHHGK238ma';
const site_name = 'Sportsdoor';
const base_url = 'http://localhost:3000/';
const site_base_url = 'http://localhost:3002/';
const logo_path = 'assets/images/logo.png';
const nodeMailerUser = 'testnewemail2021@gmail.com';
const nodeMailerPass = 'Tester@123';
 
module.exports = {
    LOCAL_DB_URL: LOCAL_DB_URL,
    secret: secret,
    site_name: site_name,
    base_url: base_url,
    logo_path: logo_path,
    site_base_url:site_base_url,
    nodeMailerUser:nodeMailerUser,
    nodeMailerPass:nodeMailerPass,
    POST_MAX_SIZE: 512, //MB
    UPLOAD_MAX_FILE_SIZE: 512, //MB
    PROJECT_DIR: __dirname,
    UPLOAD_DIR: base_url + '/uploads',
};