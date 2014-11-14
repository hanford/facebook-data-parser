var app = angular.module('fbDataApp', ['facebook-factory']);

app.controller('fbDataCtrl', ['$scope', '$http', 'facebookdata', '$timeout', function($scope, $http, facebookdata, $timeout) {
  function fetchData(cb) {
    $http.get('../../data.json').success(cb).error(function(err) {
      console.log(err)
    });
  }

  function processData(response) {
    $scope.loaded = true;
    $scope.response = response;
  }

  $timeout(function() {
    fetchData(processData);
  }, 0);
}]);
