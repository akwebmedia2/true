/**
 *Main controller of the applicatio with app specific configs such as online/offline, Pause/Resume, on Back press and logout.
 */
angular.module('TrueSense.controllers', []).run(function($rootScope, $window, $location, $document, $parse, $timeout, $http, $templateCache, $state, $ionicPlatform, $ionicNavBarDelegate, database, $localstorage) {
	$ionicPlatform.ready(function() {
		database.createDbAndTables();
		$ionicPlatform.on("resume", function() {
			//Check for Valid Session.
			//Set the Online and Offline.
			if (navigator.network.connection.type == Connection.NONE) {
				try {
					$timeout(function() {
						$rootScope.$apply(function() {
							$rootScope.online = false;
							try {
								$rootScope.onofflineclass = 'offline-indicator';
							} catch(e) {
							}
						});
					}, 10, false);
				} catch(e) {
				}
			} else {
				try {
					$timeout(function() {
						$rootScope.$apply(function() {
							$rootScope.online = true;
							try {
								$rootScope.onofflineclass = 'online-indicator';
							} catch(e) {
							}
						});
					}, 10, false);
				} catch(e) {
				}
			}

		});

		$ionicPlatform.on("online", function() {
			try {
				$timeout(function() {
					$rootScope.$apply(function() {
						$rootScope.online = true;
						try {
							$rootScope.onofflineclass = 'online-indicator';
						} catch(e) {
						}
					});
				}, 10, false);
			} catch(e) {
			}
			//On online Start the
			try {
				window.cookies.clear(function() {
					$state.go('splash');
				});
			} catch(e) {
			}
		});

		$ionicPlatform.on("offline", function() {
			//On online Start the
			try {
				$timeout(function() {
					$rootScope.$apply(function() {
						$rootScope.online = false;
						try {
							$rootScope.onofflineclass = 'offline-indicator';
						} catch(e) {
						}
					});
				}, 10, false);

			} catch(e) {
			}
		});

		// Android Fix
		if(isAndroid){
		$ionicPlatform.registerBackButtonAction(function(event) {
		try {
		navigator.notification.confirm(wantToExit, function(button) {
		if (button == 2) {
		return;
		} else {
		try {
		window.cookies.clear(function() {
		navigator.app.exitApp();
		});
		} catch(e) {
		navigator.app.exitApp();
		}
		}
		}, "Confirmation", "Yes,No");
		} catch(e) {
		}
		}, 100);
		ionic.Platform.isFullScreen = true;
		} else {
		// IOS
		$ionicPlatform.registerBackButtonAction(function(event) {
			try {
				navigator.notification.confirm(wantToExit, function(button) {
					if (button == 2) {
						return;
					} else {
						navigator.app.exitApp();
					}
				}, "Confirmation", "Yes,No");
			} catch(e) {
			}
		}, 100);
		ionic.Platform.isFullScreen = false;
		}

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			// cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			// StatusBar.hide();
			StatusBar.styleDefault();
		}
	});


	// $http.defaults.headers.common.Authorization = 'Basic NTAyMzY1NTEyOk1TQ01AMjAxNHBsdXM=';
	// $rootScope.dbpasscode = "testuser";
	$rootScope.dbcommonpass = 'truesense'
	$rootScope.db = null;
	$rootScope.onofflineclass = 'online-indicator';	
	$rootScope.baserootURL = baseURL;
	

	$rootScope.isOnline = function() {
		try {
			if (desktopVersion) {
				return navigator.onLine;
			} else {
				if (navigator.network.connection.type == Connection.NONE) {
					return false;
				} else {
					return true;
				}
			}
		} catch(e) {
			return false;
		}
	};

	/*
	 $rootScope.getPassKey = function() {
	 if($rootScope.dbpasscode)
	 $rootScope.dbpasscode = ssoId;
	 };*/

	if (!$rootScope.dbpasscode) {
		$rootScope.dbpasscode = $localstorage.get('SN-LOGIN-SSO');
	}
	$rootScope.setupHttpAuthHeader = function() {
		try {
			if (!$http.defaults.headers.common.Authorization) {
				var ssOID = $localstorage.get('SN-LOGIN-SSO');
				if (ssOID && ssOID.length > 0) {
					database.getUserInfo(ssOID, function(result) {
						if (result && result.rows && result.rows.length > 0) {
							var applicationAccess = result.rows.item(0);
							if (applicationAccess) {
								var applicationAccessJSON = angular.fromJson(Tea.decrypt(applicationAccess.UserInfo, $rootScope.dbpasscode));
								if (applicationAccessJSON) {
									if (applicationAccessJSON && applicationAccessJSON.functional_user && applicationAccessJSON.functional_user.length > 0) {
										$http.defaults.headers.common.Authorization = applicationAccessJSON.functional_user;
									}
								}
							}
						}
					});
				}
			}

			try {
				navigator.notification.activityStop();
			} catch(e) {
			}
		} catch(e) {
		}
	};

	$rootScope.online = $rootScope.isOnline();

	$rootScope.onBackPress = function() {
		history.back();
	};

	$rootScope.logout = function() {
		try {
			navigator.notification.confirm(wantToLogout, function(button) {
				if (button == 2) {
					return;
				} else {
					try {
						window.cookies.clear(function() {
							$state.go('splash');
						});
					} catch(e) {
					}
				}
			}, "Confirmation", "Yes,No");
		} catch(e) {
		}
	};
})
/**
 * Controller to Register PIN for Offline
 */.controller('pinregisterCtrl', function($scope, $ionicPopup, $timeout, $localstorage, $state, $rootScope) {
	$rootScope.setupHttpAuthHeader();
	$scope.doRemoveError = function() {
		$scope.pinregwrong = '';
		$scope.pinregister = {};
	};
	$scope.doRegisterPin = function(pinregister) {
		if (pinregister && pinregister.enter && pinregister.enter.toString().length > 0) {
			if (pinregister && pinregister.reenter && pinregister.reenter.toString().length > 0) {
				if ((!isNaN(pinregister.enter)) && (!isNaN(pinregister.reenter))) {
					if (pinregister.enter.toString().length <= 4 && pinregister.reenter.toString().length <= 4 && pinregister.enter.toString().length == 4 && pinregister.reenter.toString().length == 4) {
						if (pinregister.reenter === pinregister.enter) {
							var ssoid = $localstorage.get('SN-LOGIN-SSO')
							if (ssoid) {
								$localstorage.set('APP_PIN', ssoid + pinregister.enter);
								$state.go('eventmenu.home');
							} else {
								$scope.pinregwrong = passcodeNotSaved;
							}
						} else {
							$scope.pinregwrong = passcodeNotSame;
						}
					} else {
						$scope.pinregwrong = passcodeLength;
					}
				} else {
					$scope.pinregwrong = passcodeNumber;
				}
			} else {
				$scope.pinregwrong = reenterPasscode;
			}
		} else {
			$scope.pinregwrong = enterPasscode;
		}
	};
})
/**
 * Controller to fetch/show/manage Defect Listing
 */.controller('defecthierarchyCtrl', function($scope, $ionicPopup, $timeout, $ionicScrollDelegate, filterFilter, Utils, $localstorage, $state, applicationServices, database) {
	$rootScope.setupHttpAuthHeader();
	$scope.$parent.$parent.$parent.app_page_title = 'Defect Hierarchy';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.data = {};
	$scope.groupss = [];
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};

	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;

	};
	$scope.showDefectCategory = function(selectedItem) {
		$localstorage.set('SELECTED_DEFECT', angular.toJson(selectedItem));
		$state.go('eventmenu.defectdetails');
	};
	$scope.clearSearch = function() {
		$scope.search = '';
	};

	$scope.items = [];
	$scope.loadMore = function() {
		if ($scope.groupss && $scope.groupss.length > 0) {
			$scope.items.push({
				u_defect_category1 : $scope.groupss[$scope.items.length].label,
				groupedItems : $scope.groupss[$scope.items.length].groupedItems
			});
			if ($scope.items.length == $scope.groupss.length) {
				$scope.noMoreItemsAvailable = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	};

	Utils.getSavedDBDefectHierarchy(database, Utils, function(data, nongroupdata) {
		if (data && data.length > 0) {
			$scope.groupss = data;
			$scope.loadMore();
			if (nongroupdata && nongroupdata.length > 0) {
				$scope.searchItems = nongroupdata;
			}
		}
	});
})
/***
 * Controller to show Defect Details
 */.controller('defectdetailsCtrl', function($scope, $ionicPopup, $timeout, $ionicScrollDelegate, filterFilter, Utils, $localstorage) {
	$rootScope.setupHttpAuthHeader();
	$scope.$parent.$parent.$parent.app_page_title = defectHierarchyTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.details = {};
	var selectedItem = $localstorage.get('SELECTED_DEFECT');
	//,angular.toJson(selectedItem));
	var items = angular.fromJson(selectedItem);
	if (items) {
		$scope.details = items;
	}

})
/***
 * Controller to show Defect Details
 */.controller('loaderrorloginCntrl', function($scope, $ionicPopup, $timeout, $ionicScrollDelegate, filterFilter, Utils, $localstorage, $rootScope, $state) {
	$rootScope.setupHttpAuthHeader();
	$scope.$parent.$parent.$parent.app_page_title = defectHierarchyTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';

	$scope.loginAgain = function() {
		$state.go('splash');
	}
})
/**
 * Controller to PIN Login for Offline login
 */.controller('pinloginCtrl', function($scope, $timeout, $localstorage, $state, $rootScope) {
	$rootScope.setupHttpAuthHeader();
	$scope.loginWithPIN = function() {
		if ($scope.passcode.length > 0 && $scope.passcode.length <= 4) {
			$scope.pinwrong = "";
			if ($scope.passcode.length == 4) {
				var ssoId = $localstorage.get('SN-LOGIN-SSO');
				$rootScope.dbpasscode = ssoId;
				var apppin = $localstorage.get('APP_PIN');
				if (ssoId) {
					if (apppin) {
						if (apppin === ssoId + $scope.passcode) {
							$state.go('eventmenu.home');
						} else {

							$scope.pinwrong = wrongPasscode;
							$scope.passcode = "";
						}
					} else {
						$state.go('pinnotset');
					}
				} else {
					$scope.pinwrong = passcodeNotSaved;
					$scope.passcode = "";
				}
			} else {
				$scope.pinwrong = enterFourDigitPasscode;
				$scope.passcode = "";
			}
		} else {
			$scope.pinwrong = emptyPasscode;
		}
	};

	$scope.init = function() {
		$scope.passcode = "";
		$scope.pinwrong = "";
	}
});
