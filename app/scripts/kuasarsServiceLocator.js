(function() {

var myApp = angular.module('injectableThoughts', []);

   
myApp.provider('kuasarsSeviceProvider', function() {

    this.appID = 'Default';

    this.$get = function() {
        var appID = this.appID;
        return {
            sayHello: function() {
                
                Kuasars.Core.currentTime(); 
                return "Hello, " + appID + "!";
            }

            login: function(email, password){
                Kuasars.Users.loginByEmail({
                email: email,
                password: password}, function(error, response) {
                if(error) {
                    console.error(response.message);
                } else {
                    sessionStorage.setItem("sToken", response.sessionToken);
                    alert(response.sessionToken);
                }
                return "eco";
                });
            }
        }
    };

    this.setAppId = function(appId) {
        this.appID = appId;
    };
});

            
myApp.config(function(helloWorldProvider){
    Kuasars.Core.init("PRO", "v1", "542e58c1e4b0e502ef2c239b");
    helloWorldProvider.setAppId("542e58c1e4b0e502ef2c239b");
});


})();
