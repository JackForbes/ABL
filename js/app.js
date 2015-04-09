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
.config(function($routeProvider, $mdThemingProvider, $mdIconProvider) {
  $routeProvider.when('/craigslist', {
    templateUrl: 'partials/craigslist.html',
    controller: 'AdCtrl'
  });
  $routeProvider.otherwise({
    redirectTo: '/',
    templateUrl: 'partials/main.html',
    controller: 'AppCtrl'
  });

  $mdIconProvider
      .defaultIconSet("./assets/svg/avatars.svg", 128)
      .icon("menu"       , "./assets/svg/menu.svg"        , 24)
      .icon("share"      , "./assets/svg/share.svg"       , 24)
      .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
      .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
      .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
      .icon("phone"      , "./assets/svg/phone.svg"       , 512);

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
