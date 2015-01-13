(function(){
  MainCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$sessionStorage', 'ClientService', 'AuthService', 'AlertService'];
  function MainCtrl($rootScope, $scope, $timeout, $sessionStorage, ClientService, AuthService, AlertService) {
    // console.log('MainCtrl');
    if (!AuthService.isLoggedIn() && angular.element(document.querySelector('#o-auth')).text().length === 0) {
      AlertService.add('warning', 'login perfavore, anche con buttoni socialli!');
    }

    $scope.initPg = function() {
      if ($sessionStorage.hasOwnProperty('authenticUser')) {
        $rootScope.loggedInUser = $sessionStorage.authenticUser;
        $rootScope.loggedIn = true;
      }

      if ($sessionStorage.hasOwnProperty('current')) {
        $rootScope.current = $sessionStorage.current;
      }
    };

    $scope.loadClients = function() {
      if (AuthService.isLoggedIn()) {
        if (!$rootScope.clients) {
          ClientService.getJuzerClients($rootScope.loggedInUser.id).then(function(clients) {
            $rootScope.clients = clients;
          });
        }
      } else {
        alert('pls login !');
        angular.element(document.querySelector('#longines')).triggerHandler('click');  //jqLite
      }
      $timeout(function() {
          //var selected = $('#client-select form div select option:first-of-type');
          var selected = angular.element(document.querySelector('#client-select form div select option:first-of-type'));
          selected.text('select client');
       }, 100);
    };

    $scope.setCurrentId = function(client) {
      //console.log(client.id);
      $rootScope.current.clientId = client.id;
      $rootScope.current.selectedClientName = client.name;

      $sessionStorage.current = $rootScope.current;
    };

  }
  angular.module('tasker.common').controller('MainCtrl', MainCtrl);
})();