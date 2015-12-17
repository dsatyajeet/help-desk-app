var express = require('express');
var User = require('../models/oauth/user');
var Role = require('../models/oauth/role');
var AccessToken = require('../models/oauth/accesstoken');
var router = express.Router();
var request = require('request');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var authConfig = require('../auth');
var passport = require('passport');

GoogleStrategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get('https://www.googleapis.com/oauth2/v1/userinfo', accessToken, function (err, body, res) {
        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        try {
            var json = JSON.parse(body)
                , i, len;

            var profile = {provider: 'google'};
            profile.id = json.id;
            profile.displayName = json.displayName;
            if (json.name) {
                profile.name = {
                    familyName: json.name.familyName,
                    givenName: json.name.givenName
                };
            }
            if (json.emails) {
                profile.emails = [];
                for (i = 0, len = json.emails.length; i < len; ++i) {
                    profile.emails.push({value: json.emails[i].value, type: json.emails[i].type})
                }
            }
            if (json.image) {
                profile.photos = [{value: json.image.url}];
            }
            profile.gender = json.gender;
            json.accessToken = accessToken;
            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch (e) {
            done(e);
        }
    });
}

passport.use(new FacebookStrategy(authConfig.facebook,
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        return done(null, profile);
    }
));
passport.use(new GoogleStrategy(
    // Use the API access settings stored in ./config/auth.json. You must create
    // an OAuth 2 client ID and secret at: https://console.developers.google.com
    authConfig.google,

    function (accessToken, refreshToken, profile, done) {
        // Typically you would query the database to find the user record
        // associated with this Google profile, then pass that object to the `done`
        // callback.

        var nameArray = profile._json.name.split(" ");
        var firstName = nameArray[0];
        var lastName = nameArray[1];
        var userInfo = {};
        User.findOne({username: profile._json.email}, function (err, user) {
            userInfo = user;
            if (err) {
                userInfo = {};
                console.log("Error")
            }
            if (user == null) {
                var roleArray = ['Customer'];
                Role.find()
                    .where('name')
                    .in(roleArray)
                    .exec(function (err, roles) {
                        if (err) {
                            console.log("Error")
                        }
                        else {
                            user = new User({
                                username: profile._json.email,
                                password: 'password',
                                roles: roles,
                                email: profile._json.email,
                                firstname: firstName,
                                lastname: lastName,
                                mobile: '1234567890'
                            });

                            user.save(function (err, user) {

                                userInfo = user;

                                if (err) {

                                    console.log("error in adding user");
                                    userInfo = {};
                                }

                            });
                        }
                    });
            }

            AccessToken.findOne({userId: userInfo._id}, function (err, existingToken) {
                if (existingToken == null || existingToken == undefined) {
                    console.log("existingToken" + existingToken);
                    var token = accessToken;
                    var userToken = new AccessToken();
                    userToken.value = token;
                    userToken.userId = user.id;

                    userToken.save(function (err) {
                        if (err) {
                            console.log("Error")
                        }
                    });

                } else {
                    AccessToken.findOneAndUpdate({_id: existingToken._id}, {value: accessToken}, function (err, ticket) {
                        if (err)console.log("Error");
                    });
                }
            });
        });
        return done(null, profile);
    }
));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/auth/google',
    passport.authenticate('google', {scope: ['openid email profile']}));


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/signin',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        //console.log(req);
        //console.log(req);

        var dataObj = req.user._json;
        //console.log(req.user._json);

        User.findOne({username: req.user._json.email}, function (err, user) {
            dataObj.roles = user.roles[0].name;
            res.render('dummy', dataObj);
        }).populate('roles');
    });

router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}));

    router.get('/facebook/signin',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function (req, res) {

    });


module.exports = router;
