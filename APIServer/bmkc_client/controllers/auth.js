/*
 auth.js provided by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/controllers/auth.js
 */

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;
var JSONWebTokenStrategy = require('passport-jwt').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var configDb = require('../config/database');
var passportConfig = require('../config/passport');
/**
 * Look up user by username and check the password. Basic strategy uses basic authentication
 */
passport.use('simple', new BasicStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

/**
 * This is the current global authentication strategy used in BMKC. We did not fully flesh out our passport authentication services
 * to include OAuth 2 and other more sophisticated auth strategies due to time constraints.
 */

//
//passport.use('jwt', new JSONWebTokenStrategy (
//    var getToken = function (headers) {
//        if (headers && headers.authorization) {
//            var parted = headers.authorization.split(': ');
//            if (parted.length === 2) {
//                return parted[1];
//            } else {
//                return null;
//            }
//        } else {
//            return null;
//        }
//    };
//    function(req, res) {
//        var token = getToken(req.headers)
//    }
//));




passport.use(new DigestStrategy(
    { algorithm: 'MD5', qop: 'auth' },
    function(username, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Success
            return callback(null, user, user.password);
        });
    },
    function(params, callback) {
        // validate nonces as necessary
        callback(null, true);
    }
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass'
    },
    function(username, password, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({ id: username }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== password) { return callback(null, false); }

            // Success
            return callback(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        Token.findOne({value: accessToken }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }

                // No user found
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));

//exports.isAuthenticated = passport.authenticate(['local', 'bearer'], { session : false });
exports.isAuthenticated = passport.authenticate('simple', { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
exports.isTokenAuthenticated = passport.authenticate('jwt', {session: false});