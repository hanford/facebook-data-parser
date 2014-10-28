var fs = require('fs');
var sentiment = require('sentiment');
var HTMLParser = require('fast-html-parser');

fs.readFile('./facebook/html/messages.htm', function(err, content) {
  if (err) throw err;
  var root = HTMLParser.parse(content.toString());
  var user = root.querySelectorAll('.user');
  var message = root.querySelectorAll('p');
  var time = root.querySelectorAll('.meta');

  var bringTogether = function (dict, options) {
    var newArr = [];

    for (var item in dict)
      newArr.push([item, {occur: dict[item]}])

    if (options) {
      if (options.sentiment) {
        newArr = newArr.map(function(item) {
          var phrase = item[0];
          var val = item[1];
          val.rating = sentiment(phrase);

          return [phrase, val];
        });
      }
    }

    newArr.sort(function(a, b) {

      if (options && options.times) {
        return a[1].occur.count - b[1].occur.count;
      } else {
        return a[1].occur - b[1].occur;
      }
    })

    return newArr.filter(function(item) {
      if (options && options.times) {
        return item[1].occur.count > 1
      } else {
        return item[1].occur > 2
      }
    });
  }

  var name = {};
  var word = {};
  var date = {};
  var phrase = {};
  var times = {};

  var dayCount = {};

  var namesList = [];
  var wordList = [];
  var phraseList = [];

  message.map(function(element, idx) {
    if (element.childNodes.length == 0) return; 
    var timestamp = time[idx].childNodes[0].rawText;
    var userName = user[idx].childNodes[0].rawText;

    if (userName === 'Jack Hanford') {
      return;
    }

    if (!times[timestamp]) {
      times[timestamp] = {
        count: 0
      };
    }

    if (!times[timestamp][userName]) {
      times[timestamp][userName] = {
        messages: 0
      };
    }

    times[timestamp].count++;
    times[timestamp][userName].messages++;

    if (element.childNodes && element.childNodes[0].rawText) {
      var text = element.childNodes.pop().rawText.toLowerCase();
      var sentimentRating = sentiment(text);
      var charCheck = text.split(' ');
      if (charCheck.length > 1){
        phrase[text] ? phrase[text] ++ : phrase[text] = 1;
      }

      var eachWordArray = text.split(' ');
      eachWordArray.map(function(item) {
        word[item] ? word[item] ++ : word[item] = 1;
      })
    }

    console.log(idx + ' out of ' + message.length + ' messages');
  })

  user.map(function(element) {
    var currName = element.childNodes.pop().rawText;
    name[currName] ? name[currName] ++ : name[currName] = 1;
  })

  phraseList = bringTogether(phrase, {sentiment: true});
  wordList = bringTogether(word);
  namesList = bringTogether(name);
  timesList = bringTogether(times, {times: true});

  timesList.map(function(element) {
    var frequency = 0;
    var day = element[0].split(',')[0];

    dayCount[day] ? dayCount[day] ++ : dayCount[day] = 1;
  });

  // var data = JSON.stringify({ 'Phrases': phraseList, 'Words': wordList, 'Names': namesList }, null, 2);
  var data = JSON.stringify({
    'Words': wordList,
    'Phrases': phraseList,
    'Names': namesList,
    'Timestamps': timesList,
    'Days': dayCount
  })
  fs.writeFile('data.json', data, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });


})
