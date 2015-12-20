var Beer = require('../models/beer');

exports.postBeer = function(req, res) {
    var beer = new Beer();

    beer.name = req.body.name;
    beer.type = req.body.type;
    beer.breweryName = req.body.breweryName;
    beer.breweryDBBreweryId = req.body.breweryDBBreweryId;
    beer.breweryDBBeerId = req.body.breweryDBBeerId;

    beer.save(function(err) {
       if (err)
            res.send(err);
       res.json({message:'Beer added to the MongoLab!', data: beer});
    });
};

exports.getBeers = function(req, res) {

};