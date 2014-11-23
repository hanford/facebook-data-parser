angular.module('fbDataApp')
  .directive('bestFriends', function($http) {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/bestfriends.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.bestfriends, function(friendslist) {
          if (!friendslist) {
            return;
          }

          var friends = [];

          // friendslist is grabbed from the HTML element
          for (var userName in friendslist) {
            if (friendslist[userName].hasOwnProperty('average')) {
              var messageTotal = friendslist[userName].messages.length;
              var avg = friendslist[userName].average;
              friends.push([userName, messageTotal, avg]);
            }
          }
          friends.sort(function(a, b) {
            return a[1] - b[1]
          });

          var top40Contacts = friends.slice(friends.length - 40, friends.length).reverse();
          scope.bestFriends = [];
          for (var friend in top40Contacts) {
            var isId = top40Contacts[friend][0].indexOf("@") > -1;
            if (isId) {
              var email = top40Contacts[friend][0];
              var id = email.substring(0, top40Contacts[friend][0].indexOf("@"));
              $http.get('https://graph.facebook.com/' + id).then(function(response) {
                scope.bestFriends.push({
                  'Name': response.data.name,
                  'TimesContacted': top40Contacts[friend][1],
                  'avg': top40Contacts[friend][2]
                })
              })
            } else {
              scope.bestFriends.push({
                'Name': top40Contacts[friend][0],
                'TimesContacted': top40Contacts[friend][1],
                'avg': top40Contacts[friend][2]
              })
            }
          }
        })
      }
    }
  });