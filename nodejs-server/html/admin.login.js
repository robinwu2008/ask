In.ready('angular', 'jquery',
	function() {
		var app = angular.module('myapp', []);
		app.controller('adminLoginController', adminLoginController); 
		function adminLoginController($scope, $http) {
			$http.get('/cms/setting').success(function(data) {
				$scope.setting = data;
			});


			
			$scope.login = function() {
				$http.get('/user/login?name=' + $scope.username + '&psw=' + $scope.psw).success(function(data) {
					if (data.length > 0) {
						console.log(data);
						$scope.message="login ok"
						window.location.href="admin.html"
					} else {
						$scope.message="用户名或者密码错误"
					}
				});
			}
			$scope.havemessage=function(){
				if($scope.message==undefined || $scope.message.length<1){
					return false;
				}else{
					return true;
				}
			}
		}



	});