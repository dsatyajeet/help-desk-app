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


exports.getAllTickets = function (userName,callback, context) {
       Ticket.find({"userName":userName}, function(err, tickets) {
        if (err) callback(context, err);
        callback(context, null, tickets);
    }).sort({"createDate":-1});
};


exports.getAdminTickets = function (callback, context) {
    Ticket.find({}, function(err, tickets) {
        if (err) callback(context, err);
        callback(context, null, tickets);
    }).sort({"createDate":-1});
};

exports.updateStatus = function (ticketId,callback, context) {
    Ticket.findOneAndUpdate({_id: ticketId}, { status:"COMPLETED",updateDate:new Date() }, function(err, ticket) {
        if (err) callback(context, err);
        callback(context, null, ticket);
    });
};



