var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/otest2');

var Client = require('../models/oauth/client');
var User = require('../models/oauth/user');


function addClient() {
    var client = new Client();

    client.name = 'helpdesk';
    client.id = 'ihelp';
    client.secret = 'isecret';
    client.userId = 'sample';

    // Save the client and check for errors
    client.save(function (err) {
        if (err)
            console.error("error in saving client: " + err);
        console.log('Client added to the locker! ' + client);
    });
};

function getClient(_userid) {
    var client2 = new Client();
    client2.id = 4;
    // Use the Client model to find all clients
    Client.find({userId: _userid}, function (err, client) {
        if (err)
            console.error(err);
        console.log('client received:' + client2.id);
    });
};


function getUser(_username, _password) {
    // Use the Client model to find all clients
    User.findOne({username: _username}, function (err, user) {
        if (err) {
            console.error('error in finding user: ' + err);
            return;
        }

        // No user found with that username
        if (!user) {
            console.error('No user found with that username: ' + _username);
            return;
        }

        // Make sure the password is correct
        user.verifyPassword(_password, function (err, isMatch) {
            if (err) {
                console.error('error in verifying password');
                return;
            }

            // Password did not match
            if (!isMatch) {
                console.error('Password did not match');
                return;
            }

            // Success
            console.log('User found: ' + user);
        });
    });
};

function addUser(_username) {
    var user = new User({
        username: _username,
        password: 'password'
    });
    console.log('b4 user save');
    user.save(function (err) {
        if (err)
            console.error('error in adding user: ' + err);
        console.log('user added:' + user);
    });
    console.log('after user save');
}
//addClient();
//getClient('Satyajeet');
var uname = 'Veer';
console.log('adding user');
addUser(uname);
console.log('interval');
getUser(uname, 'password')
console.log('completed');
