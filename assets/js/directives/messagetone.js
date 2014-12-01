angular.module('fbDataApp')
.directive('messageTone', function() {
  function messageMood(value) {
    if (!value) {
      return
    }

    var positiveMessage = [];
    var negativeMessage = [];
    var messageMood = [];

    var sums = value;

    for (var year in sums) {
      if (sums[year].lengths.pos && sums[year].lengths.neg) {
        if (year != "0") {
          var pos = {
            Year: year,
            Sent: sums[year].lengths.pos,
          }
          var neg = {
            Year: year,
            Sent: sums[year].lengths.neg
          }
          positiveMessage.push(pos);
          negativeMessage.push(neg);
        }
      }
    }

    messageMood.push(positiveMessage)
    messageMood.push(negativeMessage)

    data_graphic({
      title: "Message Tone by Year",
      data: messageMood,
      width: 450,
      height: 320,
      target: '#messageTone',
      x_accessor: 'Year',
      y_accessor: 'Sent'
    })

  }

  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/message-tone.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.data, messageMood.bind(scope))
    }
  }
});