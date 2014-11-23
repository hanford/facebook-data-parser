angular.module('fbDataApp')

.directive('monthlyPie', function() {
  function monthlyPie(value) {
    if (!value) {
      return;
    }
    var monthCount = value;
    var monthLabel = 0;
    var messageMonthlyCount = [];
    for (var prop in monthCount) {
      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      messageMonthlyCount.push({
        label: month[monthLabel++],
        value: Math.ceil(monthCount[prop])
      })
    }
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
        .color(['#E3F2FD', '#82B1FF', '#BBDEFB', '#90CAF9', '#448AFF', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'])
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
    })
  }

  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/monthly-pie.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, monthlyPie.bind(scope));
    }
  }
});
