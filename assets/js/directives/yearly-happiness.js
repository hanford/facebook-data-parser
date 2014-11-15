angular.module('fbDataApp')
  .directive('yearlyHappiness', function(facebookdata) {
    function happiness(value) {
      if (!value) {
        return
      }

      var calendar = value;
      var yearlyMessages = facebookdata.yearlyActivity(calendar);
      var totalyears = facebookdata.parseYear(yearlyMessages);
      var positiveYrly = [];
      var negativeYrly = [];

      for (var year in totalyears) {
        if (totalyears[year].avg.pos && totalyears[year].avg.neg) {
          var pos = {
            Year: year,
            Average: totalyears[year].avg.pos
          }
          var neg = {
            Year: year,
            Average: totalyears[year].avg.neg
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
