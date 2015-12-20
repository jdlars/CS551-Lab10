var BdbBeer = require('../models/bdbBeer');

exports.getBeersForBrewery = function(req, res) {
    BdbBeer.find(
        {bdbBreweryId : req.params.bdbBreweryId},
        function(err, breweries) {
            if (err)
                res.send(err);
            res.json(breweries);
        });
};

exports.getBeerByBdbId = function(req, res) {
    BdbBeer.find(
        {bdbBeerId: req.params.bdbBeerId},
        function (err, beer) {
            if (err)
                res.send(err);
            res.json(beer);
        });
};

exports.getBeerByMongoId = function(req, res) {
    BdbBeer.find(
        {_id: req.params.id},
        function (err, beer) {
            if (err)
                res.send(err);
            res.json(beer);
        });
};

exports.getDemoBeers = function(req, res) {
    BdbBeer.find(
        {
            bdbBreweryId: {
            $in: [
                '8uTWZo',
                'sCgeAO'
            ]
        }},
        function (err, beers) {
            if (err) {
                res.send(err);
            }

            res.json(beers);
        });
};
