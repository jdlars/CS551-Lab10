var mongoose = require('mongoose');

var BdbBeerSchema = new mongoose.Schema({
    abv: String,
    ibu: String,
    id: String,
    name: String,
    nameDisplay: String,
    description: String,
    srmId: Number,
    availableId: Number,
    styleId: Number,
    isOrganic: String,
    labels: {
        icon: String,
        large: String,
        medium: String,
        bmkc: String
    },
    status: String,
    statusDisplay: String,
    foodPairings: String,
    createDate: String,
    updateDate: String,
    srm: {
        id: Number,
        name: String,
        hex: String
    },
    available: {
        id: Number,
        name: String,
        description: String
    },
    style: {
        id: Number,
        categoryId: Number,
        category: {
            id: Number,
            name: String,
            createDate: String
        },
        name: String,
        shortName: String,
        description: String,
        ibuMin: String,
        ibuMax: String,
        abvMin: String,
        abvMax: String,
        srmMin: String,
        srmMax: String,
        ogMin: String,
        ogMax: String,
        fgMin: String,
        fgMax: String,
        createDate: String,
        updateDate: String
    },
    bdbBreweryId: String
});

module.exports = mongoose.model('BdbBeer', BdbBeerSchema, 'bdbBeer');

