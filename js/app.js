//TODO: 
//ADMIN - manage vizsgák
//USER - Interact w/ vizsgák

let app = angular.module('vizsga', ['ngRoute']);


app.config(function ($routeProvider){
    $routeProvider
    .when('/', {templateUrl:'./views/login.html', controller:'loginController'})
    .when('/dashboard', {templateUrl:'./views/user.html', controller:'userController'})
    .when('/admin', {templateUrl:'./views/admin.html', controller:'adminController'})
    .otherwise('/');
})

app.controller('adminController', function($scope){
    
})
app.controller('userController', function($scope){

})
app.controller('loginController', function($scope){

})

app.controller('menu', function($scope){
    $scope.links = [
        {
            'link':'/',
            'name':'Menü'
        },
        {
            'link':'/admin',
            'name':'Admin'
        },
        {
            'link':'/dashboard',
            'name':'Jelentkezés'
        },
    ]
});