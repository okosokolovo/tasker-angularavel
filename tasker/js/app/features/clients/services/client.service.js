(function(){
  var ClientService = function(Restangular) {
    return {
      getClients: function() {
        //return Restangular.all('clients').getList();        // promise
        return Restangular.all('clients').getList().$object;  // restangular >=1.2
      },
      getJuzerClients: function(juzer_id) {
      //return Restangular.one('juzer_clients', juzer_id).getList();
      return Restangular.one('juzer_clients', juzer_id).getList().$object;
      },
      client: function(client_id) {
        return Restangular.one('clients', client_id); //promise
      },
      addClient: function(newclient) {
        //console.log('creating client');
        return Restangular.all('clients').post(newclient);
      },
      delClient: function() {
        //
      }
    };
  };
  ClientService.$inject = ['Restangular'];
  angular.module('clients.services').factory('ClientService', ClientService);
})();