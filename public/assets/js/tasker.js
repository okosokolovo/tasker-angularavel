/*! tasker - v - 20141124-1448 */
(function(){
  angular.module('tasker.common', []);
})();;(function(){
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
})();;(function(){
  var UploadCtrl = function ($rootScope, $scope, $upload) {
    // console.log('UploadCtrl');
    $scope.fileUploadObj = "TestString";

    $scope.onFileSelect = function($files) {
      $scope.upload = [];
      $scope.data = {};

      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
          var $file = $files[i];
          (function (index) {
              $scope.upload[index] = $upload.upload({
                  // url: "avatar",
                  url: "havatar",
                  method: "POST",
                  data: { fileUploadObj: $scope.fileUploadObj },
                  file: $file
              })
              .success(function (data) {
                  // file is uploaded successfully
                  // console.log(data);
                  $scope.data.avatar = data.avatar;
                  $rootScope.data.avatar = $scope.data.avatar;
                  // console.log($rootScope.data.avatar);
              }).error(function (data, status, headers, config) {
                  // file failed to upload
                  console.log(data);
              });
          })(i);
      }
    };
  };
  UploadCtrl.$inject = ['$rootScope', '$scope', '$upload'];
  angular.module('tasker.common').controller('UploadCtrl', UploadCtrl);
})();;(function(){
  angular.module('tasker.common')
    .filter('paginacija', function() {     // ala 'startFrom'
      return function(input, start) {         // input = tagfiltrirano, start = curPg*pgSize
        start = +start;   //parse to int (unary '+')
        if (input) {
         return input.slice(start);
        }
      };
    });
})();;(function(){
  angular.module('tasker.common').factory('AlertService', ['$rootScope', '$timeout', function($rootScope, $timeout) {

    var alertService = {};
    $rootScope.alerts = [];

    // alertService.add = function(type, msg, timeout) {
    alertService.add = function(type, msg) {
      $rootScope.alerts.push({
        type: type,
        msg: msg,
        close: function() {
          return alertService.closeAlert(this);
        }
      });
      // if (timeout) {
      //   $timeout(function() {
      //     alertService.closeAlert(this);
      //   }, timeout);
      // }
    };
    alertService.closeAlert = function(alert) {
      return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };
    alertService.closeAlertIdx = function(index) {
      return $rootScope.alerts.splice(index, 1);
    };

    return alertService;

  }]);
})();
;(function(){
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
})();;(function(){
  angular.module('tasker.common').factory('TagService', ['$sanitize', 'Restangular', function($sanitize, Restangular) {
    var Tags = Restangular.all('tags');
    var tagserv=  {
      getTags: function() {
        //return Tags.getList();
        return Tags.getList().$object;   // restangular >=1.2
      },
      addTag: function(tag_name, task_id, subtask_id) {
        var newTag = {
          name: $sanitize(tag_name),
          task_id: task_id ? taski_id : null,
          subtask_id: subtask_id ? subtask_id : null
        };
        return Tags.post(newtag);
      },
      delTag: function(id) {
        //
      }
    };
    return tagserv;
  }]);
})();;(function(){
  angular.module('tasker.common').directive('formModal', ['$http', '$compile', 'SessionService', function($http, $compile, SessionService) {

    return {
      scope: {
        formObject: '=',
        formErrors: '=',
        title: '@',
        template: '@',
        okButtonText: '@',
        formSubmit: '&',
        formClear: '&'
      },
      compile: function(element, cAtts){
        var template,
          $element,
          loader;
        loader = $http.get('templates/form_modal.html')
          .success(function(data) {
            template = data;
          });
        //return the Link function
        return function(scope, element, lAtts) {
          loader.then(function() {
            //compile templates/form_modal.html and wrap it in a jQuery object
            $element = $( $compile(template)(scope) );
          });
          //called by form_modal.html cancel button
          scope.close = function() {
            $element.modal('hide'); // TB-JS
            scope.formClear();
          };
          //called by form_modal.html form ng-submit
          scope.submit = function() {
            var result = scope.formSubmit();
            if (angular.isObject(result)) {
              result.then(function(response) {
                if (!response.flash) {
                  $element.modal('hide');
                  // console.log(response);
                  scope.formClear();
                } else {
                  scope.formErrors.extra = SessionService.get('flash');
                }
              });
              if (angular.isFunction(result.success)) {
                result.success(function(data) {
                // console.log(data);
              });
              }
            } else if (result === false) {
              //noop
            } else {
              $element.modal('hide');
            }
          };

          element.on('click', function(e) {
            e.preventDefault();
            $element.modal('show');
          });
        };
      }
    };

  }]);
})();;(function(){
  angular.module('clients.services', []);
})();;(function(){
  angular.module('clients.controllers', []);
})();;(function(){
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
})();;(function(){
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
})();;(function(){
  angular.module('clients.feature', ['clients.controllers', 'clients.services']);
})();;(function(){
  angular.module('projects.services', []);
})();;(function(){
  angular.module('projects.directives', []);
})();;(function(){
  angular.module('projects.controllers', []);
})();;(function(){
  // alt - DI ClientService
  angular.module('projects.services').factory('ProjectService', ['Restangular', function(Restangular) {
    //var Projects = Restangular.all('projects');
    var projserv =  {
      client: function(client_id) {
        return Restangular.one('clients', client_id);
      },
      getClientProjects: function(client_id) {                  // projects.clientprojects
        //return this.client(client_id).getList('projects');
        return this.client(client_id).getList('projects').$object;
      },
      getJuzerProjects: function(juzer_id) {                  // projects.userprojects
        //return Restangular.one('juzer_projects', juzer_id).getList();
        return Restangular.one('juzer_projects', juzer_id).getList().$object;
      },
      project: function(client_id, project_id) {
        return this.client(client_id).one('projects', project_id);
      },
      getProject: function(client_id, project_id) {
        return this.project(client_id, project_id).get();
      },
      addProject: function(data) {
        //console.log('creating project');
        return Restangular.all('projects').post(data);
      },
      delProject: function(client_id, project_id) {
        return this.client(client_id).one('projects', project_id).remove();
      }
    };
    return projserv;
  }]);
})();;(function(){
  var projetti = function($timeout) {
    return {
      restrict: 'A',
      scope: {
        projects: '=',
      },
      //templateUrl: 'templates/projects/projects.html',
      templateUrl: 'projects/projects.html',
      link: function(scope, elem, attrs) {
        $timeout(function() {
          elem.show();
        }, 100);
      }
    };
  };
  projetti.$inject = ['$timeout'];
  angular.module('projects.directives').directive('projetti', projetti);
})();;(function(){
  ProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService'];
  function ProjectsCtrl($rootScope, $scope, ProjectService) {
    // console.log('ProjectsCtrl');

    $scope.deleteProject = function(client_id, project_id) {
      if (confirm('Areyousure to delete entire project !?')) {
        $rootScope.loading = true;
        ProjectService.delProject(client_id, project_id)
          .then(function(deleted) {
            // console.log(deleted);
            $rootScope.loading = false;
          }, function(response) {
            console.log(response);
            $rootScope.loading = false;
          });
      }
    };
  }
  angular.module('projects.controllers').controller('ProjectsCtrl', ProjectsCtrl);
})();;(function(){
  ClientProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService', 'AlertService'];
  function ClientProjectsCtrl($rootScope, $scope, ProjectService, AlertService) {
    // console.log('ClientProjectsCtrl');
    $scope.init = function() {
      $rootScope.loading = true;
      $scope.pg = {};
      ProjectService.getClientProjects($rootScope.current.clientId)
          .then(function(projects) {
            $rootScope.loading = false;
            if (!(projects.flash)) {
              $scope.projects = projects;
              // console.log(projects);
            } else {    // projects = null
              $scope.projects = [];
              // AlertService.add('warning', 'no projects yet!', 2000);
              AlertService.add('warning', 'no projects yet!');
            }
          });
    };
    var pg = {
      title: 'projects of selected client:',
      flag: 'client projects'
    };

    $scope.init();
    $scope.pg = pg;
  }
  angular.module('projects.controllers').controller('ClientProjectsCtrl', ClientProjectsCtrl);
})();;(function(){
  UserProjectsCtrl.$inject = ['$rootScope', '$scope', 'ProjectService', 'AlertService'];
  function UserProjectsCtrl($rootScope, $scope, ProjectService, AlertService) {
    // console.log('UserProjectsCtrl');
    $scope.init = function() {
      $rootScope.loading = true;
      $scope.pg = {};
      ProjectService.getJuzerProjects($rootScope.loggedInUser.id)
          .then(function(projects) {
            $rootScope.loading = false;
            if (!(projects.flash)) {
                $scope.projects = projects;
                // console.log(projects);
            } else {    // projects = null
              $scope.projects = [];
              // AlertService.add('warning', 'no projects yet!', 2000);
              AlertService.add('warning', 'no projects yet!');
            }
          });
    };
    var pg = {
      title: 'my projects:',
      flag: 'user projects'
    };

    $scope.init();
    $scope.pg = pg;
  }
  angular.module('projects.controllers').controller('UserProjectsCtrl', UserProjectsCtrl);
})();;(function(){
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
})();;(function(){
  angular.module('projects.feature', ['projects.controllers', 'projects.directives', 'projects.services']);
})();;(function(){
  angular.module('tasksubtasks.services', []);
})();;(function(){
  angular.module('tasksubtasks.directives', []);
})();;(function(){
  angular.module('tasksubtasks.controllers', []);
})();;(function(){
  var SubtaskService = function($sanitize, $sessionStorage, TaskService) {
    var sanitizeEditSubtask = function(subtask) {
      return {
        name: $sanitize(subtask.name),
        importance: subtask.importance,
        due: subtask.due,
        completed: subtask.completed,
        description: $sanitize(subtask.description),
        completed_by: subtask.completed_by
      };
    };
    var subtaskserv = {
      updateSubtask: function(client_id, project_id, task_id, currentSubtask) {
        // console.log(currentSubtask);
        subtask = TaskService.task(client_id, project_id, task_id).one('subtasks', currentSubtask.id);
        return subtask.patch(sanitizeEditSubtask({
          name: currentSubtask.name,
          importance: currentSubtask.importance,
          due: currentSubtask.due,
          completed: currentSubtask.completed,
          description: currentSubtask.description,
          completed_by: currentSubtask.completed_by
        }));
      },
      addSubtask: function() {
        //
      },
      delSubtask: function() {
        //
      },
      setSubtasks: function(subtasks) {
        $sessionStorage.subtasks = subtasks;
      },
      getSubtasks: function() {
        if ($sessionStorage.hasOwnProperty('subtasks')) {
          return $sessionStorage.subtasks;
        }
      },
      setEditsubtask: function(subtask) {
        $sessionStorage.editsubtask = subtask;
      },
      getEditsubtask: function() {
        if ($sessionStorage.hasOwnProperty('editsubtask')) {
          return $sessionStorage.editsubtask;
        }
      }
    };
    return subtaskserv;
  };
  SubtaskService.$inject = ['$sanitize', '$sessionStorage', 'TaskService'];
  angular.module('tasksubtasks.services').factory('SubtaskService', SubtaskService);
})();;(function(){
  var TaskService = function($rootScope, $sanitize, $sessionStorage, ProjectService) {
    var sanitizeTask = function(task) {
      return {
        name: $sanitize(task.name),
        type: $sanitize(task.type),
        importance: task.importance,
        due: task.due,
        completed: task.completed,
        description: $sanitize(task.description),
        completed_by: task.completed_by
      };
    };
    var taskserv = {
      getTasks: function(client_id, project_id) {
        return ProjectService.project(client_id, project_id).getList('tasks').$object;
      },
      task: function(client_id, project_id, task_id) {
        return ProjectService.project(client_id, project_id).one('tasks', task_id);
      },
      getTask: function(client_id, project_id, task_id) {
        return this.task(client_id, project_id, task_id).get();
      },
      addTask: function(dfltask) {
        //return Restangular.all('tasks').post(dfltask);
        //return Restangular.one('projects', project_id).all('tasks').post(dfltask);
        var client_id = $rootScope.current.clientId;
        return ProjectService.project(client_id, dfltask.project_id).all('tasks').post(dfltask);
      },
      delUjTask: function(project_id, task_id) {
        var client_id = $rootScope.current.clientId;
        return this.ProjectService.project(client_id, project_id).one('ujtasks', task_id).remove();
      },
      delTask: function(project_id, task_id) {
        var client_id = $rootScope.current.clientId;
        return this.task(client_id, project_id, task_id).remove();
      },
      setEditask: function(task) {
        $sessionStorage.editask = task;
      },
      getEditask: function() {
        if ($sessionStorage.hasOwnProperty('editask')) {
          return $sessionStorage.editask;
        }
      },
      updateTask: function(task) {
        //console.log(task);
        var clientId = $rootScope.current.clientId;
        feladat = this.task(clientId, task.project_id, task.id);
        return feladat.patch(sanitizeTask({
          name: task.name,
          type: task.type,
          importance: task.importance,
          due: task.due,
          completed: task.completed,
          description: task.description,
          completed_by: task.completed_by
        }));
      }
    };
    return taskserv;
  };
  TaskService.$inject = ['$rootScope', '$sanitize', '$sessionStorage', 'ProjectService'];
  angular.module('tasksubtasks.services').factory('TaskService', TaskService);
})();;(function(){
  var feladat = function($timeout) {
    return {
      restrict: 'A',
      scope: {
        task: '=',
        taskovano: '&',
        taskovanje: '&',
        validacijaimena: '&',
        goback: '&',
        importancies: '=',
        types: '=',
      },
      // templateUrl: 'templates/tasksubtasks/feladat.html',
      templateUrl: 'tasksubtasks/feladat.html',
      link: function(scope, elem, attrs) {
        $timeout(function() {
          elem.show();
        }, 100);
      }
    };
  };
  feladat.$inject = ['$timeout'];
  angular.module('tasksubtasks.directives').directive('feladat', feladat);
})();;(function(){
  angular.module('tasksubtasks.directives').directive('taski', ['$filter', '$timeout', function($filter, $timeout) {
    return {
      restrict: 'A',
      scope: {
        tasks: '=',
        subtaskovi: '&',
        taskslist: '=',
        addtask: '&',
      },
      // templateUrl: 'templates/tasksubtasks/tasksubtasx.html',
      templateUrl: 'tasksubtasks/tasksubtasx.html',
      link: function(scope, elem, attrs) {
        scope.curPg = 0;
        scope.pgSize = 5;
        scope.totPgs = function() {
          if (scope.tagfiltrirano) {
            return Math.ceil(scope.tagfiltrirano.length/scope.pgSize);
          }
        };
        $timeout(function() {
          elem.show();
        }, 100);

        scope.tagfiltre = function(task) {
          if(scope.keres === undefined || scope.keres.length === 0) {
            return true;
          }
          var imatag = false;
          angular.forEach(task.tags, function(tag) {
            if (tag.name.toLowerCase().indexOf(scope.keres.toLowerCase()) >= 0) {
              imatag = true;
            }
          });
          angular.forEach(task.subtasks, function(subtask) {
            angular.forEach(subtask.tags, function(tag) {
              if (tag.name.toLowerCase().indexOf(scope.keres.toLowerCase()) >= 0) {
              imatag = true;
            }
            });
          });
          return imatag;
        };
      }
    };
  }]);
})();;(function(){
  EgyebCtrl.$inject = ['$scope', '$state', 'SubtaskService'];
  function EgyebCtrl($scope, $state, SubtaskService) {
    // console.log('EgyebCtrl');
    $scope.setsubtasks = function(subtasks) {
       SubtaskService.setSubtasks(subtasks);
      if ($state.current.name == 'projects.clientprojects.tasks.editask') {
        $state.go('projects.clientprojects.tasks.editask.subtasks');
      } else {
        $state.go('projects.userprojects.tasks.editask.subtasks');
      }
    };
    $scope.setcomments = function(comments) {
      //
    };
  }
  angular.module('tasksubtasks.controllers').controller('EgyebCtrl', EgyebCtrl);
})();;(function(){
  ProjectTasksCtrl.$inject = ['$rootScope', '$scope', '$state', 'Slug', 'TaskService', 'projectId', 'TagService', 'SubtaskService', 'AlertService'];
  function ProjectTasksCtrl($rootScope, $scope, $state, Slug, TaskService, projectId, TagService, SubtaskService, AlertService) {
    // console.log('ProjectTasksCtrl');
    var pId = projectId.pId;

    $scope.init = function(pId) {
      $rootScope.loading = true;
      $rootScope.taskslist = true;
      TaskService.getTasks($rootScope.current.clientId, pId).then(function(tasks) {
        $rootScope.loading = false;
        if (!(tasks.flash)) {
          angular.forEach(tasks, function(task) {
            task.subtaski = true;
            task.due = new Date(task.due.replace(/-/g,"/"));
            task.jegy = '';
            angular.forEach(task.subtasks, function(subtask) {
              subtask.due = new Date(subtask.due.replace(/-/g,"/"));
              subtask.slag = $scope.slagi(subtask.name);
            });
            task.slag = $scope.slagi(task.name);
          });
          $scope.tasks = tasks;
          // console.log($scope.tasks);
        } else {
          $scope.tasks = [];
          AlertService.add('warning', 'no tasks yet!');
        }
      });

      TagService.getTags().then(function(tags) {
        var oznake = [];
        angular.forEach(tags, function(tag) {
          oznake.push(tag.name);
        });
        $scope.alltags = oznake;
      });
    };

    $scope.labela = function(params) {
      // console.log(params);
      TagService.addTag(params.tag, params.taskId, params.subtaskId).then(function(ujtag) {
        angular.forEach($scope.tasks, function(task) {
          if (task.$index == params.taskIndex) {
            task.tags.push(ujtag);
          }
        });
      });
    };

    $scope.slagi = function(input) {
      return Slug.slugify(input);
    };

    $scope.subtaskovi = function(taskIndex) {
      if ($scope.tasks[taskIndex].subtaski === true) {
        $scope.tasks[taskIndex].subtaski = false;
      } else {
        $scope.tasks[taskIndex].subtaski = true;
      }
    };

    $scope.addtask= function() {
      var dfltask = {
        project_id: projectId.pId,
        name: 'new task name',
        //name: '',             //test TaskCreateValidateException
        type: 'other',
        description: 'new task description',
        importance: 0,
        completed: 0
      };
      TaskService.addTask(dfltask).then(function(ujtask) {
        if (!(ujtask.flash||ujtask.errors)) {
          ujtask.ujtask = true;
          ujtask.name = '';
          ujtask.description = '';
          ujtask.slag = 'new-task';
          ujtask.due = new Date();
          ujtask.due.setMinutes(ujtask.due.getMinutes() + 121);
          $scope.tasks.push(ujtask);
          TaskService.setEditask($scope.tasks[$scope.tasks.indexOf(ujtask)]);
          if ($state.current.name == 'projects.clientprojects.tasks') {
            $state.go('projects.clientprojects.tasks.editask', {slug: ujtask.slag});
          } else {
            $state.go('projects.userprojects.tasks.editask', {slug: ujtask.slag});
          }
        } else if (ujtask.flash) {
          AlertService.add('danger', 'No Authorisation !!');
        } else {
          console.log(ujtask.errors);  //validation errors
        }
      });
    };

    $scope.init(pId);
  }
  angular.module('tasksubtasks.controllers').controller('ProjectTasksCtrl', ProjectTasksCtrl);
})();;(function(){
  SetEditTaskCtrl.$inject = ['$scope', '$state', 'TaskService'];
  function SetEditTaskCtrl($scope, $state, TaskService) {
    // console.log('SetEditTaskCtrl');
    $scope.seteditask = function(task) {
      TaskService.setEditask(task);
      if ($state.current.name == 'projects.clientprojects.tasks') {
        $state.go('projects.clientprojects.tasks.editask', {slug: task.slag});
      } else {
        $state.go('projects.userprojects.tasks.editask', {slug: task.slag});
      }
    };
  }
  angular.module('tasksubtasks.controllers').controller('SetEditTaskCtrl', SetEditTaskCtrl);
})();;(function(){
  TaskEditCtrl.$inject = ['$scope', 'TaskService', 'AlertService', 'anyag', 'Slug', '$state', '$rootScope', '$sessionStorage', '$timeout', '$q'];
  function TaskEditCtrl($scope, TaskService, AlertService, anyag, Slug, $state, $rootScope, $sessionStorage, $timeout, $q) {
    // console.log('TaskEditCtrl');

    $rootScope.taskslist = false;
    $scope.task = anyag.task;
    $scope.tartalek = angular.copy(anyag.task);
    $scope.task.completed = !!anyag.task.completed;

    $scope.importancies = [             // separate values service ?
      { val: 1, text: 'important' },
      { val: 0, text: 'not so important'}
    ];

    $scope.types = [
      {val: 'feature', type: 'feature'},
      {val: 'bug', type: 'bug'},
      {val: 'other', type: 'other'}
    ];

    $scope.taskovanje = function(task) {
      var deferred = $q.defer();
      $timeout(function() {
        var ret = TaskService.updateTask(task);
        ret.then(function(response) {
          if(!response.flash) {
            deferred.resolve(true);
          } else {
            AlertService.add('danger', 'No Authorisation !!');
            deferred.reject('nemere');
          }
        }, 600);
      });
      deferred.promise.then(function() {
        console.log(arguments);
      }, function() {
        console.log(arguments);
      });
      return deferred.promise;
    };

    $scope.taskovano = function(task) {
      if (($scope.tartalek.completed === 0)&&($scope.task.completed === true)) {
        $scope.task.completed_by = $rootScope.loggedInUser.id;
        task.completed_by = $rootScope.loggedInUser.id;
      }
      var deferred = $q.defer();
      $timeout(function() {
        var ret = TaskService.updateTask(task);
        ret.then(function(task) {
          if(!task.errors) {
            $scope.task.slag = Slug.slugify(task.name);
            //if $scope.task.ujtask
              $scope.task.ujtask = false; // null?
              //+ url tweak - onEnter
            deferred.resolve(true);
          } else {
            //console.log($scope.tartalek);
            $scope.task = angular.copy($scope.tartalek);
            angular.forEach($scope.$parent.tasks, function(task) {
              if (task.id == $scope.tartalek.id) {
                $scope.indeks = $scope.$parent.tasks.indexOf(task);
              }
            });
            $scope.$parent.tasks[$scope.indeks] = angular.copy($scope.tartalek);
            $scope.$$childHead.taskAc.$setError(Object.keys(task.errors)[0], task.errors[Object.keys(task.errors)[0]][0]);
            AlertService.add('danger', 'Data Not Valid !!');
            deferred.reject('nemere');
          }
        }, 500);
      });
      deferred.promise.then(function() {
        console.log(arguments);
      }, function() {
        console.log(arguments);
      });
      return deferred.promise;
    };

    $scope.validacijaimena = function(data) {   // pl onbeforesave, obrazAc child elem
      console.log('validacija imena');
      return true;
      //return 'nemere gyk';  //ok, submit cancel
    };

    $scope.goback = function() {
      if ($scope.task.ujtask) {
        $scope.$parent.tasks.splice($scope.indeks, 1);
        TaskService.delUjTask($scope.task.project_id, $scope.task.id)
          .then(function(deleted) {
            //AlertService.add('info', deleted.flash);
            console.log(deleted.flash);
          });
      }
      //console.log('back');
      $state.go('^');
    };
  }
  angular.module('tasksubtasks.controllers').controller('TaskEditCtrl', TaskEditCtrl);
})();;(function(){
  angular.module('tasksubtasks.feature', ['tasksubtasks.controllers', 'tasksubtasks.directives', 'tasksubtasks.services']);
})();;(function(){
  angular.module('users.services', []);
})();;(function(){
  angular.module('users.directives', []);
})();;(function(){
  angular.module('users.controllers', []);
})();;(function(){
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
})();;(function(){
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
})();;(function(){
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
})();;(function(){
  angular.module('users.feature', ['users.controllers', 'users.directives', 'users.services']);
})();;(function(){
  angular.module('tasker.features', ['clients.feature', 'projects.feature', 'tasksubtasks.feature', 'users.feature']);
})();;(function(){
  angular.module('tasker.core', ['restangular', 'ui.router', 'ui.bootstrap', 'ngStorage', 'xeditable', 'ngSanitize', 'angularFileUpload']);
})();;(function(){
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
})();;(function(){
  angular.module('tasker', ['tasker.core', 'tasker.features', 'tasker.common']);
})();;(function(){
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
        //templateUrl: 'templates/projects/create-project.html',
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
            //templateUrl: 'templates/projects/projects-state.html'
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
        // templateUrl: 'templates/taskssubtasks/editask.html',
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
            //templateUrl: 'templates/projects/projects-state.html'
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
        // templateUrl: 'templates/tasks/editask.html',
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