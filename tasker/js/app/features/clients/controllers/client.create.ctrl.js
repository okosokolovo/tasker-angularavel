(function(){
  var ClientCreateCtrl = function($rootScope, $scope, $state, $modal, ClientService) {
    // console.log('ClientCreateCtrl');
    $scope.newclient = {};

    $scope.open = function() {
      var modalInstance = $modal.open({
        templateUrl: 'create-client-modal.html',    // t3r.blade.php
        resolve: {
          newclient: function() {
            return $scope.newclient;
          }
        },
        //controller: modalinstanceCtrl,
        controller: ['$scope', '$modalInstance', 'newclient', function($scope, $modalInstance, newclient) {
          $scope.newclient = newclient;
          $scope.cancel = function() {
            $scope.$dismiss('cancel');
            //$modalInstance.dismiss('cancel');
            $state.transitionTo('home');        // alt - fromState
          };
          $scope.create = function() {
            var ujclient = ClientService.addClient(newclient);
            ujclient.then(function(newclient) {
              ClientService.getJuzerClients($scope.loggedInUser.id).then(function(clients) {
                $rootScope.clients = clients;
              });
              //$rootScope.clients.push(newclient);
              $rootScope.current.clientId = newclient.id;
              $rootScope.current.selectedClientName = newclient.name;
            });
            $scope.$close(ujclient);  //$close(result)
            //$modalInstance.close(ujclient);
          };
        }],
        backdrop: false,
        keyboard: false
      });

      modalInstance.result.then(function(result) {
        if (result) {
          console.log(result);
          return $state.transitionTo('home');
        }
      });
    };
    $scope.open();
  };
  ClientCreateCtrl.$inject = ['$rootScope', '$scope', '$state', '$modal', 'ClientService'];
  angular.module('clients.controllers').controller('ClientCreateCtrl', ClientCreateCtrl);
})();