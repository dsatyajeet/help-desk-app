/**
 * Created by keyurvekariya on 11/27/15.
 */

var Ticket = require('../model/ticket');
var express = require('express');
var router = express.Router();

/* POST Ticket Add listing. */
router.post('/add', function(req, res, next) {

    Ticket.create({
        subject: req.body.subject,
        content: req.body.content,
        createDate: new Date(),
        updateDate: new Date()
    }, function(err,ticket) {
        if (err)
            res.send(err);
        //res.send("added successfully");
        res.json(ticket);
    });
});


/* GET Ticket  listing. */
router.get('/get/:ticketId', function(req, res, next) {

    Ticket.find({ "_id": req.params.ticketId }, function(err, ticket) {
        if (err) res.send(err);
        res.json(ticket);
    });
});


/* GETAll Ticket  listing. */
router.get('/getAll', function(req, res, next) {

    Ticket.find({}, function(err, tickets) {
        if (err) res.send(err);
        res.json(tickets);
    });
});

/* PUT Ticket Update listing. */
router.put('/update', function(req, res, next) {

    Ticket.findOneAndUpdate({_id: req.body.ticketId}, { subject: req.body.subject,content: req.body.content,updateDate:new Date() }, function(err, ticket) {
        if (err) res.send(err);
        // we have the updated user returned to us
        Ticket.find({ "_id": req.body.ticketId }, function(err, ticket) {
            if (err) res.send(err);
            res.json(ticket);
        });
    });


});

/* delete Ticket  listing. */
router.delete('/delete/:ticketId', function(req, res, next) {

    Ticket.findOneAndRemove({ _id: req.params.ticketId }, function(err) {
        if (err)  res.send(err);
        res.send('Ticket Deleted Successfully!!!!');
    });
});



module.exports = router;
