(function(){
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
})();