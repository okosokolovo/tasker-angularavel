(function(){
  angular.module('users.directives').directive('getBruttoUser', ['AuthService', function(AuthService) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        if (element.text().length > 0) {
            // console.log(JSON.parse(element.text()).zoc);
            AuthService.zocLogin(JSON.parse(element.text()));
            element.text('');
        }
      }
    };
  }]);
})();