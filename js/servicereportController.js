/**
 * controller for open ticket
 */
angular.module('TrueSense.controllers').controller('servicereportCntrl', function($scope, $ionicScrollDelegate, Utils, $filter, $rootScope, database, $parse, $http, $localstorage, $timeout, applicationServices, $state) {
	$scope.$parent.$parent.$parent.app_page_title = 'Create Service Report';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.cityserach = {};
	$scope.ticketform = {};
	$scope.ticketform.u_status = "Closed";
	$scope.cityserach.showList = false;
	$scope.isGrpExist = true;
	$scope.imgAttachFlag = false;
	$scope.count = 1;
	$rootScope.setupHttpAuthHeader();
	$scope.checkOnline = $rootScope.isOnline();
	$scope.reportFlag = "Service";
	//Set Date as current date.
	$scope.ticketform.u_issue_start_date = $filter("date")(Date.now(), 'yyyy-MM-dd');
	$rootScope.serialDisplayVal = '';
	$scope.visibleHistBtn = true;
	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');

	if ($rootScope.isOnline()) { // Hide the attachment button if user is in offline mode
		$scope.showAttchmentBtn = true;
		
	} else {
		$scope.showAttchmentBtn = false;
		
	}

	/**
	 *Fetch the account hie data from DB and group based on the city
	 */
	Utils.getSavedDBAccountHierarchy(database, Utils, function(data, ungrouped) {
		if (data && data.length > 0) {
			$scope.cities = data;
			Utils.hidePleaseWait();
		} else {
			Utils.hidePleaseWait();
		}
	});

	/**
	 * Check the Approval Group name is available or not for session country
	 */
	var usersCountryCode = $rootScope.usersCountryCode;

	if (usersCountryCode && usersCountryCode.length > 0) {

		database.loadPwMasterData(usersCountryCode, 'u_true_sense_process', function(result) {
			if (result && result.rows && result.rows.length > 0) {
				var ahArray = [];
				for (var i = 0; i < result.rows.length; i++) {
					ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
				}
			}

			try {
				var cntr = 0;
				for (var i = 0; i < ahArray.length; i++) {
					if (ahArray[i].u_escalation_level == '1') {
						if (ahArray[i]['u_group.name']) {
							cntr = cntr + 1;
						}
					} else if (ahArray[i].u_escalation_level == '2') {

						if (ahArray[i]['u_group.name']) {
							cntr = cntr + 1;
						}
					} else if (ahArray[i].u_escalation_level == '3') {

						if (ahArray[i]['u_group.name']) {
							cntr = cntr + 1;
						}
					} else if (ahArray[i].u_escalation_level == '4') {

						if (ahArray[i]['u_group.name']) {
							cntr = cntr + 1;
						}
					} else {
						cntr = cntr;
					}
				}

				if (cntr == 4) {
					$scope.isGrpExist = true;
				} else {
					$scope.isGrpExist = false;
					Utils.showAlert(catalogueGroupNotExist);
				}
			} catch(e) {

			}

		});

	}

	// $scope.masterList = [];
	$scope.masterListCityName = [];
	$scope.masterListAccountName = [];
	$scope.masterListShipTo = [];
	$scope.masterListSystemName = [];
	$scope.masterListControllerType = [];
	$scope.masterListCamElectronicsSerial = [];
	$scope.onCitySelected = function(selectedCity) {
		$scope.cityserach.keyword = selectedCity.currentItem.u_city;
		$scope.ticketform.u_city = selectedCity.currentItem.u_city;
		$scope.cityserach.showList = false;
		$scope.masterListCityName = selectedCity.groupedItems;
		var items = Utils.getUniqueArrayWithSelectedItem(selectedCity.groupedItems, "u_account_name");
		$scope.onCityDown();
		this.setAccNames(items);
	};

	$scope.setAccNames = function(ciyNames) {
		if (ciyNames) {
			$scope.itemsAN = ciyNames;
			if (ciyNames.length == 1) {
				$scope.ticketform.u_account_name = ciyNames[0];
				this.onAccountNameChange();
			} else {
				$scope.ticketform.u_account_name = '';
			}
		}
	};

	$scope.onAccountNameChange = function() {
		$scope.masterListAccountName = Utils.getArrayWithSeletedItem($scope.masterListCityName, "u_account_name", $scope.ticketform.u_account_name);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListAccountName, "u_ship_to");
		$scope.onANDown();
		this.setShpTo(items);
	};

	$scope.setShpTo = function(accNames) {
		if (accNames) {
			$scope.itemsST = accNames;
			if (accNames.length == 1) {
				$scope.ticketform.u_ship_sold_to = accNames[0];
				this.onShipToChange();
			} else {
				$scope.ticketform.u_ship_sold_to = '';
			}
		}
	};

	$scope.onShipToChange = function() {
		$scope.masterListShipTo = Utils.getArrayWithSeletedItem($scope.masterListAccountName, "u_ship_to", $scope.ticketform.u_ship_sold_to);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListShipTo, "u_system_name");
		$scope.onSTDown();
		this.setSySName(items);
	};

	$scope.setSySName = function(shpToNames) {
		if (shpToNames) {
			$scope.itemsSN = shpToNames;
			if (shpToNames.length == 1) {
				$scope.ticketform.u_master_asset_tag_no = shpToNames[0];
				this.onSystemNameChange();
			} else {
				$scope.ticketform.u_master_asset_tag_no = '';
			}
		}
	};

	$scope.onSystemNameChange = function() {
		$scope.masterListSystemName = Utils.getArrayWithSeletedItem($scope.masterListShipTo, "u_system_name", $scope.ticketform.u_master_asset_tag_no);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListSystemName, "u_controller_type");
		$scope.onSNDown();
		this.setCtrlType(items);
	};

	$scope.setCtrlType = function(sysNames) {
		if (sysNames) {
			$scope.itemsCT = sysNames;
			if (sysNames.length == 1) {
				$scope.ticketform.u_controller_type = sysNames[0];
				this.onControllerTypeChange();
			} else {
				$scope.ticketform.u_controller_type = '';
			}
		}
	};

	//Static Priority Options
	$scope.priorityOptions = [{
		'name' : 'High',
		'value' : 'High'
	}, {
		'name' : 'Low',
		'value' : 'Low'
	}, {
		'name' : 'Medium',
		'value' : 'Medium'
	}];

	//Setting first option as selected in configuration select
	$scope.ticketform.u_priority = $scope.priorityOptions[1].value;

	$scope.onControllerTypeChange = function() {
		$scope.masterListControllerType = Utils.getArrayWithSeletedItem($scope.masterListSystemName, "u_controller_type", $scope.ticketform.u_controller_type);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListControllerType, "u_asset_number");
		$scope.onANUMDown();
		this.setAssetNumber(items);
	};

	$scope.setAssetNumber = function(assetNum) {
		if (assetNum) {
			$scope.itemsANUM = assetNum;
			if (assetNum.length == 1) {
				$scope.ticketform.u_asset_number = assetNum[0];
				this.onAssetNumberChange();
			} else {
				$scope.ticketform.u_cam_serial_number = '';
			}
		}
	};

	$scope.onAssetNumberChange = function() {
		$scope.masterListControllerType = Utils.getArrayWithSeletedItem($scope.masterListSystemName, "u_asset_number", $scope.ticketform.u_asset_number);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListControllerType, "u_cam_serial_number");
		$scope.onCTDown();
		this.setCamSerialNumber(items);
	};

	$scope.setCamSerialNumber = function(ctrlType) {
		if (ctrlType) {
			for (var i = 0; i < ctrlType.length; i++) {
				if (ctrlType[i].length > 0) {
					$scope.itemsCSM = ctrlType;
					if (ctrlType.length == 1) {
						$scope.ticketform.u_cam_serial_number = ctrlType[0];
					} else {
						$scope.ticketform.u_cam_serial_number = '';
					}
				}
			}
			this.onCamElectronicsSerialChange();
		}
	};

	$scope.onCamElectronicsSerialChange = function() {
		$scope.show_section.historicalTickets = false;
		$scope.isViewHistoricData = false;
		$scope.visibleHistBtn = true;
		$scope.masterListCamElectronicsSerial = Utils.getArrayWithSeletedItem($scope.masterListControllerType, "u_cam_serial_number", $scope.ticketform.u_cam_serial_number);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListCamElectronicsSerial, "u_fluidics_serial_number");
		$scope.onCSNDown();
		this.setFluidicsSerialNumber(items);
	};

	$scope.setFluidicsSerialNumber = function(comSerialNumber) {
		if (comSerialNumber) {
			for (var i = 0; i < comSerialNumber.length; i++) {
				if (comSerialNumber[i].length > 0) {
					$scope.itemsFSM = comSerialNumber;
					if (comSerialNumber.length == 1) {
						$scope.ticketform.u_fluidics_serial_number = comSerialNumber[0];
					} else {
						$scope.ticketform.u_fluidics_serial_number = '';
					}
				}
			}
			this.onFluidicsSerialNumberChange();
		}
	};

	$scope.masterListControllerSerial = [];
	$scope.sys_id_correction = '';
	$scope.onFluidicsSerialNumberChange = function() {
		//Get the sys_id
		$scope.masterListControllerSerial = Utils.getArrayWithSeletedItem($scope.masterListCamElectronicsSerial, "u_fluidics_serial_number", $scope.ticketform.u_fluidics_serial_number);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListControllerSerial, "u_controller_serial_id");
		$scope.onFSNDown();
		$scope.setControllerSerial(items);
		//console.log("$scope.masterListControllerSerial = ", JSON.stringify($scope.masterListControllerSerial));
		if ($scope.masterListControllerSerial && $scope.masterListControllerSerial.length > 0 && $scope.masterListControllerSerial[0] && $scope.masterListControllerSerial[0].sys_id) {
			$scope.sys_id_correction = $scope.masterListControllerSerial[0].sys_id;
			$scope.ticketform.serial_temp_sys_id = $scope.masterListControllerSerial[0].sys_id;
		}
	};

	$scope.setControllerSerial = function(fluidicsSerialNumber) {
		if (fluidicsSerialNumber) {
			for (var i = 0; i < fluidicsSerialNumber.length; i++) {
				if (fluidicsSerialNumber[i].length > 0) {
					$scope.itemsCSD = fluidicsSerialNumber;
					if (fluidicsSerialNumber.length == 1) {
						$scope.ticketform.u_controller_serial_id = fluidicsSerialNumber[0];
						this.onControllerSerialChange();
					} else {
						$scope.ticketform.u_controller_serial_id = '';
					}
				}
			}
		}
	};

	$scope.masterListICCSSerial = [];
	$scope.onControllerSerialChange = function() {
		$scope.masterListICCSSerial = Utils.getArrayWithSeletedItem($scope.masterListControllerSerial, "u_controller_serial_id", $scope.ticketform.u_controller_serial_id);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListICCSSerial, "u_icc_skid_serial_number");
		$scope.onCSDDown();
		$scope.setICCSSerialNumber(items);
	};

	$scope.setICCSSerialNumber = function(iccSSerialNumber) {
		if (iccSSerialNumber) {
			for (var i = 0; i < iccSSerialNumber.length; i++) {
				if (iccSSerialNumber[i].length > 0) {
					$scope.itemsICCSS = iccSSerialNumber;
					if (iccSSerialNumber.length == 1) {
						$scope.ticketform.u_icc_skid_serial_number = iccSSerialNumber[0];
					} else {
						$scope.ticketform.u_icc_skid_serial_number = '';
					}
				}
			}

		}
	};

	Utils.getSavedDBDefectHierarchyServiceReport(database, Utils, function(data, nongroupdata) {
		if (data && data.length > 0) {
			$scope.u_defect_category1s = data;
		}
	});

	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};

	$scope.onSearchKeyword = function() {
		$scope.ticketform.u_city = '';
		//$scope.ticketform.u_city = $scope.cityserach.keyword;
		if ($scope.cityserach && $scope.cityserach.keyword && $scope.cityserach.keyword.length > 3) {
			$scope.cityserach.showList = true;
		}
	};

	$scope.onCityDown = function() {
		$scope.ticketform.u_account_name = '';
		$scope.itemsAN = [];

		$scope.ticketform.u_ship_sold_to = '';
		$scope.itemsST = [];

		$scope.ticketform.u_master_asset_tag_no = '';
		$scope.itemsSN = [];

		$scope.ticketform.u_controller_type = '';
		$scope.itemsCT = [];

		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];

		$scope.ticketform.u_asset_number = '';
		$scope.itemsANUM = [];
	};

	$scope.onANDown = function() {

		$scope.ticketform.u_ship_sold_to = '';
		$scope.itemsST = [];

		$scope.ticketform.u_master_asset_tag_no = '';
		$scope.itemsSN = [];

		$scope.ticketform.u_controller_type = '';
		$scope.itemsCT = [];

		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onSTDown = function() {

		$scope.ticketform.u_master_asset_tag_no = '';
		$scope.itemsSN = [];

		$scope.ticketform.u_controller_type = '';
		$scope.itemsCT = [];

		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onSNDown = function() {

		$scope.ticketform.u_controller_type = '';
		$scope.itemsCT = [];

		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onANUMDown = function() {
		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onCTDown = function() {
		$scope.ticketform.u_cam_serial_number = '';
		$scope.itemsCSM = [];

		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onCSNDown = function() {
		$scope.ticketform.u_fluidics_serial_number = '';
		$scope.itemsFSM = [];

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onFSNDown = function() {

		$scope.ticketform.u_controller_serial_id = '';
		$scope.itemsCSD = [];

		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.onCSDDown = function() {
		$scope.ticketform.u_icc_skid_serial_number = '';
		$scope.itemsICCSS = [];
	};

	$scope.isInvalid = function(field) {
		try {
			var data = $scope.$eval($parse(field));
			if (data && data.length > 0) {
				return false;
			} else {
				return true;
			}
		} catch(e) {
			return true;
		}
	};

	$scope.isInvalidWithCondition = function(rootFiled, field) {
		try {
			var rootData = $scope.$eval($parse(rootFiled));
			if (rootData && rootData.length > 0) {
				var data = $scope.$eval($parse(field));
				if (data && data.length > 0) {
					return "has-success";
				} else {
					return "has-error";
				}
			} else {
				return "";
			}
		} catch(e) {
			return "";
		}
	};

	$scope.onEffectedModuleChange2 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			$scope.ticketform.u_defect_category1_2 = selectedEffectedModule.currentItem.u_defect_category1;

		} else {
			$scope.u_defect_category2_2s = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1_2 = '';

		}
		$scope.u_defect_category3_2s = [];
		$scope.ticketform.u_defect_category2_2 = null
		$scope.ticketform.u_defect_category3_2 = null;
	};

	$scope.onComponentChange2 = function(selectedComponent) {
		$scope.u_defect_category3_2s = [];
		$scope.ticketform.u_defect_category3_2 = null;

		if (selectedComponent) {
			$scope.u_defect_category3_2s = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			$scope.ticketform.u_defect_category2_2 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_2 = '';
		}

	};

	$scope.onDefectChange2 = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3_2 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_2 = '';
		}

	};

	$scope.onEffectedModuleChange3 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s3 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			$scope.ticketform.u_defect_category1_3 = selectedEffectedModule.currentItem.u_defect_category1;
		} else {
			$scope.u_defect_category2_2s3 = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1_3 = '';
		}

		$scope.u_defect_category3_2s3 = [];
		$scope.ticketform.u_defect_category2_3 = null
		$scope.ticketform.u_defect_category3_3 = null;
	};

	$scope.onComponentChange3 = function(selectedComponent) {
		$scope.u_defect_category3_2s3 = [];
		$scope.ticketform.u_defect_category3_3 = null;
		if (selectedComponent) {
			$scope.u_defect_category3_2s3 = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			$scope.ticketform.u_defect_category2_3 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s3 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_3 = '';
		}
	};

	$scope.onDefectChange3 = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3_3 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_3 = '';
		}
	};

	$scope.onEffectedModuleChange4 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s4 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			$scope.ticketform.u_defect_category1_4 = selectedEffectedModule.currentItem.u_defect_category1;
		} else {
			$scope.u_defect_category2_2s4 = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1_4 = '';
		}

		$scope.u_defect_category3_2s4 = [];
		$scope.ticketform.u_defect_category2_4 = null
		$scope.ticketform.u_defect_category3_4 = null;
	};

	$scope.onComponentChange4 = function(selectedComponent) {
		$scope.u_defect_category3_2s4 = [];
		$scope.ticketform.u_defect_category3_4 = null;
		if (selectedComponent) {
			$scope.u_defect_category3_2s4 = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			$scope.ticketform.u_defect_category2_4 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s4 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_4 = '';
		}
	};

	$scope.onDefectChange4 = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3_4 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_4 = '';
		}

	};

	$scope.onEffectedModuleChange5 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s5 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			$scope.ticketform.u_defect_category1_5 = selectedEffectedModule.currentItem.u_defect_category1;
		} else {
			$scope.u_defect_category2_2s5 = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1_5 = '';
		}
		$scope.u_defect_category3_2s5 = [];
		$scope.ticketform.u_defect_category2_5 = null
		$scope.ticketform.u_defect_category3_5 = null;

	};

	$scope.onComponentChange5 = function(selectedComponent) {
		$scope.u_defect_category3_2s5 = [];
		$scope.ticketform.u_defect_category3_5 = null;
		if (selectedComponent) {
			$scope.u_defect_category3_2s5 = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			$scope.ticketform.u_defect_category2_5 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s5 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_5 = '';
		}

	};

	$scope.onDefectChange5 = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3_5 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_5 = '';
		}
	};

	$scope.onEffectedModuleChange = function(selectedEffectedModule) {
		$scope.u_defect_category3s = [];
		$scope.ticketform.u_defect_category2 = null
		$scope.ticketform.u_defect_category3 = null;
		//alert(selectedEffectedModule.groupedItems)
		if (selectedEffectedModule) {
			$scope.u_defect_category2s = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			$scope.ticketform.u_defect_category1 = selectedEffectedModule.currentItem.u_defect_category1;
		} else {
			$scope.u_defect_category2s = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1 = '';
		}

	};

	$scope.onComponentChange = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3 = null;
			$scope.u_defect_category3s = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			$scope.ticketform.u_defect_category2 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.ticketform.u_defect_category3 = null;
			$scope.u_defect_category3s = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2 = '';
		}
	};

	$scope.onDefectChange = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3 = '';
		}
	};

	$scope.ticketCancel = function() {
		$scope.ticketform = {};
		$rootScope.onBackPress();
	};

/**
	 * Convert the attached image to base64
	 */
	function toDataUrl(url, callback, outputFormat) {		
		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function() {
			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			var dataURL;
			canvas.height = this.height;
			canvas.width = this.width;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			callback(dataURL);
			canvas = null;
		};
		img.src = url;
	}

	/**
	 *Upload ticket to server in online mode
	 */
	$scope.uploadTicket = function() {
		
		// Check whether image is attached or not
		var imgStatus = document.getElementById('image').style.display;
		console.log(imgStatus)
		//alert(imgStatus)
		if (imgStatus == "block") {
			var allowedExtension = ['jpeg', 'jpg', 'gif', 'png'];
			var fileExtension = document.getElementById('image').src.split('.').pop().toLowerCase();
			var imgPath = document.getElementById('image').src;			
			var imgUrlPos = imgPath.lastIndexOf('/') + 1;
			var imgUrl = imgPath.lastIndexOf(".");			
			var attachmentName = imgPath.slice(imgUrlPos,imgUrl);			
			
		//	alert(fileExtension)
			var isValidFile = false;
			for (var index in allowedExtension) {
			if(fileExtension.search(allowedExtension[index]) > -1){					
					isValidFile = true;
					var imgType = allowedExtension[index]
					break;
			}
			
			
			}
			//alert(isValidFile)

			if (!isValidFile) {
				Utils.showAlert('Allowed Extensions are : *.' + allowedExtension.join(', *.') + '. Please remove the attachment OR try another image');
				$scope.imgAttachFlag = false;
			} else {
				$scope.imgAttachFlag = true;
				var imageURI = document.getElementById('image').src;
				toDataUrl(imageURI, function(base64Img) {
					var pos = base64Img.indexOf(',');
					pos = pos + 1;
					$scope.afterDot = base64Img.substr(pos);
					//console.log($scope.afterDot)
				});
			}
		} else { // If image not attached
			$scope.ticketform.u_status = "Closed";
			$scope.ticketform.u_issue_type = "Service";
			$http({
				method : 'POST',
				url : $rootScope.baserootURL + 'api/now/import/u_true_sense_process_stage?sysparm_input_display_value=false',
				data : $scope.ticketform,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			}).success(function(data, status, headers, config) {
				if (data && data.result && data.result[0] && data.result[0].display_value && data.result[0].display_value.length > 0 && data.result[0].display_value) {					
						Utils.showAlert("Ticket #" + data.result[0].display_value + createdSuccess);
						Utils.hidePleaseWait();
						$scope.backToTicketsListing();
					
				}
			}).error(function(data, status, headers, config) {
				Utils.showAlert(unableToUpload);
				Utils.hidePleaseWait();
			});	
		}

		if ($scope.imgAttachFlag) {
			$scope.ticketform.u_status = "Closed";
			$scope.ticketform.u_issue_type = "Service";
			$http({
				method : 'POST',
				url : $rootScope.baserootURL + 'api/now/import/u_true_sense_process_stage?sysparm_input_display_value=false',
				data : $scope.ticketform,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			}).success(function(data, status, headers, config) {
				if (data && data.result && data.result[0] && data.result[0].display_value && data.result[0].display_value.length > 0 && data.result[0].display_value) {
					if ($scope.imgAttachFlag === true && data.result[0].sys_id) {

						$http({
							method : 'POST',
							url : $rootScope.baserootURL + 'ecc_queue.do?JSON&sysparm_action=insert',
							data : {
								'agent' : "AttachmentCreator",
								'topic' : "AttachmentCreator",
								'name' : attachmentName + "." + imgType + ":image/" + imgType,
								'source' : "u_true_sense_process:" + data.result[0].sys_id,
								'payload' : $scope.afterDot,
							},
							headers : {
								'Content-Type' : 'application/json',
								'Accept' : 'application/json',
							},
						}).success(function(record, status, headers, config) {
							if (record) {								
								Utils.showAlert("Ticket #" + data.result[0].display_value + createdSuccess);
								Utils.hidePleaseWait();
								$scope.backToTicketsListing();
							}
						}).error(function(record, status, headers, config) {
							Utils.showAlert(unableToUpload);
							Utils.hidePleaseWait();
						});
					} else {
						//Utils.showAlert("Ticket #" + data.result[0].display_value + createdSuccess);
						//Utils.hidePleaseWait();
						//$scope.backToTicketsListing();
					}
				}
			}).error(function(data, status, headers, config) {
				Utils.showAlert(unableToUpload);
				Utils.hidePleaseWait();
			});
		} else { // If wrong image attached
			Utils.hidePleaseWait();
		}
	};
	
	$scope.removeImage = function() {
		if(document.getElementById('image').style.display == 'block'){
		document.getElementById('image').src = '';
		document.getElementById('image').style.display = 'none';
		} else {
			Utils.showAlert('No attached image found');
		}
	}



	/**
	 *On ticket upload to server if online else save it on the db for further upload
	 */
	$scope.uploadTicketProcess = function(savedItems) {
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid) {
			if (!(savedItems.u_priority && savedItems.u_priority.length > 0)) {
				$scope.ticketform.u_priority = "Low";
			}
			$scope.ticketform.ticketType = "ticket";
			var d = new Date();
			var n = d.getTime();
			$scope.ticketform.ticketId = "" + n;
			$scope.ticketform.savedTS = "" + n;
			$scope.ticketform.opened_by = ssoid;
			$scope.ticketform.userId = ssoid;
			//Patch for missing items. Not sure why service now is not using the same name for ticket creation and for edit.
			$scope.ticketform.u_cam_serial_no = $scope.ticketform.u_cam_serial_number;
			$scope.ticketform.u_fluidics_serial_no = $scope.ticketform.u_fluidics_serial_number;
			$scope.ticketform.u_icc_skid_serial_no = $scope.ticketform.u_icc_skid_serial_number;

			$scope.ticketform.u_defect_category_2 = $scope.ticketform.u_defect_category1_2;
			$scope.ticketform.u_defect_category_3 = $scope.ticketform.u_defect_category1_3;
			$scope.ticketform.u_defect_category_4 = $scope.ticketform.u_defect_category1_4;
			$scope.ticketform.u_defect_category_5 = $scope.ticketform.u_defect_category1_5;

			if ($rootScope.isOnline()) {
				Utils.showPleaseWait(uploadingTicket);
				$scope.uploadTicket();

			} else {
				if ($scope.sys_id_correction) {
					$scope.ticketform.sys_id_correction = $scope.sys_id_correction;
				}
				$scope.ticketform.u_status = "Closed";
				$scope.ticketform.u_issue_type = "Service";

				//Save it locally for future upload process
				database.storePendingTicket($scope.ticketform.ticketId, $scope.ticketform.userId, "SERVICE_REPORT", $scope.ticketform.savedTS, $scope.ticketform, function(status) {
					$scope.ticketform = {};
					$scope.backToTicketsListing();
				});
			}
		}
	};

	$scope.radio = {
		systemName : '1',
		controllerType : '1',
		serialType : '1'
	};

	$scope.openTicketCheckPhone = function() {
		if ($('#openTicketCheckPhone').is(':hidden')) {
			return false;
		} else {
			return true;
		}
	};

	$scope.backToTicketsListing = function() {
		if ($scope.openTicketCheckPhone()) {
			$state.go('eventmenu.myservicereport');
		} else {
			$state.go('eventmenu.myservicereport');
		}
	};

	/**
	 *On Ticket upload process
	 */
	$scope.ticketSubmit = function() {
		//Check for validation.
		var savedItems = $scope.ticketform;
		//console.log($scope.ticketform);

		try {
			//Check report date shohuld not be in past
			var currentTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
			var startTime = new Date(savedItems.u_issue_start_date).getTime();
			var endTime = new Date(currentTime).getTime();

		} catch(e) {
			var endTime = '';
			var startTime = '';
		}

		if (savedItems) {
			if (!(savedItems.u_city && savedItems.u_city.length > 0)) {
				Utils.showAlert(cityEmpty);
			} else if (!(savedItems.u_account_name && savedItems.u_account_name.length > 0)) {
				Utils.showAlert(accountEmpty);
			} else if (!(savedItems.u_ship_sold_to && savedItems.u_ship_sold_to.length > 0)) {
				Utils.showAlert(shiptoEmpty);
			} else if (!(savedItems.u_master_asset_tag_no && savedItems.u_master_asset_tag_no.length > 0)) {
				Utils.showAlert(systemEmpty);
			} else if (!(savedItems.u_controller_type && savedItems.u_controller_type.length > 0)) {
				Utils.showAlert(controllerEmpty);
			} else if (!(savedItems.u_asset_number && savedItems.u_asset_number.length > 0)) {
				Utils.showAlert(assetEmpty);
			} else if (startTime < endTime) {
				Utils.showAlert(pastDate);

			} else if (savedItems.u_defect_category1 && savedItems.u_defect_category1.length > 0) {
				if (!(savedItems.u_defect_category2 && savedItems.u_defect_category2.length > 0)) {
					Utils.showAlert(defectCategory2);
				} else if (!(savedItems.u_defect_category3 && savedItems.u_defect_category3.length > 0)) {
					Utils.showAlert(activityCategory3);
				} else if (savedItems.u_defect_category1_2 && savedItems.u_defect_category1_2.length > 0) {
					if (!(savedItems.u_defect_category2_2 && savedItems.u_defect_category2_2.length > 0)) {
						Utils.showAlert(defectCategory2_2);
					} else if (!(savedItems.u_defect_category3_2 && savedItems.u_defect_category3_2.length > 0)) {
						Utils.showAlert(activityCategory2_3);
					} else if (savedItems.u_defect_category1_3 && savedItems.u_defect_category1_3.length > 0) {
						if (!(savedItems.u_defect_category2_3 && savedItems.u_defect_category2_3.length > 0)) {
							Utils.showAlert(defectCategory3_2);
						} else if (!(savedItems.u_defect_category3_3 && savedItems.u_defect_category3_3.length > 0)) {
							Utils.showAlert(activityCategory3_3);
						} else if (savedItems.u_defect_category1_4 && savedItems.u_defect_category1_4.length > 0) {
							if (!(savedItems.u_defect_category2_4 && savedItems.u_defect_category2_4.length > 0)) {
								Utils.showAlert(defectCategory4_2);
							} else if (!(savedItems.u_defect_category3_4 && savedItems.u_defect_category3_4.length > 0)) {
								Utils.showAlert(activityCategory4_3);
							} else if (savedItems.u_defect_category1_5 && savedItems.u_defect_category1_5.length > 0) {
								if (!(savedItems.u_defect_category2_5 && savedItems.u_defect_category2_5.length > 0)) {
									Utils.showAlert(defectCategory5_2);
								} else if (!(savedItems.u_defect_category3_5 && savedItems.u_defect_category3_5.length > 0)) {
									Utils.showAlert(activityCategory5_3);
								} else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
									$scope.show_section.incident = true;
									Utils.showAlert(serviceReportEmpty);
								} else {
									$scope.uploadTicketProcess(savedItems);
								}
							} else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
								$scope.show_section.incident = true;
								Utils.showAlert(serviceReportEmpty);
							} else {
								$scope.uploadTicketProcess(savedItems);
							}
						} else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
							$scope.show_section.incident = true;
							Utils.showAlert(serviceReportEmpty);
						} else {
							$scope.uploadTicketProcess(savedItems);
						}
					} else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
						$scope.show_section.incident = true;
						Utils.showAlert(serviceReportEmpty);
					} else {
						$scope.uploadTicketProcess(savedItems);
					}
				} else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
					$scope.show_section.incident = true;
					Utils.showAlert(serviceReportEmpty);
				} else {
					$scope.uploadTicketProcess(savedItems);
				}
			}// End of defect
			else if (!(savedItems.u_service_report && savedItems.u_service_report.length > 0)) {
				$scope.show_section.incident = true;
				Utils.showAlert(serviceReportEmpty);
			} else {
				$scope.uploadTicketProcess(savedItems);
			}
		}

	};

	$scope.loadPartialAccountHierarchy = function(formData) {
		//var partialDataAvailable = $localstorage.get('PARTIAL_DATA');
		if (formData) {
			for (var i = 0; i < $scope.cities.length; i++) {
				if ($scope.cities[i].currentItem.u_city == formData.u_city) {
					$scope.onCitySelected($scope.cities[i]);
					break;
				}
			}
		}
		$scope.ticketform.u_account_name = formData.u_account_name;
		$scope.onAccountNameChange();
		$scope.ticketform.u_master_asset_tag_no = formData.u_system_name;
		$scope.onSystemNameChange();
		$scope.ticketform.u_controller_type = formData.u_controller_type;
	}
	var jumpFromAcHier = $localstorage.get('Partial_Account_Hieararchy_Report');
	if (jumpFromAcHier) {
		var jumpFromAcHierData = angular.fromJson(jumpFromAcHier);
	}

	/**
	 *Fetch the account hierarchy data from DB and group based on the city
	 */
	Utils.showPleaseWait(fetchingCities);
	Utils.getSavedDBAccountHierarchy(database, Utils, function(data, ungrouped) {
		if (data && data.length > 0) {
			$scope.cities = data;
			Utils.hidePleaseWait();
			try {
				if (jumpFromAcHierData) {
					$scope.loadPartialAccountHierarchy(jumpFromAcHierData);
				} else {
				}
			} catch(e) {
			}
		} else {
			Utils.hidePleaseWait();
			setTimeout(function() {
				Utils.showAlert(noCityRecord + ' ' + $rootScope.usersCountryCode + ' Country, Please check Country setting');
				// If city record could not load
			}, 100);
		}
	});

});
