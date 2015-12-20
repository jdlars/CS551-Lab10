/*
 user.js provided by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/models/user.js
 */


// Load required packages
var mongoose = require('mongoose');
var BdbBeer = require('../../brewery_db/models/bdbBeer');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    beersSpecifications: ['BdbBeer'],
    beerMePreferences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Preference'
        }
    ],
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        }
    ]
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema, 'user');