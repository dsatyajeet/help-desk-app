var express = require('express');
var router = express.Router();

var User = require('../models/oauth/user');
var oauth2 = require('../oauth/oauth2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



 /* POST Add User .*/
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

router.route('/oauth/token')
    .post(oauth2.isAuthenticated,oauth2.token2);



module.exports = router;
