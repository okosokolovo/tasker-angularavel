(function(){
  var feladat = function($timeout) {
    return {
      restrict: 'A',
      scope: {
        task: '=',
        taskovano: '&',
        taskovanje: '&',
        validacijaimena: '&',
        goback: '&',
        importancies: '=',
        types: '=',
      },
      // templateUrl: 'templates/tasksubtasks/feladat.html',
      templateUrl: 'tasksubtasks/feladat.html',
      link: function(scope, elem, attrs) {
        $timeout(function() {
          elem.show();
        }, 100);
      }
    };
  };
  feladat.$inject = ['$timeout'];
  angular.module('tasksubtasks.directives').directive('feladat', feladat);
})();