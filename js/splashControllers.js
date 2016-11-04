/**
 *Controller for splash and contains the process of inappbrowser sso login and fetching the ssoid and access control
 */
angular.module('TrueSense.controllers').controller('SplashCtrl', function($scope, $localstorage, $state, $http, $timeout, $rootScope, database, Utils, databasecache) {
	$scope.retries = 0;
	$scope.totalNoRetries = 1;
	$scope.splashmessage = pleaseWaitSettingUp;
	try {
		/**
		 * Clear the cache on start of the application
		 */
		databasecache.clearAccHierarchyCache();
		databasecache.clearDefHierarchyCache();
		databasecache.clearUserInfoDataCache();
		databasecache.clearcompletedItemsCache();

	} catch(e) {
		alert(errorClearingCaches)
	}

	$scope.updateSplashMessage = function(msg) {
		try {
			$timeout(function() {
				$scope.splashmessage = msg;
				$scope.$apply();
			});
		} catch(e) {
		}
	};

	/**
	 *Fetch the SSOId from service now after inappbrowser sets the coockie
	 */
	$scope.fetchSSOId = function() {
		try {
			$scope.updateSplashMessage(fetchingUserInfo);
			$timeout(function() {
				$.ajax({
					type : "GET",
					url : $rootScope.baserootURL + 'SSOLogin.do',
					xhrFields : {
						withCredentials : false
					},
					success : function(data, textStatus, request) {
						//console.log("----------------------------")
						//console.log(JSON.stringify(data.access_edit_ticket))
						//console.log("----------------------------")
						//console.log(data);
						var usersCountry = data.login_country;
						if (usersCountry) {
							$localstorage.set('USERS_COUNTRY', data.login_country);
							$localstorage.set('USERS_COUNTRY_TEMP', '');
						}

						var ssoId = request.getResponseHeader('SN-LOGIN-SSO');
						if (ssoId && data) {
							if (data.isFuncUser && !desktopVersion) {
								try {
									window.cookies.clear(function() {
										$state.go('splash', {}, {
											reload : true
										});
									});
								} catch(e) {
								}
							} else if (!data.login_user_auth) {
								try {
									window.cookies.clear(function() {
										$state.go('nonvaliduser');
										Utils.hidePleaseWait();
									});
								} catch(e) {
								}
							} else {
								$rootScope.dbpasscode = ssoId;
								$localstorage.set('SN-LOGIN-SSO', ssoId);

								if (data && data.functional_user && data.functional_user.length > 0) {
									$http.defaults.headers.common.Authorization = data.functional_user;
								}
								database.storeUserInfo(ssoId, data, function(result) {
									if (result) {
										var apppin = $localstorage.get('APP_PIN');
										if (apppin) {
											var associatedPINWithSSO = apppin.substring(0, apppin.length - 4);
											if (apppin && associatedPINWithSSO === ssoId) {
												$state.go('eventmenu.home');
											} else {
												$state.go('pinregister');
											}
										} else {
											$state.go('pinregister');
										}
									}
								});
							}
						}
					},
					error : function(xhr, msg) {
						if ($scope.retries < $scope.totalNoRetries) {
							$scope.retries++;
							$scope.fetchSSOId();
						} else {
							var apppin = $localstorage.get('APP_PIN')
							if (apppin) {
								$state.go('pinlogin');
							} else {
								$scope.updateSplashMessage(unableFetchUserInfo);
							}
						}
					}
				});
			}, 1500);
		} catch(e) {
			$scope.updateSplashMessage(unableFetchUserInfo);
			try {
				Utils.hidePleaseWait();
				ref.close();
				try {
					activityInfo.activityStop();
				} catch(e) {

				}
			} catch(e) {
			}

		}
	};

	if (desktopVersion) {
		$scope.fetchSSOId();
	}

	if ($rootScope.isOnline()) {
		if(isAndroid){
		var ref = window.open($rootScope.baserootURL + '/', '_blank', 'location=no,toolbar=no');      // Android
		} else {
		var ref = window.open($rootScope.baserootURL + '/', '_blank', 'location=yes,toolbar=no');		//iOS
		}
		ref.addEventListener('loadstart', function(event) {
			try {
				navigator.notification.activityStart(pleaseWaitSp, loading);
			} catch(e) {
			}
			if ((event.url === $rootScope.baserootURL + 'navpage.do') || (event.url === $rootScope.baserootURL + '$m.do')) {
				try {
					navigator.notification.activityStop();
				} catch(e) {
				}
				ref.close();
				$scope.fetchSSOId();
			}
		});

		ref.addEventListener('loadstop', function(event) {
			try {
				navigator.notification.activityStop();
			} catch(e) {
			}
			if ((event.url === $rootScope.baserootURL + '/') || (event.url === $rootScope.baserootURL + '$m.do')) {
				ref.close();
				$scope.fetchSSOId();
			}
		});

		ref.addEventListener('loaderror', function(event) {
			try {
				//$state.go('eventmenu.loaderrorlogin');
				navigator.notification.activityStop();
				ref.close();
			} catch(e) {
			}

		});

		ref.addEventListener('exit', function(event) {
			try {
				navigator.notification.activityStop();
			} catch(e) {
			}
		});
	} else {
		var apppin = $localstorage.get('APP_PIN')
		if (apppin) {
			$state.go('pinlogin');
		} else {
			$state.go('pinnotset');
		}
		$localstorage.set('USERS_COUNTRY_TEMP', '');
	}
});
