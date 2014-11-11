angular.module('weeklyPie', ['facebook-factory'])

.directive('weeklyPie', function(facebookdata, $http) {
  return {
    restrict: 'E',
    templateUrl: 'assets/js/templates/weekly-pie.html',
    link: function() {
      $http.get('../../../data.json').success(function(response) {
        var messageWeekdays = [];
        for (var prop in response.dayCount) {
          messageWeekdays.push({
            label: prop,
            value: response.dayCount[prop]
          })
        }
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
      })
    }
  }
});
