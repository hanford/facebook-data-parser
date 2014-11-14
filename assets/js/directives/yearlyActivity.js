angular.module('fbDataApp')

.directive('messageDuration', function(facebookdata) {
  function messageDuration(value) {
    if (!value) {
      return
    }
    var calendar = value;
    var yearlyMessages = facebookdata.yearlyActivity(calendar);
    var totalyears = facebookdata.parseYear(yearlyMessages);
    var activity = [];
    var yearlyActivity = [];

    for (var year in totalyears) {
      var totalSent = {
        x: year,
        y: totalyears[year].lengths.pos + totalyears[year].lengths.neg
      }
      activity.push(totalSent);
    }

    yearlyActivity.push({
      values: activity,
      area: true,
      color: '#2196F3',
      key: 'Sent:'
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
  }

  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/yearly-activity.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, messageDuration.bind(scope));
    }
  }
})
