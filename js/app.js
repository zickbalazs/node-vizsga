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
    $scope.events = [];
    if (window.localStorage.getItem('vizsgak')!=null) $scope.events = angular.fromJson(window.localStorage.getItem('vizsgak'));
    $scope.upload;
    $scope.Upload = function(){
        if (Object.values($scope.upload).includes('')) alert('Hibás adatok!');
        else{
            let start = new Date(`${$scope.upload.date.toISOString().split('T')[0]}T${$scope.upload.start.toISOString().split('T')[1].split('.')[0]}`),
                end = new Date(`${$scope.upload.date.toISOString().split('T')[0]}T${$scope.upload.end.toISOString().split('T')[1].split('.')[0]}`) 
            let newdata = {
                name: $scope.upload.name,
                teacher: $scope.upload.teacher,
                date: $scope.upload.date,
                start: start.setDate(start.getDate() + 1),
                end: end.setDate(end.getDate() + 1),
                room: $scope.upload.room,
                people: $scope.upload.people
            }
            $scope.events.push(newdata);
            $scope.Save();
            $scope.init();
        }
    }
    $scope.Save = function(){
        window.localStorage.setItem('vizsgak', angular.toJson($scope.events));
    }
    $scope.init = function(){
        $scope.upload = {
            name:'',
            teacher:'',
            date:'',
            start:'',
            end:'',
            room:''
        };
        let calendar = new FullCalendar.Calendar(document.querySelector('#calendar'), {
            initialView: 'dayGridMonth',
            height: "750px",
            nowIndicator:true,
            headerToolbar:{
                start:'title',
                center:'listWeek,dayGridMonth',
                end: 'today prev,next'
            },
            themeSystem:'bootstrap5',
            selectable:true,
            events:$scope.ConvertEvents(),
            select: function(info){
                $scope.Selected = true;
                $scope.upload.date = info.start
            },
            unselect: function(){
                $scope.Selected = false;
            }

        });
        calendar.render();
    }
    $scope.ConvertEvents = function(){
        let tomb = [];
        $scope.events.forEach(e=>{
            tomb.push({
                title:`${e.name} - ${e.teacher}`,
                startStr:new Date(e.start).toISOString(),
                endStr:new Date(e.end).toISOString()
            })
        })
        console.log(tomb);
        return tomb;
    }
    $scope.Selected = true;
    $scope.init();
})
app.controller('userController', function($scope){
    $scope.init = function(){
        let calendar = new FullCalendar.Calendar(document.querySelector('#calendar'), {
            initialView: 'dayGridMonth',
            height: "100%",
        });
        calendar.render();
    }
    $scope.Selected = true;
    $scope.init();
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