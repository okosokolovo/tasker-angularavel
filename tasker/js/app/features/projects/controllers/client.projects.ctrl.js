(function(){
  ClientProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService', 'AlertService'];
  function ClientProjectsCtrl($rootScope, $scope, ProjectService, AlertService) {
    // console.log('ClientProjectsCtrl');
    $scope.init = function() {
      $rootScope.loading = true;
      $scope.pg = {};
      ProjectService.getClientProjects($rootScope.current.clientId)
          .then(function(projects) {
            $rootScope.loading = false;
            if (!(projects.flash)) {
              $scope.projects = projects;
              // console.log(projects);
            } else {    // projects = null
              $scope.projects = [];
              // AlertService.add('warning', 'no projects yet!', 2000);
              AlertService.add('warning', 'no projects yet!');
            }
          });
    };
    var pg = {
      title: 'projects of selected client:',
      flag: 'client projects'
    };

    $scope.init();
    $scope.pg = pg;
  }
  angular.module('projects.controllers').controller('ClientProjectsCtrl', ClientProjectsCtrl);
})();