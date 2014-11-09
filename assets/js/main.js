var app = angular.module('fbDataApp', ['tc.chartjs']);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
  $http.get('../../data.json').success(function(response) {
    console.log(response)

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

    $scope.words = wordCount.reverse();

    // Checking property of object
    var messageWeekdays = [];
    for (var prop in response.dayCount) {
      messageWeekdays.push({
        label: prop,
        value: response.dayCount[prop]
      })
    }

    // Checking property of object
    var monthLabel = 0;
    var messageMonthlyCount = [];
    for (var prop in response.monthCount) {
      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      messageMonthlyCount.push({
        label: month[monthLabel++],
        value: response.monthCount[prop]
      })
    }

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

    function recursiveIteration(object) {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          if (typeof object[property] == "object") {
            recursiveIteration(object[property]);
          } else {
            var year = moment(object.timestamp, ['MMM D YYYY at h:mA']).year();
            yearlyMood[year] ? yearlyMood[year].push(object.score) : yearlyMood[year] = [object.score];
          }
        }
      }
    }

    recursiveIteration(response.calendar);

    var sums = {};

    for (var year in yearlyMood) {
      sums[year] = {
        pos: 0,
        neg: 0
      };
      var lengths = {
        pos: 0,
        neg: 0
      };

      for (var i = 0; i < yearlyMood[year].length; i++) {
        var val = yearlyMood[year][i];

        if (val >= 0) {
          sums[year].pos += val;
          lengths.pos++;
        } else {
          sums[year].neg += val;
          lengths.neg++;
        }
      }

      sums[year].avg = {};
      sums[year].lengths = lengths;

      sums[year].avg.pos = sums[year].pos / lengths.pos;
      sums[year].avg.neg = sums[year].neg / lengths.neg;
    }

    // Mood based on positive and negative messages sent by year
    var totalyears = [];
    var positiveMessage = [];
    var negativeMessage = [];
    var activity = [];
    var yearlyActivity = [];

    for (var year in sums) {
      var totalSent = {
        x: year,
        y: sums[year].lengths.pos + sums[year].lengths.neg
      };
      activity.push(totalSent);
      totalyears.push(year)
      positiveMessage.push(sums[year].lengths.pos)
      negativeMessage.push(sums[year].lengths.neg)
    }

    yearlyActivity.push({
      values: activity,
      key: 'messages'
    });

    $scope.yearData = {
      labels: totalyears,
      datasets: [{
        label: 'Negative Messages',
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(220,220,220,0.75)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: negativeMessage
      }, {
        label: 'Positive Messages',
        fillColor: 'rgba(151,187,205,0.5)',
        strokeColor: 'rgba(151,187,205,0.8)',
        highlightFill: 'rgba(151,187,205,0.75)',
        highlightStroke: 'rgba(151,187,205,1)',
        data: positiveMessage
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

    // if you have more then 200 friends, were only going to take the top 200.
    messageMoods.length > 200 ? topFriends = messageMoods.slice(messageMoods.length - 100, messageMoods.length) : topFriends = messageMoods

    // sorting to lowest sentiment score
    topFriends.sort(function(a, b) {
      return a[1] - b[1]
    });

    var len = topFriends.length;

    var negative = {
      "key": "Negative",
      "color": "#d67777",
      "values": []
    };
    var positive = {
      "key": "Positive",
      "color": "#4f99b4",
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

    nv.addGraph(function() {
      var chart = nv.models.lineChart()
        .margin({
          left: 100
        }) //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
        .transitionDuration(350) //how fast do you want the lines to transition?
        .showLegend(false) //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true) //Show the y-axis
        .showXAxis(true);

      chart.xAxis //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format('d'));

      chart.yAxis //Chart y-axis settings
        .axisLabel('Number of Messages')
        .tickFormat(d3.format('d'));
      d3.select('#messageActivty svg') //Select the <svg> element you want to render the chart in.
        .datum(yearlyActivity) //Populate the <svg> element with chart data...
        .call(chart); //Finally, render the chart!

      //Update the chart when window resizes.
      nv.utils.windowResize(function() {
        chart.update()
      });
      return chart;
    });

  }).error(function(err) {
    console.log(err)
  })
}]);
