var app = angular.module('chartApp', ['tc.chartjs']);

app.controller('SalesController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http){
  var d;
  $http.get('../../data.json').success(function(response) {
    d = response.Days;
    console.log()
    $scope.data = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
      {
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [d['Monday'], d['Tuesday'], d['Wednesday'], d['Thursday'], d['Friday'], d['Saturday'], d['Sunday']]
      }
      ]
    };

    // Chart.js Options
    $scope.options =  {
      // Sets the chart to be responsive
      responsive: true,
      ///Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,
      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth : 1,
      //Boolean - Whether the line is curved between points
      bezierCurve : true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension : 0.4,
      //Boolean - Whether to show a dot for each point
      pointDot : true,
      //Number - Radius of each point dot in pixels
      pointDotRadius : 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,
      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,
      onAnimationProgress: function(){},
      onAnimationComplete: function(){},
      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };
  })



}]);
