(function(){
  UserProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService', 'AlertService'];
  function UserProjectsCtrl($rootScope, $scope, ProjectService, AlertService) {
    // console.log('UserProjectsCtrl');
    $scope.init = function() {
      $rootScope.loading = true;
      $scope.pg = {};
      ProjectService.getJuzerProjects($rootScope.loggedInUser.id)
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
      title: 'my projects:',
      flag: 'user projects'
    };

    $scope.init();
    $scope.pg = pg;
  }
  angular.module('projects.controllers').controller('UserProjectsCtrl', UserProjectsCtrl);
})();