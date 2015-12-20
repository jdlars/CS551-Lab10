/*
 user.js inspired by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/controllers/user.js
 */
// Load required packages
var User = require('../models/user');
var BdbBeer = require('../../brewery_db/models/bdbBeer');
var configDb = require('..//config/database');
var jwt = require('jwt-simple');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, message: 'Make sure you have entered a username and password.'});
    } else {
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.save(function (err) {
            if (err)
                res.json({success: false, msg: 'Username already exists.'});
            else {
                res.json({success: true, message: 'New BMKC beer drinker added to the MongoLab!'});
            }

        });
    }
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send("!"+err);

        res.json(users);
    });
};

exports.removeUser = function(req, res) {
    User.remove({
        _id: req.params.id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json({message: 'User with username: ' + user.username + ' successfully removed from MongoDB'});

    })
};

exports.getUserById = function(req, res) {
    User.findOne({_id: req.params.id}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    })
};

exports.getUserByName = function(req, res) {
    User.findOne({username: req.params.name}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    })
};

exports.updateUser = function(req, res) {
    User.findOne({_id: req.params.id}, function(err, user) {
        if (err)
            res.send(err);
        for (prop in req.body) {
            user[prop] = req.body[prop];
        }

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User successfully updated!'});
        });


    });
};

exports.addUserPreference = function(req, res) {
    User.findOne({_id: req.params.id}, function(err, user) {
        if (err)
            res.send(err);

        for (preference in req.body.preferences) {

            user[beerMePreferences].add(preference);
        }

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({message: 'User Preferences successfully updated!'});

        });

        res.json(user);

    });
};

exports.tryGenerateJWToken = function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.send({success: false, message: "Authentication failed. User not found in the databse."});
        } else {
            user.verifyPassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, configDb.secret);
                    res.json({success: true, token: 'JWT - Java Web Token: ' + token });

                } else {
                    res.send({success: false, message: "Authentication failed. Incorrect password."});
                }
            });
        }
    });
};

exports.authenticateUser = function(req, res) {
    getToken = function (headers) {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
}
