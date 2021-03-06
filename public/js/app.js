angular.module('myApp', ['ui.router', 'ngStorage', 'smart-table', 'ui.bootstrap'])

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
	})
	.state({
		name: 'region',
		url: '/region',
		templateUrl: '../views/region.html',
		controller: 'RegionController'
	})
	.state({
		name: 'teacher',
		url: '/teacher',
		templateUrl: '../views/teacher.html',
		controller: 'TeacherController'
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

	// load education degree lists
	$scope.educationDegreeLists = [];
	$scope.loadEducationDegreeList = function() {
		$http.get('/api/education_degree', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.educationDegreeLists = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	// load expertise lists
	$scope.expertiseLists = [];
	$scope.loadExpertiseList = function() {
		$http.get('/api/expertise', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.expertiseLists = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	// load collegeType lists
	$scope.collegeTypeLists = [];
	$scope.loadCollegeType = function() {
		$http.get('/api/college_type', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.collegeTypeLists = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	// load major lists
	$scope.malorLists = [];
	$scope.loadMajorList = function() {
		$http.get('/api/major', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.majorLists = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	// load province lists
	$scope.provinceLists = [];
	$scope.loadProvinceList = function() {
		$http.get('/api/province', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.provinceLists = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	$scope.loadEducationDegreeList();
	$scope.loadExpertiseList();
	$scope.loadCollegeType();
	$scope.loadMajorList();
	$scope.loadProvinceList();

	// save
	$scope.save = function() {
		var param = {
			idCard: $scope.idCard,
			name: $scope.name,
			birthdate: $scope.birthdate,
			tel: $scope.tel,
			email: $scope.email,
			lineID: $scope.lineID,
			address: $scope.address,
			graduateDegree: $scope.graduateDegree,
			expertise: $scope.expertise,
			collegeType: $scope.collegeType,
			collegeName: $scope.collegeName,
			major: $scope.major,
			province: $scope.province
		};
		$http.post('/api/teacher_register', param).success(function(response) {
			if (response.success) {
				alert('ลงทะเบียนเรียบร้อยแล้ว');
				$scope.clearForm();
			} else {
				alert('เกิดข้อผิดพลาดในการลงทะเบียน');
			}
		}).error(function(e, status) {
			alert('เกิดข้อผิดพลาดในการลงทะเบียน');
			console.log('status : ' + status + ' ' + e);
		});
	};

	$scope.clearForm = function() {
		$scope.idCard = '';
		$scope.name = '';
		$scope.birthdate = '';
		$scope.tel = '';
		$scope.email = '';
		$scope.lineID = '';
		$scope.address = '';
		$scope.graduateDegree = '';
		$scope.expertise = '';
		$scope.collegeType = '';
		$scope.collegeName = '';
		$scope.major = '';
		$scope.province = '';
		$scope.form.$setPristine();
	};
})
.controller('LoginController', function($scope, $http, $location, $localStorage, $window, $rootScope) {

	function initController() {
		if (localStorage.getItem('token')) {
			$location.path('/dashboard');
		} else {
			$rootScope.isLogin = false;
			$location.path('/login');
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
			} else {
				alert('ชื่อผู้ใช้หรือรหัสไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
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
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
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
	$scope.regions = [];

	$scope.findRegion = function() {
		$http.get('/api/region', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.regions = response;
		}).error(function(e, status) {
			if (status == 401) {
				localStorage.removeItem('token');
				$location.path('/login');
			} else {
				console.log(e);
			}
		});
	};
	$scope.findRegion();

	$scope.findAll = function() {
		$http.get('/api/province', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
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
			
			$http.put('/api/province', {
				id: $scope.id, 
				provinceName: $scope.provinceName,
				region: $scope.region
			}, 
			{
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
				$scope.region = '';
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
			$http.post('/api/province', {
				provinceName: $scope.provinceName,
				region: $scope.region
			}, {
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
		if (data.region) {
			$scope.region = data.region._id;
		}
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
			//console.log(response);
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
			//console.log(response);
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
			//console.log(response);
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
			//console.log(response);
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
})
.controller('RegionController', function($scope, $http, $location, $rootScope) {
	$scope.regions = [];

	$scope.findAll = function() {
		$http.get('/api/region', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.regions = response;
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
			
			$http.put('/api/region', {id: $scope.id, regionName: $scope.regionName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.id = undefined;
				$scope.regionName = '';
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
			$http.post('/api/region', {regionName: $scope.regionName}, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				if (response.success) {
					console.log(response.message);
					$scope.findAll();
				} else {
					console.log(response.message);
				}
				$scope.regionName = '';
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
		$scope.regionName = data.regionName;
	};

	$scope.delete = function(id) {
		$http.delete('/api/region/' + id, {
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
.controller('TeacherController', function($scope, $http, $location, $rootScope, $uibModal) {

	$scope.regions = [];
	$scope.loadRegion = function() {
		$http.get('/api/region', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.regions = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	// load collegeType lists
	$scope.collegeTypes = [];
	$scope.loadCollegeType = function() {
		$http.get('/api/college_type', {
			headers:{ 'Authorization': localStorage.getItem('token') }
		}).success(function(response) {
			//console.log(response);
			$scope.collegeTypes = response;
		}).error(function(e, status) {
			console.log(e);
		});
	};

	$scope.loadCollegeType();
	$scope.loadRegion();

	// load province lists
	$scope.provinces = [];
	$scope.loadProvinceList = function() {
		if ($scope.region) {
			$http.get('/api/province/' + $scope.region, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
				//console.log(response);
				$scope.provinces = response;
			}).error(function(e, status) {
				console.log(e);
			});
		} else {
			$scope.provinces = [];
		}
	};

	$scope.rowCollection = [];
	$scope.displayCollection = [].concat($scope.rowCollection);
	$scope.save = function() {
		var param = {
			region: $scope.region,
			province: $scope.province,
			collegeType: $scope.collegeType
		};

		$http.post('/api/teacher/query', param, {
				headers:{ 'Authorization': localStorage.getItem('token') }
			}).success(function(response) {
			console.log(response);
			//$scope.teacherList = response;
			if (response.length > 0) {
				$scope.rowCollection = response;
				$scope.displayCollection = [].concat($scope.rowCollection);
			} else {
				alert('ไม่พบข้อมูลที่ค้นหา');
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

	$scope.openDialogDetail = function(data) {
		var modalInstance = $uibModal.open({
			animation : false,
			templateUrl : '../views/teacher_modal.html',
			controller : 'TeacherModalController',
			size : 'lg',
			backdrop: 'static',
		    keyboard: false,
		    resolve: {
    			data: function () {
      				return data;
    			}
  			}
		});

		modalInstance.result.then(function() {
			
		}, function() {
			//$log.info('Modal dismissed at: ' + new Date());
			console.log('close dialog');
		});
	};

	$scope.clearForm = function() {
		$scope.region = '';
		$scope.province = '';
		$scope.collegeType = '';
	};
})
.controller('TeacherModalController', function($uibModalInstance, data, $scope) {

	function setData() {
		//console.log(data);
		$scope.idCard = data.idCard;
		$scope.name = data.name;
		$scope.birthdate = data.birthdate;
		$scope.tel = data.tel;
		$scope.email = data.email;
		$scope.lineID = data.lineID;
		$scope.address = data.address;
		$scope.graduateDegree = data.graduateDegree.educationName;
		$scope.expertise = data.expertise.expertiseName;
		$scope.collegeType = data.collegeType.collegeTypeName;
		$scope.collegeName = data.collegeName;
		$scope.major = data.major.majorName;
		$scope.province = data.province.province_name;
	}

	setData();

	$scope.cancel = function () {
	 	$uibModalInstance.dismiss('cancel');
 	};
});