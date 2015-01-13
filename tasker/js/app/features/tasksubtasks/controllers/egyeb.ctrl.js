(function(){
  EgyebCtrl.$inject = ['$scope', '$state', 'SubtaskService'];
  function EgyebCtrl($scope, $state, SubtaskService) {
    // console.log('EgyebCtrl');
    $scope.setsubtasks = function(subtasks) {
       SubtaskService.setSubtasks(subtasks);
      if ($state.current.name == 'projects.clientprojects.tasks.editask') {
        $state.go('projects.clientprojects.tasks.editask.subtasks');
      } else {
        $state.go('projects.userprojects.tasks.editask.subtasks');
      }
    };
    $scope.setcomments = function(comments) {
      //
    };
  }
  angular.module('tasksubtasks.controllers').controller('EgyebCtrl', EgyebCtrl);
})();