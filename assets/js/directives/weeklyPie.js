angular.module('fbDataApp')
  .directive('weeklyPie', function(facebookdata) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/weekly-pie.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function(value) {
          if (!value) {
            return;
          }
          var dayCount = value;
          var messageWeekdays = [];
          for (var prop in dayCount) {
            messageWeekdays.push({
              label: prop,
              value: dayCount[prop]
            })
          }
          nv.addGraph(function() {
            var chart = nv.models.pieChart()
              .color(['#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'])
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
