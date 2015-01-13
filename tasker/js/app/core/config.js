(function(){
  angular.module('tasker.core')
    .config(['$locationProvider', function($locationProvider) {
      $locationProvider.html5Mode(true);
    }])
    .config(['$httpProvider', function($httpProvider) {   //cors
      $httpProvider.defaults.useXDomains = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
    .config(['$sceDelegateProvider', function($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://api.twitter.com/**',
        'https://www.facebook.com/**']);
    }])
    .config(['RestangularProvider', function(RestangularProvider) {
      RestangularProvider.setBaseUrl('/');

      RestangularProvider.setDefaultHeaders({
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        //'X-CSRF-token': $('meta[name="token"]').attr('content')
      });

      RestangularProvider.setMethodOverriders(["put", "patch"]);

      RestangularProvider.addResponseInterceptor(function(response, operation) {
            if(operation == 'post') {
              return response;
            }
            var resp_ops = ['patch', 'get'];
            if((resp_ops.indexOf(operation) != -1) || response.flash) {
              return response;
            }
            if (operation === 'getList') {
              if (response.flash) {
                return response;
              } else {
                return _.values(response);
              }
            }
            return response;
      });
    }]);

  angular.module('tasker.core')
    .run(function($rootScope, $http, $state, $stateParams, editableOptions) {

      $rootScope.data = {};

      var current = {
          clientId: null,
          projectId: null,
          taskId: null,
          selectedClientName: ''
        };

      $rootScope.current = current;

      editableOptions.theme = 'bs3';

      //ui-router:
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        if ((!$rootScope.loggedIn) && ((toState.data === undefined) || (toState.data.public === undefined))) {
          //console.log(toState);
          e.preventDefault();
          $state.go('home');
        }
      });

    })
    .$inject = ['$rootScope', '$http', '$state', '$stateParams', 'editableOptions'];
})();