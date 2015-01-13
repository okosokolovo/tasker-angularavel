(function(){
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
                  //url: "avatar",
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
})();