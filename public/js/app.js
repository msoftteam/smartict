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
	})
	.state({
		name: 'major',
		url: '/major',
		templateUrl: '../views/major.html',
		controller: 'MajorController'
	})
	.state({
		name: 'educationDegree', 
		url: '/educationDegree',
		templateUrl: '../views/education_degree.html',
		controller: 'EducationDegreeController'
	})
	.state({
		name: 'expertise',
		url: '/expertise',
		templateUrl: '../views/expertise.html',
		controller: 'ExpertiseController'
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
.controller('LoginController', function($scope, $http, $location, $localStorage, $window, $rootScope) {

	function initController() {
		if (localStorage.getItem('token')) {
			$location.path('/dashboard');
		} else {
			$rootScope.isLogin = false;
		}
	}

	initController();

	$scope.login = function() {
		console.log('login');
		console.log($scope.form);

		$http.post('/api/authenticate', { username: $scope.username, password: $scope.password}).success(function(response) {
			console.log(response);
			if (response.success) {
				//$localStorage.token = response.token;
				localStorage.setItem('token', response.token);
				$location.path('/dashboard');
				//$window.location.reload();
				$rootScope.isLogin = true;
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
.controller('MenuController', function($scope, $localStorage, $location, $window, $rootScope) {
	initController();

	function initController() {
		console.log('MenuController');

		if (localStorage.getItem('token')) {
			$rootScope.isLogin = true;
		} else {
			$rootScope.isLogin = false;
		}

		console.log($rootScope.isLogin);
	}

	$scope.logout = function() {
		localStorage.removeItem('token');
		$location.path('/login');
		//$window.location.reload();
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
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
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
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
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
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
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
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

})
.controller('CollegeTypeController', function($scope, $http) {

	$scope.collegeTypes = [];

	$scope.findAll = function() {
		$http.get('/api/college_type', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
			$scope.collegeTypes = response;
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

	$scope.findAll();

	$scope.save = function() {
		if ($scope.id) {
			
			$http.put('/api/college_type', {id: $scope.id, collegeTypeName: $scope.collegeTypeName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.collegeTypeName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		} else {
			$http.post('/api/college_type', {collegeTypeName: $scope.collegeTypeName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.collegeTypeName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		}

	};

	$scope.edit = function(data) {
		$scope.id = data._id;
		$scope.collegeTypeName = data.collegeTypeName;
	};

	$scope.delete = function(id) {
		$http.delete('/api/college_type/' + id, {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			if (response.success) {
				console.log(response.message);
				$scope.findAll();
			} else {
				console.log(response.message);
			}
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};
	
})
.controller('MajorController', function($scope, $http, $location) {
	$scope.majors = [];

	$scope.findAll = function() {
		$http.get('/api/major', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
			$scope.majors = response;
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

	$scope.findAll();

	$scope.save = function() {
		if ($scope.id) {
			
			$http.put('/api/major', {id: $scope.id, majorName: $scope.majorName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.majorName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		} else {
			$http.post('/api/major', {majorName: $scope.majorName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.majorName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		}

	};

	$scope.edit = function(data) {
		$scope.id = data._id;
		$scope.majorName = data.majorName;
	};

	$scope.delete = function(id) {
		$http.delete('/api/major/' + id, {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			if (response.success) {
				console.log(response.message);
				$scope.findAll();
			} else {
				console.log(response.message);
			}
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

})
.controller('EducationDegreeController', function($scope, $http, $rootScope, $location) {
	$scope.educationDegrees = [];

	$scope.findAll = function() {
		$http.get('/api/education_degree', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
			$scope.educationDegrees = response;
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

	$scope.findAll();

	$scope.save = function() {
		if ($scope.id) {
			
			$http.put('/api/education_degree', {id: $scope.id, educationName: $scope.educationName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.educationName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		} else {
			$http.post('/api/education_degree', {educationName: $scope.educationName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.educationName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		}

	};

	$scope.edit = function(data) {
		$scope.id = data._id;
		$scope.educationName = data.educationName;
	};

	$scope.delete = function(id) {
		$http.delete('/api/education_degree/' + id, {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			if (response.success) {
				console.log(response.message);
				$scope.findAll();
			} else {
				console.log(response.message);
			}
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

})
.controller('ExpertiseController', function($scope, $http, $rootScope, $location) {
	$scope.expertises = [];

	$scope.findAll = function() {
		$http.get('/api/expertise', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			console.log(response);
			$scope.expertises = response;
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};

	$scope.findAll();

	$scope.save = function() {
		if ($scope.id) {
			
			$http.put('/api/expertise', {id: $scope.id, expertiseName: $scope.expertiseName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.expertiseName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		} else {
			$http.post('/api/expertise', {expertiseName: $scope.expertiseName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.expertiseName = '';
				$scope.form.$setPristine();
			}).error(function(e, status) {
				if (status == 401) {
					localStorage.removeItem('token');
					$location.path('/login');
				} else {
					console.log(e);
				}
			});
		}

	};

	$scope.edit = function(data) {
		$scope.id = data._id;
		$scope.expertiseName = data.expertiseName;
	};

	$scope.delete = function(id) {
		$http.delete('/api/expertise/' + id, {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			if (response.success) {
				console.log(response.message);
				$scope.findAll();
			} else {
				console.log(response.message);
			}
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};
});