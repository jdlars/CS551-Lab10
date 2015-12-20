/*
 server.js provided by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/server.js
 */

// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var morgan = require('morgan');
var userController = require('./bmkc_client/controllers/user');
var authController = require('./bmkc_client/controllers/auth');
var oauth2Controller = require('./bmkc_client/controllers/oauth2');
var clientController = require('./bmkc_client/controllers/client');
var beerController = require('./bmkc_client/controllers/beer');

var bdbBreweryController = require('./brewery_db/controllers/bdbBrewery');
var bdbBeerController = require('./brewery_db/controllers/bdbBeer');


var untappdController = require('./untappd');
var breweryDBNode = require('brewerydb-node');
var uriUtil = require('mongodb-uri');
var mongoose = require('mongoose');
var Beer = require('./bmkc_client/models/beer');

var configDb = require('./bmkc_client/config/database');
require('./bmkc_client/config/passport')(passport);
// Connect to the bmkc MongoDB

/**
 * Mongolab https://gist.github.com/mongolab-org/9959376 code follows for establishing connection
 */
/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
var mongodbUri = configDb.mongoLabUri;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

/*
 * Need multiple parameters for url, collections, auth mechanism, and options.
 */
mongoose.connect(mongooseUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
    mongoose.set('debug', true);
    // Wait for the database connection to establish, then start the app.
});

/*
End of https://gist.github.com/mongolab-org/9959376 snippet
 */

// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Use express session support since OAuth2orize requires it
app.use(session({
    secret: 'BMKC Session Key Is a Secret yo',
    saveUninitialized: true,
    resave: true
}));

// Use Morgan for logging to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();



//// Create endpoint handlers for /beers
//router.route('/api/beers')
//    .post(authController.isAuthenticated, beerController.postBeers)
//    .get(authController.isAuthenticated, beerController.getBeers);
//
//// Create endpoint handlers for /beers/:beer_id
//router.route('/api/beers/:beer_id')
//    .get(authController.isAuthenticated, beerController.getBeer)
//    .put(authController.isAuthenticated, beerController.putBeer)
//    .delete(authController.isAuthenticated, beerController.deleteBeer);

// Create endpoint handlers for /users


router.route('/api/authenticate')
    .get(userController.authenticateUser);

router.get('/api/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, configDb.secret);
        User.findOne({
            username: decoded.username
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.username + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});


router.route('/api/users')
    .post(userController.postUsers)
    .get(userController.getUsers);


router.route('/api/users/base_auth')
    .post(userController.tryGenerateJWToken, userController.getUserByName);

router.route('/api/users/:id')
    .get(userController.getUserById)
    .delete(userController.removeUser)
    .put(userController.updateUser);

router.route('/api/users/byname/:name')
    .get(authController.isAuthenticated, userController.getUserByName);

router.route('/api/beers')
    .get(beerController.getBeers)
    .post(beerController.postBeer);

router.route('/api/brewery_db/breweries')
    .get(bdbBreweryController.getBreweries);

router.route('/api/brewery_db/breweries/:bdbBreweryId')
    .get(bdbBreweryController.getBreweryByBdbId);

router.route('/api/brewery_db/breweries/mongo/:id')
    .get(bdbBreweryController.getBreweryByMongoId);


router.route('/api/brewery_db/beers/mongo/:mongoId')
    .get(bdbBeerController.getBeerByMongoId);

router.route('/api/brewery_db/beers/:bdbBeerId')
    .get(bdbBeerController.getBeerByBdbId);


router.route('/api/brewery_db/beers_for_brewery/:bdbBreweryId')
    .get(bdbBeerController.getBeersForBrewery);

router.route('/api/brewery_db/demo_beers')
    .get(bdbBeerController.getDemoBeers);

router.get('/api/untappd/findBeers?:q', function(req, res) {
    var beerSearch = new untappdController();
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+req.params.q);
    var result = beerSearch.beerSearch.beers({ q: req.params.q }, null);
    res.json({message:'Found Untappd Search Result!!', data: result});

});


/**
 * Stripped these routes out because our API services for auth is not working at this point. Will need to address this later in the month! TODO
 */
//// Create endpoint handlers for /clients
//router.route('/api/clients')
//    .post(authController.isAuthenticated, clientController.postClients)
//    .get(authController.isAuthenticated, clientController.getClients);
//
//// Create endpoint handlers for oauth2 authorize
//router.route('/api/oauth2/authorize')
//    .get(authController.isAuthenticated, oauth2Controller.authorization)
//    .post(authController.isAuthenticated, oauth2Controller.decision);
//
//// Create endpoint handlers for oauth2 token
//router.route('/api/oauth2/token')
//    .post(authController.isClientAuthenticated, oauth2Controller.token);

router.get('/', function(req, res) {
    res.json({ message: 'There is nothing here yet!' });
});

// Register all our routes
app.use(router);

// Start the server
app.listen(3000);