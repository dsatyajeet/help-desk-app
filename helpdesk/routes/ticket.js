/**
 * Created by keyurvekariya on 11/27/15.
 */

var Ticket = require('../models/ticket');
var express = require('express');
var router = express.Router();
var oauth2 = require('../oauth/oauth2');
var userService = require('../service/userService');
var utilService = require('../service/utilService');
var ticketService = require('../service/ticketService');
var async = require('async');


/* POST Ticket Add listing. */
router.route('/add').post(oauth2.isLoggedIn, function(req, res, next) {
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Customer'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            ticketService.addTicket(req.body.username,req.body.subject, req.body.content, utilService.generalSyncCallback,context);
        }
    ];
    async.series(actionArray);
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('ticket', { title: 'Express' });
});

/* GET home page. */
router.get('/myTickets', function(req, res, next) {
    res.render('tickets', { title: 'Express' });
});

/* GET home page. */
router.get('/adminTickets', function(req, res, next) {
    res.render('admin', { title: 'Express' });
});

/* GET Ticket  listing. */
router.route('/get/:ticketId').get(oauth2.isLoggedIn, function(req, res, next) {

    Ticket.find({ "_id": req.params.ticketId }, function(err, ticket) {
        if (err) res.send(err);
        res.json(ticket);
    });
});


/* GETAll Ticket  listing. */
router.route('/getAll/:userName').get(oauth2.isLoggedIn, function(req, res, next) {
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin','Customer'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            ticketService.getAllTickets(req.params.userName, utilService.generalSyncCallback,context);
        }
    ];
    async.series(actionArray);

});

/* GETAll Ticket  listing. */
router.route('/getAdminTickets').get(oauth2.isLoggedIn, function(req, res, next) {
    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            ticketService.getAdminTickets(utilService.generalSyncCallback,context);
        }
    ];
    async.series(actionArray);

});

/* PUT Ticket Update listing. */
router.route('/update').put(oauth2.isLoggedIn, function(req, res, next) {

    Ticket.findOneAndUpdate({_id: req.body.ticketId}, { subject: req.body.subject,content: req.body.content,updateDate:new Date() }, function(err, ticket) {
        if (err) res.send(err);
        // we have the updated user returned to us
        Ticket.find({ "_id": req.body.ticketId }, function(err, ticket) {
            if (err) res.send(err);
            res.json(ticket);
        });
    });


});


/* PUT Ticket Update listing. */
router.route('/updateStatus/:ticketId').put(oauth2.isLoggedIn, function(req, res, next) {

    var actionArray = [
        function validation(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            userService.validatUserByRoles(req.header('Authorization').split(' ')[1], ['Admin'],
                utilService.generalSyncCallback, context);
        },
        function executeAPI(syncCallBack) {
            var context = utilService.getContext(req, res, syncCallBack);
            ticketService.updateStatus(req.params.ticketId, utilService.generalSyncCallback,context);
        }
    ];
    async.series(actionArray);


});


/* delete Ticket  listing. */
router.route('/delete/:ticketId').delete(oauth2.isLoggedIn, function(req, res, next) {

    Ticket.findOneAndRemove({ _id: req.params.ticketId }, function(err) {
        if (err)  res.send(err);
        res.send('Ticket Deleted Successfully!!!!');
    });
});



module.exports = router;
