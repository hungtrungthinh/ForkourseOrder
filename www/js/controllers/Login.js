angular.module('starter.controllers')
.controller('LoginCtrl',['$scope','$location','config','$state','bfgData','$cordovaToast', function($scope,$location,config,$state,bfgData,$cordovaToast) {
		$scope.data={};
		
		
		localStorage.removeItem('user_id');
		localStorage.removeItem('location_id');
		localStorage.removeItem('restaurant_id');
		localStorage.removeItem('user_name');
		if(window.localStorage['user_id']!='' && window.localStorage['location_id']!='' && window.localStorage['restaurant_id']!='' && typeof window.localStorage['user_id'] != 'undefined' && typeof window.localStorage['user_id'] != 'location_id' && typeof window.localStorage['restaurant_id'] != 'undefined'){
			//alert(window.localStorage['user_id']);
			//alert(window.localStorage['user_id']);
			//alert(window.localStorage['location_id']);
			//alert(window.localStorage['restaurant_id']);
			$location.path('/app/newOrders');
		}
		$scope.login = function(data){

			$scope.data.deviceToken=window.localStorage['deviceToken'];
			$scope.data.devicePlatform=window.localStorage['devicePlatform'];
			$scope.data.deviceId=window.localStorage['deviceId'];
			$scope.data.email=data.email;
			$scope.data.password=data.password;
			//console.log($scope.data,window.localStorage['deviceToken']);
			var promise = bfgData.authenticate($scope.data,config.clientUrl,$state);
			//console.log(promise);
			//alert("here");
			promise.success(function(result){
					//alert(result.status);
					if(result.status=='false'){
						$cordovaToast.show(result.message, 'short', 'center');
					}else{	
						window.localStorage['user_id'] = result.data.admin_id;
						window.localStorage['location_id'] = result.data.location_id;
						window.localStorage['restaurant_id'] = result.data.restaurant_id;
						window.localStorage['user_name'] = result.data.full_name;
						window.localStorage['email'] = result.data.email;
						$scope.user_name = window.localStorage['user_name'];
						//localStorage.clear();
						$scope.data.email='';
						$scope.data.password='';
						
						$location.path('/app/newOrders');
					}
			
			}).
			 error(function(data, status, headers, config) {
				//console.log($cordovaToast);
				$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
		  	}); 
			//$location.path('/app/newOrders');
		};	
		
		

}]);