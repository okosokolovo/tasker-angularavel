(function(){
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
})();