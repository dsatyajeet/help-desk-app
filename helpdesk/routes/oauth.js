var express = require('express');
var router = express.Router();
var oauth2 = require('../oauth/oauth2');

router.route('/oauth2/token')
    .post(oauth2.isAuthenticated, oauth2.token2);

router.route('/userinfo')
    .get(oauth2.isLoggedIn, oauth2.info);

module.exports = router;


