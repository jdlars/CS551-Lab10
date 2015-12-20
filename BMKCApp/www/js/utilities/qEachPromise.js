angular.module("qEachPromise", [])
  .factory("qEach", ["$q", function(q) {
    function qEach(collection, promiseFactory) {
      var deferred = q.defer();
      var promises = _.map(collection, function(value) {
        var val = promiseFactory(value);
        if (typeof val === "undefined") {
          val = value;
        }
        return q.when(val);
      });
      q.all(promises).then(function(values) {
        deferred.resolve(values);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
    return qEach;

  }]);
