var app = angular.module('fbDataApp', ['tc.chartjs', 'messageDuration', 'monthlyPie', 'weeklyPie', 'sentimentFriends', 'facebook-factory']);

app.controller('fbDataCtrl', ['$scope', '$timeout', '$http', 'facebookdata', function($scope, $timeout, $http, facebookdata) {
  $http.get('../../data.json').success(function(response) {
    $scope.response = response;

    var friends = [];
    var wordCount = [];
    var yearlyMood = {};

    var dictionary = response.dictionary;
    for (var word in dictionary) {
      if (dictionary[word] > 200 && word.length > 0) {
        var commonWords = {
          'text': word,
          'count': dictionary[word]
        };
        wordCount.push(commonWords)
      }
    }

    wordCount.sort(function(a, b) {
      return a.count - b.count
    });

    // Top 40 words
    $scope.words = wordCount.reverse().slice(0, 40);

    var message = response.userMessages;
    for (var userName in message) {
      if (message[userName].hasOwnProperty('average')) {
        var messageTotal = message[userName].messages.length;
        message[userName].messages[userName]
        friends.push([userName, messageTotal]);
      }
      // Potential ID name fix below
      // if (userName.indexOf('@facebook.com') != -1) {
      //   var hasID = userName.indexOf('@facebook.com');
      //   // Hacky way of removing @facebook.com
      //   var id = userName.slice(hasID, hasID + 13)
      //   console.log(id)
      // }
    }

    // Sorting Most active users based on messages
    friends.sort(function(a, b) {
      return a[1] - b[1]
    });

    var top20Contacts = friends.slice(friends.length - 40, friends.length).reverse();

    $scope.bestFriends = [];
    for (var friend in top20Contacts) {
      $scope.name = "";
      if (top20Contacts[friend][0].indexOf("@") > -1) {
        var facebookEmail = top20Contacts[friend][0];
        var toCut = top20Contacts[friend][0].indexOf("@");
        var id = facebookEmail.substring(0, toCut);
        $http.get('https://graph.facebook.com/' + id).then(function(response) {
          $scope.bestFriends.push({
            'Name': response.data.name,
            'TimesContacted': top20Contacts[friend][1]
          })
        })
      } else {
        $scope.bestFriends.push({
          'Name': top20Contacts[friend][0],
          'TimesContacted': top20Contacts[friend][1]
        })
      }
    }


    // var yearlyMood = facebookdata.yearlyActivity(response);

    // Mood based on positive and negative messages sent by year
    var totalyears = [];
    var positiveMessage = [];
    var negativeMessage = [];
    var sums = {};

    for (var year in sums) {
      totalyears.push(year)
      positiveMessage.push(sums[year].lengths.pos)
      negativeMessage.push(sums[year].lengths.neg)
    }

    $scope.yearData = {
      labels: totalyears,
      datasets: [{
        label: 'Positive',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: positiveMessage
      }, {
        label: 'Negative',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: negativeMessage
      }]
    };

    // Chart.js Options
    $scope.options = {
      // Sets the chart to be responsive
      responsive: true,
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,
      //String - A legend template
      legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="padding-left:10px;margin-right:5px;background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

  }).error(function(err) {
    console.log(err)
  })
}]);
