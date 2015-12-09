var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var utilService = require('../service/utilService');
var oauth2 = require('../oauth/oauth2');
var async = require('async');

var User = require('../models/oauth/user');
var oauth2 = require('../oauth/oauth2');

/* GET users listing. */
/*router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});*/

router.get('/user/:username', function (req, res, next) {
    userService.get(req.param('username'),utilService.generalSyncCallback,utilService.getContext(req, res));
});

router.get('/myProfile', function (req, res, next) {
    var context = utilService.getContext(req, res, null,null);
    var actionArray=[function setUser(syncCallback){
        context.callback=syncCallback;
        userService.getUserByToken(req.header('Authorization').split(' ')[1],utilService.setUserSyncCallback,context);
    },function profile(syncCallback){
        res.json(context.thisUser);
        syncCallback(null);
    }];

async.series(actionArray);


});



/* Add User. */
router.route('/add').post(oauth2.isLoggedIn, function (req, res, next) {
    console.log('in add API..');
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            console.log('context is: '+context);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin', 'Customer'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            console.log('test advance..');
            var roleArray = req.body.roles.split(',');
            var context = utilService.getContext(req, res, syncCallBack);
            userService.add(req.body.username, req.body.password, req.body.email,req.body.firstName,req.body.lastName,req.body.mobile,
                roleArray, utilService.generalSyncCallback,context);
        }
    ];


    async.series(actionArray);
});


/* Add User. */
router.route('/update').post(oauth2.isLoggedIn, function (req, res, next) {
    console.log('in add API..');
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            console.log('context is: '+context);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin', 'Customer'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            console.log('test advance..');
            var roleArray = req.body.roles.split(',');
            var context = utilService.getContext(req, res, syncCallBack);
                userService.update(req.body.userId,req.body.username, req.body.email,req.body.firstName,req.body.lastName,req.body.mobile,
                    roleArray, utilService.generalSyncCallback,context);
        }
    ];


    async.series(actionArray);
});



 /* POST Add User .*/
/*
router.route('/add').post(oauth2.isAuthenticated,function(req, res, next) {
  var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile: req.body.mobile,
    username: req.body.username,
    password: req.body.password

  });

  console.log("user = "+user);

  user.save(function(err,user) {
    if (err)
      res.send(err);
    res.json(user);
  })
});
*/
router.route('/oauth/token')
    .post(oauth2.isAuthenticated,oauth2.token2);



module.exports = router;
