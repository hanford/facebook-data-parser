var fs = require('fs');
var FB = require('fb');
var moment = require('moment');
var he = require('he');
var sentiment = require('sentiment');
var HTMLParser = require('fast-html-parser');

// FB.setAccessToken('token')

fs.readFile('./facebook/html/messages.htm', 'utf8', function(err, content) {
  if (err) throw err;
  var root = HTMLParser.parse(content.toString());
  var user = root.querySelectorAll('.user');
  var message = root.querySelectorAll('p');
  var time = root.querySelectorAll('.meta');


  var stream = fs.createWriteStream('data.csv');
  stream.write('key, value, date' + '\n');

  var calendar = {};
  var userMessages = {};
  var dict = {};

  message.map(function(element, idx) {
    console.log(idx + ' messages');

    if (element.childNodes.length == 0) return;
    var timestamp = time[idx].childNodes[0].rawText;
    var userName = he.decode(user[idx].childNodes[0].rawText);
    var messageTxt = he.decode(element.childNodes[0].rawText);
    var eachWord = element.childNodes[0].rawText.split(' ');

    if (userName == 'Jack Hanford') {
      eachWord.map(function(word) {
        word = he.decode(word.toLowerCase().replace(/↵/g, ' ').trim());
        dict[word] ? dict[word] ++ : dict[word] = 1;
      });
      return;
    }

    // Timestamp pre moment - Monday, September 10, 2012 at 10:51pm PDT
    var parts = timestamp.split(', ');

    timestamp = parts.reduce(function(prev, part, idx) {
      if (idx > 0) {
        return (prev || '') + ' ' + part;
      }
    }, '');

    var stamp = moment(timestamp, ['MMM D YYYY at h:mA']);
    var stampYear = stamp.year();
    var stampMonth = stamp.month();
    var stampDay = stamp.date();

    var sentimentScore = sentiment(messageTxt).score;

    if (!calendar[stampYear]) {
      calendar[stampYear] = {};
    }

    if (!calendar[stampYear][stampMonth]) {
      calendar[stampYear][stampMonth] = {};
    }

    if (!calendar[stampYear][stampMonth][stampDay]) {
      calendar[stampYear][stampMonth][stampDay] = {};
    }

    if (!calendar[stampYear][stampMonth][stampDay][userName]) {
      calendar[stampYear][stampMonth][stampDay][userName] = [];
    }

    if (!userMessages[userName]) {
      userMessages[userName] = {
        messages: []
      };
    }

    // var computedMessage = {
    //   content: messageTxt,
    //   timestamp: timestamp.trim(),
    //   score: sentimentScore
    // };

    userMessages[userName].messages.push(computedMessage);
    calendar[stampYear][stampMonth][stampDay][userName].push(computedMessage);

    stream.write(userName + ',' + sentimentScore + ',' + timestamp + '\n');
  });

  stream.end();

  for (var user in userMessages) {
    var messages = userMessages[user].messages;
    var len = messages.length;

    var sum = messages.reduce(function(prev, msg) {
      if (msg.content.split(' ').length <= 1) {
        len--;
        return prev || 0;
      }

      return (prev || 0) + msg.score;
    }, 0);

    userMessages[user].average = sum / len;
  }

  // var data = JSON.stringify({
  //   userMessages: userMessages,
  //   calendar: calendar,
  //   dictionary: dict
  // })

  fs.writeFile('data.json', data, function(err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});
