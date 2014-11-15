angular.module('fbDataApp')
  .directive('bestFriends', function(facebookdata, $http) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/bestfriends.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function(value) {
          if (!value) {
            return;
          }

          var message = value.userMessages;
          var friends = [];

          for (var userName in message) {
            if (message[userName].hasOwnProperty('average')) {
              var messageTotal = message[userName].messages.length;
              friends.push([userName, messageTotal]);
            }
          }
          friends.sort(function(a, b) {
            return a[1] - b[1]
          });
          var top40Contacts = friends.slice(friends.length - 40, friends.length).reverse();
          scope.bestFriends = [];
          for (var friend in top40Contacts) {
            if (top40Contacts[friend][0].indexOf("@") > -1) {
              var facebookEmail = top40Contacts[friend][0];
              var id = facebookEmail.substring(0, top40Contacts[friend][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                scope.bestFriends.push({
                  'Name': response.data.name,
                  'TimesContacted': top40Contacts[friend][1]
                })
              })
            } else {
              scope.bestFriends.push({
                'Name': top40Contacts[friend][0],
                'TimesContacted': top40Contacts[friend][1]
              })
            }
          }
        })
      }
    }
  });
