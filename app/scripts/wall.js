(function() {
  var app = angular.module('wall', ['injectableThoughts']);


  app.controller('wallCtrl', ['$scope','$rootScope', 'kuasarsServiceLocator', function($scope, $rootScope, kuasarsServiceLocator){
 
 $scope.wallPageSize = 3;
 var authors = new Array();
 var exangefunctionsScore = 0;
 var exangefunctionsSelectedMicrorrelato = 0;

 $scope.init = function () {
   var author = {
    userId:sessionStorage.getItem("userId"),
    name:sessionStorage.getItem("userName"),
    avatarUrl:sessionStorage.getItem("avatarURL")
   };

   authors[0] = author;   
   $scope.microrrelatosWallAmount();

   $scope.getMicrorrelatosWallPage();
 }

 $scope.getMicrorrelatosWallPage = function (){
    var followUsers = JSON.parse(sessionStorage.getItem("following"));
    followUsers.push(sessionStorage.getItem("userId"));
    var response = kuasarsServiceLocator.findEntities('microrrelatos',{author: {$in:followUsers}},$scope.wallPageSize,$scope.wallPageSize * $scope.wallCurrentPage,'updatedAt','DESC',['updatedAt','title','body','author']);
    response.then(wallInitCallback, wallInitCallbackError);
 }

 $scope.microrrelatosWallAmount = function () { 
   var followUsers = JSON.parse(sessionStorage.getItem("following"));
   followUsers.push(sessionStorage.getItem("userId"));
   var response = kuasarsServiceLocator.countEntities('microrrelatos',{author: {$in:followUsers}});
   response.then(wallMicrorrelatosAmountCallback, wallMicrorrelatosAmountCallbackError);
 }

 $scope.nextWallPage = function (){
   $scope.wallCurrentPage ++;
   $scope.getMicrorrelatosWallPage();
 }

$scope.addScore = function(id, score){

      var response = kuasarsServiceLocator.runHostedCodeFunction('addScore', score+","+id, true);
      response.then(updateMicrorrelatosScoreCallback, updateMicrorrelatosScoreCallbackError);
      $scope.microrrelatosWall = null;
      if($scope.wallCurrentPage){
      	$scope.wallCurrentPage = 0;
      }
      $scope.microrrelatosWallAmount();
      $scope.getMicrorrelatosWallPage();
}

 $rootScope.$on('reloadWall', function(event,value) {
     $scope.microrrelatosWall = null;
     $scope.init();
 });

  $scope.init();

  function wallInitCallback(data){
     
    for(var j = 0; j < data.length; j++){ 
      var isCached = false;
      for(var i = 0; i < authors.length; i++){
        if(data[j].author === authors[i].userId){
          data[j].author = authors[i];
          isCached = true;
          break;
        }
      }
      if(isCached == false){
        var response = kuasarsServiceLocator.getUserById(data[j].author);
        response.then(cacheNewAuthor,null);
      }
    }

    if($scope.microrrelatosWall){
       for(var i = 0; i < data.length; i++){
         $scope.microrrelatosWall.push(data[i]);
       }
    }else{$scope.microrrelatosWall = data;}
    getMicrorrelatosScore();
  }


  function cacheNewAuthor(data){
    var newAuthor = {
      userId:data.id,
      name:data.fullName,
      avatarUrl:data.avatarUrl
    };
    for(var j = 0; j < $scope.microrrelatosWall.length; j++){
        if($scope.microrrelatosWall[j].author === data.id){
          $scope.microrrelatosWall[j].author = newAuthor;
          break;
        }
      }

    authors.push(newAuthor);
  } 

  function wallInitCallbackError (data){
     $scope.microrrelatosWall = {};
  }

  function wallMicrorrelatosAmountCallback(data){
    $scope.wallAmount = data.count;
    $scope.wallPages = Math.ceil($scope.wallAmount / $scope.wallPageSize);
    $scope.wallCurrentPage = 0;
  }

  function wallMicrorrelatosAmountCallbackError (data){
     $scope.wallAmount = 0;
  }

   //scores
  function getMicrorrelatosScore(){
      var ids = new Array();
      for(var j = 0; j < $scope.microrrelatosWall.length; j++){
        ids[j] = $scope.microrrelatosWall[j].id;
      }
      var response = kuasarsServiceLocator.findEntities('microrrelatosScores',{id: {$in:ids}},ids.length,0,'_id','DESC',[]);
      response.then(getMicrorrelatosScoreCallback, getMicrorrelatosScoreCallbackError);
  } 

  function getMicrorrelatosScoreCallback (data){

    if(data){
       for(var j = 0; j < data.length; j++){
          for(var i =0;i < $scope.microrrelatosWall.length; i++){
            if($scope.microrrelatosWall[i].id == data[j].id){
               $scope.microrrelatosWall[i].score = Math.ceil((data[j].scoreCounters[0] * 1 + data[j].scoreCounters[1] * 2 + data[j].scoreCounters[2] * 3  + data[j].scoreCounters[3] * 4 + data[j].scoreCounters[4] * 5)/ (data[j].scoreCounters[0]+ data[j].scoreCounters[1] + data[j].scoreCounters[2] + data[j].scoreCounters[3] + data[j].scoreCounters[4]));
            }
         }
        }
    }
  }
  
/*
  function microrrelatoGetScoresCallback (data){
    
       data.scoreCounters[Number(exangefunctionsScore) - 1] = data.scoreCounters[Number(exangefunctionsScore) - 1] + 1;
       var scores = {
       id:data.id,
       scoreCounters: data.scoreCounters,
      }

      exangefunctionsScore = 0;
      exangefunctionsSelectedMicrorrelato = 0;
      var response = kuasarsServiceLocator.replaceEntity('microrrelatosScores',data.id, scores);  
      response.then(updateMicrorrelatosScoreCallback, updateMicrorrelatosScoreCallbackError);
  }*/

  function updateMicrorrelatosScoreCallback (data){ 
      if($scope.microrrelatosWall){
      	for(var i =0;i < $scope.microrrelatosWall.length; i++){
            if($scope.microrrelatosWall[i].id == data.id){
               $scope.microrrelatosWall[i].score = Math.ceil((data.scoreCounters[0] * 1 + data.scoreCounters[1] * 2 + data.scoreCounters[2] * 3  + data.scoreCounters[3] * 4 + data.scoreCounters[4] * 5)/ (data.scoreCounters[0]+ data.scoreCounters[1] + data.scoreCounters[2] + data.scoreCounters[3] + data.scoreCounters[4]));
            }
         }
        }
  }

 function updateMicrorrelatosScoreCallbackError (data){ }
 
 function getMicrorrelatosScoreCallbackError (data){ }
 
 /* function microrrelatoGetScoresCallbackError(data){ 
    //If it's the first time.
    var scoresCounters = new Array(5);
    for(var i =0; i < scoresCounters.length; i++){
        scoresCounters[i] = 0;
    }
    scoresCounters[Number(exangefunctionsScore) - 1] = 1;

    var scores = {
       id: exangefunctionsSelectedMicrorrelato,
       scoreCounters:scoresCounters,
       acl:{
        read:{
          user:["ALL"]
        },
        rw:{
          user:["ALL"]
        },
        admin:{
          user:["NONE"]
        }
       }
    }

    var response = kuasarsServiceLocator.saveEntity('microrrelatosScores', scores);
    response.then(updateMicrorrelatosScoreCallback, updateMicrorrelatosScoreCallbackError);
    exangefunctionsSelectedMicrorrelato = 0;
    exangefunctionsScore = 0;
  }

  function updateMicrorrelatosScoreCallbackError (data){ }

*/
  

  }]);

app.directive('wall',function(){
    return{
    restrict:'E',
    templateUrl:'wall.html'
    };
  });
 
})();
