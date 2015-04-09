'use strict';

// Declare app level module which depends on controllers, directives, filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngAutocomplete',
  'ui.tree',
  'myApp.controllers',
  'myApp.directives',
  'myApp.filters',
  'myApp.services'
])
.config(function($routeProvider, $mdThemingProvider) {
  $routeProvider.when('/craigslist', {
    templateUrl: 'partials/craigslist.html',
    controller: 'AdCtrl'
  });
  $routeProvider.otherwise({
    redirectTo: '/',
    templateUrl: 'partials/main.html',
    controller: 'AppCtrl'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '500',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
    .accentPalette('green', {
      'default': '500'
    });
})
.constant("appConstants", {
    "urlBase": 'http://higherme.com/api/'
});
