(function(){
  SetEditTaskCtrl.$inject = ['$scope', '$state', 'TaskService'];
  function SetEditTaskCtrl($scope, $state, TaskService) {
    // console.log('SetEditTaskCtrl');
    $scope.seteditask = function(task) {
      TaskService.setEditask(task);
      if ($state.current.name == 'projects.clientprojects.tasks') {
        $state.go('projects.clientprojects.tasks.editask', {slug: task.slag});
      } else {
        $state.go('projects.userprojects.tasks.editask', {slug: task.slag});
      }
    };
  }
  angular.module('tasksubtasks.controllers').controller('SetEditTaskCtrl', SetEditTaskCtrl);
})();