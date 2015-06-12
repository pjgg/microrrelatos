(function() {
  var app = angular.module('settings', ["injectableThoughts"]);


app.controller('settingsCtrl', ['$scope', 'kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
  
   $scope.status = "User Profile";
   $scope.name = sessionStorage.getItem("userName");
   $scope.email = sessionStorage.getItem("userEmail");
  

   if(sessionStorage.getItem("aboutYourSelf")){
     $scope.aboutYourSelf = sessionStorage.getItem("aboutYourSelf");
   }

   if(sessionStorage.getItem("avatarURL")){
     $scope.avatarURL = sessionStorage.getItem("avatarURL");
   }

   $scope.updateUser = function(){
   
    var url = $scope.avatarURL
    if(url.length == 0)
       url = null;
    var response = kuasarsServiceLocator.replaceUser($scope.name, {aboutYourSelf:$scope.aboutYourSelf,following:JSON.parse(sessionStorage.getItem("following"))}, url);
    response.then(updateUserCallback, updateUserCallbackError);

    };

  $scope.$watch('name', function(newValue, oldValue ) {
    if(oldValue === newValue){return;}
    else{
      $scope.status = "User Profile *";
    }
  });

 $scope.$watch('avatarURL', function(newValue, oldValue ) {
    if(oldValue === newValue){return;}
    else{
      $scope.status = "User Profile *";
    }
  });

 $scope.$watch('aboutYourSelf', function(newValue, oldValue ) {
    if(oldValue === newValue){return;}
    else{
      $scope.status = "User Profile *";
    }
  });

 function updateUserCallback(data){
    sessionStorage.setItem("userName", data.fullName);
    sessionStorage.setItem("userEmail", data.authentication.email.email);
    sessionStorage.setItem("aboutYourSelf", data.custom.aboutYourSelf);
    sessionStorage.setItem("avatarURL", data.avatarUrl);

    var searchAuthor = { 
          avatarUrl:data.avatarUrl,     
          name: data.fullName,
          authorDesc: data.custom.aboutYourSelf
      }

    kuasarsServiceLocator.replaceEntity("searchAuthor", data.id, searchAuthor);

    $scope.status = "User Profile";
  }

  function updateUserCallbackError (data){
     console.error(data); 
     $scope.status = "User Profile Fail!";
  }


  }]);

app.directive('settings',function(){
    return{
    restrict:'E',
    templateUrl:'settings.html'
    };
  });

})();
