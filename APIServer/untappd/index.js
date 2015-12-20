var Config = require('./config');
var BeerSearch = require('./lib/endpoints/beerSearch');


function Untappd() {
    this.config = new Config();
    this.beerSearch = new BeerSearch(this.config);
}

module.exports = Untappd;