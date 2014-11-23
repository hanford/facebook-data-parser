angular.module('fbDataApp')
  .directive('yearlyHappiness', function() {
    function happiness(value) {
      if (!value) {
        return
      }

      var positiveYrly = [];
      var negativeYrly = [];

      for (var year in value) {
        if (value[year].avg.pos && value[year].avg.neg) {
          var pos = {
            Year: year,
            Average: value[year].avg.pos
          }
          var neg = {
            Year: year,
            Average: value[year].avg.neg
          }
          positiveYrly.push(pos);
          negativeYrly.push(neg);
        }
      }

      var avgYearlyMood = [];
      avgYearlyMood.push(positiveYrly);
      avgYearlyMood.push(negativeYrly);

      data_graphic({
        title: "Average Sentiment Score by Year",
        data: avgYearlyMood,
        width: 450,
        height: 320,
        target: '#yearlyHappiness',
        x_accessor: 'Year',
        y_accessor: 'Average'
      })

    }
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/yearly-happiness.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, happiness.bind(scope))
      }
    }
  });
