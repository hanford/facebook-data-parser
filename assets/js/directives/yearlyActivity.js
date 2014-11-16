angular.module('fbDataApp')

.directive('yearly', function(facebookdata) {
  function yearly(value) {
    if (!value) {
      return
    }

    var totalyears = value;
    var activity = [];
    var yearlyActivity = [];

    for (var year in totalyears) {
      var totalSent = {
        year: year,
        sent: totalyears[year].lengths.pos + totalyears[year].lengths.neg
      }
      activity.push(totalSent);
    }

    data_graphic({
      title: 'Yearly',
      data: activity,
      width: 450,
      height: 320,
      target: '#activity',
      x_accessor: 'year',
      y_accessor: 'sent',
    })
  }

  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/yearly-activity.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, yearly.bind(scope));
    }
  }
})
