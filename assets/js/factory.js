angular.module('facebook-factory', [])

.factory('facebookdata', function($http, $timeout) {
  return {
    yearlyActivity: function(calendar) {
      var yearlyMood = {};
      yearlySentiment(calendar);
      function yearlySentiment(object) {
        for (var property in object) {
          if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object") {
              // Restart
              yearlySentiment(object[property]);
            } else {
              var year = moment(object.timestamp, ['MMM D YYYY at h:mA']).year();
              yearlyMood[year] ? yearlyMood[year].push(object.score) : yearlyMood[year] = [object.score];
            }
          }
        }
      }
      return yearlyMood;
    },
    setFriends: function(value) {
      var userMessages = value;
      var messageMoods = [];
      for (var userName in userMessages) {
        var user = userMessages[userName];
        if (user.hasOwnProperty('average')) {
          var messageTotal = user.messages.length;
          user.average = Math.round(user.average * 100) / 100;
          timestampCount = {};
          user.messages[userName];
          for (var count in user.messages) {
            var timestamp = user.messages[count].timestamp;
            var stamp = moment(timestamp, ['MMM D YYYY at h:mA']).valueOf();
            timestampCount[stamp] ? timestampCount[stamp] ++ : timestampCount[stamp] = 1;
          }
          messageMoods.push([userName, user.average, messageTotal, timestampCount]);
        }
      }
      return messageMoods;
    },
    parseYear: function(yearlyMood) {
      var sums = {};

      for (var year in yearlyMood) {
        sums[year] = {
          pos: 0,
          neg: 0
        };
        var lengths = {
          pos: 0,
          neg: 0
        };

        for (var i = 0; i < yearlyMood[year].length; i++) {
          var val = yearlyMood[year][i];

          if (val >= 0) {
            sums[year].pos += val;
            lengths.pos++;
          } else {
            sums[year].neg += val;
            lengths.neg++;
          }
        }

        sums[year].avg = {};
        sums[year].lengths = lengths;

        sums[year].avg.pos = sums[year].pos / lengths.pos;
        sums[year].avg.neg = sums[year].neg / lengths.neg;
      }
      return sums;
    }
  }
})
