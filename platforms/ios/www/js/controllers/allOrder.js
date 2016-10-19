angular.module('starter.controllers')
.controller('allOrderCtrl',['$scope','$location','$interval','$ionicPopup','MediaSrv','$ionicModal','$cordovaToast','config','$http','bfgData','$state','$rootScope','$ionicActionSheet','$cordovaStarPrint','$timeout','$cordovaScreenshot',function($scope,$location,$interval,$ionicPopup,MediaSrv,$ionicModal,$cordovaToast,config,$http,bfgData,$state,$rootScope,$ionicActionSheet,$cordovaStarPrint,$timeout,$cordovaScreenshot) {

	sessionStorage.removeItem('newpop');
	sessionStorage['newpage'] = "all";	
	var Urlcall =config.clientUrl;
	//alert("1");
	$scope.var1=1;
	$scope.var2=2;

	$scope.accept='';
	$scope.refund='true';
	$scope.allpage='true';
	  // Create the login modal that we will use later
	  
	$scope.modalshow = function(order_id){
        $ionicModal.fromTemplateUrl('templates/orderDetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
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
        });
			
	}
  	
    $scope.previewmodalshow = function(){
        // Create the preview modal that we will use later
        $ionicModal.fromTemplateUrl('templates/printPreview.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalpreview = modal;
            $scope.modalpreview.show();
            //$cordovaStarPrint.preSetting();
            $timeout(function() {
                var prevContent = document.getElementById("prevContent");
                var prevContentHeight = prevContent.offsetHeight;
                console.log(prevContentHeight);
                $cordovaScreenshot.capture('preview', 'jpg', prevContentHeight);
                //$cordovaStarPrint.print();
                $scope.modalpreview.remove();
            }, 2000);
        });
    }
	
	//To get the accepted orders list
	$scope.ord={};
	var location_id	=window.localStorage['location_id'];
	var restaurant_id	=window.localStorage['restaurant_id'];
	
	$scope.ord.location_id	=	window.localStorage['location_id'];
	$scope.ord.restaurant_id		=	window.localStorage['restaurant_id'];
	
		var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			if(response.status=='success'){
				$scope.orderlist=response.result.orderdetails;
			}else{	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
		}); 

$scope.doRefresh=function(){
	var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
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
				var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
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
    //Printer order
    $scope.printOrder=function(order_id){
        // Show the action sheet
        /*var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>Setting</b>' },
                { text: '<b>Print</b>' }
            ],
            destructiveText: null,
            titleText: null,
            cancelText: 'Cancel',
            cancel: function() {
            // add cancel code..
            },
            buttonClicked: function(index) {
                if(index == 0)
                    $cordovaStarPrint.setting();
                else
                    $scope.previewmodalshow();
                    //$cordovaStarPrint.print();
                return true;
            }
        });
                        
    // For example's sake, hide the sheet after two seconds
        $timeout(function() {
            hideSheet();
        }, 2000);*/
        $scope.previewmodalshow();
                            
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
				$scope.accept='';
				message = 'Order completed';
				$cordovaToast.show(message, 'short', 'center');
		
				$scope.allcounts=response.result;
				//console.log ($scope.allcounts);
				
				var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
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
	
	
		$scope.orderDetailmodal = function(order_id){
                            
                        $scope.details=true;
                        $scope.ord.order_id=order_id;
                        $ionicModal.fromTemplateUrl('templates/orderDetails.html', {
                                                    scope: $scope,
                                                    animation: 'slide-in-up'
                        }).then(function(modal) {
                                                    $scope.modal = modal;
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
                                                                                console.log(response.data);
                                                                                
                                                                                $scope.modal.show();
                                                                    }else{
                                                                                sessionStorage.removeItem('newpop');	
                                                                    }
                                                        }).error(function(data, status, headers, config) {
                                                                    $cordovaToast.showToast('Unknown server error occurs! Check your connection','short', 'center');
                                                        });
                        });
		}
	
	//Order down arrow hide details
	$scope.hideDetails=function(){
		$scope.details=false;
		
	};		
	


 $scope.showPopup = function(order_id) {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-model="data.reamount">',
     title: 'Enter Refund Amount',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>OK</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.reamount) {
             e.preventDefault();
           } else {
             $scope.refundOrder(order_id,$scope.data.reamount);
			 //alert($scope.data.reamount);
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   
  };
  
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
					console.log(response);
					if(response.status=='success'){
						$scope.modal.hide();
						sessionStorage.removeItem('newpop');	
						message = 'Order cancelled';
						$cordovaToast.show(message, 'short', 'center');
				
						//$scope.allcounts=response.result;
						//console.log (response);
						
						var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
						//console.log(promise);
						promise.success(function(response){
							if(response.status=='success'){
								$scope.orderlist=response.result.orderdetails;
								$rootScope.allcounts=response.result.allcounts;
								//console.log ($scope.orderdetails);
							}else{	
									
							}
						}).error(function(data, status, headers, config) {
							$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
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
		  


	//Cancel Order
	$scope.refundOrder=function(order_id,reamount){
		
		 
			 	
				$http({
					method : 'POST',
					url : Urlcall+'OrderPartialRefund',
					data : {'restaurant_id':restaurant_id,'location_id':location_id,'order_id':order_id,'amount':reamount}
				}).success(function(response){
					//alert(response);
					//console.log(response);
					if(response.status=='success'){
						$scope.modal.hide();
						sessionStorage.removeItem('newpop');	
						message = 'Order refunded';
						$cordovaToast.show(message, 'short', 'center');
				
						//$scope.allcounts=response.result;
						//console.log (response);
						
						var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
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
						message = 'The amount is not refunded';
						$cordovaToast.show(message, 'short', 'center');
					}
				});	
				
			 
	};			
		
		
  $scope.closeModal=function(){
		$scope.modal.remove();
		sessionStorage.removeItem('newpop');	
		var promise = bfgData.allorder($scope.ord,config.clientUrl,$state);
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