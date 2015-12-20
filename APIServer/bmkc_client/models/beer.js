var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    breweryName: String,
    breweryDBBreweryID: String,
    breweryDBBeerID: String
});

module.exports = mongoose.model('Beer', BeerSchema);