(function(){
  'use strict';

  angular.module('todo')
         .service('todoService', ['$q', TodoService]);

  /**
   * Lists DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function TodoService($q){
    var lists = [
      {
        name: 'Groceries',
        avatar: 'svg-1',
        todos: [
          { title: 'Milk', done: false },
          { title: 'Fruit', done: false },
          { title: 'Bread', done: false },
          { title: 'Cereal', done: false },
          { title: 'Sandwich Meat', done: false },
          { title: 'Vegetables', done: false }
        ]
      },
      {
        name: 'Clean',
        avatar: 'svg-2',
        todos: [
          { title: 'Kitchen', done: false },
          { title: 'Bathroom', done: false },
          { title: 'Vacuum', done: false },
          { title: 'Windows', done: false }
        ]
      },
      {
        name: 'Car',
        avatar: 'svg-3',
        todos: [
          { title: 'Oil Change', done: false },
          { title: 'Check Tire Pressure', done: false },
          { title: 'Check Brakes', done: false }
        ]
      },
      {
        name: 'Pack For Vancouver',
        avatar: 'svg-4',
        todos: [
          { title: 'Passport', done: false },
          { title: 'Green Card', done: false },
          { title: 'Laptop + Charger', done: false },
          { title: 'Phone + Charger', done: false }
        ]
      },
      {
        name: 'Coding Challenge',
        avatar: 'svg-5',
        todos: [
          { title: 'View Items', done: true },
          { title: 'Add Items', done: true },
          { title: 'Delete Items', done: true }
        ]
      }
    ];

    // Promise-based API
    return {
      loadAllLists : function() {
        // Simulate async nature of real remote calls
        return $q.when(lists);
      }
    };
  }

})();
