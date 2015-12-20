angular.module('bmkcApp.controllers').controller('MapController', function ($scope, $stateParams, $ionicLoading, $ionicPlatform, BreweryPassingFactory, breweryServiceBDB, Distance, qEachPromise) {



  $ionicPlatform.ready(function () {

    var myLat, myLong;
//            navigator.geolocation.getCurrentPosition(function (p){
//                myLat = p.coords.latitude;
//                myLong = p.coords.longitude;
//            });


//            function GetLocation(location) {
//                myLat = location.coords.latitude;
//                myLong = location.coords.longitude;
//            }
    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);


    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var geoImage = "img/drunk-guy.png";

    navigator.geolocation.getCurrentPosition(function (pos) {
      myLat = pos.coords.latitude;
      myLong = pos.coords.longitude;
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        icon: geoImage,
        animation: google.maps.Animation.BOUNCE,
        title: "My Location"
      });
    });

    function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
        content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });

    }

    //used to know current location of user
//            var myLat, myLong;
//            navigator.geolocation.getCurrentPosition(GetLocation);
//
//
//            function GetLocation(location) {
//                myLat = location.coords.latitude;
//                myLong = location.coords.longitude;
//            }

    var distanceArr = [];
    var record = [];
    breweryServiceBDB.getBreweriesInKC().then(function (promise) {
      record = promise.data;
      var beerIcon = "img/beer-icon-yellow.png";
      for (var i = 0; i < record.length; i++) {
        var records = record[i];
        console.log("bla", records.latitude);
        var markerPos = new google.maps.LatLng(records.latitude, records.longitude);

        // Add the markerto the map

        var marker = new google.maps.Marker({
          map: map,
          icon: beerIcon,
          animation: google.maps.Animation.DROP,
          position: markerPos
        });

        var infoWindowContent = "<h5>" + records.brewery.name + "</h5>";
        infoWindowContent += "<a href='https://www.google.com/maps/dir/Current+Location/" + records.latitude + "," + records.longitude + "'>" + "Click Me</a>";
        //                        infoWindowContent += "<a href='#' onclick='navigateMe()'>" + "Take me there!" + "</a>;
        //                        infoWindowContent += "<p>" + record.

        addInfoWindow(marker, infoWindowContent, record);
        document.getElementById("mapBreweryName").innerHTML += "<div class='row'>" + records.brewery.name + "</div>";
        var dist, dur;
//                    console.log("lat", myLat);
        Distance.getDistance(myLat, myLong, records).then(function (promise) {
//                        document.getElementById("mapDistance").innerHTML += "<div class='row'>" + promise.data.rows[0].elements[0].distance.text + "</div>";
          console.log("prom", promise);
          var result = promise;
          dist = result.data.rows[0].elements[0].distance.text;
          dur = result.data.rows[0].elements[0].duration.text;
          distanceArr.push({
            brewery: records.brewery.name,
            distance: dist,
            duration: dur
          });
          distanceArr.sort(function(a, b){
            return parseFloat(a.distance) - parseFloat(b.distance);
          });
          console.log("arr", distanceArr);
          dist = promise.data.rows[0].elements[0].distance.text;
        });
//                    Distance.getDuration(myLat, myLong, records).then(function (promise) {
//                        document.getElementById("mapDuration").innerHTML += "<div class='row'>" + promise.data.rows[0].elements[0].duration.text + "</div>";
//                        //                        dur = promise.data.rows[0].elements[0].duration.text;
//                    });

        //                    distanceArr.push({brewery: records.brewery.name, distance: dist, duration: dur});
        //                    console.log("arr", distanceArr);
      }
      console.log("b", promise);
    });

//            function navigateMe(destination, start) {
//                $cordovaLaunchNavigator.navigate(destination, start);
//            }

    //        function loadMarkers() {
    //
    //            //Get all of the markers from our Markers factory
    //            Markers.getMarkers().then(function (markers) {
    //
    //                var records = markers.data.data;
    //                var beerIcon = "img/beer-icon-yellow.png";
    //
    //
    //                for (var i = 0; i < records.length; i++) {
    //
    //                    var record = records[i];
    //                    var markerPos = new google.maps.LatLng(record.latitude, record.longitude);
    //
    //                    // Add the markerto the map
    //
    //                    var marker = new google.maps.Marker({
    //                        map: map,
    //                        icon: beerIcon,
    //                        animation: google.maps.Animation.DROP,
    //                        position: markerPos
    //                    });
    //
    //                    var destination = [record.latitude, record.longitude];
    //
    //                            var infoWindowContent = "<h5>" + record.brewery.name + "</h5>";
    //                            infoWindowContent += "<a href='https://www.google.com/maps/dir/Current+Location/" + record.latitude + "," + record.longitude + "'>" + "Click Me</a>";
    //                            //                        infoWindowContent += "<a href='#' onclick='navigateMe()'>" + "Take me there!" + "</a>;
    //                            //                        infoWindowContent += "<p>" + record.
    //
    //                            addInfoWindow(marker, infoWindowContent, record);
    //
    //                }
    //
    //            })
    //
    //        }


    //        loadMarkers();
    $scope.map = map;
    //        console.log(Markers.getMarkers());
  });



//    .factory('Distance', function ($http, $q) {
//        var returnDistance = [];
//        var returnDuration = [];
//        var apiLink = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=";
//        var apiKey = "&key=AIzaSyCCFNl9nQvcN1ZLlydw-_w4CBL4deNn3vc"
//        var deffered = $q.defer();
//        return {
//            getDistance: function (thisLat, thisLong, thisRecord) {
//                return $http.get(apiLink + thisLat + "," + thisLong + "&destinations=" + thisRecord.latitude + "," + thisRecord.longitude + "&units=imperial" + apiKey).then(function (response) {
//                    console.log("theresp", response);
//                    return response;
//                    //                    deffered.resolve(response.data.rows[0].elements[0].distance.text);
//                    //                    localStorage.setItem("distance", returnDistance);
//                    //                    return deffered.promise;
//                })
//            },
//            getDuration: function (thisLat, thisLong, thisRecord) {
//                return $http.get(apiLink + thisLat + "," + thisLong + "&destinations=" + thisRecord.latitude + "," + thisRecord.longitude + "&units=imperial" + apiKey).then(function (response) {
//                    return response;
//                })
//            }
//        }
//    });




});
