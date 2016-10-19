// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova','starter.services'])

.run(function($ionicPlatform,$cordovaDevice,$cordovaPush,$state,$rootScope,$ionicPopup,$interval,$timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
		
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	
	if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        //if(!result) {
                            ionic.Platform.exitApp();
                       // }
                    });
    }
	}
	
	//alert("here");
	window.localStorage['device_id'] = $cordovaDevice.getUUID();	
	window.localStorage['idle_time']= new Date();

	setTimes=[];
	 $ionicPlatform.registerBackButtonAction(function (event) {}, 100);
	 
  		
          // -- PUSH NOTIFICATION -- //

          

            // iOS

            if (ionic.Platform.isIOS()) {

                var iosConfig = {
                    "badge": true,
                    "sound": true,
                    "alert": true,
                };

                document.addEventListener("deviceready", function () {
                    $cordovaPush.register(iosConfig).then(function (deviceToken) {
                        localStorage.setItem("deviceToken", deviceToken);
						//alert(deviceToken);
                        localStorage.setItem("devicePlatform", 'iOS');
                        localStorage.setItem("deviceType", 1);
                        localStorage.setItem("deviceId", $cordovaDevice.getUUID());
                    }, function (err) {
                        //alert(err);
                    });

                        
                    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                    	//console.log("notif ", notification);    
                        if (notification.alert) {
							if(typeof myPopup!= 'undefined'){
								myPopup.close();
								//alert("heo");
							}
							//console.log(setTimes);
							var audio=document.getElementById("newAudio12");
							if(typeof setTimes!= 'undefined'){
								//console.log(setTimes);
							}
							audio.currentTime = 1;
							audio.play();
							$timeout(function(){
								//alert("here");
								audio.currentTime = 1;
								audio.play();
								timeVar=1;
								setTimes.push($interval(function() {
									audio.currentTime = 1;
									audio.play();
									timeVar=parseInt(timeVar)+1;
									if(timeVar>=30){
										
										audio.pause();
										//$interval.cancel(setTimes);
										angular.forEach(setTimes, function(interval) {
											$interval.cancel(interval);
										});
										setTimes.length = 0;
										
										audio.currentTime = 0;
										//$scope.doRefresh();
									}
								}, 30000));
							},100);
			
								var myPopup = $ionicPopup.show({
								cssClass: 'yourclass',
								buttons: [
								  { text: 'NEW ORDER',
									type: 'button-positive',
									onTap: function() { 
										//console.log('OK pressed');
										audio.pause();
										angular.forEach(setTimes, function(interval) {
											$interval.cancel(interval);
										});
										setTimes.length = 0;
										audio.currentTime = 0;
										//$scope.doRefresh();
										sessionStorage['neworder1'] = true;
										//alert(sessionStorage['newpop']);
										if(sessionStorage['newpop']){
											//alert(sessionStorage['newpop']);
											if(sessionStorage['newpage']=='new'){
												$state.go('app.newOrders', {},{reload:false});
											}else if(sessionStorage['newpage']=='accept'){
												$state.go('app.acceptedOrders', {},{reload:false});
											}else if(sessionStorage['newpage']=='all'){
												$state.go('app.allOrders', {},{reload:false});
											}else if(sessionStorage['newpage']=='cancel'){
												$state.go('app.declinedOrders', {},{reload:false});
											}else if(sessionStorage['newpage']=='late'){
												$state.go('app.futureOrders', {},{reload:false});
											}else{
												$state.go('app.newOrders', {},{reload:false});
											}
										}else{
											$state.go('app.newOrders', {},{reload:true});
										}
										
									}
									 
								},
								]
							});
			
//                                if(notification.type == 'order'){
                                    //sessionStorage['neworder'] = true;
                                    //$state.go('app.newOrders', {}, {reload: true});
//                                }

                        }

                        if (notification.sound) {
                            var snd = new Media(event.sound);
                            snd.play();
                        }

                        if (notification.badge) {
                            $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                                // Success!
                            }, function (err) {
                                // An error occurred. Show a message to the user
                            });
                        }


                    });
                    

                }, false);

            }
            

            // -- END OF PUSH NOTIFICATION -- //
            
        
  
  
  
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.newOrders', {
      url: '/newOrders',
	  cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/orderNew.html',
          controller: 'OrderCtrl'
        }
      }
    })
  .state('app.acceptedOrders', {
      url: '/acceptedOrders',
	  cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/acceptedOrders.html',
          controller: 'acceptedOrderCtrl'
        }
      }
    })
  .state('app.declinedOrders', {
      url: '/declinedOrders',
	  cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/declinedOrders.html',
          controller: 'cancelledOrderCtrl'
        }
      }
    })
  .state('app.futureOrders', {
      url: '/futureOrders',
	  cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/futureOrders.html',
          controller: 'lateOrderCtrl'
        }
      }
    })
  .state('app.allOrders', {
      url: '/allOrders',
	  cache:false,
      views: {
        'menuContent': {
          templateUrl: 'templates/allOrders.html',
          controller: 'allOrderCtrl'
        }
      }
    })
   
	.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
        
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

.factory('config', function() {
		return {
			siteName	: 'Forkours',
			//clientUrl	: 'http://192.168.1.254/forkourse/api/',
			//baseUrl		: 'http://192.168.1.254/forkourse/',
	
			clientUrl	: 'https://dashboard.forkourse.com/api/',
			baseUrl		: 'https://dashboard.forkourse.com/',
			
		};
})

.factory('MediaSrv', function($q, $ionicPlatform, $window){
  var service = {
    loadMedia: loadMedia,
    getStatusMessage: getStatusMessage,
    getErrorMessage: getErrorMessage
  };

  function loadMedia(src, onError, onStatus, onStop){
	
    var defer = $q.defer();
    $ionicPlatform.ready(function(){
      var mediaSuccess = function(){
        if(onStop){onStop();}
      };
      var mediaError = function(err){
        _logError(src, err);
        if(onError){onError(err);}
      };
      var mediaStatus = function(status){
        if(onStatus){onStatus(status);}
      };

      if($ionicPlatform.is('android')){src = '/android_asset/www/' + src;}
      defer.resolve(new $window.Media(src, mediaSuccess, mediaError, mediaStatus));
    });
    return defer.promise;
  }

  function _logError(src, err){
    console.error('media error', {
      code: err.code,
      message: getErrorMessage(err.code)
    });
  }

  function getStatusMessage(status){
    if(status === 0){return 'Media.MEDIA_NONE';}
    else if(status === 1){return 'Media.MEDIA_STARTING';}
    else if(status === 2){return 'Media.MEDIA_RUNNING';}
    else if(status === 3){return 'Media.MEDIA_PAUSED';}
    else if(status === 4){return 'Media.MEDIA_STOPPED';}
    else {return 'Unknown status <'+status+'>';}
  }

  function getErrorMessage(code){
    if(code === 1){return 'MediaError.MEDIA_ERR_ABORTED';}
    else if(code === 2){return 'MediaError.MEDIA_ERR_NETWORK';}
    else if(code === 3){return 'MediaError.MEDIA_ERR_DECODE';}
    else if(code === 4){return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';}
    else {return 'Unknown code <'+code+'>';}
  }

  return service;
});
