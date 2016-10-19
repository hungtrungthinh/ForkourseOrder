angular.module('starter.controllers')
.controller('lateOrderCtrl',['$scope','$location','$interval','$ionicPopup','MediaSrv','$ionicModal','$cordovaToast','config','$http','bfgData','$state','$rootScope', function($scope,$location,$interval,$ionicPopup,MediaSrv,$ionicModal,$cordovaToast,config,$http,bfgData,$state,$rootScope) {

	var Urlcall =config.clientUrl;
	sessionStorage.removeItem('newpop');	
	sessionStorage['newpage'] = "late";
	$scope.var1=1;
	$scope.var2=2;
	$scope.newpage='true';
	
	// Create the login modal that we will use later
	  $ionicModal.fromTemplateUrl('templates/orderDetails.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
	  });	
	$scope.modalshow = function(order_id){
		$scope.accept='';
		$scope.details='';
		
		$http({
            method : 'POST',
            url : Urlcall+'orderDetail',
			data : {'restaurant_id':restaurant_id,'location_id':location_id,'order_id':order_id}
        }).success(function(response){
			//alert(response);
			//console.log(response);
			if(response.status=='success'){
				$scope.orderid=response.data.orderid;
				$scope.allcounts=response.data.allcounts;
				$scope.orderdetails=response.data.orderdetails[0];
				$scope.itemdetails=response.data.itemdetails;
				$scope.payment_details=response.data.payment_details;
				$scope.sidesdetails=response.data.sidesdetails;
				console.log ($scope.orderdetails);
				$scope.modal.show();
			}else{	
				
			}
		});	
	}

	// Create the login modal that we will use later
	  $ionicModal.fromTemplateUrl('templates/printPreview.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modalpreview = modal;
	  });	
	$scope.previewmodalshow = function(order_id){
		$scope.accept='';
		$scope.details='';
		
		$http({
            method : 'POST',
            url : Urlcall+'orderDetail',
			data : {'restaurant_id':restaurant_id,'location_id':location_id,'order_id':order_id}
        }).success(function(response){
			//alert(response);
			//console.log(response);
			if(response.status=='success'){
				$scope.orderid=response.data.orderid;
				$scope.allcounts=response.data.allcounts;
				$scope.orderdetails=response.data.orderdetails[0];
				$scope.itemdetails=response.data.itemdetails;
				$scope.payment_details=response.data.payment_details;
				$scope.sidesdetails=response.data.sidesdetails;
				console.log ($scope.orderdetails);
				$scope.modalpreview.show();
			}else{	
				
			}
		});	
	}	

	//To get the late/future orders list
	$scope.ord={};
	var location_id	=window.localStorage['location_id'];
	var restaurant_id	=window.localStorage['restaurant_id'];
	
	$scope.ord.location_id	=	window.localStorage['location_id'];
	$scope.ord.restaurant_id		=	window.localStorage['restaurant_id'];
	
		var promise = bfgData.late($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			if(response.status=='success'){
				$scope.orderlist=response.result.orderdetails;
			}else{	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
		}); 	
	
$scope.doRefresh=function(){
	var promise = bfgData.late($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			$scope.$broadcast('scroll.refreshComplete');	
			if(response.status=='success'){
				$scope.orderlist=response.result.orderdetails;
				
			}else{	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
		}); 	
}
		
	//var my_media = new Media(src, onSuccess, onError);
	//var myMedia = new Media("https://dashboard.forkourse.com/assets/horse.mp3");
    


	
	//angular.element('#playbutton').triggerHandler('click');		
		
		
		/*$interval(function() {
			if($scope.var1 < 2){
				MediaSrv.loadMedia('test.mp3').then(function(media){
				  media.play();
				});
				//myMedia.play();
				var myPopup = $ionicPopup.show({
					title: 'New Order Placed '+ $scope.var1,
					scope: $scope,
					buttons: [
					  { text: 'OK',type: 'button-positive' },
					]
				  });
				 	
				
				//console.log($scope.var1);         
				$scope.var1=parseInt($scope.var1)+1;
            } else {
				
				//console.log($scope.var1);            
				$scope.var1=parseInt($scope.var1)+1;
            }
          }, 10000);*/
		
	
	//accept order
	$scope.acceptOrder=function(order_id){
		//alert(order_id);
		$scope.ord.order_id=order_id;
		var promise = bfgData.acceptOrder($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			if(response.status=='success'){
				$scope.accept=1;
				$scope.allcounts=response.result;
				var promise = bfgData.late($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.result.orderdetails;
						$rootScope.allcounts=response.result.allcounts;
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
				}); 
			}else{	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
		}); 
		

		
		
	};
	
	//Complete order
	$scope.completeOrder=function(order_id){
		
		$http({
            method : 'POST',
            url : Urlcall+'completeOrder',
			data : {'restaurant_id':restaurant_id,'location_id':location_id,'order_id':order_id}
        }).success(function(response){
			//alert(response);
			//console.log(response);
			if(response.status=='success'){
				$scope.modal.hide();
				sessionStorage.removeItem('newpop');	
				$scope.accept='';
				message = 'Order completed';
				$cordovaToast.show(message, 'short', 'center');
		
				$scope.allcounts=response.result;
				//console.log ($scope.allcounts);
				
				var promise = bfgData.late($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.result.orderdetails;
						$rootScope.allcounts=response.result.allcounts;
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
				}); 
				
				
			}else{	
				
			}
		});	

	};
	
	//Order down arrow details show
	$scope.showDetails=function(){
		$scope.details=true;
	};	
	
	//Order down arrow hide details
	$scope.hideDetails=function(){
		$scope.details=false;
		
	};		
	
	$scope.orderDetailmodal = function(order_id){
		$scope.details=true;
		$scope.ord.order_id=order_id;
		var promise = bfgData.orderDetail($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			if(response.status=='success'){
				sessionStorage['newpop'] = true;
				$scope.orderid=response.data.orderid;
				$scope.allcounts=response.data.allcounts;
				$scope.orderdetails=response.data.orderdetails[0];
				$scope.itemdetails=response.data.itemdetails;
				$scope.payment_details=response.data.payment_details;
				$scope.sidesdetails=response.data.sidesdetails;
				console.log ($scope.orderdetails);
				$scope.modal.show();
			}else{
				sessionStorage.removeItem('newpop');		
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
		});
		
	}


	//Cancel Order
	$scope.cancelOrder=function(order_id){
		$ionicPopup.show({
		  template: "<style>.popup { width:500px; }</style><p>Are you sure you want to decline this order?<p/>",
		  title: 'Decline order',
		  scope: $scope,
		  buttons: [
		   { text: 'OK',
		     type: 'button-positive',
			 onTap: function() { 
			 	
				$http({
					method : 'POST',
					url : Urlcall+'cancelOrder',
					data : {'restaurant_id':restaurant_id,'location_id':location_id,'order_id':order_id}
				}).success(function(response){
					//alert(response);
					//console.log(response);
					if(response.status=='success'){
						$scope.modal.hide();
						sessionStorage.removeItem('newpop');	
						message = 'Order cancelled';
						$cordovaToast.show(message, 'short', 'center');
				
						//$scope.allcounts=response.result;
						//console.log (response);
						
						var promise = bfgData.late($scope.ord,config.clientUrl,$state);
						//console.log(promise);
						promise.success(function(response){
							if(response.status=='success'){
								$scope.orderlist=response.result.orderdetails;
								$rootScope.allcounts=response.result.allcounts;
									//console.log ($scope.orderdetails);
							}else{	
									
							}
						}).error(function(data, status, headers, config) {
							$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
						}); 
						
						
					}else{	
						
					}
				});	
				
			 }
		   },
		   {
			 text: '<b>Cancel</b>',
			 type: 'button-positive',
			 onTap: function() { console.log('Not Cancelled') }
		   }
		  ]
		});
	};		
		
		
	$scope.closeModal=function(){
		$scope.modal.hide();
		sessionStorage.removeItem('newpop');	
		var promise = bfgData.late($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.result.orderdetails;
						$rootScope.allcounts=response.result.allcounts;
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
				}); 
	};	
  
	
}]);