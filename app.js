var fs = require('fs');
var moment = require('moment');
var he = require('he');
var sentiment = require('sentiment');
var HTMLParser = require('fast-html-parser');

var messageCount = {};

fs.readFile('./facebook/html/messages.htm', 'utf8', function(err, content) {
  if (err) throw err;
  var root = HTMLParser.parse(content.toString());
  var user = root.querySelectorAll('.user');
  var message = root.querySelectorAll('p');
  var time = root.querySelectorAll('.meta');


  var stream = fs.createWriteStream('output.csv');
  stream.write('userName, timestamp' + '\n')

  var calendar = {};

  message.map(function(element, idx) {
    console.log(idx + ' messages');

    if (element.childNodes.length == 0) return; 
    var timestamp = time[idx].childNodes[0].rawText;
    var userName = he.decode(user[idx].childNodes[0].rawText);
    var messageTxt = he.decode(element.childNodes[0].rawText);
    
    if (userName == 'Jack Hanford') {
      return;
    }

    var message = element.childNodes[0].rawText;

    // Monday, September 10, 2012 at 10:51pm PDT - Timestamp pre moment
    var stamp = moment(timestamp, ['MMMM Do, YYYY at HH:mmA']);
    var parts = timestamp.split(', ');
    timestamp = parts.reduce(function(prev, part, idx) {
      if (idx > 0) {
        return (prev || '') + ' ' + part; 
      }
    }, '');
    var stampYear = stamp.year();
    var stampMonth = stamp.month();
    var stampDay = stamp.day();

    // if (!(stampYear > startYear && stampYear < endYear)) {
    //   return;
    // }

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

    if (!messageCount[userName]) {
      messageCount[userName] = [];
    }

    messageCount[userName].push(timestamp);
    calendar[stampYear][stampMonth][stampDay][userName].push(timestamp);

    stream.write(userName + ',' + timestamp + '\n');
  });

stream.end();


var data = JSON.stringify(calendar)
fs.writeFile('data.json', data, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});


})
