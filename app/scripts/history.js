(function() {
  var app = angular.module('history', ['injectableThoughts', 'angularModalService']);

var controllerExangeEntity = null;
var isMicrorrelatoUpdated = false;

 app.controller('ComplexController', ['$scope', 'title', 'close','kuasarsServiceLocator', function($scope, title, close, kuasarsServiceLocator) {

  $scope.updatedBody = controllerExangeEntity.body;
  $scope.updatedTitle = controllerExangeEntity.title;
  $scope.title = title;
  $scope.lastUpdateTime = controllerExangeEntity.updatedAt;
  if(controllerExangeEntity.publicURL === 'private'){
    $scope.isPublic = 'false';
  }else{ $scope.isPublic = 'true';}

  $scope.close = function() {
    close({
      updatedBody: $scope.updatedBody,
      updatedTitle: $scope.updatedTitle,
      lastUpdateTime: $scope.lastUpdateTime,
      isPublic: $scope.isPublic
    }, 500); // close, but give 500ms for bootstrap to animate

  console.log($scope.updatedBody, $scope.updatedTitle);
 };

 $scope.update = function() {
     var updatedEntity = controllerExangeEntity; 
     updatedEntity.body = $scope.updatedBody;
     updatedEntity.title = $scope.updatedTitle;
     if($scope.isPublic === 'true'){
       updatedEntity.publicURL = controllerExangeEntity.id;
    }else{
       updatedEntity.publicURL = "private";
    }

     var response = kuasarsServiceLocator.replaceEntity("microrrelatos",controllerExangeEntity.id, updatedEntity);
     response.then(updatedMicrorrelatoCallback, updatedMicrorrelatoCallbackError);
 };

$scope.reset = function() {
    $scope.updatedBody = controllerExangeEntity.body;
    $scope.updatedTitle = controllerExangeEntity.title;
};

  function updatedMicrorrelatoCallback(data){
    controllerExangeEntity = data;
    $scope.updatedTitle = data.title;
    $scope.updatedBody = data.body;
    $scope.title = data.title;
    $scope.lastUpdateTime = data.updatedAt;

    if($scope.isPublic === 'true'){
      kuasarsServiceLocator.makeEntityAnonymous("microrrelatos",controllerExangeEntity.id, true);
    }else{
      kuasarsServiceLocator.makeEntityAnonymous("microrrelatos",controllerExangeEntity.id, false);
    }

    isMicrorrelatoUpdated = true;
  }

  function updatedMicrorrelatoCallbackError (data){
     controllerExangeEntity = {};
  }

}]);

  app.controller('historyCtrl', ['$scope', 'kuasarsServiceLocator', 'ModalService', function($scope, kuasarsServiceLocator, ModalService){
  $scope.pageSize = 5;

 $scope.init = function () {

   $scope.microrrelatosAmount();

   $scope.getMicrorrelatosPage();
 }

 $scope.getMicrorrelatosPage = function (){
    var response = kuasarsServiceLocator.findEntities('microrrelatos',{author:sessionStorage.getItem("userId")},$scope.pageSize,$scope.pageSize * $scope.currentPage,'updatedAt','DESC',['updatedAt','title','publicURL']);
    response.then(historyInitCallback, historyInitCallbackError);
 }

 $scope.microrrelatosAmount = function () { 
   var response = kuasarsServiceLocator.countEntities('microrrelatos',{author:sessionStorage.getItem("userId")});
   response.then(historyMicrorrelatosAmountCallback, historyMicrorrelatosAmountCallbackError);
 }

 $scope.nextPage = function (){
   $scope.currentPage ++;
   $scope.getMicrorrelatosPage();
 }

 $scope.prevPage = function (){
   $scope.currentPage --;
   $scope.getMicrorrelatosPage();
 }

 $scope.updateMicrorrelato = function (microrrelatoID){
 
  var response = kuasarsServiceLocator.getEntitiesById('microrrelatos', microrrelatoID);
  response.then(function(success){
  controllerExangeEntity = success;
   
    ModalService.showModal({
      templateUrl: "updateMicrorrelato.html",
      controller: "ComplexController",
      inputs: {
        title: success.title
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        if(isMicrorrelatoUpdated === true){
          var microrrelatosLength = $scope.microrrelatos.length;
          for (var i = 0; i < microrrelatosLength; i++) { 
            if($scope.microrrelatos[i].id === microrrelatoID){
              $scope.microrrelatos[i].updatedAt = result.lastUpdateTime;
              $scope.microrrelatos[i].title = result.updatedTitle;
              if(result.isPublic === 'true'){
                $scope.microrrelatos[i].publicURL = "http://www.microrrelatos.byethost14.com/public.html?id=" + microrrelatoID;  
              }else{
                $scope.microrrelatos[i].publicURL = "private";  
              }
              
              break;
            }
          }
      }
      isMicrorrelatoUpdated = false;
      });
    });


  }, null);
  
 }

  $scope.init();

  function historyInitCallback(data){
    $scope.isHistoryEmpty = false;
    var dataLength = data.length;
    if(dataLength == 0){
      $scope.isHistoryEmpty = true;
    }
    for (var i = 0; i < dataLength; i++) { 
      if(data[i].publicURL !== 'private'){
        data[i].publicURL = "http://www.microrrelatos.byethost14.com/public.html?id=" + data[i].publicURL;
      }
    }
    $scope.microrrelatos = data;
  }

  function historyInitCallbackError (data){
     $scope.microrrelato = {};
  }

  function historyMicrorrelatosAmountCallback(data){
    $scope.amount = data.count;
    $scope.pages = Math.ceil($scope.amount / $scope.pageSize);
    $scope.currentPage = 0;
  }

  function historyMicrorrelatosAmountCallbackError (data){
     $scope.amount = 0;
  }

  }]);

app.directive('history',function(){
    return{
    restrict:'E',
    templateUrl:'history.html'
    };
  });
 
})();
