/*
 client.js provided by https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-6.2/models/client.js
 */

// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    id: { type: String, required: true },
    secret: { type: String, required: true },
    userId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);