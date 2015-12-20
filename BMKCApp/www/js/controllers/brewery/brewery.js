angular.module('bmkcApp.controllers')
    .controller('BreweryCtrl', function ($scope, $stateParams, $http, $ionicPlatform, $ionicLoading, BreweryPassingFactory, breweryServiceBDB) {
        $scope.BreweryPassingFactory = BreweryPassingFactory;
        $scope.brewery = BreweryPassingFactory.selectedBrewery;
        var breweryId = $scope.brewery.breweryId;
        $scope.beers = [];
        console.log("breweryId: " + breweryId);
        breweryServiceBDB.getBeersForBrewery(breweryId).then(function (data) {
            $scope.beers = data.data;
            /*
             used to populate the MongoDB with the existing beers for this brewery. Saving this for later.
             */
            //data.data.data.forEach(function partB(theObject) {
            //  theObject.bdbBreweryId = breweryId;
            //
            //
            //
            //
            //    breweryServiceBDB.insertBrewery(theObject).then(function(response) {
            //      console.log("success??");
            //
            //    });
            //});
            console.log($scope.beers);
        })
        var brewLocator = BreweryPassingFactory.selectedBrewery;
        console.log("brandon", brewLocator);
        var myLatlng = new google.maps.LatLng(brewLocator.latitude, brewLocator.longitude);


        var mapOptions = {
            center: myLatlng,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("breweryMap"), mapOptions);
        var markerPos = new google.maps.LatLng(brewLocator.latitude, brewLocator.longitude);
        var beerIcon = "img/beer-icon-yellow.png";
        // Add the markerto the map

        var marker = new google.maps.Marker({
            map: map,
            icon: beerIcon,
            animation: google.maps.Animation.DROP,
            position: markerPos
        });
        var geoImage = "img/drunk-guy.png";

        navigator.geolocation.getCurrentPosition(function (pos) {
//            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                zoom: 20,
                map: map,
                icon: geoImage,
                animation: google.maps.Animation.BOUNCE,
                title: "My Location"
            });
        });


    });