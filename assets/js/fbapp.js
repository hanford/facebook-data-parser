angular.module('fbDataApp', ['facebook-factory'])

.controller('fbDataCtrl', ['$scope', '$http', 'facebookdata', '$timeout', function($scope, $http, facebookdata, $timeout) {
  function fetchData(cb) {
    $http.get('../../data.json').success(cb).error(function(err) {
      console.log(err)
    });
  }

  function processData(response) {
    $scope.loaded = true;
    $scope.response = response;

    var yearlyMood = facebookdata.yearlyActivity(response.calendar);
    $scope.hourly = facebookdata.hourlyAct(response.calendar);
    $scope.sums = facebookdata.parseYear(yearlyMood);
  }



  $timeout(function() {
    fetchData(processData);
  }, 0);
}]);
