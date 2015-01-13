(function(){
  ProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService'];
  function ProjectsCtrl($rootScope, $scope, ProjectService) {
    // console.log('ProjectsCtrl');

    $scope.deleteProject = function(client_id, project_id) {
      if (confirm('Areyousure to delete entire project !?')) {
        $rootScope.loading = true;
        ProjectService.delProject(client_id, project_id)
          .then(function(deleted) {
            // console.log(deleted);
            $rootScope.loading = false;
          }, function(response) {
            console.log(response);
            $rootScope.loading = false;
          });
      }
    };
  }
  angular.module('projects.controllers').controller('ProjectsCtrl', ProjectsCtrl);
})();