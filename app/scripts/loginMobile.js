(function() {
  var app = angular.module('mobileLogin', ["injectableThoughts"]);

 
 app.controller('mobileLoginFormCtrl', ['$scope', 'kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
 	
	$scope.loginFormData = {};

    this.login = function(){
      if($scope.loginForm.$valid){
    		
        var response = kuasarsServiceLocator.login($scope.loginFormData.email, $scope.loginFormData.password);  
        response.then(loginCallback, loginCallbackError);
    		$scope.loginFormData = {};
    }else{
      $scope.loginFormData = {};
    }
  };

  function loginCallback(data){
   
    var response = kuasarsServiceLocator.getUserById(data.userId);
    response.then(function dataSuccess(user){
       sessionStorage.setItem("userName", user.fullName);
       sessionStorage.setItem("userEmail", user.authentication.email.email);
       sessionStorage.setItem("aboutYourSelf", user.custom.aboutYourSelf);
       sessionStorage.setItem("avatarURL", user.avatarUrl);
       sessionStorage.setItem("following", JSON.stringify(user.custom.following));
       sessionStorage.setItem("isMobile", true);
      var searchAuthor = { 
          avatarUrl:user.avatarUrl,     
          name: user.fullName,
          authorDesc: user.custom.aboutYourSelf
      }

       kuasarsServiceLocator.replaceEntity("searchAuthor", user.id, searchAuthor);
       $(location).attr('href',"dashboard.html");
    }, null);
  }

  function loginCallbackError (data){
     $scope.loginFormData = {};
  }

  
  }]);

})();
