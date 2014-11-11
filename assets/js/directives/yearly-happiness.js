angular.module('fbDataApp')
  .directive('yearlyHappiness', function(facebookdata) {
    function happiness(value) {
      if (!value) {
        return
      }

      var calendar = value;
      var yearlyMessages = facebookdata.yearlyActivity(calendar);
      var totalyears = facebookdata.parseYear(yearlyMessages);
      var avgYearlyMood = [];
      var positiveYrly = [];
      var negativeYrly = [];

      for (var year in totalyears) {
        if (totalyears[year].avg.pos && totalyears[year].avg.neg) {
          var pos = {
            x: year,
            y: totalyears[year].avg.pos
          }
          var neg = {
            x: year,
            y: totalyears[year].avg.neg
          }
          positiveYrly.push(pos);
          negativeYrly.push(neg);
        }
      }

      avgYearlyMood.push({
        values: positiveYrly,
        color: '#405E9B',
        key: 'Projected Hapiness'
      })

      avgYearlyMood.push({
        values: negativeYrly,
        color: 'red',
        key: 'Projected Negative'
      })

      nv.addGraph(function() {
        var chart = nv.models.lineChart()
          .margin({
            left: 100
          }) //Adjust chart margins to give the x-axis some breathing room.
          .useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
          .transitionDuration(350) //how fast do you want the lines to transition?
          .showLegend(false) //Show the legend, allowing users to turn on/off line series.
          .showYAxis(false) //Show the y-axis
          .showXAxis(true);

        chart.xAxis //Chart x-axis settings
          .axisLabel('Year')
          .tickFormat(d3.format('d'));

        chart.yAxis //Chart y-axis settings
          .axisLabel('Happiness')
          .tickFormat(d3.format('d'));
        d3.select('#yearlyhappiness svg') //Select the <svg> element you want to render the chart in.
          .datum(avgYearlyMood) //Populate the <svg> element with chart data...
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
      templateUrl: 'assets/js/templates/yearly-happiness.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, happiness.bind(scope))
      }
    }
  });
