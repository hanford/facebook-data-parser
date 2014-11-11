angular.module('weeklyPie', ['facebook-factory'])

.directive('weeklyPie', function(facebookdata) {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/weekly-pie.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, function(newValue) {
        if (newValue) {
          var response = newValue;
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
        }
      })
    }
  }
});
