angular.module('fbDataApp')
  .directive('dictionary', function() {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'assets/js/templates/dictionary.html',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.value, function (wordList) {
        if (!wordList) {
          return;
        }

        var wordCount = [];

        for (var word in wordList) {
          if (wordList[word] > 200 && word.length > 0) {
            var commonWords = {
              'text': word,
              'count': wordList[word]
            };
            wordCount.push(commonWords)
          }
        }

        wordCount.sort(function(a, b) {
          return a.count - b.count
        });

        scope.words = wordCount.reverse().slice(0, 40);

      });
    }
  }
})