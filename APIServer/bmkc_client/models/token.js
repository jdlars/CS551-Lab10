/*
 token.js provided by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/models/token.js
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
    value: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);