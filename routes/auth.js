const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Pin = require('../models/pin-model');

var express = require('express');
var app = express();

router.get('/github', passport.authenticate('github', {
    scope: [ 'user:email' ]
}));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/profile');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/github');
    } else {
        next();
    }
};

router.get('/profile', authCheck, (req, res) => {
	//console.log(req.user.thumbnail);
    var length=req.user.pinID.length;
      // for(i=0;i<length;i++)
        // {
          Pin.find({_id : {$in: req.user.pinID}}, (err, pinimg)=>{
            if (err) throw err;
                  if (pinimg) {
                  }
                  // if(i==length-1)
                  // show();
          }).then((pins)=> {
            // console.log(pinThumbnail, pinID, length);
            console.log(pins);
            res.render('profile', { user: req.user, pins: pins });
          });
        // }
      // function show() {
        
      // }
});


module.exports = router;