(function(){
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
})();