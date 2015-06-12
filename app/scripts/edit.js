(function() {
  var app = angular.module('edit', ["injectableThoughts"]);


app.controller('editCtrl', ['$scope', 'kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
  
   $scope.microrrelato = {};
   $scope.title = "lalala";
    this.editMicrorrelato = function(){
        
        var entityToSave = { 
          title:$scope.microrrelato.title,   
          body: $scope.microrrelato.message,
          author: sessionStorage.getItem('userId')
        }

        var response = kuasarsServiceLocator.saveEntity("microrrelatos",entityToSave);
        response.then(editMicrorrelatoCallback, editMicrorrelatoCallbackError);
        $scope.microrrelato = {};
      };

  function editMicrorrelatoCallback(data){
    console.log(data);
  }

  function editMicrorrelatoCallbackError (data){
     $scope.microrrelato = {};
  }

  }]);

app.directive('edit',function(){
    return{
    restrict:'E',
    templateUrl:'edit.html'
    };
  });

})();
