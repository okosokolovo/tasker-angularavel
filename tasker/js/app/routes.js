(function(){
  angular.module('tasker')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('home', {
        url: '/',
        data: { public: true}
      })
      .state('about', {
        url:'/about',
        templateUrl: 'templates/about.html',
        controller: function($scope) {
          var pg = {
          title: 'Just Use Your Head!',
          msg: 'Not hitting it against the wall, but to do job and solve tasks intelligently.',
          act: 'Learn more...',
          };
          $scope.pg = pg;
        },
        data: { public: true}
      })
      .state('more', {
        url:'/moreabout',
        templateUrl: 'templates/more.html',
        controller: function($scope) {
          var pg = {
          title: 'There is always A solution at the table!',
          msg: 'But first you need to start working.',
          act: 'Continue using your head...',
          };
          $scope.pg = pg;
        },
        data: { public: true}
      })

      .state('zoclogin', {
        onEnter: ['$rootScope', '$state', '$sessionStorage', 'SessionService', 'AuthService',
          function($rootScope, $state, $sessionStorage, SessionService, AuthService) {
            $sessionStorage.authenticUser = $rootScope.loggedInUser;
            if ($rootScope.zocial == 'ggl') {
              $rootScope.$broadcast('ggl-signin-siker');
            }
            if ($rootScope.zocial == 'fb') {
              $rootScope.$broadcast('fb-signin-siker');
            }
            if ($rootScope.zocial == 'git') {
              $rootScope.$broadcast('git-signin-siker');
            }
            if ($rootScope.zocial == 'twt') {
              $rootScope.$broadcast('twt-signin-siker');
            }
            $state.go('home');
        }]
      })

      .state('client', {
        abstract: true,
        url: '/client',
        template: '<ui-view/>'
      })
      .state('client.create', {
        url: '/create',
        controller: 'ClientCreateCtrl'
      })

      .state('project', {
        abstract: true,
        url: '/project',
        views: {
          'abs@': {
            template: '<ui-view/>'
          }
        }
      })
      .state('project.create', {
        url: '/create',
        // templateUrl: 'templates/projects/create-project.html',
        templateUrl: 'projects/create-project.html',
        controller: 'ProjectCreateCtrl',
        onEnter: ['$rootScope', '$state', function($rootScope, $state) {
          $rootScope.preprojcreate = $state.current.name;
          // console.log($rootScope.preprojcreate);
        }]
      })

      .state('projects', {
        abstract: true,
        url:'/projects',
        views: {
          'projects@': {
            template: '<div ui-view="projects-list"></div>'
          }
        }
      })
      .state('projects.clientprojects', {
        url:'/clientprojects',
        //templateUrl: 'templates/projects/projectsstate.html',
        views: {
          'projects-list': {
            // templateUrl: 'templates/projects/projects-state.html'
            templateUrl: 'projects/projects-state.html'
          },
          'abs@': {
            template: '<div ui-view="project-tasks"></div>'
          }
        },
        controller: 'ClientProjectsCtrl'
      })
      .state('projects.clientprojects.tasks', {
        url: '/:projectId/tasks',
        views: {
          'project-tasks': {
            // templateUrl: 'templates/tasksubtasks/tasks-state.html'
            templateUrl: 'tasksubtasks/tasks-state.html'
          }
        },
        resolve: {
          projectId: ['$stateParams', function($stateParams) {
            return {pId: $stateParams.projectId};
          }]
        },
        controller: 'ProjectTasksCtrl',
        onExit: ['$rootScope', function($rootScope) {
          $rootScope.taskslist = false;
        }]
      })
      .state('projects.clientprojects.tasks.editask', {
        url:'/:slug',
        // templateUrl: 'templates/tasksubtasks/editask.html',
        templateUrl: 'tasksubtasks/editask.html',
        resolve: {
          anyag: ['$timeout', '$stateParams', 'TaskService', function($timeout, $stateParams, TaskService) {
            var feladat = TaskService.getEditask();
            return {task: feladat};
          }]
        },
        controller: 'TaskEditCtrl',
        onEnter: ['$rootScope', '$location', '$state', '$stateParams', 'Slug', 'anyag', function($rootScope, $location, $state, $stateParams, Slug, anyag) {
          $rootScope.taskslist = false;
          if (($stateParams.slug == 'new-task')&&(anyag.task.name !== '')) {
            var newname = Slug.slugify(anyag.task.name);
            $location.path($state.$current.url.segments[0]+$stateParams.projectId+
                        $state.$current.url.segments[1]+'/'+newname).replace();
          }
        }],
        onExit: ['$rootScope', function($rootScope) {
          $rootScope.taskslist = true;
        }]
      })

      .state('projects.userprojects', {
        url:'/userprojects',
        //templateUrl: 'LL4/public/templates/projects/projectsstate.html',
        views: {
          'projects-list': {
            // templateUrl: 'templates/projects/projects-state.html'
            templateUrl: 'projects/projects-state.html'
          },
          'abs@': {
            template: '<div ui-view="project-tasks"></div>'
          }
        },
        controller: 'UserProjectsCtrl'
      })
      .state('projects.userprojects.tasks', {
        url: '/:projectId/tasks',
        //templateUrl: 'LL4/public/templates/tasks/tasksstate.html',
        views: {
          'project-tasks': {
            // templateUrl: 'templates/tasksubtasks/tasks-state.html'
            templateUrl: 'tasksubtasks/tasks-state.html'
          }
        },
        resolve: {
          projectId: ['$stateParams', function($stateParams) {
            return { pId: $stateParams.projectId};
          }]
        },
        controller: 'ProjectTasksCtrl',
        onExit: ['$rootScope', function($rootScope) {
          $rootScope.taskslist = false;
        }]
      })
      .state('projects.userprojects.tasks.editask', {
        url:'/:slug',
        // templateUrl: 'templates/tasksubtasks/editask.html',
        templateUrl: 'tasksubtasks/editask.html',
        resolve: {
          anyag: ['$timeout', '$stateParams', 'TaskService', function($timeout, $stateParams, TaskService) {
            var feladat = TaskService.getEditask();
            return {task: feladat};
          }]
        },
        controller: 'TaskEditCtrl',
        onEnter: ['$rootScope', '$location', '$state', '$stateParams', 'Slug', 'anyag',  function($rootScope, $location, $state, $stateParams, Slug, anyag) {
          $rootScope.taskslist = false;
          if (($stateParams.slug == 'new-task')&&(anyag.task.name !== '')) {
            var newname = Slug.slugify(anyag.task.name);
            $location.path($state.$current.url.segments[0]+$stateParams.projectId+
                        $state.$current.url.segments[1]+'/'+newname).replace();
          }
        }],
        onExit: ['$rootScope', function($rootScope) {
          $rootScope.taskslist = true;
        }]
      });

      //.state();
    }]);
})();