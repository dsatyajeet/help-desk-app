/*jslint node: true */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var Client = require('../models/oauth/client');
var User = require('../models/oauth/user');
var AccessToken = require('../models/oauth/accesstoken');

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log("local strategy")
        return done(null, user);
    }
));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
    function (_id, _secret, done) {
        Client.findOne({id: _id}, function (err, client) {
            console.log('basic strategy: id:'+_id+'    secret:'+_secret+' client'+client);
            if (err)
                return done(err);
            if (!client) {
                return done(null, false);
            }
            if (client.secret != _secret) {
                return done(null, false);
            }
            console.log('client received:' + client);
            return done(null, client);
        });
    }
));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        console.log("ClientPasswordStrategy");
        return done(null, client);
    }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
/*passport.use(new BearerStrategy(
 function (accessToken, done) {
 console.log("BearerStrategy");
 return done(null, client, info);
 }));*/
passport.use(new BearerStrategy(
    function (accessToken, done) {
        console.log('in bearer strategy'+accessToken);
        AccessToken.findOne({value:accessToken}, function (err, token) {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            console.log('in bearer strategy, token'+token.value+'   userId:'+token.userId);
            if (token.userID !== null) {
                User.findOne({_id:token.userId}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    // to keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes
                    var info = {scope: '*'};
                    console.log(" bearer user: "+user)
                    return done(null, user, info);
                });
            } else {
                return done(null,false);
            }
        });
    }
));


// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

passport.serializeUser(function (user, done) {
    console.log("authjs serializeUser")
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log("authjs deserializeUser");
    done(err, user);

});
