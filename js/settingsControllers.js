/**
 *Controller for the settings module
 */
angular.module('TrueSense.controllers').controller('settingsCtrl', function($scope, $rootScope, database, $localstorage, Utils, $state, applicationServices, $timeout, pendingTicketUploadProcess) {
	$scope.$parent.$parent.$parent.app_page_title = settingPageTitle;
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$rootScope.setupHttpAuthHeader();
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	Utils.showPleaseWait("Please wait...");
	$scope.appVersion = appVer;
	$scope.backToTicketsListing = function() {
		$state.go('eventmenu.home');
	};

	/**
	 * Defect Category Manual Sync
	 */
	$scope.defectManualSync = function() {
		if ($rootScope.isOnline()) {
			Utils.showPleaseWait(syncDefectHierarchy);
			Utils.fetchSaveDBDefectHierarchy(applicationServices, database, function(status, data) {
				try {
					$scope.defectHierarchySettingUI();
					$timeout(function() {
						Utils.hidePleaseWait();
					}, 2000);
				} catch(e) {
					Utils.hidePleaseWait();
				}
			});
		} else {
			Utils.showAlert(syncWorksOnline);
		}
	};

	/**
	 * Account Hierarchy Manual Sync
	 */
	$scope.accountManualSync = function() {
		if ($rootScope.isOnline()) {
			Utils.showPleaseWait(syncAccountHierarchy);
			Utils.fetchSaveDBAccountHierarchy(applicationServices, database, function(status, data) {
				try {
					$scope.accountHierarchySettingUI();
					$timeout(function() {
						Utils.hidePleaseWait();
					}, 2000);
				} catch(e) {
					Utils.hidePleaseWait();
				}
			});
		} else {
			Utils.showAlert(syncWorksOnline);
		}
	};

	$scope.pendingElementsManualSync = function() {
		if ($rootScope.isOnline()) {
			Utils.showPleaseWait(synchronizing);
			$scope.performPendingElementsSync();
		} else {
			Utils.showAlert(syncWorksOnline);
		}
	};

	$scope.performPendingElementsSync = function() {
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		var pendingListItems = [];
		if (ssoid) {
			try {
				$scope.pendingListItems = [];
				database.getPendingTickets(ssoid, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						$scope.pendingListItems = [];
						for (var i = result.rows.length - 1; i >= 0; i--) {
							var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
							tktData.Type = result.rows.item(i).Type;
							$scope.pendingListItems.push(tktData);
						}
						pendingTicketUploadProcess.uploadTicketsToServiceNow($scope.pendingListItems, $scope, function() {
							$scope.pendingTicektsSettingUI(ssoid);
						});
					} else {
						Utils.hidePleaseWait();
						Utils.showAlert(noTicketSync);
					}
				});
				if (pendingListItems.length > 0) {
					database.getLatestSysUpdatedTimeTickets(ssoid, function(results) {
						if (results && results.rows && results.rows.length > 0) {
							$scope.uploadedTicektsSettingUI(ssoid);
							$scope.pendingTicektsSettingUI(ssoid);
							var reqTS = "'2014-10-10 23:59:59'";
							try {
								reqTS = results.rows.item(0).SysUpdatedOn;
							} catch(e) {

							}
							$scope.fetchRecords(ssoid, reqTS, function(data) {
								if (data) {
									$scope.uploadedTicektsSettingUI(ssoid);
									$scope.pendingTicektsSettingUI(ssoid);
								}
							});
						} else {
							var reqTS = "'2014-10-10 23:59:59'";
							$scope.fetchRecords(ssoid, reqTS, function(data) {
								if (data) {
									$scope.uploadedTicektsSettingUI(ssoid);
									$scope.pendingTicektsSettingUI(ssoid);
								}
							});
						}
					});
				}
			} catch(e) {
				Utils.hidePleaseWait();
			}
		}
	};
	/**
	 * Fetch records from DB for My and My Group Open Tickets
	 * @param {Object} ssoid
	 * @param {Object} reqTS
	 * @param {Object} callback
	 */
	$scope.fetchRecords = function(ssoid, reqTS, callback) {
		try {
			var promise = applicationServices.getMyAndMyGroupOpenTicketsData(ssoid);
			promise.then(function(payload) {
				if (payload) {
					if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
						database.storeBulkCompletedTickets(payload.data.result, ssoid, function(data) {
							callback(data);
						});
					}
				}
			}, function(errorPayload) {
				Utils.hidePleaseWait();
			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
	};

	/**
	 * Change Passcode
	 * @param {Object} pinChange : Carrying New Passcode and Confirm New Passcode
	 */
	$scope.submitPin = function(pinChange) {
		if (pinChange) {
			var ssoId = $localstorage.get('SN-LOGIN-SSO');
			var oldPin = $localstorage.get('APP_PIN');
			if (oldPin && pinChange.oldpasscode && pinChange.oldpasscode.toString().length > 0) {
				if (ssoId + pinChange.oldpasscode === oldPin) {
					if ((!isNaN(pinChange.newpasscode)) || (!isNaN(pinChange.confirmnewpasscode))) {
						if (pinChange.newpasscode.toString().length >= 4 || pinChange.confirmnewpasscode.toString().length >= 4) {
							if (pinChange.newpasscode === pinChange.confirmnewpasscode) {
								if (ssoid) {
									$localstorage.set('APP_PIN', ssoid + pinChange.newpasscode);
									Utils.showAlert(passcodeUpdated);

									$timeout(function() {
										// pinChange = {};
										pinChange.oldpasscode = '';
										pinChange.newpasscode = '';
										pinChange.confirmnewpasscode = '';
										$scope.$apply();
									}, 10, false);
									//$state.go('eventmenu.home');
								}
							} else {
								Utils.showAlert(passcodeNotSame);
							}
						} else {
							Utils.showAlert(passcodeLength);
							//$scope.newpinError = 'Please enter the atleast 4 number in new passcode field';
						}

					} else {
						Utils.showAlert(passcodeNumber);
					}

				} else {
					Utils.showAlert(oldPasscodeNotMatching);
				}
			} else {
				Utils.showAlert(correctOldPasscode);
			}
		} else {
			Utils.showAlert(enterOldPasscode);
		}

	};

	$scope.defectHierarchySettingUI = function() {
		try {
			database.getLatestSysUpdatedTimeTicketsForDefectHierarchyWithRecord(function(results) {
				var reqTS = "'2014-10-10 23:59:59'";
				if (results && results.rows && results.rows.length > 0) {
					reqTS = results.rows.item(0).SysUpdatedOn;
				}
				$scope.drts = reqTS;
				$scope.defHie = angular.fromJson(Tea.decrypt(results.rows.item(0).DefectHierarchyData, $rootScope.dbcommonpass));
			});
		} catch(e) {
		}
	};

	$scope.accountHierarchySettingUI = function() {
		try {
			database.getLatestDetailsSysUpdatedTimeTicketsForAccountHierarchy(function(results) {
				var reqTS = "'2014-10-10 23:59:59'";
				if (results && results.rows && results.rows.length > 0) {
					reqTS = results.rows.item(0).SysUpdatedOn;
				}
				$scope.hrts = reqTS;
				$scope.accHie = angular.fromJson(Tea.decrypt(results.rows.item(0).AccountHierarchyData, $rootScope.dbcommonpass));
			});
		} catch(e) {
		}
	};
	$scope.uploadedTicektsSettingUI = function(ssoid) {
		try {
			database.getLatestSysUpdatedForUploadedTicketsWithRecords(ssoid, function(results) {
				var reqTS = "'2014-10-10 23:59:59'";
				if (results && results.rows && results.rows.length > 0) {
					reqTS = results.rows.item(0).SysUpdatedOn;
				}
				$scope.crts = reqTS;
				$scope.upTkt = angular.fromJson(Tea.decrypt(results.rows.item(0).TicketInfo, $rootScope.dbpasscode));
			});
		} catch(e) {
		}
	};

	$scope.pendingTicektsSettingUI = function(ssoid) {
		try {
			database.getPendingTicketsCount(ssoid, function(results) {
				if (results && results.rows && results.rows.length > 0) {
					setTimeout(function() {
						$scope.ptcount = results.rows.item(0).count;
						$scope.$apply();
					}, 100);
				}
			});
		} catch(e) {
		}
	};
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	if (ssoid) {
		database.getUserInfo(ssoid, function(result) {
			if (result && result.rows && result.rows.length > 0) {
				var applicationAccess = result.rows.item(0);
				if (applicationAccess) {
					var applicationAccessJSON = angular.fromJson(Tea.decrypt(applicationAccess.UserInfo, $rootScope.dbpasscode));
					if (applicationAccessJSON) {
						$scope.firstname = applicationAccessJSON.login_user_firstName;
						$scope.lastname = applicationAccessJSON.login_user_lastName;
						$scope.ssoid = applicationAccessJSON.login_user_sso;
						$scope.email = applicationAccessJSON.login_user_email;
					}
				}
			}
		});
		$scope.uploadedTicektsSettingUI(ssoid);
		$scope.pendingTicektsSettingUI(ssoid);

	}

	$scope.accountHierarchySettingUI();
	$scope.defectHierarchySettingUI();
	$scope.show_section = {};
	/**
	 * On Off Accordion
	 * @param {Object} section : Accordion section
	 * @param {Object} id : Sequence number of accordion from top order
	 */
	$scope.section_click = function(section, id) {
		for (var i = 1; i < 6; i++) {
			if (id != i) {
				$scope.show_section[section + i] = false;
			}
		}
		$scope.show_section[section + id] = !$scope.show_section[section + id];
		$scope.$broadcast('scroll.resize');
	};

	/**
	 * Get the Country list from account hieararchy table
	 */
	Utils.getSavedDBCountryAccountHierarchy(database, Utils, function(data) {
		if (data && data.length > 0) {
			try {
				$scope.countryList = data;
				for (var i = 0; i < $scope.countryList.length; i++) {
					if ($scope.countryList[i].country == $rootScope.usersCountryCode) {
						$scope.country_code = $rootScope.usersCountryCode;
					}
				}
			} catch(e) {
			}
			Utils.hidePleaseWait();
		} else {
			Utils.showPleaseWait(countryNotFetched);
			Utils.hidePleaseWait();
		}
	});

	$scope.switchCountry = function(country) {
		try {
			if (country && country != 'null' && country != 'undefined') {
				$rootScope.usersCountryCode = country;
				$localstorage.set('USERS_COUNTRY_TEMP', $rootScope.usersCountryCode);
				$scope.backToTicketsListing();
			} else {
				Utils.showAlert(selectCountry);
			}
		} catch(e) {
		}
	};

	$scope.viewAllCountry = function() {
		$rootScope.usersCountryCode = '';
		$localstorage.set('USERS_COUNTRY_TEMP', '');
		$rootScope.allCountry = true;
		$scope.backToTicketsListing();
	};

});
