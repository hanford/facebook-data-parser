var app = angular.module('fbDataApp', []);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
  $http.get('../../data.json').success(function(response) {
    console.log(response)

    $scope.messages = response.userMessages;

    var messageMoods = [];
    var bestFriends = [];
    var wordCount = [];

    for (var word in response.dictionary) {
      // Grabs words used more then 500 times, throws out spaces ""
      if (response.dictionary[word] > 500 && word.length > 0) {

        // wordCount.push(word + ' ' + response.dictionary[word])
      }
    }

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

    // Sorting Most active users based on messages
    messageMoods.sort(function(a, b) {
      return a[2] - b[2]
    });

    var top20Contacts = messageMoods.slice(messageMoods.length - 10, messageMoods.length).reverse();

    var bestFriends = [];
    for (var friend in top20Contacts) {
      bestFriends.push({
        'key': top20Contacts[friend][0],
        'values': []
      })
      for (var times in top20Contacts[friend][3]) {
        if (times === 1) { console.log('t1'); }
        bestFriends[friend]['values'].push([parseInt(times), top20Contacts[friend][3][times]]);
      }
    }

    // console.log(JSON.stringify(bestFriends, null, 4));

  // nv.addGraph(function() {
  //   var chart = nv.models.stackedAreaChart()
  //                 .margin({right: 100})
  //                 .x(function(d) { return d[0] })   //We can modify the data accessor functions...
  //                 .y(function(d) { if (!d) { console.log(d); } return d[1] })   //...in case your data is formatted differently.
  //                 .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
  //                 .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
  //                 .transitionDuration(500)
  //                 .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
  //                 .clipEdge(true);
  //
  //   //Format x-axis labels with custom function.
  //   chart.xAxis
  //       .tickFormat(function(d) {
  //         return d3.time.format('%x')(new Date(d))
  //   });
  //
  //   chart.yAxis
  //       .tickFormat(d3.format(',.2f'));
  //
  //   d3.select('#besties svg')
  //     .datum(bestFriends)
  //     .call(chart);
  //
  //   nv.utils.windowResize(chart.update);
  //
  //   return chart;
  // });

    // if you have more then 200 friends, were only going to take the top 200.
    messageMoods.length > 200 ? topFriends = messageMoods.slice(messageMoods.length - 200, messageMoods.length) : topFriends = messageMoods

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
      key: 'messages',
      area: true
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
        .showXAxis(true) //Show the x-axis
      ;

      chart.xAxis //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format('d'));

      chart.yAxis //Chart y-axis settings
        .axisLabel('Number of Messages')
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

  }).error(function(err) {
    console.log(err)
  })
}]);
