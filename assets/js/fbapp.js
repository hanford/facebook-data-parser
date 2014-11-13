var app = angular.module('fbDataApp', ['tc.chartjs', 'facebook-factory']);

app.controller('fbDataCtrl', ['$scope', '$http', 'facebookdata', '$timeout', function($scope, $http, facebookdata, $timeout) {
  $http.get('../../data.json').success(function(response) {
    $scope.response = response;

    // Mood based on positive and negative messages sent by year
    var totalyears = [];
    var positiveMessage = [];
    var negativeMessage = [];
    var yearlyMood = {};

    var yearlyMood = facebookdata.yearlyActivity(response.calendar);
    var sums = facebookdata.parseYear(yearlyMood);
    var hourlyMessages = facebookdata.hourlyAct(response.calendar);

    var totalhours =[];
    var messagesSent = [];

    for (var hour in hourlyMessages) {
      totalhours.push(moment(hour, ['H']).format('h a'));
      messagesSent.push(hourlyMessages[hour])
    }

    $scope.hourlyActivity = {
      labels: totalhours,
      datasets: [{
        label: 'Messages sent by hour',
        fillColor: 'rgba(81, 114, 158, 0.55)',
        strokeColor: 'rgba(81, 114, 158, 0.95)',
        pointColor: 'rgba(81, 114, 158, 1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(81, 114, 158, 95)',
        data: messagesSent
      }]
    };

    for (var year in sums) {
      totalyears.push(year)
      positiveMessage.push(sums[year].lengths.pos)
      negativeMessage.push(sums[year].lengths.neg)
    }

    $scope.yearData = {
      labels: totalyears,
      datasets: [{
        label: 'Positive',
        fillColor: 'rgba(81, 114, 158, 0.55)',
        strokeColor: 'rgba(81, 114, 158, 0.95)',
        pointColor: 'rgba(81, 114, 158, 1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(81, 114, 158, 95)',
        data: positiveMessage
      }, {
        label: 'Negative',
        fillColor: 'rgba(223, 223, 223, 0.55)',
        strokeColor: 'rgba(220,220,220,80)',
        pointColor: 'rgba(220,220,220,80)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: negativeMessage
      }]
    };

    // Chart.js Options
    $scope.options = {
      // Sets the chart to be responsive
      responsive: true,
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,
      //String - A legend template
      legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="padding-left:10px;margin-right:5px;background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

  }).error(function(err) {
    console.log(err)
  })
}]);
