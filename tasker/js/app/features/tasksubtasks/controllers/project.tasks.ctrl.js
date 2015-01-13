(function(){
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
})();