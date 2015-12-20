var mongoose = require('mongoose');

var BdbBrewerySchema = new mongoose.Schema({
   id: String,
    name: String,
    streetAddress: String,
    locality: String,
    region: String,
    postalCode: String,
    phone: String,
    website: String,
    latitude: Number,
    longitude: Number,
    isPrimary: String,
    inPlanning: String,
    isClosed: String,
    openToPublic: String,
    locationType: String,
    locationTypeDisplay: String,
    countryIsoCode: String,
    yearOpened: String,
    status: String,
    statusDisplay: String,
    createDate: String,
    updateDate: String,
    breweryId: String,
    brewery: {
        id: String,
        name: String,
        description: String,
        website: String,
        established: String,
        isOrganic: String,
        images: {
            icon: String,
            medium: String,
            large: String
        },
        status: String,
        statusDisplay: String,
        createDate: String,
        updateDate: String
    },
    country: {
        isoCode: String,
        name: String,
        displayName: String,
        isoThree: String,
        numberCode: Number,
        createDate: String
    }


});

module.exports = mongoose.model('BdbBrewery', BdbBrewerySchema, 'bdbBrewery');

