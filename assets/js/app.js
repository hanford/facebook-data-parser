var app = angular.module('fbDataApp', []);

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
      messageWeekdays.push({label: prop, value: response.dayCount[prop]})
    }

    console.log(messageWeekdays)

    // Checking property of object
    var monthLabel = 0;
    for (var prop in response.monthCount) {
      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      messageMonthlyCount.push({label: month[monthLabel++], value: response.monthCount[prop]})
    }

    console.log(messageMonthlyCount)

    for (var userName in $scope.messages) {
      var user = $scope.messages[userName];

      // Potential ID name fix below
      // if (userName.indexOf('@facebook.com') != -1) {
      //   var hasID = userName.indexOf('@facebook.com');
      //   // Hacky way of removing @facebook.com
      //   var id = userName.slice(hasID, hasID + 13)
      //   console.log(id)
      // }

      if (user.hasOwnProperty('average')) {
        var messageTotal = user.messages.length;
        user.average = Math.round(user.average * 100) / 100;
        messageMoods.push([userName, user.average, messageTotal]);
      }
    }

    // Sorting Most active users based on total messages with user
    messageMoods.sort(function(a, b) {
      return a[2] - b[2]
    });

    $scope.bestFriends = messageMoods.slice(messageMoods.length - 20, messageMoods.length).reverse();

    // if you have more then 200 friends, were only going to take the top 200.
    messageMoods.length > 200 ? topFriends = messageMoods.slice(messageMoods.length - 200, messageMoods.length) : topFriends = messageMoods

    // sorting to lowest sentiment score
    topFriends.sort(function(a, b) {
      return a[1] - b[1]
    });
    // Slicing lowest sentiment
    $scope.sadFriends = topFriends.slice(0, 20);
    topFriends.reverse();
    // Slicing top sentiment scores
    $scope.happyFriends = topFriends.slice(0, 20);

    //Regular pie chart example
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .x(function(d) {
          return d.label
        })
        .y(function(d) {
          return d.value
        })
        .showLabels(true);

      d3.select("#weeklyPie svg")
        .datum(messageWeekdays)
        .transition().duration(350)
        .call(chart);

      return chart;
    });

    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .x(function(d) {
          return d.label
        })
        .y(function(d) {
          return d.value
        })
        .showLabels(true);

      d3.select("#monthlyPie svg")
        .datum(messageMonthlyCount)
        .transition().duration(350)
        .call(chart);

      return chart;
    });

    $scope.yearly = [];
    var vals = [];

    for (var prop in response.yearCount) {
      var pos = {
        x: prop,
        y: response.yearCount[prop]
      };
      vals.push(pos);
    }

    $scope.yearly.push({
      values: vals,
      key: 'messages'
    });

    nv.addGraph(function() {
      var chart = nv.models.lineChart()
        .margin({
          left: 100
        }) //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
        .transitionDuration(350) //how fast do you want the lines to transition?
        .showLegend(true) //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true) //Show the y-axis
        .showXAxis(true) //Show the x-axis
      ;

      chart.xAxis //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format('d'));

      chart.yAxis //Chart y-axis settings
        .axisLabel('# of Messages')
        .tickFormat(d3.format('d'));

      var myData = $scope.yearly;

      d3.select('#messageActivty svg') //Select the <svg> element you want to render the chart in.
        .datum($scope.yearly) //Populate the <svg> element with chart data...
        .call(chart); //Finally, render the chart!

      //Update the chart when window resizes.
      nv.utils.windowResize(function() {
        chart.update()
      });
      return chart;
    });

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
