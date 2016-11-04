/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('openAccountCntrl', function($scope, $ionicScrollDelegate, $rootScope, Utils, database, $state, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http, $filter) {
	$scope.show_section = {};
	$scope.$parent.$parent.$parent.app_page_title = 'My Open Account/Asset';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.newaccountform = {};
	$scope.pendingItems = [];
	$scope.searchItems = null;
	$scope.pendingAccountItems = '';
	$scope.noTicketFound = false;
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');

	Utils.showPleaseWait(pleaseWait);
	$scope.hideSparePartDefectItems = function() {
		$scope.orderSpareParts.sparePartButtonHide = 'false';
	};

	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};

	$scope.createUI = function(ssoid) {
		try {
			database.getExtendedCRTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).UserId == ssoid) {
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).extendedCRData, $rootScope.dbpasscode)));
						}
					}
					$scope.noTicketFound = false;
					$scope.completedItems = compltedTaskArray;
					Utils.hidePleaseWait();

				} else {
					$scope.noTicketFound = true;
					$scope.completedItems = '';
					if ($rootScope.isOnline()) {// Do not hide the please wait message if online is true
					} else {
						Utils.hidePleaseWait();
					}
				}
			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
	};

	var ssoid = $localstorage.get('SN-LOGIN-SSO');

	if (ssoid) {
		database.getPendingTickets(ssoid, function(result) {
			if (result && result.rows && result.rows.length > 0) {
				for (var i = result.rows.length - 1; i >= 0; i--) {
					if (result.rows.item(i) && result.rows.item(i).Type && result.rows.item(i).Type == 'NEWACCOUNT') {
						//console.log(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)))
						$scope.pendingItems.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
					}
				}
				$scope.pendingAccountItems = $scope.pendingItems;
				//console.log($scope.pendingAccountItem)
			}
		});
	}

	/**
	 * Fetch the Closed ticket details from web service
	 */
	if ($rootScope.isOnline() && ssoid && ssoid.length > 0) {
		$scope.createUI(ssoid);
		//Utils.showPleaseWait(pleaseWait);
		$http.get($rootScope.baserootURL + 'api/now/table/u_extend_cr?sysparm_query=opened_by.user_name=' + ssoid + '^state!=3^u_stageNOT INClosed,closed-rejected^sysparam_display_value=true^ORDERBYDESCnumber&sysparm_limit=5&sysparm_fields=number,assignment_group.name,u_city,u_country,u_pole,u_account_name,u_system_name,u_operational_status,u_controller_type,u_asset_type,opened_by.name,u_ship_to,u_sold_to__,u_state,u_short_description,u_stage,u_cooler,u_ge_sap_po__,u_cam_electronics_serial_no,u_fluidics_serial_no,u_controller_serial_id,u_icc_skid_serial_no,u_transfer_date,u_asset_no,u_wbs_no').success(function(data, status, headers, config) {
			if (data && status == 200 && data.result && data.result.length > 0) {
				if (data.result.length > 0) {
					$scope.closedData = data.result;

					database.deleteOldExtendedCRData(ssoid, function(tmpdata) {
						database.storeExtendedCRTickets(data.result, ssoid, function(data) {
							var allItems = $scope.closedData;
							$scope.createUI(ssoid);

						});
					});
				}
			} else {				
				Utils.hidePleaseWait();
				$scope.createUI(ssoid);
			}
		}).error(function(data, status, headers, config) {
			//console.log(data.error.message)
			if (data && status == 404 && data.error.message == 'No Record found') {
				database.deleteOldClosedTickets(ssoid, function(tmpdata) {
					$scope.noTicketFound = true;
					Utils.hidePleaseWait();
					$scope.createUI(ssoid);

				});
			} else {
				Utils.showAlert("Not able to fetch the updated record");
				Utils.hidePleaseWait();
				//$scope.createUI(ssoid);
			}
		});
	} else {
		$scope.createUI(ssoid);
	}

	/**
	 * Open the respective account hierarchy form page
	 */
	$scope.showExtendedCRDetails = function(selectedItem, stage) {
		$localstorage.set('SELECTED_EXTENDED_CR', angular.toJson(selectedItem));
		$state.go('eventmenu.editExtendedCRform');
	};

});

