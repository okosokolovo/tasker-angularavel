(function(){
  angular.module('tasker.common')
    .filter('paginacija', function() {     // ala 'startFrom'
      return function(input, start) {         // input = tagfiltrirano, start = curPg*pgSize
        start = +start;   //parse to int (unary '+')
        if (input) {
         return input.slice(start);
        }
      };
    });
})();