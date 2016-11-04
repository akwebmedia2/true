/**
 *COntroller for accounthierarchy form
 */
angular.module('TrueSense.controllers').controller('accounthierarchyformCtrl', function($scope, $ionicScrollDelegate, $localstorage, applicationServices, $rootScope, Utils, database, $state) {
	$scope.$parent.$parent.$parent.app_page_title = accountHierarchyFormTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.show_section = {};
	$scope.accessibility = {};
	$scope.accessibility.enable_account_hierarchy_edit = false;
	$scope.isAccountHierEdit = false;
	$scope.accessibility.isShowControle = 'false';
	$rootScope.setupHttpAuthHeader();
	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};

	$scope.details = {};
	var selectedItem = $localstorage.get('SELECTED_ACCOUNT');
	var items = angular.fromJson(selectedItem);
	$scope.savedValue = angular.fromJson(selectedItem);
	//console.log($scope.savedValue)
	if (items) {
		var accountMode = $localstorage.get('SELECTED_ACCOUNT_MODE');
		if (accountMode) {
			$scope.details = items;
			if ($scope.details && $scope.details.u_hw_kits && $scope.details.u_hw_kits.length > 0) {
				if ($scope.details.u_hw_kits == 'true') {
					$scope.details.u_hw_kits = true;
				} else if ($scope.details.u_hw_kits == 'false') {
					$scope.details.u_hw_kits = false;
				}
			}
			if ($scope.details && $scope.details.u_ethernet_kits && $scope.details.u_ethernet_kits.length > 0) {
				if ($scope.details.u_ethernet_kits == 'true') {
					$scope.details.u_ethernet_kits = true;
				} else if ($scope.details.u_ethernet_kits == 'false') {
					$scope.details.u_ethernet_kits = false;
				}
			}
			if ($scope.details && $scope.details.u_electrical_cover_box && $scope.details.u_electrical_cover_box.length > 0) {
				if ($scope.details.u_electrical_cover_box == 'true') {
					$scope.details.u_electrical_cover_box = true;
				} else if ($scope.details.u_electrical_cover_box == 'false') {
					$scope.details.u_electrical_cover_box = false;
				}
			}

			/*if ($scope.details.u_fluidic_cooler_option == 'true'){
			$scope.details.u_fluidic_cooler_option = "yes";
			} else if ($scope.details.u_fluidic_cooler_option == 'false'){
			$scope.details.u_fluidic_cooler_option = "no";
			} else {
			$scope.details.u_fluidic_cooler_option = '';
			}*/

			/**
			 * Check in pending Item
			 */
			if ($scope.details && $scope.details.sys_id) {
				database.getPendingTicketBasedonTicketId('ACCOUNTHIERARCHY' + $scope.details.sys_id, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						if (accountMode && accountMode.length > 0) {
							if (accountMode == 'PENDING') {
								$scope.accessibility.isShowControle = 'true';
								$scope.$apply();
							} else {
								$scope.accessibility.isShowControle = 'false';
								$scope.$apply();
								//Show alert Message
								Utils.showAlert(alreadyPendingToUpload);
							}
						}
					} else {
						if (accountMode == 'NEW') {
							$scope.accessibility.isShowControle = 'true';
							$scope.$apply();
						}
					}
				});
			}
		}
	}

	/**
	 * Check the Account Hierarchy edit access is available or not
	 */

	var usersCountryCode = $scope.savedValue.u_country;

	if (usersCountryCode) {
		database.loadPwMasterData(usersCountryCode, 'u_true_sense_process', function(result) {
			if (result && result.rows && result.rows.length > 0) {
				var ahArray = [];
				for (var i = 0; i < result.rows.length; i++) {
					ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
				}
				$scope.groups = Utils.getPWMasterDataGroupBy(ahArray, "u_group.name");

				var ssoid = $localstorage.get('SN-LOGIN-SSO')
				if (ssoid) {
					database.getUserInfo(ssoid, function(result) {
						if (result && result.rows && result.rows.length > 0) {
							var applicationAccess = result.rows.item(0);
							if (applicationAccess) {
								var applicationAccessJSON = angular.fromJson(Tea.decrypt(applicationAccess.UserInfo, $rootScope.dbpasscode));
								if (applicationAccessJSON) {
									$scope.usergroups = applicationAccessJSON.login_user_groups;

									//console.log($scope.groups)
									//console.log($scope.usergroups)
									try {
										for (var i = 0; i < $scope.groups.length; i++) {
											//console.log($scope.groups[i].value)
											if ($scope.usergroups.indexOf($scope.groups[i].value) > -1) {
												$scope.accessibility.enable_account_hierarchy_edit = true;
												$scope.$apply();
												break;
											}
										}
									} catch(e) {
									}

								}
							}
						}

					});

				}

			}
		});

	}

	/**
	 * Get the Controller type data from DB
	 */
	database.getControllersOperationalData(function(result) {
		if (result && result.rows && result.rows.length > 0) {
			var compltedTaskArray = [];
			for (var i = 0; i < result.rows.length; i++) {
				compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).Data, $rootScope.dbpasscode)));
			}
			$scope.operationalVal = [];
			$scope.controllerval = [];
			$scope.marketSectorVal = [];
			$scope.dcsConnectionVal = [];
			$scope.assetType = [];
			var allItems = compltedTaskArray[0];

			for (var iTm = 0; iTm < allItems.length; iTm++) {
				if (allItems[iTm].element == 'u_controller_type') {
					$scope.controllerval.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_market_sector' && allItems[iTm].label != '-- Select --') {
					$scope.marketSectorVal.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_dcs_connection' && allItems[iTm].label != '-- Select --') {
					$scope.dcsConnectionVal.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_asset_type') {
					$scope.assetType.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_operational_status') {
					if (allItems[iTm].label != '-- Select --') {
						if ($scope.accountHierOperational == true) {
							$scope.operationalVal.push(allItems[iTm]);
						} else {
							if (allItems[iTm].label != 'Obsolete') {
								$scope.operationalVal.push(allItems[iTm]);
							}
						}
					}
				}
			}

		}
	});

	Utils.getSavedDBCountryAccountHierarchy(database, Utils, function(data) {
		$scope.countryList = data;
	});

	/**
	 * Send update account hierarchy information to the web service
	 */
	$scope.onUpdateAccountHierarchy = function() {
		$scope.details.currentUTCDate = '' + Utils.currentUTCDate();
		// if (/*$rootScope.isOnline()*/false) {
		if ($rootScope.isOnline()) {
			var items = {
				"u_account_name" : $scope.details.u_account_name,
				"u_pole" : $scope.details.u_pole,
				"u_sold_to" : $scope.details.u_sold_to,
				"u_city" : $scope.details.u_city,
				"u_ship_to" : $scope.details.u_ship_to,
				"u_state" : $scope.details.u_state,
				"u_duns_number" : $scope.details.u_duns_number,
				"u_country" : $scope.details.u_country,
				"u_notes" : $scope.details.u_notes,
				"u_system_name" : $scope.details.u_system_name,
				"u_controller_type" : $scope.details.u_controller_type,
				"u_cam_serial_number" : $scope.details.u_cam_serial_number,
				"u_fluidics_serial_number" : $scope.details.u_fluidics_serial_number,
				"u_controller_serial_id" : $scope.details.u_controller_serial_id,
				"u_icc_skid_serial_number" : $scope.details.u_icc_skid_serial_number,
				"u_sap_pe_no" : $scope.details.u_sap_pe_no,
				"u_salesorg" : $scope.details.u_salesorg,
				"u_ship_date" : $scope.details.u_ship_date,
				"u_salesdistrictid" : $scope.details.u_salesdistrictid,
				"u_region" : $scope.details.u_region,
				"u_salesregionid" : $scope.details.u_salesregionid,
				"u_contract_details" : $scope.details.u_contract_details,
				"u_operational_status" : $scope.details.u_operational_status,
				"u_hw_kits" : "" + $scope.details.u_hw_kits,
				"u_electrical_cover_box" : "" + $scope.details.u_electrical_cover_box,
				"u_changes_from" : "Mobile",
				"u_ethernet_kits" : "" + $scope.details.u_ethernet_kits,
				"u_ts2_firmware_rev" : $scope.details.u_ts2_firmware_rev,
				"u_temperature_c_or_f" : $scope.details.u_temperature_c_or_f,
				"u_mrc__psc_firmware_rev" : $scope.details.u_mrc__psc_firmware_rev,
				"u_update_date" : '' + Utils.currentUTCDateTimeServiceNowFormat(),
				// "u_update_date" : $scope.details.u_date_of_upgrade,
				"u_date_of_upgrade" : $scope.details.u_date_of_upgrade,
				"u_control_status" : $scope.details.u_control_status,
				"u_fluidic_cooler_option" : $scope.details.u_fluidic_cooler_option,
				"u_changes_date" : '' + Utils.currentUTCDate(),
				"u_asset_number" : '' + $scope.details.u_asset_number,
				"u_asset_type" : '' + $scope.details.u_asset_type,
				"u_market_sector" : '' + $scope.details.u_market_sector,
				"u_dcs_connection" : '' + $scope.details.u_dcs_connection

			};

			/**
			 * Send the warranty date if commissing flag is false
			 */
			if ($scope.details.u_dateofcommissing && $scope.details.u_dateofcommissing.length > 0 && $scope.savedValue.u_flagdateofcommissing == 'false') {
				items.u_dateofcommissing = $scope.details.u_dateofcommissing;
				items.u_flagdateofcommissing = $scope.details.flagofcommissing;
			}

			Utils.showPleaseWait(pleaseWait);
			var promise = applicationServices.updateAccountHierarchy($scope.details.sys_id, items);
			promise.then(function(payload) {
				if (payload && payload.status == 200) {
					Utils.showAlert(updateSuccessfully);
					Utils.hidePleaseWait();
					$state.go('eventmenu.home');
				}
			}, function(errorPayload) {
				if (errorPayload && errorPayload.statusText && errorPayload.statusText.length > 0) {
					$state.go('eventmenu.home');
					Utils.showAlert(errorPayload.statusText);
				}
				Utils.hidePleaseWait();

			});
		} else {
			/**
			 * Save it locally for future upload process
			 */
			if (ssoid) {
				$scope.details.u_update_date = '' + Utils.currentUTCDateTimeServiceNowFormat();
				var d = new Date();
				var n = d.getTime();
				var localSavedTS = "" + n;
				database.storePendingTicket('ACCOUNTHIERARCHY' + $scope.details.sys_id, ssoid, 'ACCOUNTHIERARCHY', localSavedTS, $scope.details, function(status) {
					$state.go('eventmenu.home');
					Utils.showAlert(offlineModeRecords);
				});
			}
		}
	};

	/**
	 * On Cancel button press
	 */
	$scope.onCancelAccountHierarchy = function() {
		var selectedItemOnCancle = $localstorage.get('SELECTED_ACCOUNT');
		var itemsOnCancle = angular.fromJson(selectedItemOnCancle);
		if (itemsOnCancle) {
			$scope.details = itemsOnCancle;
		}
		$state.go('eventmenu.home');
	};
	/**
	 * Set the current date if operational status changed from To be commissioned to In service and commissing flag is false
	 */
	$scope.operationalStatusChange = function() {
		if ($scope.savedValue.u_flagdateofcommissing == 'false') {
			if ($scope.savedValue.u_operational_status == "To Be Commissioned" && $scope.details.u_operational_status == "In Service") {
				$scope.details.u_dateofcommissing = Utils.currentGMTDate();
				$scope.details.flagofcommissing = "true";
			} else {
				$scope.details.flagofcommissing = "false";
			}

		}
	};
	$scope.newTicketAcHierarchy = function() {
		var partialData = JSON.parse($localstorage.get('SELECTED_ACCOUNT'));
		$localstorage.set('Partial_Account_Hieararchy_New', JSON.stringify(partialData));
		$localstorage.set('PARTIAL_FORM_DATA', '');
		$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
		$localstorage.set('Partial_Account_Hieararchy_Log', '');
		$localstorage.set('Partial_Account_Hieararchy_Correction', '');
		$localstorage.set('Partial_Account_Hieararchy_Report', '');
		$state.go('eventmenu.openticket');

	}

	$scope.createLogIssueAcHierarchy = function() {
		var partialData = JSON.parse($localstorage.get('SELECTED_ACCOUNT'));
		$localstorage.set('Partial_Account_Hieararchy_Log', JSON.stringify(partialData));
		$localstorage.set('PARTIAL_FORM_DATA', '');
		$localstorage.set('Partial_Account_Hieararchy_New', '');
		$localstorage.set('Partial_Account_Hieararchy_Correction', '');
		$state.go('eventmenu.logissue');
		$localstorage.set('Partial_Account_Hieararchy_Report', '');
	}

	$scope.correctAccount = function() {
		var partialData = JSON.parse($localstorage.get('SELECTED_ACCOUNT'));
		$localstorage.set('Partial_Account_Hieararchy_Correction', JSON.stringify(partialData));
		$localstorage.set('PARTIAL_FORM_DATA', '');
		$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
		$localstorage.set('Partial_Account_Hieararchy_New', '');
		$localstorage.set('Partial_Account_Hieararchy_Log', '');
		$localstorage.set('Partial_Account_Hieararchy_Report', '');
		$state.go('eventmenu.correctaccount');
	}
	$scope.serviceReport = function() {
		var partialData = JSON.parse($localstorage.get('SELECTED_ACCOUNT'));
		$localstorage.set('Partial_Account_Hieararchy_Report', JSON.stringify(partialData));
		$localstorage.set('PARTIAL_FORM_DATA', '');
		$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
		$localstorage.set('Partial_Account_Hieararchy_New', '');
		$localstorage.set('Partial_Account_Hieararchy_Log', '');
		$state.go('eventmenu.servicereport');
	}
});
