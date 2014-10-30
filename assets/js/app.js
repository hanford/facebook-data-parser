var app = angular.module('fbDataApp', ['tc.chartjs']);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
  $http.get('../../data.json').success(function(response) {
    $scope.items = response;
    console.log(Object.keys(response).length, response)
  }).error(function(err) {
    console.log(err)
  })
}]);
