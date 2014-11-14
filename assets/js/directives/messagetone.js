angular.module('fbDataApp')
  .directive('messageTone', function(facebookdata) {
    function messageMood(value) {
      if (!value) {
        return
      }

      // Mood based on positive and negative messages sent by year
      var positiveMessage = [];
      var negativeMessage = [];
      var messageMood = [];

      var calendar = value;
      var yearlyMood = facebookdata.yearlyActivity(calendar);
      var sums = facebookdata.parseYear(yearlyMood);

      for (var year in sums) {
        if (sums[year].lengths.pos && sums[year].lengths.neg) {
          if (year != "0") {
            var pos = {
              x: year,
              y: sums[year].lengths.pos
            }
            var neg = {
              x: year,
              y: sums[year].lengths.neg
            }
            positiveMessage.push(pos);
            negativeMessage.push(neg);
          }
        }
      }

      messageMood.push({
        values: positiveMessage,
        color: '#2196F3',
        key: 'Positive Sent'
      })

      messageMood.push({
        values: negativeMessage,
        color: '#F44336',
        key: 'Negative Sent'
      })

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
          .axisLabel('Happiness')
          .tickFormat(d3.format('d'));
        d3.select('#messageTone svg') //Select the <svg> element you want to render the chart in.
          .datum(messageMood) //Populate the <svg> element with chart data...
          .call(chart); //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function() {
          chart.update()
        });
        return chart;
      });
    }

    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/message-tone.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, messageMood.bind(scope))
      }
    }
  });
