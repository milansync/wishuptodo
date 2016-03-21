
var app = angular.module('todo', ['ui.router','ui.bootstrap']);





app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider,$locationProvider){

        $urlRouterProvider.otherwise('/login');

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'template/index.html',
          controller: 'MainCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
                if(!auth.islogIn()){
                    $state.go('login');
                }
            }],
        })

          .state('login', {
          url: '/login',
          templateUrl: 'template/login.html',
          controller: 'loginCtrl',
              onEnter: ['$state', 'auth', function($state, auth){
                  if(auth.islogIn()){
                      $state.go('home');
                  }
              }],
      });







    }]);

app.factory('Todos', function($http) {
    return {
        get : function(token) {
            return $http.post('/api/fetch', token);
        },
        create : function(todoData) {
            return $http.post('/api/todos', todoData);
        },
        delete : function(id, token) {
            console.log(id);
            return $http.delete('/api/todos/' + id +'/' + token);
        },
        snooze : function(id,token){
            return $http.get('/api/todo/' + id +'/' + token)
        },
        todo:function(data){


            for(var i=0;i<data.length;i++)
            {
                data[i].fulltodo=data[i].text+" at "+data[i].location;

            }

          console.log(data) ;
            return data;
        }

    }
});




app.factory('auth', ['$http', '$window', '$rootScope','$state', function($http, $window, $rootScope,$state){
    var auth = {
        saveToken: function (token){
            $window.localStorage['ftoken'] = token;
        },

        getToken: function (){
            return $window.localStorage['ftoken'];
        },
        logFace:function(){
        return $http.get('/auth/facebook').success(function(data){
                console.log(data);
                auth.saveToken(data.token);
                $state.go('home');
            });
        }

        islogIn:function(){

            var token=auth.getToken();
            if(token){
                return true;
            }
            else{
                return false;
            }
        },

        register: function(user){
            return $http.post('/signup', user).success(function(data){
                console.log(data);
                auth.saveToken(data.token);
                $state.go('home');
            });
        },

        logIn: function(user){
            return $http.post('/login', user).success(function(data){
                console.log(data);
                auth.saveToken(data.token);
                $state.go('home');
            });
        },
        logOut: function(){

            $window.localStorage.removeItem('ftoken');
            $state.go('login');
        }
    };

    return auth;
}]);



app.controller('MainCtrl',[
    '$scope',
    '$http',
    'auth',
    'Todos',

    function($scope, $http, auth, Todos) {
    $scope.formData = {};
        var tok={
            'token' : auth.getToken()
        }

    Todos.get(tok).success(function(data){

        $scope.todos=Todos.todo(data.todo);
    });


    $scope.createTodo = function() {

            $scope.formData.token=auth.getToken();

            console.log($scope.formData);
        $scope.formData.location=document.getElementById('pac-input').value;

            Todos.create($scope.formData).success(function(data) {
                    $scope.formData = {};
                    $scope.todos = Todos.todo(data);



                });

    };

        $scope.logout= function(){

            auth.logOut();
        };



    $scope.deleteTodo = function(id) {
        Todos.delete(id, auth.getToken()).success(function(data) {
                $scope.todos = Todos.todo(data); // assign our new list of todos
            });
    };
   $scope.snoozeTodo = function(id) {
            Todos.snooze(id, auth.getToken()).success(function(data) {
                $scope.todos = Todos.todo(data); // assign our new list of todos
            });
        };

}]);






app.controller('loginCtrl',[
    '$scope',
    '$http',
    'auth',
    'Todos',

    function($scope, $http, auth, Todos) {

        $scope.login=function() {

            var data = {
                'email': $scope.email,
                'password': $scope.password
            };

            auth.logIn(data);

        };
        
        $scope.facebook=function() {

            auth.logFace();

        };
        $scope.signup=function() {

            var data = {
                'email': $scope.email,
                'password': $scope.password
            };

            auth.register(data);

        };



    }]);



