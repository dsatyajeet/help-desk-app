/**
 * Created by ajitmogre on 07/12/15.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('profile-page', { title: 'Express' });
});

module.exports=router;