/**
 *Controller for  group assigned ticket
 */
angular.module('TrueSense.controllers').controller('groupassignedticketCtrl', function($scope, $localstorage, $state, Utils, applicationServices, database, $rootScope) {
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.app_page_title = groupAssignedTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.data = {};
	$scope.pendingListItemsGroup = [];
	$scope.pendingItemsGroup = [];
	$scope.pendingSPItems = [];
	$rootScope.setupHttpAuthHeader();
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	$scope.createUI = function(ssoid, showWaiting) {
		try {
			if (showWaiting) {
				Utils.showPleaseWait('Please Wait...');
			}
			database.getCompletedTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).OpenBy != ssoid && result.rows.item(i).IsGroupTkt == 'true') {
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
						}
					}
					$scope.completedItems = compltedTaskArray;
					Utils.hidePleaseWait();
				} else {
					Utils.hidePleaseWait();
				}
			});

			// pendingSPItems
			database.getPendingTickets(ssoid, function(result) {
				$scope.pendingSPItems = [];
				if (result && result.rows && result.rows.length > 0) {
					for (var i = result.rows.length - 1; i >= 0; i--) {
						var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
						if (result.rows.item(i).Type == 'MY_GROUP_EDIT') {
							$scope.pendingListItemsGroup.push(tktData);
						}
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'MY_GROUP_SPARE_PART') {
							$scope.pendingSPItems.push(tktData);
						}
					}
					$scope.pendingItemsGroup = $scope.pendingListItemsGroup;
				}
			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
	};

	$scope.ticketDetailsPage = function(details, fromDB) {
		$localstorage.set('TICKET_EDIT_MODE', angular.toJson(details));
		$localstorage.set('TICKET_TYPE', angular.toJson(fromDB));
		$localstorage.set('TICKET_EDIT_FROM', 'MY_GROUP');
		$state.go('eventmenu.openticketedit');
	};

	$scope.sparePartPage = function(details) {
		$localstorage.set('SPARE_PART_EDIT_MODE', angular.toJson(details));
		$localstorage.set('SPARE_PART_EDIT_FROM', 'MY_GROUP');
		$state.go('eventmenu.opensparepartedit');
	};

	//Perorm Lazy Loading. Also on each page visit fetch the my group ticket and update the DB with status as isGroup = true
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	if (ssoid) {
		$scope.createUI(ssoid, true);
		Utils.showPleaseWait(pleaseWait);
		try {
			var promise = applicationServices.getMyGroupOpenTicketsData(ssoid);
			promise.then(function(payload) {
				if (payload) {
					if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
						database.deleteAllGroupNonGroupCompletedTickets(ssoid, "true", function(data) {
							database.storeBulkCompletedTicketsMyGroup(payload.data.result, ssoid, function(data) {
								$scope.createUI(ssoid, false);
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
									sparePartsPromise.then(function(_payload) {
										if (_payload) {
											if (_payload && _payload.status == 200 && _payload.data && _payload.data.result && _payload.data.result.length > 0) {
												//Save the sparePart Records into the database
												// alert(_payload.data.result.length)
												database.deleteAllUploadedSparePartsForUserGroupAndNonGroup(ssoid, 'true', function(status) {
													//Status not required
													database.storeBulkSpareParts(_payload.data.result, ssoid, 'true', function(status) {
													});
												});
											}
										}
									}, function(errorPayload) {
									});
								}
							});
						});
					}
				}
			}, function(errorPayload) {
				Utils.hidePleaseWait();
			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
	}
});
