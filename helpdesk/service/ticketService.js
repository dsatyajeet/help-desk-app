var User = require('../models/oauth/user');
var Role = require('../models/oauth/role');
var AccessToken = require('../models/oauth/accesstoken');
var Ticket = require('../models/ticket');


exports.addTicket = function (userName,subject, content, callback, context) {
    Ticket.create({
        userName:userName,
        subject: subject,
        content: content,
        createDate: new Date(),
        updateDate: new Date()
    }, function(err,ticket){
        if (err)
            callback(context, err);

        callback(context, null, ticket);
    });
};