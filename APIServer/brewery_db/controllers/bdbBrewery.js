var BdbBrewery = require('../models/bdbBrewery');

exports.getBreweries = function(req, res) {
    BdbBrewery.find(function(err, breweries) {
        if (err)
            res.send(err);
        res.json(breweries);
    });
};

exports.getBreweryByBdbId = function(req, res) {
    BdbBrewery.find(
        {id: req.params.bdbBreweryId},
        function (err, brewery) {
        if (err)
            res.send(err);
        res.json(brewery);
    });
};

exports.getBreweryByMongoId = function(req, res) {
    BdbBrewery.find(
        {_id: req.params.id},
        function (err, brewery) {
        if (err)
            res.send(err);
        res.json(brewery);
    });
};
