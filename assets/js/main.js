var app = angular.module('fbDataApp', ['tc.chartjs', 'messageDuration', 'monthlyPie', 'weeklyPie', 'facebook-factory']);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', 'facebookdata', function($scope, $timeout, $http, facebookdata) {
  $http.get('../../data.json').success(function(response) {
    $scope.response = response;

    $scope.messages = response.userMessages;
    var dictionary = response.dictionary;

    var messageMoods = [];
    var wordCount = [];
    var yearlyMood = {};

    for (var word in dictionary) {
      // Words detected more then 200 times
      if (dictionary[word] > 200 && word.length > 0) {
        var commonWords = {
          'text': word,
          'count': dictionary[word]
        };
        wordCount.push(commonWords)
      }
    }

    wordCount.sort(function(a, b) {
      return a.count - b.count
    });

    $scope.words = wordCount.reverse().slice(0, 40);

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
        timestampCount = {};
        user.messages[userName]
        for (var count in user.messages) {
          var timestamp = user.messages[count].timestamp;
          // Converting to UTC ...
          var stamp = moment(timestamp, ['MMM D YYYY at h:mA']).valueOf();
          timestampCount[stamp] ? timestampCount[stamp] ++ : timestampCount[stamp] = 1;
        }
        messageMoods.push([userName, user.average, messageTotal, timestampCount]);
      }
    }


    // var yearlyMood = facebookdata.yearlyActivity(response);
    var sums = facebookdata.parseYear(yearlyMood);
    // Mood based on positive and negative messages sent by year
    var totalyears = [];
    var positiveMessage = [];
    var negativeMessage = [];

    for (var year in sums) {
      totalyears.push(year)
      positiveMessage.push(sums[year].lengths.pos)
      negativeMessage.push(sums[year].lengths.neg)
    }

    $scope.yearData = {
      labels: totalyears,
      datasets: [{
        label: 'Positive',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: positiveMessage
      }, {
        label: 'Negative',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
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

    // Sorting Most active users based on messages
    messageMoods.sort(function(a, b) {
      return a[2] - b[2]
    });

    var top20Contacts = messageMoods.slice(messageMoods.length - 40, messageMoods.length).reverse();

    $scope.bestFriends = [];
    for (var friend in top20Contacts) {
      $scope.bestFriends.push({
        'Name': top20Contacts[friend][0],
        'TimesContacted': top20Contacts[friend][2]
      })
    }

    // if you have more then 200 friends, were only going to take the top 200... Might use later
    messageMoods.length > 200 ? topFriends = messageMoods.slice(messageMoods.length - 100, messageMoods.length) : topFriends = messageMoods

    // sorting to lowest sentiment score
    topFriends.sort(function(a, b) {
      return a[1] - b[1]
    });

    var len = topFriends.length;

    var negative = {
      "key": "Negative",
      "color": "#F3313A",
      "values": []
    };
    var positive = {
      "key": "Positive",
      "color": "#4F6DA0",
      "values": []
    };

    var negative20 = topFriends.slice(0, 20);
    for (var user in negative20) {
      negative["values"].push({
        label: topFriends[user][0],
        value: negative20[user][1]
      })
    }

    topFriends.reverse();
    var positive20 = topFriends.slice(0, 20);
    for (var user in positive20) {
      positive["values"].push({
        label: topFriends[user][0],
        value: positive20[user][1]
      })
    }

    var negativeChart = [];
    var positiveChart = [];
    negativeChart.push(negative)
    positiveChart.push(positive)

    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) {
          return d.label
        })
        .y(function(d) {
          return d.value
        })
        .margin({
          top: 30,
          right: 20,
          bottom: 50,
          left: 175
        })
        .showValues(false) //Show bar value next to each bar.
        .tooltips(true) //Show tooltips on hover.
        .transitionDuration(350)
        .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.

      chart.yAxis
        .tickFormat(d3.format(',.2f'));

      d3.select('#negative svg')
        .datum(negativeChart)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) {
          return d.label
        })
        .y(function(d) {
          return d.value
        })
        .margin({
          top: 30,
          right: 20,
          bottom: 50,
          left: 175
        })
        .showValues(false) //Show bar value next to each bar.
        .tooltips(true) //Show tooltips on hover.
        .transitionDuration(350)
        .showControls(false); //Allow user to switch between "Grouped" and "Stacked" mode.

      chart.yAxis
        .tickFormat(d3.format(',.2f'));

      d3.select('#positive svg')
        .datum(positiveChart)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });

  }).error(function(err) {
    console.log(err)
  })
}]);
