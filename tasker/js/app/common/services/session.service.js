(function(){
  var SessionService = function() {
    return {
      get: function(key) {
        return sessionStorage.getItem(key);       // window.sessionStorage obj ! (html5)
      },
      set: function(key, val) {
        return sessionStorage.setItem(key, val);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      }
    };
  };

  angular.module('tasker.common').factory('SessionService', SessionService);
})();