(function(){

  angular
       .module('todo')
       .controller('TodoController', [
          'todoService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
          TodoController
       ]);

  /**
   * Main Controller for the Angular Material Todo App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function TodoController( todoService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.newListName  = '';
    self.newTodoTitle = '';
    self.selected     = null;
    self.lists        = [ ];
    self.addList      = addList;
    self.addTodo      = addTodo;
    self.removeTodo   = removeTodo;
    self.getAvatar    = getAvatar;
    self.selectList   = selectList;
    self.toggleList   = toggleList;
    self.share        = share;

    // Load all registered lists

    todoService
          .loadAllLists()
          .then( function( lists ) {
            self.lists    = [].concat(lists);
            self.selected = lists[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Add a list
     * @param name
     */
    function addList(name) {
      var newList = { name: name, avatar: getAvatar(), todos: [] };
      self.lists.push(newList);
      selectList(newList);
      self.newListName = '';
    }

    /**
     * Add a todo item
     * @param title
     */
    function addTodo(title) {
      var newTodo = { title: title, done: false };
      self.selected.todos.push(newTodo)
      self.newTodoTitle = '';
    }

    /**
     * Remove a todo item
     * @param title
     */
    function removeTodo(index) {
      self.selected.todos.splice(index, 1);
    }

    /**
     * Create Avatar SVG String
     */
    function getAvatar() {
      var avatarNum = self.lists.length + 1;
      var avatar = 'svg-' + avatarNum.toString();
      return avatar;
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectList ( list ) {
      self.selected = angular.isNumber(list) ? $scope.lists[list] : list;
      self.toggleList();
    }

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Show the bottom sheet
     */
    function share($event) {
        var list = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'todo/view/shareSheet.html',
          controller: [ '$mdBottomSheet', TodoSheetController ],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function TodoSheetController( $mdBottomSheet ) {
          this.list = list;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
