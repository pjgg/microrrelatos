(function() {
  var app = angular.module('writers', ['injectableThoughts']);


 app.controller('writersCtrl', ['$scope','$rootScope', 'kuasarsServiceLocator', function($scope, $rootScope, kuasarsServiceLocator){

 $scope.pageSize = 12;
 $scope.isWriterSelected = false;
 $scope.findMicrorrelatosPageSize = 5;

 $scope.init = function () {
   $scope.writersAmount({});
   $scope.getWritersPage({});
 }

$scope.findWriters = function(){

  var finalQuery = "";
  if($scope.find){
    finalQuery = $scope.find.query.slice(1) || "";
  }

  $scope.writersAmount({name:{$regex: finalQuery}});
  $scope.getWritersPage({name:{$regex: finalQuery}});
  $scope.microrrelatos = null;
  $scope.isWriterSelected = false;
}

 $scope.getWritersPage = function (where){
  var response = kuasarsServiceLocator.findEntities('searchAuthor',where,$scope.pageSize,$scope.pageSize * $scope.currentPage,'updatedAt','DESC',[]);
  response.then(writersInitCallback, writersInitCallbackError);
 }

 $scope.writersAmount = function (where) { 
   var response = kuasarsServiceLocator.countEntities('searchAuthor',where);
   response.then(writersAmountCallback, writersAmountCallbackError);
 }

$scope.nextPage = function (){
   $scope.currentPage ++;
   $scope.getWritersPage({});
 }

 $scope.prevPage = function (){
   $scope.currentPage --;
   $scope.getWritersPage({});
 }

$scope.nextFindMicrorrelatosPage = function (userId){
   $scope.findMicrorrelatosCurrentPage ++;
   $scope.getMicrorrelatosPage(userId);
 }

$scope.follow = function (userId){
    var following = JSON.parse(sessionStorage.getItem("following"));
    following.push(userId);

    var avatarUrl = null;
    if(sessionStorage.getItem("avatarURL").length > 0 && sessionStorage.getItem("avatarURL") !== 'null'){
      avatarUrl = sessionStorage.getItem("avatarURL");
    }

    var authorDesc = null;
    if(sessionStorage.getItem("aboutYourSelf").length > 0 && sessionStorage.getItem("aboutYourSelf") !== 'null'){
      authorDesc = sessionStorage.getItem("aboutYourSelf");
    }

    kuasarsServiceLocator.replaceUser(sessionStorage.getItem("userName"), {aboutYourSelf:authorDesc,following:following}, avatarUrl);
    $scope.isAlreadyFollow = true;
    sessionStorage.setItem("following", JSON.stringify(following));
    $rootScope.$broadcast('reloadWall', 'newFollower');
}

 $scope.showUser = function (writerID){
   $scope.isWriterSelected = true;
   $scope.isAlreadyFollow = false;
   for(var i = 0; i < $scope.writers.length; i++){
      if($scope.writers[i].id === writerID){
        $scope.writerSelected = $scope.writers[i];
        
        if($scope.writerSelected.avatarUrl == null || $scope.writerSelected.avatarUrl == 'undefined'){
          $scope.writerSelected.avatarUrl = 'images/glasses.jpg';
        }

        $scope.microrrelatosAmount(writerID);
        $scope.getMicrorrelatosPage(writerID);
        var following = JSON.parse(sessionStorage.getItem("following"));
        if(writerID === sessionStorage.getItem("userId") || (following.indexOf(writerID) > -1)){
          $scope.isAlreadyFollow = true;
        }
      }
   }
 }

 $scope.getMicrorrelatosPage = function (userId){
    var response = kuasarsServiceLocator.findEntities('microrrelatos',{author:userId},$scope.findMicrorrelatosPageSize,$scope.findMicrorrelatosPageSize * $scope.findMicrorrelatosCurrentPage,'updatedAt','DESC',['title','body']);
    response.then(findMicrorrelatosCallback, findMicrorrelatosCallbackError);
 }

 $scope.microrrelatosAmount = function (userId) { 
   var response = kuasarsServiceLocator.countEntities('microrrelatos',{author:userId});
   response.then(findMicrorrelatosAmountCallback, findMicrorrelatosAmountCallbackError);
 }

  function findMicrorrelatosCallback(data){
     if($scope.microrrelatos){
       for(var i = 0; i < data.length; i++){
         $scope.microrrelatos.push(data[i]);
       }
    }else{$scope.microrrelatos = data;}
  }

  function findMicrorrelatosCallbackError (data){
     $scope.microrrelatos = {};
  }

  function findMicrorrelatosAmountCallback(data){
    $scope.findMicrorrelatosAmount = data.count;
    $scope.findMicrorrelatosPages = Math.ceil($scope.findMicrorrelatosAmount / $scope.findMicrorrelatosPageSize);
    $scope.findMicrorrelatosCurrentPage = 0;
  }

  function findMicrorrelatosAmountCallbackError (data){
     $scope.findMicrorrelatosAmount = 0;
  }

 function writersInitCallback(data){
  $scope.writers = data; 
  for(var i = 0; i < $scope.writers.length; i++){
    if($scope.writers[i].avatarUrl == null || $scope.writers[i].avatarUrl == 'undefined'){
          $scope.writers[i].avatarUrl = 'images/glasses.jpg';
    }
  }
 
  }

  function writersInitCallbackError (data){
     $scope.writers = {};
  }

  function writersAmountCallback(data){
    $scope.amount = data.count;
    $scope.pages = Math.ceil($scope.amount / $scope.pageSize);
    $scope.currentPage = 0;
  }

  function writersAmountCallbackError (data){
     $scope.amount = 0;
  }

  $scope.init(); 

  }]);

app.directive('writers',function(){
    return{
    restrict:'E',
    templateUrl:'writers.html'
    };
  });
 
})();

