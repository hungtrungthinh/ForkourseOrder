angular.module('starter.controllers')
.controller('OrderCtrl',['$scope','$location','$interval','$timeout','$ionicPopup','MediaSrv','$ionicModal','$cordovaToast','config','$http','bfgData','$state','$rootScope','$cordovaMedia','$ionicLoading','$ionicActionSheet','$cordovaStarPrint','$cordovaScreenshot', function($scope,$location,$interval,$timeout,$ionicPopup,MediaSrv,$ionicModal,$cordovaToast,config,$http,bfgData,$state,$rootScope,$cordovaMedia,$ionicLoading,$ionicActionSheet,$cordovaStarPrint,$cordovaScreenshot) {

	var media = '';
	sessionStorage.removeItem('newpop');	
	sessionStorage['newpage'] = "new";
	$scope.plays = function(path) {
		var newaudio=document.getElementById("newAudio12");
		newaudio.play();
	};
	
	

	var audio=document.getElementById("newAudio12");
	audio.currentTime = 0;
	
	
	$scope.newpage='true';
	//$scope.modal.hide();
	  // Create the login modal that we will use later
	  
	var Urlcall =config.clientUrl;
	
	
	$scope.ord={};
	var location_id	=window.localStorage['location_id'];
	var restaurant_id	=window.localStorage['restaurant_id'];
	
	$scope.ord.location_id	=	window.localStorage['location_id'];
	$scope.ord.restaurant_id		=	window.localStorage['restaurant_id'];
	
		var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
		
		promise.success(function(response){
			if(response.status=='success'){
				$scope.orderlist=response.data.orderdetails;
				$rootScope.allcounts=response.data.allcounts;
				//alert(response.data.orderdetails.length());
				console.log (response.data.orderdetails);
			}else{	
					
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
		}); 
		
		
	$scope.doRefresh=function(){
		var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
		
		promise.success(function(response){
			if(response.status=='success'){
				$scope.orderlist=response.data.orderdetails;
				$rootScope.allcounts=response.data.allcounts;
				
				$scope.$broadcast('scroll.refreshComplete');
				console.log ($rootScope.allcounts);
			}else{	
				$scope.$broadcast('scroll.refreshComplete');	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
		}); 
	}
	
	
	
	
	$scope.orderDetailmodal = function(order_id){
		$scope.accept='';
		$scope.details='';
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
                                $scope.modal.show();
                                //bfgData.showMessage();
                                }else{
                                sessionStorage.removeItem('newpop');	
                                }
                }).error(function(data, status, headers, config) {
                                $cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
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

		$scope.orderCount=1;	
		
		if(sessionStorage['neworder']){
			//$scope.modal.hide();
			/*MediaSrv.loadMedia('test.mp3').then(function(media){
			  media.play();
			});*/
//var audio=document.getElementById("newAudio");
//alert("here");console.log(audio);
	var audio=document.getElementById("newAudio12");
	
	//$('.popup-container').html('');
			if(ionic.Platform.isIOS()){
				audio.currentTime = 1;
				audio.play();
				$timeout(function(){
					//alert("here");
					audio.currentTime = 1;
					audio.play();
					$scope.timeVar=1;
					setTimes = $interval(function() {
						audio.currentTime = 1;
						audio.play();
						$scope.timeVar=parseInt($scope.timeVar)+1;
						if($scope.timeVar>=30){
							
							audio.pause();
							$interval.cancel(setTimes);
							audio.currentTime = 0;
							$scope.doRefresh();
						}
					}, 30000);
				},100);
			}
			if(typeof myPopup!= 'undefined'){
				//myPopup.close();
				//alert("heo");
			}else{
				//alert("not available");	
			}
			var myPopup = $ionicPopup.show({
							scope: $scope,
							cssClass: 'yourclass',
							buttons: [
							  { text: 'NEW ORDER',
								type: 'button-positive',
								onTap: function() { 
									console.log('OK pressed');
									  audio.pause();
									  $interval.cancel(setTimes);
   									  audio.currentTime = 0;
									  $scope.doRefresh();
									  

								}
					 
							 },
							]
			});
			sessionStorage.removeItem('neworder');
		}
/*		$interval(function() {
				
			var promise = bfgData.newOrders($scope.ord,config.clientUrl,$state);
			promise.success(function(response){
				if(response.status=='success'){
					var Count=response.result;
					if(Count > $scope.orderCount){
						
						$scope.orderCount	=	Count;
						
						MediaSrv.loadMedia('test.mp3').then(function(media){
						  media.play();
						});
						
						var myPopup = $ionicPopup.show({
							scope: $scope,
							cssClass: 'yourclass',
							buttons: [
							  { text: 'NEW ORDER',
								type: 'button-positive',
								onTap: function() { 
									console.log('OK pressed');
									
								}
					 
							 },
							]
						  });
				
					}else{
					}
					console.log ($scope.orderCount);
				}else{	
						
				}
			}).error(function(data, status, headers, config) {
				//$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
			}); 
	
	
          }, 10000);
*/		
	
	//accept order
	$scope.acceptOrder=function(order_id){
		//alert(order_id);
		$scope.ord.order_id=order_id;
		var promise = bfgData.acceptOrder($scope.ord,config.clientUrl,$state);
		promise.success(function(response){
			//console.log(response);
			if(response.status=='success'){
				$scope.accept=1;
				$rootScope.allcounts=response.result;
				
				var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.data.orderdetails;
						//alert($scope.orderdetails.order_status);
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
				}); 
			}else{	
			}
		}).error(function(data, status, headers, config) {
			$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
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
				sessionStorage.removeItem('newpop');	
				$scope.accept='';
				message = 'Order completed';
				$cordovaToast.show(message, 'short', 'center');
		
				$scope.allcounts=response.result;
				//console.log ($scope.allcounts);
				
				var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.data.orderdetails;
						$rootScope.allcounts=response.data.allcounts;
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
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
						
						var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
						//console.log(promise);
						promise.success(function(response){
							if(response.status=='success'){
								$scope.orderlist=response.data.orderdetails;
								$rootScope.allcounts=response.data.allcounts;
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
		
		
	$scope.closeModal=function(){
		$scope.modal.remove();
		sessionStorage.removeItem('newpop');	
		var promise = bfgData.orderListing($scope.ord,config.clientUrl,$state);
				promise.success(function(response){
					if(response.status=='success'){
						$scope.orderlist=response.data.orderdetails;
						$rootScope.allcounts=response.data.allcounts;
					}else{	
					}
				}).error(function(data, status, headers, config) {
					$cordovaToast.show('Unknown server error occurs! Check your connection','short', 'center');
				}); 
	};
		
  
	
}]);