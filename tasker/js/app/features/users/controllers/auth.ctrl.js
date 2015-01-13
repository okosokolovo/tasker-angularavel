(function(){
  var AuthCtrl = function ($rootScope, $scope, $state, $window, $location, $http, $q, $timeout, $sessionStorage, AuthService, AlertService, SessionService) {
    // console.log('AuthCtrl');
    $scope.user = {};
    $scope.errors = {};
    $scope.data = {};

    $scope.isAuthentic = function() {
      if ($sessionStorage.hasOwnProperty('authenticUser')) {
        $scope.loggedInUser = $sessionStorage.authenticUser;
      }
    };

    //window.scope = $scope;    // scope.csrf_token (dev tools console check)

    $scope.login = function() {
      _clearErrs();
      return AuthService.login($scope.user)
        .success(function(data) {
          //console.log(data);
          $scope.loggedIn = AuthService.isLoggedIn();
          $scope.loggedInUser = data;
          $rootScope.loggedIn = $scope.loggedIn;
          $rootScope.loggedInUser = $scope.loggedInUser;
          $sessionStorage.authenticUser = data;
        })
        .error(_hibas);
    };

    $scope.register = function() {
      _clearErrs();
      if ( $scope.user.pwd !== $scope.user.pwd_confirm ) {
        _addErr('pwd', 'password confirm err');
        _addErr('pwd_confirm', 'password confirm err');
      }
      if ( $scope.user.pwd.length < 6 ) {
        _addErr('pwd', 'minimum 6 characters');
      }

      if ( Object.keys($scope.errors).length === 0 ) {
        var registracija = AuthService.register($scope.user);
        return registracija;

      } else {
        return false;
      }

    };

    $scope.update = function() {
      _clearErrs();
      if ( $scope.loggedInUser.pwd !== $scope.loggedInUser.pwd_confirm ) {
        _addErr('pwd', 'password confirm err');
        _addErr('pwd_confirm', 'password confirm err');
      }
      if ( $scope.loggedInUser.pwd.length < 6 ) {
        _addErr('pwd', 'minimum 6 characters');
      }

      if ( Object.keys($scope.errors).length === 0 ) {
        $scope.loggedInUser.avatar = $rootScope.data.avatar;
        // console.log($scope.loggedInUser.avatar);

        var azsuracija = AuthService.update($scope.loggedInUser);
        return azsuracija;

      } else {
        return false;
      }
    };

    $scope.logout = function() {
      return AuthService.logout()
        .success(function() {
          $scope.loggedIn = AuthService.isLoggedIn();
          $rootScope.loggedIn = $scope.loggedIn;
          $scope.loggedInUser = {};
          $rootScope.loggedInUser = {};
          $rootScope.current = {
            clientId: null,
            projectId: null,
            taskId: null,
            selectedClientName: ''
          };
          angular.element(document.querySelector('#av')).removeAttr('src');
          delete $sessionStorage.authenticUser;
          delete $sessionStorage.current;
          $state.go('home');
        });
    };

    $scope.clear = function() {   // 'cancel'
      _clearUsr();
      _clearErrs();
    };

    $scope.gitlogin = function() {
      $rootScope.zocial = '';
      var git = $http.get('git');
      git.then(function(data) {
        $scope.cbViaRedirect(data.data);
      }, function(error) {
        $rootScope.$broadcast('git-signin-hiba');
      });
    };

    $scope.twtlogin = function() {
      $rootScope.zocial = '';
      var twt = $http.get('twt');
      twt.then(function(data) {
        // console.log(data);
        $scope.cbViaRedirect(data.data);
      }, function(error) {
        $rootScope.$broadcast('twt-signin-hiba');
      });
    };

    $scope.fblogin = function() {
      $rootScope.zocial = '';
      var fb = $http.get('fb');
      fb.then(function(data) {
        //console.log($user);
        $scope.cbViaRedirect(data.data);
      }, function(error) {
        $rootScope.$broadcast('fb-signin-hiba');
      });
    };

    $scope.cbViaRedirect = function(url) {
      $window.location.href = url;          // return to zoc login url
    };

    $scope.getBruttoUser = function(bruttoUser) {
      // console.log(bruttoUser);
      $rootScope.loggedInUser = bruttoUser;
      $rootScope.loggedIn = true;
      $rootScope.zocial = 'fb';
      $location.path('/').replace();
      //$location.path($location.host()).replace();
      $state.go('zoclogin');
    };

    $scope.gglButtonRender = function() {
      gapi.signin.render('signinButton', {
        'clientid': 'GAE-app-clientid-here',
        'callback': $scope.gglSigninCallback,
        'scope': 'profile email',
        'cookiepolicy': 'single_host_origin',
        'width': 'wide'
      });
      // console.log('ggl button render');
    };

    $scope.gglSigninCallback = function(authResult) {
      $scope.$apply(function() {
        $scope.processAuth(authResult);
      });
    };

    $scope.processAuth = function(authResult) {
      $rootScope.zocial = '';
      if (authResult) {
        if(authResult['error'] === undefined) {     // pl authResult['status']['signed_in']
          // console.log(authResult['status']);

          gapi.auth.setToken(authResult); // store returned token - automatically !?

          gapi.client.load('oauth2', 'v2', function() {
            var request = gapi.client.oauth2.userinfo.get();
            request.execute($scope.getUserinfoCallback);
          });
        } else {
          console.log(authResult['error']);
          $rootScope.$broadcast('ggl-signin-hiba', authResult['error']);
        }
      } else {
        $rootScope.$broadcast('ggl-signin-hiba');
      }
    };

    $scope.getUserinfoCallback = function(user) {
      $scope.$apply(function() {
        $scope.processUserInfo(user);
      });
    };

    $scope.processUserInfo = function(user) {
      // console.log(user.result);
      var authres = gapi.auth.getToken();
      var ggloggedIn = $http.post('ggl', {
        user: user.result,
        token: authres.access_token
      });
      ggloggedIn.success(function(data) {
        SessionService.set('authenticated', true);  //cacheSession()
        $rootScope.loggedInUser = data;
        $rootScope.loggedIn = true;
        $rootScope.zocial = 'ggl';
        $state.go('zoclogin');
      });
      ggloggedIn.error(function(data) {
        $rootScope.$broadcast('ggl-signin-hiba', data);
      });
    };

    $scope.$on('ggl-signin-hiba', function(event, hiba) {
      if (hiba && (hiba !== 'immediate_failed')) {
        // AlertService.add('error', 'ggl zocial login hiba: ' + hiba, 3000);
        AlertService.add('danger', 'ggl zocial login hiba: ' + hiba);
      }
    });

    $scope.$on('ggl-signin-siker', function() {
      // AlertService.add('success', 'Logged in with Google!', 3000);
      AlertService.add('success', 'Logged in with Google!');
      AlertService.add('warning', 'temporary password was set, pls update user profile!');
    });

    $scope.$on('fb-signin-hiba', function(event) {
      // AlertService.add('error', 'fb zocial login hiba!', 3000);
      AlertService.add('danger', 'fb zocial login hiba!');
    });

    $scope.$on('fb-signin-siker', function() {
      // AlertService.add('success', 'Logged in with Facebook!', 3000);
      AlertService.add('success', 'Logged in with Facebook!');
      AlertService.add('warning', 'temporary password was set, pls update user profile!');
    });

    $scope.$on('git-signin-hiba', function(event) {
      // AlertService.add('error', 'git zocial login hiba!', 3000);
      AlertService.add('danger', 'git zocial login hiba!');
    });

    $scope.$on('git-signin-siker', function() {
      // AlertService.add('success', 'Logged in with GitHub!', 3000);
      AlertService.add('success', 'Logged in with GitHub!');
      AlertService.add('warning', 'temporary password was set, pls update user profile!');
    });

    $scope.$on('twt-signin-hiba', function(event) {
      // AlertService.add('error', 'twt zocial login hiba!', 3000);
      AlertService.add('danger', 'twt zocial login hiba!');
    });

    $scope.$on('twt-signin-siker', function() {
      // AlertService.add('success', 'Logged in with Twitter!', 3000);
      AlertService.add('success', 'Logged in with Twitter!');
      AlertService.add('warning', 'temporary email address / password was set, pls update user profile!');
    });

    function _addErr(field, msg) {
      $scope.errors[field] = msg;
    }

    function _clearErrs() {
      $scope.errors = null;
      $scope.errors = {};
    }

    function _clearUsr() {
      $scope.user = null;
      $scope.user = {};
    }

    function _hibas(response) {
      if (response.flash) {
        _addErr('extra', response.flash);
      }
    }

    $scope.indit = function() {
      $timeout(function() {
        $scope.gglButtonRender();
      }, 700);
    };

    $scope.indit();
  };
  AuthCtrl.$inject = ['$rootScope', '$scope', '$state', '$window', '$location', '$http', '$q', '$timeout', '$sessionStorage', 'AuthService', 'AlertService', 'SessionService'];
  angular.module('users.controllers').controller('AuthCtrl', AuthCtrl);
})();