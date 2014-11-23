angular.module('fbDataApp')

.directive('hourly', function() {
  function hourly(value) {
    if (!value) {
      return
    }

    var activity = [];
    for (var hour in value) {
      var time = moment(hour, ['H']).format('HH');
      var hourSent = {
        Hour: time,
        Sent: value[hour],
      }
      activity.push(hourSent);
    }

    data_graphic({
      title: 'Hour',
      data: activity,
      width: 450,
      height: 320,
      target: '#hourly',
      x_accessor: 'Hour',
      y_accessor: 'Sent',
    })
  }

  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/hourly.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.data, hourly.bind(scope));
    }
  }
})
