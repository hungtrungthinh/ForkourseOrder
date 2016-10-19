angular.module('starter.services',[])

.service('bfgData',['$http','$q','$cordovaDevice','$cordovaToast','$ionicLoading','$ionicModal', function($http,$q,$cordovaDevice,$cordovaToast,$ionicLoading,$ionicModal){
	var  q	=	$q.defer();
	var bfgData = this;
	
	return{
	
		openModal:function($scope,url)
		{
			
			 $ionicModal.fromTemplateUrl('templates/image_modal.html', {
				scope: $scope,
				animation: 'slide-in-right'
			  }).then(function(modal) {
				 $scope.url = url;
				$scope.modal = modal;
				 $scope.modal.show();
			  });
			 
		},
		closeModal:function($scope,$ionicModal)
		{
			 $scope.modal.hide();
			 $scope.modal.remove();
			 
		},
		
		authenticate: function(data, baseUrl, $state){
			
			var promise = $http({
				url: baseUrl + 'login',
				method: "POST",
				data:{				
					user_name: data.email,
					password: data.password,	
					devicePlatform: data.devicePlatform,	
					deviceId: data.deviceId,	
					deviceToken: data.deviceToken	
				}
			
			});
			return promise;
		
		},
		
		showToast:	function(message,duration,location) {
			     
				getToast(message,duration,location);
		
		},
		
		
		orderListing: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'orderListing',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id	
				}
			
			});
			return promise;
		
		},
		late: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'late',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id	
				}
			
			});
			return promise;
		
		},
		cancelled: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'cancelled',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id	
				}
			
			});
			return promise;
		
		},
		allorder: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'all',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id	
				}
			
			});
			return promise;
		
		},
		accepted: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'accepted',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id	
				}
			
			});
			return promise;
		
		},
		acceptOrder: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'acceptOrder',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id,
					order_id:data.order_id
				}
			
			});
			return promise;
		
		},
		orderDetail: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'orderDetail',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id,
					order_id:data.order_id
				}
			
			});
			return promise;
		
		},
		newOrders: function(data, baseUrl, $state){

			var promise = $http({
				url: baseUrl + 'newOrders',
				method: "POST",
				data:{				
					restaurant_id: data.restaurant_id,
					location_id: data.location_id,
				}
			
			});
			return promise;
		
		},
		
		
		
	}

}])