var JwtStrategy = require('passport-jwt').Strategy;

var User = require('../models/user');
var mongoLabConfig = require('./database');

module.exports = function(passport) {
  var options = {};
    options.secretOrKey = mongoLabConfig.secret;
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        User.findOne({username: jwt_payload.username}, function(err, user) {
            if(err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
    }))
};