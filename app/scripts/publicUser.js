var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

var userId = urlParams["id"];

(function() {
  var app = angular.module('userPublic', ["injectableThoughts"]);

app.controller('UserPublicController',[ '$scope', 'kuasarsServiceLocator', function($scope, kuasarsServiceLocator){
    
   $scope.init = function () {

   var response = kuasarsServiceLocator.getUserById(userId);
    response.then(getUserCallback,null);

 }

 function getUserCallback(data){
    $scope.authorName = data.fullName;
    $scope.description = data.custom.aboutYourSelf;
     if(data.avatarUrl){
        $scope.avatarURL = data.avatarUrl;
       }else{
        $scope.avatarURL = 'images/glasses.jpg';
      }
  }

  function getMicrorrelatoCallbackError (data){ }

  $scope.init();
  }]);



})();