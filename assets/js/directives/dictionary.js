angular.module('fbDataApp')
.directive('dictionary', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: 'assets/js/templates/dictionary.html',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.value, function(value) {
        if (!value) {
          return;
        }

        var wordCount = [];

        var dictionary = value;
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
        scope.words = wordCount.reverse().slice(0, 40);

      })
    }
  }
});
