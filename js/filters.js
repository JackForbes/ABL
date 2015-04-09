'use strict'

// Angular Filters Go Here
angular.module('myApp.filters', [])
.filter('convertTime', function() {
  return function(time) {
    if (time > 12) {
      return time - 12;
    }
    return time;
  };
});
