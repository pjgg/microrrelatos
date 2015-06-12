(function() {
  var app = angular.module('new', ["injectableThoughts"]);


app.controller('newCtrl', ['$scope', 'kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
  
   $scope.microrrelato = {};

    this.addMicrorrelato = function(){
        
        var entityToSave = { 
          title:$scope.microrrelato.title,   
          body: $scope.microrrelato.message,
          author: sessionStorage.getItem('userId'),
          publicURL:"private"
        }

        var response = kuasarsServiceLocator.saveEntity("microrrelatos",entityToSave);
        response.then(newMicrorrelatoCallback, newMicrorrelatoCallbackError);
        $scope.microrrelato = {};
      };

  function newMicrorrelatoCallback(data){
    $(location).attr('href',"dashboard.html");
  }

  function newMicrorrelatoCallbackError (data){
     $scope.microrrelato = {};
  }

  }]);

app.directive('new',function(){
    return{
    restrict:'E',
    templateUrl:'new.html'
    };
  });

})();
