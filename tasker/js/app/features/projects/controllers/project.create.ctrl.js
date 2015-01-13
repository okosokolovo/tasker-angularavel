(function(){
  var ProjectCreateCtrl = function($rootScope, $scope, $state, ProjectService) {
    // console.log('ProjectCreateCtrl');
    $scope.newproject = {};

    $scope.create = function() {
      var newprojectdata = $scope.newproject;
      newprojectdata.client_id = $rootScope.current.clientId;
      var createdproject = ProjectService.addProject(newprojectdata);
      createdproject.then(function(ujproject) {
        //console.log(ujproject);
        $state.go('projects.clientprojects');
      }, function(err) {
        console.log(err);
      });
    };

    $scope.cancel = function() {
      $state.go($rootScope.preprojcreate);
    };
  };
  ProjectCreateCtrl.$inject = ['$rootScope', '$scope', '$state', 'ProjectService'];
  angular.module('projects.controllers').controller('ProjectCreateCtrl', ProjectCreateCtrl);
})();