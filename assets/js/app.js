var app = angular.module('fbDataApp', ['tc.chartjs']);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
  $http.get('../../data.json').success(function(response) {
    console.log(response)

    $scope.messages = response.userMessages;

    var messageMoods = [];
    var bestFriends = [];
    var messageWeekdays = [];
    var messageWeekdayCount = [];
    var messageMonthlyCount = [];
    var messageYear = [];
    var messageYearly = [];
    var wordCount = [];

    for (var word in response.dictionary) {
      // Grab words used more then 500 times
      if (response.dictionary[word] > 500) {

        // wordCount.push(word + ' ' + response.dictionary[word])
      }
    }

    // Checking property of object
    for (var prop in response.dayCount) {
      messageWeekdays.push(prop)
      messageWeekdayCount.push(response.dayCount[prop])
    }

    // Checking property of object
    for (var prop in response.monthCount) {
      messageMonthlyCount.push(response.monthCount[prop])
    }

    for (var userName in $scope.messages) {
      var user = $scope.messages[userName];

      if (user.hasOwnProperty('average')) {
        user.average = Math.round(user.average * 100) / 100;
        messageMoods.push([userName, user.average]);
      }

      if (user.hasOwnProperty('messages')) {
        var messageTotal = user.messages.length;
        bestFriends.push([userName, messageTotal])
      }
    }

    bestFriends.sort(function(a, b) {
      return a[1] - b[1]
    });
    messageMoods.sort(function(a, b) {
      return a[1] - b[1]
    });

    $scope.sadFriends = messageMoods.slice(0, 20);
    $scope.happyFriends = messageMoods.slice(messageMoods.length - 20, messageMoods.length).reverse();

    $scope.bestFriends = bestFriends.slice(bestFriends.length - 20, bestFriends.length).reverse();

    // ChartJS set up
    $scope.weeklyData = {
      labels: messageWeekdays,
      datasets: [{
        label: 'Conversations started by day',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: messageWeekdayCount
      }]
    };

    $scope.monthlyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Conversations started by Month',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: messageMonthlyCount
      }]
    };

    $scope.yearly = [];

    for (var prop in response.yearCount) {
      var color = Please.make_color( );
      var year = {
        value: response.yearCount[prop],
        color: color,
        highlight: color,
        label: prop,
      };
      $scope.yearly.push(year)
    }

        // Chart.js Options
    $scope.pie =  {
      // Sets the chart to be responsive
      responsive: true,
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke : true,
      //String - The colour of each segment stroke
      segmentStrokeColor : '#fff',
      //Number - The width of each segment stroke
      segmentStrokeWidth : 2,
      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout : 20, // This is 0 for Pie charts
      //Number - Amount of animation steps
      animationSteps : 100,
      //String - Animation easing effect
      animationEasing : 'easeOutBounce',
      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,
      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : true,
      //String - A legend template
      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

    };

    // ChartJS options
    $scope.lineChart = {
      // Sets the chart to be responsive
      responsive: true,
      ///Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether the line is curved between points
      bezierCurve: true,
      //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.4,
      //Boolean - Whether to show a dot for each point
      pointDot: true,
      //Number - Radius of each point dot in pixels
      pointDotRadius: 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius: 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke: true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth: 2,
      //Boolean - Whether to fill the dataset with a colour
      datasetFill: true,
      // Function - on animation progress
      onAnimationProgress: function() {},
      // Function - on animation complete
      onAnimationComplete: function() {},
      //String - A legend template
      legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };


  }).error(function(err) {
    console.log(err)
  })
}]);
