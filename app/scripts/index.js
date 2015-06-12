(function() {
  var app = angular.module('microrrelatosIndex', ["injectableThoughts"]);

 
 app.controller('loginFormCtrl', ['$scope', 'kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
 	
	$scope.loginFormData = {};
  $scope.isMobile = false;
  
  $scope.init = function(){
    var element = document.getElementById("loginEmail");
    $scope.isMobile = element.offsetWidth > 0 || element.offsetHeight > 0;

  }

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

  $scope.init();
  }]);


 app.controller('registerFormCtrl', ['$scope','kuasarsServiceLocator',function($scope, kuasarsServiceLocator){
 	
	  $scope.registerFormData = {};
    $scope.serverErrorMsg = {};

    this.getVerificationCode = function(){
      $scope.isServerErrorMsg = false;
      if ($scope.requestVerificationCodeForm.$valid) {

        var response = kuasarsServiceLocator.verificationCodeRequest($scope.registerFormData.email); 
        response.then(null, signupCallbackError);
        $scope.isVerificationCode = true;

      }
      else{
        $scope.showValidation = true;
      }
    };

    this.register = function(){
      $scope.isServerErrorMsg = false;
      if ($scope.registerForm.$valid) {

        var response = kuasarsServiceLocator.signup($scope.registerFormData.email, $scope.registerFormData.password, $scope.registerFormData.verificationCode, $scope.registerFormData.name, {following:[],aboutYourSelf:''});  
        response.then(signupCallback, signupCallbackError);
       
      }else{
        $scope.showRegisterSecondStepValidation = true;
      }
   };

   $scope.getEmailError = function (error) {
      if (angular.isDefined(error)) {
        if (error.required) {
          return "Please enter an email";
        } else if (error.email) {
          return "Please enter a valid email address";
        }
     }
  };

   $scope.getVerificationCodeError = function (error) {
      if (angular.isDefined(error)) {
        if (error.required) {
          return "Please enter a verificationCode";
        } else if (error.minlength || error.maxlength) {
          return "Please enter a valid verificationCode";
        }
     }
  };

 $scope.getNameError = function (error) {
      if (angular.isDefined(error)) {
        if (error.required) {
          return "Please enter your writer name";
        } else if (error.minlength || error.maxlength) {
          return "Please enter a valid name";
        }
     }
  };

 $scope.getPasswordError = function (error) {
      if (angular.isDefined(error)) {
        if (error.required) {
          return "Please enter a password";
        } else if (error.minlength || error.maxlength) {
          return "Please enter a valid password";
        }
     }
  };

  function signupCallback(data){
    var response = kuasarsServiceLocator.login($scope.registerFormData.email, $scope.registerFormData.password);  
    response.then(loginSignUpCallback, loginSignUpCallbackError);
  }

  function signupCallbackError (data){
     $scope.registerFormData = {};
     $scope.isVerificationCode = false;
     $scope.showRegisterSecondStepValidation = false;
     $scope.serverErrorMsg = data.message;
     $scope.showValidation = true;
     $scope.isServerErrorMsg = true;
  }


  function loginSignUpCallback(data){
  
    var response = kuasarsServiceLocator.getUserById(data.userId);
    response.then(function dataSuccess(user){
       sessionStorage.setItem("userName", user.fullName);
       sessionStorage.setItem("userEmail", user.authentication.email.email);
       sessionStorage.setItem("aboutYourSelf", user.custom.aboutYourSelf);
       sessionStorage.setItem("avatarURL", user.avatarUrl);
       sessionStorage.setItem("following", JSON.stringify(user.custom.following));

      var searchAuthor = { 
          avatarUrl:user.avatarUrl,     
          name: user.fullName,
          authorDesc: user.custom.aboutYourSelf,
          id: user.id,
          acl:{read:{user:['ALL'], groups:[]}, rw:{user:['NONE'], groups:[]}, admin:{user:[user.id],groups:[]}}
        }

        var response = kuasarsServiceLocator.saveEntity("searchAuthor",searchAuthor);
        response.then(function(){$(location).attr('href',"dashboard.html");}, null);
    }, null);
  }

  function loginSignUpCallbackError (data){
     $scope.loginFormData = {};
  }

  }]);


})();
