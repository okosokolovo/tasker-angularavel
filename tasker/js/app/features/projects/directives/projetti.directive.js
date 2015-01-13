(function(){
  var projetti = function($timeout) {
    return {
      restrict: 'A',
      scope: {
        projects: '=',
      },
      // templateUrl: 'templates/projects/projects.html',
      templateUrl: 'projects/projects.html',
      link: function(scope, elem, attrs) {
        $timeout(function() {
          elem.show();
        }, 100);
      }
    };
  };
  projetti.$inject = ['$timeout'];
  angular.module('projects.directives').directive('projetti', projetti);
})();