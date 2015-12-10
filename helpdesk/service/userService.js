var User = require('../models/oauth/user');
var Role = require('../models/oauth/role');
var AccessToken = require('../models/oauth/accesstoken');

exports.validatUserByRoles = function (token, roleArray, callback, context) {
    console.log('in validate role:' + context);
    AccessToken.findOne({value: token}, function (err, accessToken) {
        if (err) {
            return callback(context, err);
        }
        if (!(accessToken && accessToken.userId)) {
            return callback(context, new Error('Access token not found.'));
        }
        User.findById(accessToken.userId).populate({
            path: 'roles',
            match: {"name": {"$in": roleArray}}
        }).exec(err, function (err, userRoles) {
            if (!(userRoles && userRoles.roles && userRoles.roles.length > 0)) {
                return callback(context, new Error('Access denied'));
            }
            return callback(context, null, null);
        });

    });
};



exports.getUserByToken = function (token, callback, context) {

    console.log('get user by token:cc ' + token);
    AccessToken.findOne({value: token}, function (err, accessToken) {
        if (err) {
            return callback(context, err);
        }
        if (!(accessToken && accessToken.userId)) {
            return callback(context, new Error('Access token not found.'));
        }
        console.log('token userId: '+accessToken.userId);
        User.findById(accessToken.userId).populate('roles').exec(err, function (err, loadedUser) {
            console.log('token err :'+err+'   user loaded:'+loadedUser);
            if (!loadedUser) {
                return callback(context, new Error('User not found.'));
            }
            console.log('user found and context is: '+context);
            return callback(context, null, loadedUser);
        });

    });
};

exports.add = function (username, password, email,firstname,lastname,mobile ,roleArray, callback, context) {
    console.log('add firstName: '+firstname);
    Role.find()
        .where('name')
        .in(roleArray)
        .exec(function (err, roles) {
            if (err) {
                console.error('error in finding user.');
                return callback(context, err);
            }
            else {
                console.log(' record found ' + roles);
                console.log('total records: ' + roles.length);
                addUser(username, password, email,firstname,lastname,mobile, roles, callback, context);
            }
        });
};

exports.update = function (id, email,firstname,lastname,mobile, callback, context) {

                updateUser(id,email,firstname,lastname,mobile, callback, context);

};

exports.get = function (username, callback, context) {
    User.findOne({username: username}).populate('roles').exec(function (err, found) {
        if (err) {
            return callback(context, err);
        }
        else {
            if (!found) {

                return callback(context, new Error('User not found'));
            }
            return callback(context, null, found);
        }
    });
};

function addUser(username,password,email,firstName,lastName,mobile,  roles, callback, context) {
    var user = null;
    if (!roles) {
        user = new User({
            username: username,
            password: password,
            email:email,
            firstName:firstName,
            lastName:lastName,
            mobile:mobile
        });
    }
    else {
        user = new User({
            username: username,
            password: password,
            roles: roles,
            email:email,
            firstname:firstName,
            lastname:lastName,
            mobile:mobile
        });
    }
    console.log('b4 user save');
    user.save(function (err) {
        if (err) {
            console.error('error in adding user: ' + err);
            callback(context, err);
        }
        else {
            console.log('user added:' + user);
            callback(context, null, user);
        }
    });
}

function updateUser(id,email,firstname,lastname,mobile, callback, context) {
    User.findByIdAndUpdate(id,{email:email,firstname:firstname,lastname:lastname,mobile:mobile}, function (err, userUpdated) {
        console.log('update status: '+err+'    update user: '+userUpdated);
        if (err) return callback(context, err);

        User.findById(id,function(err,found){
            if (err) return callback(context, err);
            return callback(context, null, found);
        })
    });
    console.log('whats this..');
}
