var fs = require('fs');
var HTMLParser = require('fast-html-parser');

fs.readFile('./data/messages.htm', function(err, content) {
  if (err) throw err;

  var name = {};
  var word = {};
  var phrase = {};

  var namesList = [];
  var wordList = [];
  var phraseList = [];

  var root = HTMLParser.parse(content.toString());
  var user = root.querySelectorAll('.user');
  var message = root.querySelectorAll('p');

  var bringTogether = function (dict) {
    var newArr = [];

    for (var item in dict)
      newArr.push([item, dict[item]])

    console.log(newArr);

    newArr.sort(function(a, b) {
      return a[1] - b[1]
    })

    return newArr;
  }

  message.map(function(element, idx) {
    if (element.childNodes.length == 0) return;

    if (element.childNodes && element.childNodes[0].rawText) {
      var text = element.childNodes.pop().rawText.toLowerCase();
      phrase[text] ? phrase[text] ++ : phrase[text] = 1;

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

  phraseList = bringTogether(phrase);
  wordList = bringTogether(word);
  namesList = bringTogether(name);

  console.log(wordList)


})
