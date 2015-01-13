(function(){
  TaskEditCtrl.$inject = ['$scope', 'TaskService', 'AlertService', 'anyag', 'Slug', '$state', '$rootScope', '$sessionStorage', '$timeout', '$q'];
  function TaskEditCtrl($scope, TaskService, AlertService, anyag, Slug, $state, $rootScope, $sessionStorage, $timeout, $q) {
    // console.log('TaskEditCtrl');

    $rootScope.taskslist = false;
    $scope.task = anyag.task;
    $scope.tartalek = angular.copy(anyag.task);
    $scope.task.completed = !!anyag.task.completed;

    $scope.importancies = [             // separate values service ?
      { val: 1, text: 'important' },
      { val: 0, text: 'not so important'}
    ];

    $scope.types = [
      {val: 'feature', type: 'feature'},
      {val: 'bug', type: 'bug'},
      {val: 'other', type: 'other'}
    ];

    $scope.taskovanje = function(task) {
      var deferred = $q.defer();
      $timeout(function() {
        var ret = TaskService.updateTask(task);
        ret.then(function(response) {
          if(!response.flash) {
            deferred.resolve(true);
          } else {
            AlertService.add('danger', 'No Authorisation !!');
            deferred.reject('nemere');
          }
        }, 600);
      });
      deferred.promise.then(function() {
        console.log(arguments);
      }, function() {
        console.log(arguments);
      });
      return deferred.promise;
    };

    $scope.taskovano = function(task) {
      if (($scope.tartalek.completed === 0)&&($scope.task.completed === true)) {
        $scope.task.completed_by = $rootScope.loggedInUser.id;
        task.completed_by = $rootScope.loggedInUser.id;
      }
      var deferred = $q.defer();
      $timeout(function() {
        var ret = TaskService.updateTask(task);
        ret.then(function(task) {
          if(!task.errors) {
            $scope.task.slag = Slug.slugify(task.name);
            //if $scope.task.ujtask
              $scope.task.ujtask = false; // null?
              //+ url tweak - onEnter
            deferred.resolve(true);
          } else {
            //console.log($scope.tartalek);
            $scope.task = angular.copy($scope.tartalek);
            angular.forEach($scope.$parent.tasks, function(task) {
              if (task.id == $scope.tartalek.id) {
                $scope.indeks = $scope.$parent.tasks.indexOf(task);
              }
            });
            $scope.$parent.tasks[$scope.indeks] = angular.copy($scope.tartalek);
            $scope.$$childHead.taskAc.$setError(Object.keys(task.errors)[0], task.errors[Object.keys(task.errors)[0]][0]);
            AlertService.add('danger', 'Data Not Valid !!');
            deferred.reject('nemere');
          }
        }, 500);
      });
      deferred.promise.then(function() {
        console.log(arguments);
      }, function() {
        console.log(arguments);
      });
      return deferred.promise;
    };

    $scope.validacijaimena = function(data) {   // pl onbeforesave, obrazAc child elem
      console.log('validacija imena');
      return true;
      //return 'nemere gyk';  //ok, submit cancel
    };

    $scope.goback = function() {
      if ($scope.task.ujtask) {
        $scope.$parent.tasks.splice($scope.indeks, 1);
        TaskService.delUjTask($scope.task.project_id, $scope.task.id)
          .then(function(deleted) {
            //AlertService.add('info', deleted.flash);
            console.log(deleted.flash);
          });
      }
      //console.log('back');
      $state.go('^');
    };
  }
  angular.module('tasksubtasks.controllers').controller('TaskEditCtrl', TaskEditCtrl);
})();