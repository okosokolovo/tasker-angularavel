(function(){
  angular.module('tasksubtasks.directives').directive('taski', ['$filter', '$timeout', function($filter, $timeout) {
    return {
      restrict: 'A',
      scope: {
        tasks: '=',
        subtaskovi: '&',
        taskslist: '=',
        addtask: '&',
      },
      // templateUrl: 'templates/tasksubtasks/tasksubtasx.html',
      templateUrl: 'tasksubtasks/tasksubtasx.html',
      link: function(scope, elem, attrs) {
        scope.curPg = 0;
        scope.pgSize = 5;
        scope.totPgs = function() {
          if (scope.tagfiltrirano) {
            return Math.ceil(scope.tagfiltrirano.length/scope.pgSize);
          }
        };
        $timeout(function() {
          elem.show();
        }, 100);

        scope.tagfiltre = function(task) {
          if(scope.keres === undefined || scope.keres.length === 0) {
            return true;
          }
          var imatag = false;
          angular.forEach(task.tags, function(tag) {
            if (tag.name.toLowerCase().indexOf(scope.keres.toLowerCase()) >= 0) {
              imatag = true;
            }
          });
          angular.forEach(task.subtasks, function(subtask) {
            angular.forEach(subtask.tags, function(tag) {
              if (tag.name.toLowerCase().indexOf(scope.keres.toLowerCase()) >= 0) {
              imatag = true;
            }
            });
          });
          return imatag;
        };
      }
    };
  }]);
})();