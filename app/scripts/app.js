'use strict';

/**
 * @ngdoc overview
 * @name microrrelatosApp
 * @description
 * # microrrelatosApp
 *
 * Main module of the application.
 */
(function() {
  var app = angular.module('microrrelatos', ['history','writers','new','settings','wall','injectableThoughts']);

 app.controller('TabController',[ '$scope', 'kuasarsServiceLocator', function($scope, kuasarsServiceLocator){
    this.tab = 1;
    $scope.userName = sessionStorage.getItem('userName');
    $scope.isMobile = sessionStorage.getItem('isMobile');

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };

    this.logOut = function(){
      var i = sessionStorage.length;
      while(i--) {
      var key = sessionStorage.key(i);
      sessionStorage.removeItem(key); 
    }
    kuasarsServiceLocator.logout();
    $(location).attr('href','index.html');
    };

    $scope.$on('reloadTab', function(event, value) {
      this.tab = value;
    });
  }]);



})();
