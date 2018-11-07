const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();



/** Bring in User Model */

let User = require ('../models/user');

/** Add Register route */

//Form
router.get('/register', function(req, res){
    res.render('register');
});

//Register action
router.post('/register', 
[
    check('name').isLength({min:1}).trim().withMessage('Name required'),
    check('email').isLength({min:1}).trim().withMessage('Email required'),
    check('email').isEmail().trim().withMessage('Enter a valid email address'),
    check('username').isLength({min:1}).trim().withMessage('Username required'),
    check('password').isLength({min:5}).trim().withMessage('Password must contain at least 6 characters'),
    check('password').custom((value,{req, loc, path}) => {
        if (value !== req.body.confirmPassword) {
            // throw error if passwords do not match
            throw new Error("Passwords do not match");
        } else {
            return value;
        }
    })  
],
function(req, res, next){
  
    let newUser = new User({
        name: req.body.name,
       email: req.body.email,
       username: req.body.username,
       password: req.body.password
        
      });

//check for errors
let errors = validationResult(req);

if (!errors.isEmpty()) {
    console.log(errors);
       res.render('register',
        { 
        newUser:newUser,
         errors: errors.mapped()
        });
     }else{
            //Hash password
         bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if(err){
                    console.log (err);
                }
                // Store hashed password in the DB.
                newUser.password = hash;
                newUser.save(err=>{
                    if(err)throw err;
                    req.flash('success','You are now registered and can log in');
                    res.redirect('/users/login');
                 });
            });
        });
     }

});

/** Add User Login Route Form */
router.get('/login', function(req, res){
res.render('login');
});

//Login process
router.post('/login', function(req, res, next){
passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/users/login',
    failureFlash:true
})(req, res, next);
});

//Google+ Form
router.get('/auth/google', passport.authenticate('google', {
    scope:['profile']

}));

//Callback route for Google to redirect to
router.get('/auth/google/callback', function(req, res){
res.send ('It works');
});

//Logout process
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
})

//Export router
module.exports = router;