


angular.module('bmkcApp.controllers').controller('BreweriesCtrl', function ($scope, $http, BreweryPassingFactory, breweryServiceBDB) {


  $scope.testBreweries = breweryServiceBDB.getBreweriesInKC().then(function(response) {
    console.log(response.data);

    /*
    used to populate the MongoDB with the existing breweries. Saving this for later.
     */
    //response.data.data.forEach(function(theObject) {
    //    breweryServiceBDB.insertBrewery(theObject).then(function(response) {
    //      console.log("success??");
    //
    //    });
    //});




    $scope.breweries = response.data;
  });

  $scope.passBreweryToBreweryView = function (brewery) {
    $scope.BreweryPassingFactory = BreweryPassingFactory;
    BreweryPassingFactory.selectedBrewery = brewery;
  }


});
