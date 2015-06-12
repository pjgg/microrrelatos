

$(document).ready(function() {

	Kuasars.Core.init("PRO", "v1", "542e58c1e4b0e502ef2c239b");
	$("#logOut > a").click(function(){logOut()});
	historyInit();

	function historyInit(){
		
		if(sessionStorage.getItem("sToken") === null){
			 $(location).attr('href',"index.html");
		}

		Kuasars.Core.token = sessionStorage.getItem("sToken");
		Kuasars.Users.getSession({"appId":"542e58c1e4b0e502ef2c239b"}, function(error, response) {
    	if(error) {
     		console.error(response.message);
    	} else {
    		getUserById(response.userId);
    	}
		});
	
	}

	function getUserById(uId){
		Kuasars.Users.get(uId ,function(error, response) { 
    	if (error) { 
        	console.error(response.message);
    	} else {
        	sessionStorage.setItem("user", response);
        	$("#mainMenuUserBtn").text(response.fullName);
    	} 
		});
	}

	function logOut(){
		Kuasars.Users.logout(function(error, response){	});
		sessionStorage.clear();
	}

});