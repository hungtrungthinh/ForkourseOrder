angular.module('starter.controllers', [])
.controller('AppCtrl',['$scope', '$ionicModal', '$timeout', '$location','$interval','$ionicPopup','$cordovaToast','$http','config','$state', function($scope, $ionicModal, $timeout, $location,$interval,$ionicPopup,$cordovaToast,$http,config,$state) {

	var Urlcall =config.clientUrl;
	$scope.menuactive='new';
	
	
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

 

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  // $scope.login = function() {
    //$scope.modal.show();
	
  //};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
 //alert($scope.menuactive);
 $scope.changeMenu = function(menu) {
  	$scope.menuactive=menu;
  	//alert($scope.menuactive);
	//$location.path('/app/newOrders');
  };
  $scope.logout = function(menu) {
	var location_id=window.localStorage['location_id'];
	var deviceToken=window.localStorage['deviceToken'];
	var devicePlatform=window.localStorage['devicePlatform'];
	var deviceId=window.localStorage['deviceId'];
	$scope.data={};
	$scope.data.email='aa';
	//$location.path('/login');
	
	localStorage.clear();
	window.localStorage['deviceId']=deviceId;
	window.localStorage['devicePlatform']=devicePlatform;
	window.localStorage['deviceToken']=deviceToken;
	
		$http({
            method : 'POST',
            url : Urlcall+'logout',
			data : {'location_id':location_id}
        }).success(function(response){
			//alert(response);
			
			$state.go('login', {},{reload:true});
		});	
		
		
  };
  
}])

.controller('PlaylistsCtrl',['$scope', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
}])
;
