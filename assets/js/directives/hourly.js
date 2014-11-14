angular.module('fbDataApp')

.directive('hourly', function(facebookdata) {
  function hourly(value) {
    if (!value) {
      return
    }

    var hourlyMessages = facebookdata.hourlyAct(value);

    var activity = [];
    for (var hour in hourlyMessages) {
      var time = moment(hour, ['H']).format('HH');
      var hourSent = {
        x: time,
        y: hourlyMessages[hour],
      }
      activity.push(hourSent);
    }

    var hourlyActivity = [];
    hourlyActivity.push({
      values: activity,
      area: true,
      color: '#2196F3',
      key: 'Sent by hour'
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
        .axisLabel('Hour')
        .tickFormat(d3.format('d'));

      chart.yAxis //Chart y-axis settings
        .axisLabel('Number of Messages');
        // .tickFormat(d3.format('d'));
      d3.select('#hourly svg') //Select the <svg> element you want to render the chart in.
        .datum(hourlyActivity) //Populate the <svg> element with chart data...
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
    templateUrl: 'assets/js/templates/hourly.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, hourly.bind(scope));
    }
  }
})
