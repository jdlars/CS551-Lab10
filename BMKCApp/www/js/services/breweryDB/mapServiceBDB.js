angular.module('breweryDBServices')
  .service('Markers', function ($http, APIS) {
    var markers = [];
    return {
      getMarkers: function () {
        return $http.get('https://api.brewerydb.com/v2/locations/?key=fd038434276f4a9e7d6a19ee2d8aa5b5'+APIS.BREWERYDB.KANSAS_CITY_LOCALITY).then(function (response) {
          markers = response;
          return markers;
        });
      },
      getMarker: function (id) {}
    }

  });
