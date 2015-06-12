

$(document).ready(function() {

	Kuasars.Core.init("PRO", "v1", "542e58c1e4b0e502ef2c239b");
	$("#reqVerificationCodeBtn").click(function(){verificationCode()});
	$("#signUpBtn").click(function(){signUp()});
	$("#signIn").click(function(){loginByEmail($("#loginEmail").val(), $("#loginPassword").val())});

	function loginByEmail(email, password){

		Kuasars.Users.loginByEmail({
  		email: email,
  		password: password}, function(error, response) {
    	if(error) {
     		console.error(response.message);
    	} else {
			sessionStorage.setItem("sToken", response.sessionToken);
		    $(location).attr('href',"history.html");
    	}
		});
	}


	function signUp(){

		var name = $("#signUpName").val();
		var password = $("#signUpPassword").val();
		var verificationCode = $("#verificationCode").val();
		var email = $("#emailVerificationCode").val();
		console.log("email" + email);
		var myUser = {  
		  fullName: name,
		  authentication: { 
		    email: {
		      email: email,
		      password: password,
		      validationCode  : verificationCode
		    }
		  }
		};
		
		Kuasars.Users.register({user: myUser}, function(error, response) {
		  if(error)
		    console.error(response);
		  else{
		    loginByEmail(email, password);
			}
		});
	}

	function verificationCode(){
		Kuasars.Users.requestCodeToRegister({email: $("#emailVerificationCode").val()}, function(error, response) {
		  if(error) {
		    alert(response.message);
		  }else{
		  	$("#emailVerificationCode").hide();
		  	$("#reqVerificationCodeBtn").hide();
		  	$("#signUpRegister").show();
		  	$("#registerStatus").text("Check your email, paste your verification code, and welcome!");
		  } 
		});
	}
	
});