const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
  }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({githubID: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                    new User({
                    	githubID: profile.id,
	                    githubUserName: profile.username,
	                    name: profile.displayName,
	                    thumbnail: profile._json.avatar_url,
	                    email: profile._json.email,
	                    bio: profile._json.bio
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);