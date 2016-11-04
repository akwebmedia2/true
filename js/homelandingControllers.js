/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('HomeLandingCtrl', function($scope, $rootScope, $ionicScrollDelegate, Utils, database, $state, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http) {

	$scope.$parent.$parent.$parent.showBackButton = '';
	$scope.$parent.$parent.$parent.showLogo = 'showlogo';
	$scope.$parent.$parent.$parent.app_page_title = 'TrueSense';

	$rootScope.setupHttpAuthHeader();
	try {
		if (!Utils.isPhoneView()) {
			$scope.$parent.$parent.$parent.app_page_title_subtitle = myOpenTicketTitle;
		} else {
			$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
		}
	} catch(e) {
	}

	angular.element($window).bind('resize', function() {
		try {
			if (!Utils.isPhoneView()) {
				$scope.$parent.$parent.$parent.app_page_title_subtitle = myOpenTicketTitle;
			} else {
				$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
			}
			$scope.$apply();
		} catch(e) {
		}
	});

	//Utils.showAllTiles($scope);
	Utils.showPleaseWait(pleaseWait);
	if ($rootScope.isOnline()) {
		$rootScope.onofflineclass = 'online-indicator';
	} else {
		$rootScope.onofflineclass = 'offline-indicator';
	}

	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});

	$scope.pendingSPItems = [];
	$scope.pendingCRItems = [];
	$scope.pendingODRSPItems = [];
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	/**
	 * Start sync praocess contains creation of the queue for pending items (Ticket, issues for both on my and my groups, spare part and comments)
	 * @param {Object} ssoid
	 */
	$scope.startSyncProcess = function(ssoid) {
		if (ssoid) {
			try {
				$scope.pendingListItems = [];
				$scope.pendingListItemsNonGroup = [];
				$scope.pendingSPItems = [];
				$scope.pendingCRItems = [];
				$scope.pendingODRSPItems = [];
				database.getPendingTickets(ssoid, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						$scope.pendingListItems = [];
						//$scope.pendingListItemsNonGroup = [];
						//$scope.pendingSPItems = [];
						//$scope.pendingCRItems = [];
						//$scope.pendingEXTCRItems = [];
						for (var i = result.rows.length - 1; i >= 0; i--) {
							var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
							tktData.Type = result.rows.item(i).Type;
							$scope.pendingListItems.push(tktData);
							/*if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type != "ACCOUNTHIERARCHY" && result.rows.item(i).Type != 'MY_GROUP_EDIT' && result.rows.item(i).Type != 'MY_SPARE_PART' && result.rows.item(i).Type != 'CORRECTION' && result.rows.item(i).Type != 'NEWACCOUNT' && result.rows.item(i).Type != 'MY_GROUP_SPARE_PART') {
							 $scope.pendingListItemsNonGroup.push(tktData);
							 }*/
							/*if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'MY_SPARE_PART') {
							 $scope.pendingSPItems.push(tktData);
							 }
							 if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'CORRECTION') {
							 $scope.pendingCRItems.push(tktData);
							 }
							 if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'NEWACCOUNT') {
							 $scope.pendingEXTCRItems.push(tktData);
							 }*/

						}
						//$scope.pendingItems = $scope.pendingListItems;
						//$scope.pendingItemsNonGroup = [];
						//$scope.pendingItemsNonGroup = $scope.pendingListItemsNonGroup;

						pendingTicketUploadProcess.uploadTicketsToServiceNow($scope.pendingListItems, $scope, function() {
							$scope.createUI(ssoid);
						});
					}
				});
			} catch(e) {
			}
			try {
				if (databasecache.completedItemsCache && databasecache.completedItemsCache.length > 0) {
				} else {
					//Utils.showPleaseWait(pleaseWait);
				}

				var promise = applicationServices.getControllersOperationalData();
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.deleteControllersOperationalData(function(data) {
								database.storeControllersOperationalData(payload.data.result, function(data) {
								});
							});
						}
					}
				}, function(errorPayload) {
				});

				var promise = applicationServices.getCountryPoleData();
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.deleteCountryPoleData(function(data) {
								database.storeCountryPoleData(payload.data.result, function(data) {
								});
							});
						}
					}
				}, function(errorPayload) {
				});

				var promise = applicationServices.getPWMasterData();
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.deletePwMasterData(function(data) {
								database.storePwMasterData(payload.data.result, function(data) {
								});
							});
						}
					}
				}, function(errorPayload) {
				});
				
				var promise = applicationServices.getAllCountryData();
				promise.then(function(payload) {
					if (payload) {
						
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.deleteAllCountryData(function(data) {
								database.storeAllCountryData(payload.data.result, function(data) {																					 
								});
							});
						}
					}
				}, function(errorPayload) {
				});

				var promise = applicationServices.getMyAndMyGroupOpenTicketsData(ssoid);
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							//Before Going to save all the records first delete and then save with new daya
							database.deleteAllGroupNonGroupCompletedTickets(ssoid, "false", function(data) {
								database.storeBulkCompletedTickets(payload.data.result, ssoid, function(data) {
									$scope.createUI(ssoid);
									Utils.hidePleaseWait();
									//Silenetly Fetch the recored for spare parts.
									var itemsWithSpareParts = [];
									if (payload.data.result.length > 0) {
										var allItems = payload.data.result;
										for (var iTm = 0; iTm < allItems.length; iTm++) {
											if (allItems[iTm].u_order_spare_part_flag == 'true') {
												itemsWithSpareParts.push(allItems[iTm].number);
											}
										}
									}
									if (itemsWithSpareParts && itemsWithSpareParts.length > 0) {
										var serviceRequestData = itemsWithSpareParts.join();
										var sparePartsPromise = applicationServices.fetchOrderSpareParts(serviceRequestData);
										sparePartsPromise.then(function(payload) {
											if (payload) {
												if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
													//Save the sparePart Records into the database
													database.deleteAllUploadedSparePartsForUserGroupAndNonGroup(ssoid, "false", function(status) {
														//Status not required
														database.storeBulkSpareParts(payload.data.result, ssoid, 'false', function(status) {
														});
													});

												}
											}
										}, function(errorPayload) {
										});
									}
								});
							});
						} else {
							Utils.hidePleaseWait();
						}
					}
				}, function(errorPayload) {
					Utils.hidePleaseWait();
				});
			} catch(e) {
			}

		}
		$timeout(function() {
			Utils.fetchSaveDBAccountHierarchy(applicationServices, database, function(status, data) {
			});
		}, 1000);

		$timeout(function() {
			Utils.fetchSaveDBDefectHierarchy(applicationServices, database, function(status, data) {
				// Get the deleted defect information
				var promise = applicationServices.getDeletedDefectData();
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.deleteDefectDataDeleted(payload.data, function(status) {
							});
						} else {
							Utils.hidePleaseWait();
						}
					}
				}, function(errorPayload) {
				});

			});
		}, 1000);

	};

	/**
	 *Create the ui only for my open tickets
	 * @param {Object} ssoid
	 */
	$scope.createUI = function(ssoid) {
		try {
			database.getCompletedTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).IsGroupTkt == 'false') {
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
						}
					}
					// alert(compltedTaskArray.length);
					$scope.completedItems = compltedTaskArray;
					databasecache.completedItemsCache = compltedTaskArray;
					Utils.hidePleaseWait();
				} else {
					Utils.hidePleaseWait();
				}
			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
		try {
			database.getPendingTickets(ssoid, function(result) {
				$scope.pendingListItemsNonGroup = [];
				$scope.pendingSPItems = [];
				$scope.pendingODRSPItems = [];

				//console.log(result)
				if (result && result.rows && result.rows.length > 0) {
					for (var i = result.rows.length - 1; i >= 0; i--) {
						var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
						tktData.Type = result.rows.item(i).Type;
						//console.log(result.rows.item(i).Type)
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type != "ACCOUNTHIERARCHY" && result.rows.item(i).Type != 'MY_GROUP_EDIT' && result.rows.item(i).Type != 'MY_SPARE_PART' && result.rows.item(i).Type != 'ORDER_SPARE_PART' && result.rows.item(i).Type != 'CORRECTION' && result.rows.item(i).Type != 'NEWACCOUNT' && result.rows.item(i).Type != 'MY_GROUP_SPARE_PART' && result.rows.item(i).Type != 'CLOSED_TICKET' && result.rows.item(i).Type != 'SERVICE_REPORT') {
							$scope.pendingListItemsNonGroup.push(tktData);
						}
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'MY_SPARE_PART') {
							$scope.pendingSPItems.push(tktData);
						}
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'ORDER_SPARE_PART') { // For Order Spare part module
							$scope.pendingODRSPItems.push(tktData);
						}

					}
					$scope.pendingItemsNonGroup = [];
					$scope.pendingItemsNonGroup = $scope.pendingListItemsNonGroup;

				} else {
					setTimeout(function() {
						$scope.pendingItemsNonGroup = [];
						$scope.pendingSPItems = [];
						$scope.pendingODRSPItems = [];
						$scope.$apply();
						//this triggers a $digest
					}, 1000);
				}
			});
		} catch(e) {
		}
	};

	/**
	 * Enable and desable home screen tiles based on teh access control downloaded at the time of user profile
	 * @param {Object} details
	 */
	/*$scope.accessControl = function(details) {
	if (details) {
	if (!details.mod_my_open_ticket) {
	$('#dashboardaccessmod_my_open_ticket').hide();
	}
	if (!details.mod_open_ticket) {
	$('#dashboardaccessmod_open_ticket').hide();
	}
	if (!details.mod_log_issue) {
	$('#dashboardaccessmod_log_issue').hide();
	}
	if (!details.mod_correct_account) {
	$('#dashboardaccessmod_correct_account').hide();
	}
	if (!details.mod_extended_cr) {
	$('#dashboardaccessmod_extended_cr').hide();
	}
	if (!details.mod_closed_ticket) {
	$('#dashboardaccessmod_closed_ticket').hide();
	}
	if (!details.mod_myGroup_assigned_ticket) {
	$('#dashboardaccessmod_myGroup_assigned_ticket').hide();
	}
	if (!details.mod_account_hierarchy) {
	$('#dashboardaccessmod_account_hierarchy').hide();
	}
	if (!details.mod_defect_hierarchy) {
	$('#dashboardaccessmod_defect_hierarchy').hide();
	}
	if (!details.mod_setting) {
	$('#dashboardaccessmod_setting').hide();
	}
	}
	};*/

	//Set the User Access Details.
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	if (ssoid) {
		if (databasecache.completedItemsCache && databasecache.completedItemsCache.length > 0) {
			$scope.completedItems = databasecache.completedItemsCache;
		} else {
			$scope.createUI(ssoid);
		}
		database.getUserInfo(ssoid, function(result) {
			Utils.hidePleaseWait();
			if (result && result.rows && result.rows.length > 0) {
				var applicationAccess = result.rows.item(0);
				if (applicationAccess) {
					var applicationAccessJSON = angular.fromJson(Tea.decrypt(applicationAccess.UserInfo, $rootScope.dbpasscode));
					if (applicationAccessJSON) {
						if (applicationAccessJSON && applicationAccessJSON.functional_user && applicationAccessJSON.functional_user.length > 0) {
							$http.defaults.headers.common.Authorization = applicationAccessJSON.functional_user;
						}
						if (!applicationAccessJSON.login_user_auth) {
							try {
								window.cookies.clear(function() {
									$state.go('nonvaliduser');
								});
							} catch(e) {
								$state.go('nonvaliduser');
							}
						} else {
							$scope.dashboardaccess = applicationAccessJSON;
							//$scope.accessControl(applicationAccessJSON);
							if ($rootScope.isOnline()) {
								$scope.startSyncProcess(ssoid);
							} else {
								$scope.createUI(ssoid);
							}

						}
					}
				}
			}
		});
	} else {
		try {
			window.cookies.clear(function() {
				$state.go('nonvaliduser');
			});
		} catch(e) {
		}
	}

	/**
	 *Show ticket details page
	 */
	$scope.ticketDetailsPage = function(details, type) {
		$localstorage.set('TICKET_EDIT_MODE', angular.toJson(details));
		$localstorage.set('TICKET_TYPE', angular.toJson(type));
		$localstorage.set('TICKET_EDIT_FROM', 'MY_TICKET');
		$state.go('eventmenu.openticketedit');
	};

	/**
	 *show spare part
	 * @param {Object} details
	 */
	$scope.sparePartPage = function(details) {
		$localstorage.set('SPARE_PART_EDIT_MODE', angular.toJson(details));
		$localstorage.set('SPARE_PART_EDIT_FROM', 'MY_TICKET');
		$state.go('eventmenu.opensparepartedit');
	};
	
	$scope.orderPartPage = function(details) {		
		$localstorage.set('SPARE_PART_EDIT_MODE', angular.toJson(details));
		$localstorage.set('SPARE_PART_EDIT_FROM', 'MY_TICKET');
		$state.go('eventmenu.ordersparepartedit');
		//console.log(details)
	};

	var countryCodeT = $localstorage.get('USERS_COUNTRY_TEMP');
	var countryCode = $localstorage.get('USERS_COUNTRY');
	if (countryCodeT) {
		$rootScope.usersCountryCode = countryCodeT;
	} else if (countryCode && $rootScope.allCountry != true) {
		$rootScope.usersCountryCode = countryCode;
	} else {
		$rootScope.usersCountryCode = '';
	}
});
