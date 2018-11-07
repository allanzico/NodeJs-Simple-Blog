const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require ('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const keys = require('../config/keys');

module.exports = function(passport){

    //Local strategy
    passport.use(new localStrategy(function(username, password, done){

    // Match username
    let query = {username:username};
    User.findOne(query, function(err, user){
        if (err) throw err;
        if(!user){
            return done (null, false, {message:'User does not exist'});
        }

        //Match password
        bcrypt.compare(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
              return done(null, user);
          }  else{
            return done (null, false, {message:'password or username is incorrect'});
          }
        });
    })

    }));

    /**In order to support login sessions, 
     * Passport will serialize and deserialize user instances to and from the session. */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

      /**Using Google+ Strategy */
      passport.use(new GoogleStrategy({
        //options of the strategy
        
        clientID: keys.google.clientID,
        clientSecret:keys.google.clientSecret,
        callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
        
        }, function(){
            //Pasport callback function
        }));
}