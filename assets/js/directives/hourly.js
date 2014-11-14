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
        Hour: time,
        Sent: hourlyMessages[hour],
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
      scope.$watch(attrs.value, hourly.bind(scope));
    }
  }
})
