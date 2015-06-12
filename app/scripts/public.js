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

var microrrelatoId = urlParams["id"];

(function() {
  var app = angular.module('microrrelato', ["injectableThoughts"]);

app.controller('MicroController',[ '$scope', 'kuasarsServiceLocator', function($scope, kuasarsServiceLocator){
    
   $scope.init = function () {

   var response = kuasarsServiceLocator.getEntitiesById('microrrelatos', microrrelatoId);
   response.then(getMicrorrelatoCallback, getMicrorrelatoCallbackError);

 }

 function getMicrorrelatoCallback(data){
    $scope.title = data.title;
    $scope.body = data.body;
    $scope.userId = data.author;
    var response = kuasarsServiceLocator.getUserById(data.author);
    response.then(function dataSuccess(user){
       $scope.authorName = user.fullName;
       if(user.avatarUrl){
        $scope.avatarURL = user.avatarUrl;
       }else{
        $scope.avatarURL = 'images/glasses.jpg';
      }
    }, null);
  }

  function getMicrorrelatoCallbackError (data){
     
  }

  $scope.init();
  }]);



})();