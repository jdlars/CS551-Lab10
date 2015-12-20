angular.module('bmkcApp.controllers')

  .directive('noScroll', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        $element.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })


  .controller('CardsCtrl', function ($scope, breweryServiceBDB, $q) {
    $q.all([
      breweryServiceBDB.getDemoBeers(),
      breweryServiceBDB.getBreweriesInKC()
    ]).then(function(results) {
      var beers = results[0].data;
      var breweries = results[1].data;
      var breweryMap = {};
      angular.forEach(breweries, function(brewery) {
        breweryMap[brewery.brewery.id] = brewery.brewery.name;
      });
      console.log("these are the beers");
      console.log(beers);
      var cardTypes = [];



      angular.forEach(beers, function(beer) {

        cardTypes.push({image: getImage(beer), title: beer.name, brewery: {name: breweryMap[beer.bdbBreweryId]}, style: {name: beer.style.name}, abv: beer.abv, ibu: beer.ibu});
      });

      function getImage(beer) {
        if (typeof beer.labels != "undefined") {
          if (typeof beer.labels.bmkc == "undefined") {
            if (typeof beer.labels.medium != "undefined") {
              return beer.labels.medium;
            }
          } else {
            return beer.labels.bmkc;
          }
        }

      };

      $scope.cards = [];

      $scope.addCard = function(i) {
        var indexCard = Math.floor(Math.random() * cardTypes.length);
        var newCard = cardTypes[indexCard];
        cardTypes.splice(indexCard, 1);
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
      };

      for(var i = 0; i < cardTypes.length; i++) $scope.addCard();

      $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
      }

      $scope.cardSwipedRight = function(index) {
        console.log('Right swipe');
      }

      $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
        console.log('Card removed');
      }
    });




  });

