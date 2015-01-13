(function(){
  angular.module('users.services').factory('AuthService',
    ['$rootScope',
     '$http',
     '$sanitize',
     '$state',
     '$sessionStorage',
     'Restangular',
     'SessionService',
     'AlertService',
    function($rootScope, $http, $sanitize, $state, $sessionStorage, Restangular, SessionService, AlertService) {

      var cacheSession   = function() {
        SessionService.set('authenticated', true);
        // console.log('session cached');
      };

      var uncacheSession = function() {
        SessionService.unset('authenticated');
      };

      var credsError = function(response) {
        AlertService.add('danger', 'Invalid credentials !');
      };

      var sanitizeLoginForm = function(credentials) {
        //debugger;
        return {
          email: $sanitize(credentials.email),
          password: $sanitize(credentials.password)
          //csrf_token: CSRF_TOKEN
        };
      };

      var sanitizeRegisterForm = function(user) {
        //debugger;
        return {
          username: $sanitize(user.uname),
          email: $sanitize(user.email),
          password: $sanitize(user.pwd),
          password_confirmation: $sanitize(user.pwd_confirm)  // confide
          //csrf_token: CSRF_TOKEN
        };
      };

      var sanitizeEditForm = function(user) {
        return {
          avatar: $sanitize(user.avatar),
          email: $sanitize(user.email),
          password: $sanitize(user.pwd),
          password_confirmation: $sanitize(user.pwd_confirm)  // confide
          //csrf_token: CSRF_TOKEN
        };
      };

      return {
        login: function(credentials) {
          //console.log(credentials);
          var login = $http.post('login', sanitizeLoginForm(credentials));
          login.success(cacheSession);
          login.error(credsError);
          return login;
        },
        zocLogin: function(bruttoUser) {
          cacheSession();
          // console.log(bruttoUser);
          $rootScope.loggedInUser = bruttoUser;
          $rootScope.loggedIn = true;
          $rootScope.zocial = bruttoUser.zoc;
          $state.go('zoclogin');
        },
        logout: function() {
          var logout = $http.get('logout');
          logout.success(uncacheSession);
          return logout;
        },
        isLoggedIn: function() {
          return SessionService.get('authenticated');
        },
        register: function(user) {
          if (SessionService.get('flash')) {
            SessionService.unset('flash');
          }
          // var register = Restangular.all('users').post(sanitizeRegisterForm(user));
          var register = Restangular.all('juzers').post(sanitizeRegisterForm(user));
          register.then(function(postedUser) {
            if (postedUser.flash) {
              console.log(postedUser.flash);
              SessionService.set('flash', postedUser.flash);
            }
          }, function(response) {
            console.log('err status code', response.status);
            console.log(response);
          });
          return register;
        },
        update: function(user) {
          if (SessionService.get('flash')) {
            SessionService.unset('flash');
          }
          // var azsuracija = Restangular.one('users', user.id).patch(sanitizeEditForm(user));
          var azsuracija = Restangular.one('juzers', user.id).patch(sanitizeEditForm(user));
          azsuracija.then(function(updatedUser) {
            // console.log(updatedUser);
            if (updatedUser.flash) {
              console.log(updatedUser.flash);
              SessionService.set('flash', updatedUser.flash);
            } else {        //renew $sessionStorage authenticUser
              $sessionStorage.authenticUser = updatedUser;
              $rootScope.loggedInUser = updatedUser;
            }
          }, function(response) {
            console.log('err status code', response.status);
            console.log(response);
          });
          return azsuracija;
        }
      };
    }]);
})();