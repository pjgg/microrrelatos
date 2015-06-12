(function() {

var myApp = angular.module('injectableThoughts', []);

   
myApp.provider('kuasarsServiceLocator',function() {

    this.appID = 'Default';
    this.finalResponse = 'test';

    this.$get = function($q) {
        var appID = this.appID;
        var finalResponse = "default";
        return {
                currentTime: function() {
                    var SDKcurrentTime = Kuasars.toPromise(Kuasars.Core.currentTime);
                    var deferred = $q.defer();
                    SDKcurrentTime().then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },
                
                login: function(email, password) {
                     var SDKloginUser = Kuasars.toPromise(Kuasars.Users.loginByEmail);
                     var deferred = $q.defer();
                     SDKloginUser({email: email,password: password}).then(function(successResponse){
                     sessionStorage.setItem("kuasarsSessionToken", successResponse.sessionToken);
                     sessionStorage.setItem("userId", successResponse.userId);
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                 logout: function() {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKlogout = Kuasars.toPromise(Kuasars.Users.logout);
                     var deferred = $q.defer();
                     SDKlogout().then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                verificationCodeRequest: function(email) {
                     var SDKVerificationCode = Kuasars.toPromise(Kuasars.Users.requestCodeToRegister);
                     var deferred = $q.defer();
                     SDKVerificationCode({email: email}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                signup: function(email, password, verificationCode, name, custom) {
                     var SDKRegisterUser = Kuasars.toPromise(Kuasars.Users.register);
                     var deferred = $q.defer();
                     var newUser = {  
                          fullName: name,
                          authentication: { 
                            email: {
                              email: email,
                              password: password,
                              validationCode  : verificationCode
                            }
                          },
                          custom:custom
                        };
                     SDKRegisterUser({user:newUser}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                getUserById: function(userId) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKgetUser = Kuasars.toPromise(Kuasars.Users.get);
                     var deferred = $q.defer();
                     SDKgetUser({userId:userId}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                replaceUser: function(name, custom, avatarUrl) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKreplaceUser = Kuasars.toPromise(Kuasars.Users.replace);
                     var deferred = $q.defer();
                     var updatedUser = {  
                          fullName: name,
                          custom: custom
                        };
                     
                     if(avatarUrl){
                        updatedUser.avatarUrl = avatarUrl;
                     }

                     SDKreplaceUser({userId:sessionStorage.getItem("userId"), user:updatedUser}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                saveEntity: function(type, entity) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKsaveEntity = Kuasars.toPromise(Kuasars.Entities.save);
                     var deferred = $q.defer();
                     SDKsaveEntity({ type: type, entity: entity }).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                replaceEntity: function(type, entityID, entity) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKreplaceEntity = Kuasars.toPromise(Kuasars.Entities.replace);
                     var deferred = $q.defer();
                     SDKreplaceEntity({ entityId: entityID, type: type, entity: entity}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                makeEntityAnonymous: function(type, entityID, isAnonymous) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKreplaceEntityAcl = Kuasars.toPromise(Kuasars.Entities.replaceACL);
                     var deferred = $q.defer();
                     var anonymousValue = 'NONE';
                     if(isAnonymous === true){anonymousValue = "?";} 
                     var newACL =   {
                        admin: {
                            groups: [''],
                            user: [sessionStorage.getItem("userId")]
                        },
                        read: {
                            groups: [''],
                            user: [anonymousValue]
                        },
                        rw: {
                            groups: [''],
                            user: ['NONE']
                        }
                    };
                    
                     SDKreplaceEntityAcl({ type: type, entityId: entityID, acl: newACL}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                 findEntities: function(entityType, where, limit, skip, orderField, direction, projectedFields) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKfindEntity = Kuasars.toPromise(Kuasars.Entities.query);
                     var deferred = $q.defer();
                     var query = {
                        where : where || {},
                        limit : limit || 10,
                        skip : skip || 0,
                        order:[{field : orderField || {}, direction : direction || {}}],
                        fields: projectedFields || {},
                        type : "FIND"
                    }

                     SDKfindEntity({type : entityType, query : query}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                countEntities: function(entityType, where) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKfindEntity = Kuasars.toPromise(Kuasars.Entities.query);
                     var deferred = $q.defer();
                     var query = {
                        where : where || {},
                        type : "COUNT"
                    }

                     SDKfindEntity({type : entityType, query : query}).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },

                getEntitiesById: function(entityType, id) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKgetEntity = Kuasars.toPromise(Kuasars.Entities.get);
                     var deferred = $q.defer();
                     var query = {
                        type : entityType,
                        entityId : id
                    }

                     SDKgetEntity(query).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                },
                runHostedCodeFunction: function(functionName, params, wait) {
                     Kuasars.Core.token = sessionStorage.getItem("kuasarsSessionToken");
                     var SDKrunHostedCodeFunction = Kuasars.toPromise(Kuasars.Code.executeFunction);
                     var deferred = $q.defer();
                     var options = {
							name : functionName,
							parameters : params.split(","),
							wait : wait
						};

                     SDKrunHostedCodeFunction(options).then(function(successResponse){
                     deferred.resolve(successResponse);
                    }, function(errorResponse){
                        deferred.reject(errorResponse); 
                    });

                    return deferred.promise;
                }
        }
    };

    this.setAppId = function(appId) {
        this.appID = appId;
    };

    this.setFinalResponse = function(response){
        this.response = response;
    };
});

            
myApp.config(function(kuasarsServiceLocatorProvider){
    Kuasars.Core.init("PRO", "v1", "542e58c1e4b0e502ef2c239b");
    kuasarsServiceLocatorProvider.setAppId("542e58c1e4b0e502ef2c239b");
});


})();
