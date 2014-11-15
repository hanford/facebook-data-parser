angular.module('fbDataApp')
  .directive('sentimentFriends', function(facebookdata, $http) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/sentiment.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function(value) {

          if (!value) {
            return;
          }

          var userFormatted = facebookdata.setFriends(value);

          userFormatted.sort(function(a, b) {
            return a[2] - b[2]
          });

          userFormatted.length > 100 ? topFriends = userFormatted.slice(userFormatted.length - 100, userFormatted.length) : topFriends = userFormatted;

          topFriends.sort(function(a, b) {
            return a[1] - b[1]
          });

          var negative = [];
          var positive = [];

          var negative20 = topFriends.slice(0, 20);
          for (var user in negative20) {
            if (negative20[user][0].indexOf("@") > -1) {
              var facebookEmail = negative20[user][0];
              debugger
              var id = facebookEmail.substring(0, negative20[user][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                negative.push({
                  label: response.data.name,
                  value: Math.abs(negative20[user][1])
                })
              })
            } else {
              negative.push({
                label: topFriends[user][0],
                value: Math.abs(negative20[user][1])
              })
            }
          }
          topFriends.reverse();
          var positive20 = topFriends.slice(0, 20);
          for (var user in positive20) {
            if (positive20[user][0].indexOf("@") > -1) {
              var facebookEmail = positive20[user][0];
              var id = facebookEmail.substring(0, positive20[user][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                positive.push({
                  label: response.data.name,
                  value: positive20[user][1]
                })
              })
            } else {
              positive.push({
                label: topFriends[user][0],
                value: positive20[user][1]
              })
            }
          }

          data_graphic({
            title: 'Negative Chart',
            data: negative,
            chart_type: 'bar',
            x_accessor: 'value',
            y_accessor: 'label',
            width: 475,
            height: 320,
            target: '#negative',
          })

          data_graphic({
            title: 'Positive Chart',
            data: positive,
            chart_type: 'bar',
            x_accessor: 'value',
            y_accessor: 'label',
            width: 475,
            height: 320,
            target: '#positive',
          })
        })
      }
    }
  })
