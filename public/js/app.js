angular.module('myApp', ['ui.router', 'ngStorage'])

.config(function($stateProvider, $urlRouterProvider) {
	// default route
   	$urlRouterProvider.otherwise("/login");

	$stateProvider
	// .state({
	// 	name: '/',
	// 	url: '/',
	// 	templateUrl: '../views/home.html',
	// 	controller: 'HomeController'
	// })
	.state({
		name: 'register',
		url: '/register',
		templateUrl: '../views/register.html',
		controller: 'RegisterController'
	})
	.state({
		name: 'login',
		url: '/login',
		templateUrl: '../views/login.html',
		controller: 'LoginController'
	})
	.state({
		name: 'dashboard',
		url: '/dashboard',
		templateUrl: '../views/dashboard.html',
		controller: 'DashboardController'
	})
	.state({
		name: 'province',
		url: '/province',
		templateUrl: '../views/province.html',
		controller: 'ProvinceController'
	})
	.state({
		name: 'collegeType',
		url: '/collegeType',
		templateUrl: '../views/college_type.html',
		controller: 'CollegeTypeController'
	});
})
.run(function($location) {
	/*if ($location.path() == '/login') {
		$location.path('/login');
	} else if ($location.path() == '/register') {
		$location.path('/register');
	} else {
		$location.path('/');
	}*/
})
.controller('HomeController', function($scope, $http) {

	initController();

	function initController() {
		console.log('running on HomeController');
	}
})
.controller('RegisterController', function($scope, $http) {

	initController();

	function initController() {
		console.log('running on RegisterController');
	}

	$scope.save = function() {
		console.log('registered.');
	};
})
.controller('LoginController', function($scope, $http, $location, $localStorage, $window) {
	$scope.login = function() {
		console.log('login');
		console.log($scope.form);

		$http.post('/api/authenticate', { username: $scope.username, password: $scope.password}).success(function(response) {
			console.log(response);
			if (response.success) {
				//$localStorage.token = response.token;
				localStorage.setItem('token', response.token);
				$location.path('/dashboard');
				$window.location.reload();
			}

			//console.log('token : ' + $localStorage.token);
		}).error(function(e) {
			console.log(e);
		});
	};
})
.controller('DashboardController', function($scope, $http, $localStorage) {

	callDashboard();

	function callDashboard() {
		$http.get('/api/dashboard', {
        	headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
		}).error(function(e) {
			console.log(e);
		});
	}
})
.controller('MenuController', function($scope, $localStorage, $location, $window) {
	initController();

	function initController() {
		console.log('MenuController');

		if (localStorage.getItem('token')) {
			$scope.isLogin = true;
		} else {
			$scope.isLogin = false;
		}

		console.log($scope.isLogin);
	}

	$scope.logout = function() {
		localStorage.removeItem('token');
		$location.path('/');
		$window.location.reload();
	};
})
.controller('ProvinceController', function($scope, $http) {

	$scope.provinces = [];

	$scope.findAll = function() {
		$http.get('/api/province', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
			$scope.provinces = response;
		}).error(function(e) {
			console.log(e);
		});
	};

	$scope.findAll();

	$scope.save = function() {

		if ($scope.id) {
			
			$http.put('/api/province', {id: $scope.id, provinceName: $scope.provinceName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.provinceName = '';
				$scope.form.$setPristine();
			}).error(function(e) {
				console.log(e);
			});
		} else {
			$http.post('/api/province', {provinceName: $scope.provinceName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log('save province success');
					$scope.findAll();
				} else {
					console.log('save province fail!');
				}
				$scope.provinceName = '';
				$scope.form.$setPristine();
			}).error(function(e) {
				console.log(e);
			});
		}
	};

	$scope.edit = function(data) {
		$scope.id = data._id;
		$scope.provinceName = data.province_name;
	};

	$scope.delete = function(id) {
		$http.delete('/api/province/' + id, {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			if (response.success) {
				console.log(response.message);
				$scope.findAll();
			} else {
				console.log(response.message);
			}
		}).error(function(e) {
			console.log(e);
		});
	}

})
.controller('CollegeTypeController', function($scope, $http) {

	

});