var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var utilService = require('../service/utilService');
var oauth2 = require('../oauth/oauth2');
var async = require('async');
var Role = require('../models/oauth/role');


var User = require('../models/oauth/user');
var oauth2 = require('../oauth/oauth2');

/* GET home page. */

router.get('/profile', function (req, res, next) {
    res.render('profile-page', {title: 'Express'});
});

router.get('/user/:username', function (req, res, next) {
    userService.get(req.param('username'), utilService.generalSyncCallback, utilService.getContext(req, res));
});

router.get('/myProfile', function (req, res, next) {
    var context = utilService.getContext(req, res, null, null);
    var actionArray = [function setUser(syncCallback) {
        context.callback = syncCallback;
        userService.getUserByToken(req.header('Authorization').split(' ')[1], utilService.setUserSyncCallback, context);
    }, function profile(syncCallback) {
        res.json(context.thisUser);
        syncCallback(null);
    }];

    async.series(actionArray);


});


/* Add User. */
router.route('/add').post(oauth2.isAuthenticated, function (req, res, next) {

    var roleArray = req.body.roles.split(',');

    Role.find()
        .where('name')
        .in(roleArray)
        .exec(function (err, roles) {
            if (err) {
                return res.send(err);
            }
            else {
                user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    roles: roles,
                    email: req.body.email,
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    mobile: req.body.mobile
                });

                user.save(function (err, user) {
                    if (err){
                        res.status(err.status || 500);
                        return res.json(err);
                    }
                    return res.json(user);

                });
            }
        });

});


/* Add User. */
router.route('/update').put(oauth2.isLoggedIn, function (req, res, next) {
    console.log('in add API..');
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            console.log('context is: ' + context);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin', 'Customer'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            console.log('test advance..');
            var context = utilService.getContext(req, res, syncCallBack);
            userService.update(req.body._id, req.body.email, req.body.firstname, req.body.lastname, req.body.mobile,
                utilService.generalSyncCallback, context);
        }
    ];


    async.series(actionArray);
});


router.route('/oauth/token')
    .post(oauth2.isAuthenticated, oauth2.token2);


module.exports = router;
