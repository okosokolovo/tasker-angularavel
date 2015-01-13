module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),    // meta data !

    banner: '/*! <%= pkg.name %> - v<% pkg.version %> - ' +
      '<%= grunt.template.today("yyyymmdd-HHMM") %> */\n',

    dir: {
      ftr: 'tasker/js/app/features',
      cmn: 'tasker/js/app/common'
    },

    concat: {
      options: {
        separator: ';',
        banner: '<%= banner %>'
      },
      uvoz_css: {
        src: [
        'bwr/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bwr/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        'bwr/bower_components/angular-xeditable/dist/css/xeditable.css'
        ],
        dest: 'public/assets/css/uvoz.css',
        nonull: true
      },
      uvoz_js: {
        src: [
          'bwr/bower_components/jquery/dist/jquery.js',
          'bwr/bower_components/angular/angular.js',
          'bwr/bower_components/underscore/underscore.js',
          //'bwr/bower_components/modernizr/modernizr.js',

          'bwr/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          //'bwr/bower_components/bootstrap/js/dropdown.js',
          'bwr/bower_components/bootstrap/js/modal.js',
          //'bwr/bower_components/bootstrap/dist/js/bootstrap.js',

          'bwr/bower_components/restangular/dist/restangular.js',
          'bwr/bower_components/ng-file-upload/angular-file-upload.js',
          'bwr/bower_components/angular-ui-router/release/angular-ui-router.js',
          'bwr/bower_components/ui-router-extras/release/ct-ui-router-extras.js',
          'bwr/bower_components/angular-sanitize/angular-sanitize.js',
          'bwr/bower_components/angular-xeditable/dist/js/xeditable.js',
          'bwr/bower_components/angular-slugify/angular-slugify.js',
          'bwr/bower_components/ngstorage/ngStorage.js'
        ],
        dest: 'tasker/dist/js/uvoz.js',
        nonull: true
      },
      tasker_css: {
        src: ['tasker/css/*.css'],
        // dest: 'tasker/dist/css/tasker.css',
        dest: 'public/assets/css/tasker.css',      //temp
        nonull: true
      },
      tasker_js: {
        // src: ['tasker/js/**/*'],
        src: [
          ///common:
          //'<%= dir.cmn %>/common.module.js',
          'tasker/js/app/common/common.module.js',
          'tasker/js/app/common/controllers/main.ctrl.js',
          'tasker/js/app/common/controllers/upload.ctrl.js',
          'tasker/js/app/common/filters/paginacija.filter.js',
          'tasker/js/app/common/services/alert.service.js',
          'tasker/js/app/common/services/session.service.js',
          'tasker/js/app/common/services/tag.service.js',
          'tasker/js/app/common/directives/form-modal.directive.js',
          
          ///features:
          'tasker/js/app/features/clients/services/clients.services.js',
          //'<%= dir.ftr %>/clients/controllers/clients.controllers.js',
          'tasker/js/app/features/clients/controllers/clients.controllers.js',
          'tasker/js/app/features/clients/services/client.service.js',
          'tasker/js/app/features/clients/controllers/client.create.ctrl.js',
          'tasker/js/app/features/clients/clients.module.js',

          'tasker/js/app/features/projects/services/projects.services.js',
          'tasker/js/app/features/projects/directives/projects.directives.js',
          'tasker/js/app/features/projects/controllers/projects.controllers.js',
          'tasker/js/app/features/projects/services/project.service.js',
          'tasker/js/app/features/projects/directives/projetti.directive.js',
          'tasker/js/app/features/projects/controllers/projects.ctrl.js',
          'tasker/js/app/features/projects/controllers/client.projects.ctrl.js',
          'tasker/js/app/features/projects/controllers/user.projects.ctrl.js',
          'tasker/js/app/features/projects/controllers/project.create.ctrl.js',
          'tasker/js/app/features/projects/projects.module.js',

          'tasker/js/app/features/tasksubtasks/services/tasksubtasks.services.js',
          'tasker/js/app/features/tasksubtasks/directives/tasksubtasks.directives.js',
          'tasker/js/app/features/tasksubtasks/controllers/tasksubtasks.controllers.js',
          'tasker/js/app/features/tasksubtasks/services/subtask.service.js',
          'tasker/js/app/features/tasksubtasks/services/task.service.js',
          'tasker/js/app/features/tasksubtasks/directives/feladat.directive.js',
          'tasker/js/app/features/tasksubtasks/directives/taski.directive.js',
          'tasker/js/app/features/tasksubtasks/controllers/egyeb.ctrl.js',
          'tasker/js/app/features/tasksubtasks/controllers/project.tasks.ctrl.js',
          'tasker/js/app/features/tasksubtasks/controllers/set.edit.task.ctrl.js',
          'tasker/js/app/features/tasksubtasks/controllers/task.edit.ctrl.js',
          'tasker/js/app/features/tasksubtasks/tasksubtasks.module.js',

          'tasker/js/app/features/users/services/users.services.js',
          'tasker/js/app/features/users/directives/users.directives.js',
          'tasker/js/app/features/users/controllers/users.controllers.js',
          'tasker/js/app/features/users/services/auth.service.js',
          'tasker/js/app/features/users/directives/get-brutto-user.directive.js',
          'tasker/js/app/features/users/controllers/auth.ctrl.js',
          'tasker/js/app/features/users/users.module.js',
          
          'tasker/js/app/features/features.module.js',
          
          ///core:
          'tasker/js/app/core/core.module.js',
          'tasker/js/app/core/config.js',

          ///app
          'tasker/js/app/app.module.js',
          'tasker/js/app/routes.js'
        ],
        // dest: 'tasker/dist/js/tasker.js',
        dest: 'public/assets/js/tasker.js',      //temp
        nonull: true
      }
    },
    
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: true,
        compress: true,
      },
      uvoz: {
        src: '<%= concat.uvoz_js.dest %>',
        dest: 'public/assets/js/uvoz.min.js'
      },
      tasker: {
        src: '<%= concat.tasker_js.dest %>',
        dest: 'public/assets/js/tasker.min.js'
      }
    },
    
    cssmin: {
      tasker: {
        src: '<%= concat.tasker_css.dest %>',
        dest: 'public/assets/css/tasker.min.css'
      }
    }

  });

  // grunt.registerTask('default', ['concat']);
};