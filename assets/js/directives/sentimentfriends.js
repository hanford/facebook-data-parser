angular.module('fbDataApp')
  .directive('sentimentFriends', function(facebookdata, $http) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/sentiment.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function(value) {
          if (!value) {
            return;
          }
          var userFormatted = facebookdata.setFriends(value);
          // Sort by messages participated in
          userFormatted.sort(function(a, b) {
            return a[2] - b[2]
          });
          // Cut top 100 friends for smaller data size
          userFormatted.length > 100 ? topFriends = userFormatted.slice(userFormatted.length - 100, userFormatted.length) : topFriends = userFormatted;
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
            if (negative20[user][0].indexOf("@") > -1) {
              var facebookEmail = negative20[user][0];
              var id = facebookEmail.substring(0, negative20[user][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                negative["values"].push({
                  label: response.data.name,
                  value: negative20[user][1]
                })
              })
            } else {
              negative["values"].push({
                label: topFriends[user][0],
                value: negative20[user][1]
              })
            }
          }
          topFriends.reverse();
          var positive20 = topFriends.slice(0, 20);
          for (var user in positive20) {
            if (positive20[user][0].indexOf("@") > -1) {
              var facebookEmail = positive20[user][0];
              var id = facebookEmail.substring(0, positive20[user][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                positive["values"].push({
                  label: response.data.name,
                  value: positive20[user][1]
                })
              })
            } else {
              positive["values"].push({
                label: topFriends[user][0],
                value: positive20[user][1]
              })
            }
          }
          var negativeChart = [];
          var positiveChart = [];
          negativeChart.push(negative);
          positiveChart.push(positive);
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
        })
      }
    }
  })
