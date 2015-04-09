'use strict';

/* Services */
angular.module('myApp.services', []).
  service('AppData', [function() {
    return {
      mockJob: {
        about: '',
        category: '',
        requirements: '',
        education: '',
        experience: '',
        hours: {
          sunday: [false, false, false ],
          monday: [false, false, false ],
          tuesday: [false, false, false ],
          wednesday: [false, false, false ],
          thursday: [false, false, false ],
          friday: [false, false, false ],
          saturday: [false, false, false ]
        },
        position: '',
        questions: [],
        salary: null,
        status: '',
        summary: ''
      },
      adJob: {}
    };
  }])
  .service('Utilities', ['$mdDialog', function($mdDialog) {
    return {
      showAlert: function(ev, title, message) {
        $mdDialog.show(
          $mdDialog.alert()
            .title(title)
            .content(message)
            .ariaLabel(title)
            .ok('Got it!')
            .targetEvent(ev)
        );
      },
      buildNewStoreObject: function(brandId, storeDetails) {
        var components = {
          street_number: '',
          route: '',
          locality: '',
          administrative_area_level_1: '',
          postal_code: ''
        }

        var componentForm = {
          street_number: 'long_name',
          route: 'long_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          postal_code: 'long_name'
        };

        for (var i = 0; i < storeDetails.address_components.length; i++) {
          var addressType = storeDetails.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = storeDetails.address_components[i][componentForm[addressType]];
            components[addressType] = val;
          }
        }

        var street = components.street_number + ', ' + components.route;
        var city = components.locality;
        var state = components.administrative_area_level_1;
        var zipcode = components.postal_code;
        var latitude = storeDetails.geometry.location.k;
        var longitude = storeDetails.geometry.location.D;

        return { brand_id: brandId, street: street, city: city, state: state, zipcode: zipcode, latitude: latitude, longitude: longitude };
      }
    }
  }]);
