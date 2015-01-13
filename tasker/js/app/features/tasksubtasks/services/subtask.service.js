(function(){
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
})();