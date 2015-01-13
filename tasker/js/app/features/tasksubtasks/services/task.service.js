(function(){
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
})();