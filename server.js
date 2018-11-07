const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const config = require ('./config/database');
const passport = require('passport');
    

//mongoose.connect('mongodb://localhost/nodekb');
mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log ('connected to database');
})

//Check for DB Errors
db.on('error', function(){
  console.log(err);
})

const hostname = '127.0.0.1';
const port = 3000;

//Initialize app
const app = express();

/** Bring in Models */
let Article = require ('./models/article');

/**Load view engine */
app.set('views', __dirname + '/views');
app.set ('view engine', 'pug');

/** Add a generic JSON and URL-encoded parser as a top-level middleware, 
 * which will parse the bodies of all incoming requests */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Use express session middleware
app.use(cookieParser('keyboard cat'));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'keyboard cat',
    resave: true,
 
}));
app.use(flash());

//Use Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Import passport config
require('./config/passport')(passport);

//Passport Middle ware
app.use(passport.initialize());
app.use(passport.session());

//Global variable for all URLs
app.get('*', function(req, res, next){
res.locals.user = req.user || null;
next();
})


/** Home route */
app.get('/', function(req, res){
Article.find({}, function(err, articles){
  if(err){
    console.log(err);
  }else{
    res.render ('index', {
      title: 'Articles',
      articles: articles
    });
  }
 
});
});

//Router files 
let articles = require ('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


//Start Server
app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
