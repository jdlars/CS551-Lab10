var apiConstants = angular.module('apiConstants', []);

apiConstants.constant("APIS", {
    "BREWERYDB":
    {
      /**
       * To overcome CORS issues, use http://ionicinaction.com/blog/how-to-fix-cors-problems-and-no-access-control-allow-origin-header-errors-with-ionic/
       * http://localhost:<PORT>/api.brewerydb.com/...
       */
      //"BASE_URL": "http://api.brewerydb.com/v2/",
      "BASE_URL": "http://localhost:1337/api.brewerydb.com/v2/",
      "KEY" : "?key=fd038434276f4a9e7d6a19ee2d8aa5b5",
      "PREFIX": "",
      "KANSAS_CITY_LOCALITY": "&locality=Kansas%20City"
    },
    "UNTAPPD":
    {

    },
    "PROXY":
    {
      "HOST": "http://localhost:1337/"
    },
    "NODEJS":
    {
      /**
       * Likely you will have to change this to your localhost IP
       */
      //"BASE_URL": "http://192.168.1.120:3000/api/",
      "BASE_URL": "http://localhost:3000/api/",

      "INSERT_ATTEMPT_URL": "http://192.168.1.120:3000/post"
    }
  });
