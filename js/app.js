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
    $scope.IsEvent = false;
    $scope.CurrentEvent = {};
    if (window.localStorage.getItem('vizsgak')!=null) $scope.events = angular.fromJson(window.localStorage.getItem('vizsgak'));
    $scope.upload;
    $scope.Upload = function(){
        if (Object.values($scope.upload).includes('')) alert('Hibás adatok!');
        else{
            let start = new Date(`${$scope.upload.date.toISOString().split('T')[0]}T${$scope.upload.start.toISOString().split('T')[1].split('.')[0]}`),
                end = new Date(`${$scope.upload.date.toISOString().split('T')[0]}T${$scope.upload.end.toISOString().split('T')[1].split('.')[0]}`) 
            let newdata = {
                id: $scope.events.length,
                name: $scope.upload.name,
                teacher: $scope.upload.teacher,
                date: $scope.upload.date,
                start: start.setDate(start.getDate() + 1),
                end: end.setDate(end.getDate() + 1),
                room: $scope.upload.room,
                max: $scope.upload.people,
                people: []
            }
            $scope.events.push(newdata);
            $scope.Save();
            $scope.Selected = false;
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
            dateClick: function(info){
                $scope.Selected = true;
                $scope.upload.date = info.date
            },
            eventClick: function(info){
                $scope.IsEvent = true;
                $scope.CurrentEvent = info.event
                console.log($scope.CurrentEvent);
            }

        });
        calendar.render();
    }
    $scope.ConvertEvents = function(){
        let tomb = [];
        $scope.events.forEach(e=>{
            tomb.push({
                id: e.id,
                title:`${e.name} - ${e.teacher}`,
                start:new Date(e.start).toISOString(),
                end:new Date(e.end).toISOString(),
                people: e.people,
                max: e.max
            })
        })
        console.log(tomb);
        return tomb;
    }
    $scope.Selected = false;
    $scope.init();
})
app.controller('userController', function($scope){
    $scope.events = window.localStorage.getItem('vizsgak')==null ? [] : angular.fromJson(window.localStorage.getItem('vizsgak'));
    $scope.Selected = false;
    $scope.selected = {};
    $scope.student = {};
    $scope.init = function(){
        let calendar = new FullCalendar.Calendar(document.querySelector('#calendar'), {
            initialView: 'dayGridMonth',
            height: "650px",
            headerToolbar:{
                start:'title',
                center:'listWeek,dayGridMonth',
                end: 'today prev,next'
            },
            selectable:true,
            events: $scope.ConvertEvents(),
            eventClick: function(info){
                let event = info.event
                $scope.Selected = true;
                $scope.selected = $scope.setSelection(event);
            }

        });
        calendar.render();
    }

    $scope.setSelection = function(event){
        let object = {
            teacher: event.title.split('-')[1].trim(),
            name:event.title.split('-')[0].trim(),
            room:event.extendedProps.room,
            date:event.start,
            signups:`${event.extendedProps.current}/${event.extendedProps.limit}`,
            id:event.id
        }
        return object;
    }
    $scope.SignUp = function(){
        if (Object.values($scope.selected).length==0) alert('Nem választott vizsgát!');
        else if (Object.values($scope.student).length==3 && !Object.values($scope.student).includes('')){
            if ($scope.events[$scope.selected.id].length!=$scope.events[$scope.selected.id].max){
                $scope.events[$scope.selected.id].people.push($scope.student)
                alert('Sikeres vizsgafelvétel!');
                window.localStorage.setItem('vizsgak', angular.toJson($scope.events));
                $scope.Selected = false;
            }
            else alert('Erre a vizsgára sajnos már nem lehet jelentkezni!');
        }
        else alert('Nem megfelelőek a bemeneti adatok!')
    }

    $scope.ConvertEvents = function(){
        let tomb = [];
        $scope.events.forEach(e=>{
            tomb.push({
                id: e.id,
                title:`${e.name} - ${e.teacher}`,
                start:new Date(e.start).toISOString(),
                end:new Date(e.end).toISOString(),
                room: e.room,
                limit: e.max,
                current: e.max - e.people.length
            })
        })
        return tomb;
    }
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