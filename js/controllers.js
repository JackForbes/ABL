'use strict'

// Angular Controllers Go Here
angular.module('myApp.controllers', [])
.controller('AppCtrl', ['$scope', '$http', '$location', '$window', '$mdSidenav', '$mdDialog', 'appConstants', 'AppData', 'Utilities', function($scope, $http, $location, $window, $mdSidenav, $mdDialog, appConstants, AppData, Utilities) {

      $scope.hourStart = 6;
      $scope.testing = 4;
      $scope.sliders = [[6,4,1]];

      $scope.shown = {
          brand: {},
          store: {},
          job: -1,
          jobTab: 0,
          questionType: 'singlechoice'
      };

      $http.get(appConstants.urlBase + 'brands').
          success(function(data, status, headers, config) {
              $scope.brands = data.brands;
          }).
          error(function(data, status, headers, config) {
              var dialogTitle = 'Error Loading Data';
              var dialogMessage = 'Unable to get brands';
              Utilities.showAlert(dialogTitle, dialogMessage);
          });

      $http.get(appConstants.urlBase + 'display_info').
          success(function(data) {
              $scope.displayData = data.display_data;
              $scope.questionCategories = data.questions_categories;
          }).
          error(function(data, status, headers, config) {
              var dialogTitle = 'Error Loading Data';
              var dialogMessage = 'Unable to get display info';
              Utilities.showAlert(dialogTitle, dialogMessage);
          });

      $http.get(appConstants.urlBase + 'users').
          success(function(data) {
              $scope.users = data;
          }).
          error(function(data, status, headers, config) {
              var dialogTitle = 'Error Loading Data';
              var dialogMessage = 'Unable to get users';
              Utilities.showAlert(dialogTitle, dialogMessage);
          });

      $scope.viewUsers = function(ev) {
        $mdDialog.show({
          controller: 'UsersCtrl',
          locals: {users: $scope.users},
          templateUrl: 'partials/users.html',
          targetEvent: ev
        })
        .then(function(answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.alert = 'You cancelled the dialog.';
        });
      };

      $scope.setShownStore = function(brandId, storeIndex, storeId) {
          $scope.shown.brand.id = brandId;
          $scope.shown.brand.index = $scope.brands.getIndexBy('id', brandId);
          $scope.shown.store.index = storeIndex;
          $scope.shown.store.id = storeId;
          $http.get(appConstants.urlBase + 'stores/' + storeId + '/jobs').
              success(function(data) {
                  $scope.jobs = data;
              });

          $scope.loadManagers();
      };

      $scope.toggle = function(type, index) {
          if ($scope.shown[type] == index) {
              $scope.shown[type] = -1;
          } else {
              $scope.shown[type] = index;
          }
      };

      $scope.addBrand = function(newBrand) {
          $.post(appConstants.urlBase + 'brands', newBrand)
              .done(function(brandData) {
                  $scope.brands.push({id: brandData.id, name: brandData.name, stores: []});
                  $scope.$apply();
              });
      };

      $scope.addStore = function(brandId, storeDetails) {
          var postData = Utilities.buildNewStoreObject(brandId, storeDetails);

          $.post(appConstants.urlBase + 'stores', postData)
              .done(function(storeData) {
                  var brandIndex = $scope.brands.getIndexBy('id', brandId);
                  $scope.brands[brandIndex].stores.push({id: storeData.id, location: storeData.location, jobs: []});
                  $scope.setShownStore(brandIndex, $scope.brands[brandIndex].stores.length - 1, storeData.id);
                  $scope.$apply();
              });
      };

      $scope.addJob = function() {
          var newJob = AppData.mockJob;
          newJob.traits = $scope.displayData.traits;
          $scope.jobs.push(newJob);
          $scope.toggle('job', $scope.jobs.length - 1);
      };

      $scope.addQuestion = function(ev, newQuestion) {
          $.ajax({
              url: appConstants.urlBase + 'questions',
              data: newQuestion,
              type: 'POST',
              success: function(questionData) {
                  var categoryIndex = $scope.questionCategories.getIndexBy('name', newQuestion.category);
                  if (categoryIndex >= 0) {
                      $scope.questionCategories[categoryIndex].questions.push(questionData);
                      $scope.newQuestion = {};
                      var dialogTitle = 'New Question Created';
                      var dialogMessage = 'Question successfully created';
                      Utilities.showAlert(ev, dialogTitle, dialogMessage);
                  }
              },
              error: function(errorData) {
                  var dialogTitle = 'Sorry, Eh?';
                  var dialogMessage = 'We ran into a problem creating the question';
                  Utilities.showAlert(ev, dialogTitle, dialogMessage);
              }
          });
      };

      $scope.addOption = function(question, newOption, newQuestion) {
          if (newQuestion && !question.options) {
              question.options = [];
              question.options.push({title: newOption, important: false});
          } else if (question.options.getIndexBy('title', newOption) < 0) {
              question.options.push({title: newOption, important: false});
          }
      };

      $scope.removeOption = function(question, optionIndex) {
          question.options.splice(optionIndex, 1);
      };

      $scope.createJob = function(ev, job, storeId) {
          if (job.id) {
            var copyJob = true;
          }
          var postData = job;
          postData.store_id = storeId;
          console.log('create job post data', postData);

          $.post(appConstants.urlBase + 'jobs', job)
              .done(function(jobData) {
                  var dialogTitle = jobData.position + ' Created';
                  var dialogMessage = 'Job successfully created';
                  Utilities.showAlert(ev, dialogTitle, dialogMessage);
                  job.id = jobData.id;

                  if (copyJob) {
                      $scope.showCopyJob(storeId);
                  }
              });
      };

      $scope.removeQuestion = function(qIndex) {
          $scope.jobs[$scope.shown.job].questions.splice(qIndex, 1);
      };

      $scope.copyJob = function(ev, job, copyToStoreId) {
          var copyJob = job;
          copyJob.position = job.position + ' copy';
          console.log('copyJob', copyJob);
          $scope.createJob(ev, copyJob, copyToStoreId);
      };

      $scope.showCopyJob = function(storeId) {
          for (var i = 0; i < $scope.brands.length; i++) {
            var storeIndex = $scope.brands[i].stores.getIndexBy('id', storeId);
            if (storeIndex >= 0) {
              $scope.setShownStore($scope.brands[i].id, storeIndex, storeId);
              $scope.toggle('job', $scope.brands[i].stores.length - 1);
              break;
            }
          }
      };

      $scope.saveJob = function(ev, job) {
          if (!job.id) {
              $scope.createJob(ev, job, $scope.shown.store.id);
          }
          else {
              job.store_id = $scope.shown.store.id;
              $.ajax({
                  url: appConstants.urlBase + 'jobs/' + job.id,
                  data: job,
                  type: 'POST',
                  success: function(jobData) {
                      console.log('job postback data', jobData);
                      var dialogTitle = jobData.position + ' Updated';
                      var dialogMessage = 'Changes successfully saved';
                      Utilities.showAlert(ev, dialogTitle, dialogMessage);
                  }
              });
          }
      };

      $scope.loadManagers = function() {
          $scope.managers = [];
          var storeId = $scope.shown.store.id;
          for (var i = 0; i < $scope.users.length; ++i) {
              if ($scope.users[i].stores.indexOf(storeId) >= 0) {
                  $scope.managers.push($scope.users[i]);
              }
          }
      };

      $scope.setActiveQuestion = function(index) {
          $scope.activeQuestion = index;
      };

      $scope.createAd = function(job) {
          var absUrl = $location.absUrl() + 'craigslist?store=' + $scope.shown.store.id + '&job=' + job.id;
          $window.open(absUrl);
          // AppData.adJob = job;
      }

      $scope.treeOptions = {
          dropped: function(e) {
              // Copy question and add it back after dropping
              var copy = angular.copy(e.source.nodeScope.$modelValue);
              e.source.nodesScope.$modelValue.push(copy);
          }
          // accept: function(sourceNodeScope, destNodesScope, destIndex) {
          //     return false;
          // },
          // dragStart: function(event) {
          //     event.elements.placeholder.replaceWith(event.elements.dragging.clone().find('li'));
          // },
          // dragStop: function(event) {
          //     $scope.questionCategories = angular.copy(questionCategories);
          // }
      };

      // Side Nav
      $scope.nav = {
          left: true,
          right: false
      };

      $scope.toggleSidenav = function(side) {
          $scope.nav[side] = !$scope.nav[side];
      };

}])
.controller('UsersCtrl', function($scope, $mdDialog, $mdToast, appConstants, users) {

  $scope.users = users;

  $scope.createUser = function(newUser) {
    $.ajax({
        url: appConstants.urlBase + 'users',
        data: newUser,
        type: 'POST',
        success: function(newUserPassword) {
            $scope.users.push(newUser);
            $scope.newUser = {};

            $mdToast.show(
              $mdToast.simple()
                .content('New User Successfully Created')
                .position('bottom right')
                .hideDelay(5000)
            );
        },
        error: function(errorData) {
        }
    });
  }

  $scope.hide = function() {
    $mdDialog.hide();
  };
})
.controller('AdCtrl', function($scope, $mdDialog, $location, $http, appConstants, Utilities) {

  var searchParams = $location.search();
  if (searchParams.store && searchParams.job) {
    $scope.storeId = searchParams.store;
    $scope.jobId = searchParams.job;
    $http.get(appConstants.urlBase + 'brands').
        success(function(data) {
            for (var i = 0; i < data.brands.length; i++) {
                var storeIndex = data.brands[i].stores.getIndexBy('id', $scope.storeId);
                if (storeIndex >= 0) {
                    $scope.brand = data.brands[i];
                    $scope.store = data.brands[i].stores[storeIndex];
                    break;
                }
            }
        }).
        error(function(data, status, headers, config) {
            var dialogTitle = 'Error Loading Data';
            var dialogMessage = 'Unable to get brands';
            Utilities.showAlert(dialogTitle, dialogMessage);
        });

    $http.get(appConstants.urlBase + 'stores/' + $scope.storeId + '/jobs').
        success(function(jobs) {
            jobs.forEach(function(job) {
                if (job.id == $scope.jobId) {
                  $scope.adJob = job;
                  console.log('job', job);
                }
            });
        });
  } else {
    var dialogTitle = 'Error Loading Data';
    var dialogMessage = 'Store ID and job ID not included in url parameters';
    Utilities.showAlert(dialogTitle, dialogMessage);
  }

  $scope.copyHtml = function(ev) {
    var html = document.getElementById('ad-html').innerHTML;
    console.log('html', html);
    html = html.replace(/class=\"(.*?)\"/g, "");
    html = html.replace(/<!--(.*?)-->/g, "");
    html = html.replace(/ng-repeat=\"(.*?)\"/g, "");
    console.log('html', html);
    $mdDialog.show(
      $mdDialog.alert()
        .title('HTML to copy')
        .content(html)
        .ariaLabel('Copy HTML')
        .ok('Got it!')
        .targetEvent(ev)
    );
  }
});

Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
    return -1;
}
