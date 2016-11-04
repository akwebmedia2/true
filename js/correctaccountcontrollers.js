/**
 * controller for open ticket
 */
angular.module('TrueSense.controllers').controller('correctaccountCtrl', function($scope, $ionicScrollDelegate, Utils, $filter, $rootScope, database, $parse, $http, $localstorage, $timeout, applicationServices, $state) {
	$scope.$parent.$parent.$parent.app_page_title = 'Correct Account/Asset';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.cityserach = {};
	$scope.ticketform = {};
	$scope.cityserach.showList = false;
	$rootScope.setupHttpAuthHeader();
	$scope.checkOnline = $rootScope.isOnline();
	$rootScope.serialDisplayVal = '';
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');

	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});

	/**
	 * Load the data for jump from account hieararchy to correction
	 */
	$scope.loadPartialData = function(formData) {
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
		$scope.ticketform.u_asset_type = formData.u_asset_type;
		$scope.ticketform.u_asset_number = formData.u_asset_number;
		$scope.ticketform.u_cam_serial_number = formData.u_cam_serial_number;
		$scope.ticketform.u_fluidics_serial_number = formData.u_fluidics_serial_number;
		$scope.ticketform.u_controller_serial_id = formData.u_controller_serial_id;
		$scope.ticketform.u_icc_skid_serial_number = formData.u_icc_skid_serial_number;

	};

	/**
	 * Get the Controller type data from DB
	 */
	database.getControllersOperationalData(function(result) {
		if (result && result.rows && result.rows.length > 0) {
			var compltedTaskArray = [];
			$scope.controllerval = [];
			for (var i = 0; i < result.rows.length; i++) {
				compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).Data, $rootScope.dbpasscode)));
			}

			var allItems = compltedTaskArray[0];

			for (var iTm = 0; iTm < allItems.length; iTm++) {
				if (allItems[iTm].element == 'u_controller_type') {
					$scope.controllerval.push(allItems[iTm]);
				}

			}
		}
	});

	var ssoid = $localstorage.get('SN-LOGIN-SSO');
	$scope.pendingCRItems = [];
	if (ssoid) {
		database.getPendingTickets(ssoid, function(result) {
			if (result && result.rows && result.rows.length > 0) {
				for (var i = result.rows.length - 1; i >= 0; i--) {
					var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
					tktData.Type = result.rows.item(i).Type;
					if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type == 'CORRECTION') {
						$scope.pendingCRItems.push(tktData);
					}
				}
				$scope.pendingCRItems = $scope.pendingCRItems;
				//console.log($scope.pendingAccountItem)
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
		//console.log(ciyNames)
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

	$scope.onControllerTypeChange = function() {
		$scope.masterListControllerType = Utils.getArrayWithSeletedItem($scope.masterListSystemName, "u_controller_type", $scope.ticketform.u_controller_type);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListControllerType, "u_asset_type");
		$scope.onANUMDown();
		this.setAssetType(items);
	};

	$scope.setAssetType = function(assetTP) {
		if (assetTP) {
			$scope.itemsATYP = assetTP;
			if (assetTP.length == 1) {

				$scope.ticketform.u_asset_type = assetTP[0];
				this.onAssetTypeChange();
			} else {
				$scope.ticketform.u_cam_serial_number = '';
			}
		}
	};

	$scope.onAssetTypeChange = function() {
		$scope.masterListControllerType = Utils.getArrayWithSeletedItem($scope.masterListSystemName, "u_asset_type", $scope.ticketform.u_asset_type);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListControllerType, "u_asset_number");
		$scope.onANUMDown();
		this.setAssetNumber(items);

		// Restting the Serial correction
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
		$scope.radio.serialType = 1;

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
					} else {
						$scope.ticketform.u_controller_serial_id = '';
					}
				}
			}
			this.onControllerSerialChange();

		}
	};
	$scope.masterListICCSSerial = [];
	$scope.onControllerSerialChange = function() {
		$scope.masterListICCSSerial = Utils.getArrayWithSeletedItem($scope.masterListControllerSerial, "u_controller_serial_id", $scope.ticketform.u_controller_serial_id);
		var items = Utils.getUniqueArrayWithSelectedItem($scope.masterListICCSSerial, "u_icc_skid_serial_number");
		$scope.onCSDDown();
		if (items[0].length > 0) {
			$scope.setICCSSerialNumber(items);
		}
		if ($scope.ticketform.u_controller_serial_id === null || $scope.ticketform.u_controller_serial_id === 'undefined' || $scope.ticketform.u_controller_serial_id == '') {
			$scope.ticketform.u_controller_serial_id_new = '';
			$scope.ticketform.u_icc_skid_serial_number_new = '';
		}
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

	$scope.onIccSkidSerialChange = function() {
		if ($scope.ticketform.u_icc_skid_serial_number === null || $scope.ticketform.u_icc_skid_serial_number === 'undefined' || $scope.ticketform.u_icc_skid_serial_number == '') {
			$scope.ticketform.u_icc_skid_serial_number_new = '';
		}
	}

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

		$scope.ticketform.u_asset_type = '';
		$scope.itemsATYP = [];

		$scope.ticketform.u_asset_number = '';
		$scope.itemsANUM = [];

		$scope.radio.serialType = 1;
		$scope.radio.systemName = 1;
		$scope.radio.controllerType = 1;
		$scope.ticketform.u_system_name_correction = '';
		$scope.ticketform.u_controller_type_correction = '';
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

	$scope.radio = {
		systemName : '1',
		controllerType : '1',
		serialType : '1'
	};

	$scope.ticketCancel = function() {
		$scope.ticketform = {};
		$rootScope.onBackPress();
	};

	$scope.onCorrectionUpload = function(savedItems, correctionType) {
		var corectiondata = {};
		if (correctionType) {
			if (correctionType == 'both') {
				corectiondata = {
					"u_system_name" : savedItems.u_system_name_correction,
					"u_controller_type" : savedItems.u_controller_type_correction
				};

				//$scope.ticketform.u_master_asset_tag_no = savedItems.u_system_name_correction;
				//$scope.ticketform.u_controller_type = savedItems.u_controller_type_correction;
			} else if (correctionType == 'system') {
				corectiondata = {
					"u_system_name" : savedItems.u_system_name_correction
				};
				//$scope.ticketform.u_master_asset_tag_no = savedItems.u_system_name_correction;
			} else if (correctionType == 'controller') {
				corectiondata = {
					"u_controller_type" : savedItems.u_controller_type_correction
				};
				//$scope.ticketform.u_controller_type = savedItems.u_controller_type_correction;
			}

			applicationServices.uploadAccountHierarchyCorrectionData($scope.sys_id_correction, corectiondata).then(function(payload) {
				if (payload) {
					$scope.onSerialCorrectionUpload();
				}
			}, function(errorPayload) {
				Utils.showAlert(unableToUpload);
				$scope.onSerialCorrectionUpload();

			});
		} else {
			$scope.onSerialCorrectionUpload();
		}
	};

	$scope.onSerialCorrectionUpload = function() {
		if ($scope.radio.serialType == 0) {
			var ssoid = $localstorage.get('SN-LOGIN-SSO');
			var serialCorrectionData = {};
			serialCorrectionData = {
				"opened_by" : ssoid,
				"u_city" : $scope.sys_id_correction,
				"state" : '1',
				"u_new_cam_elec_serial" : $scope.ticketform.u_cam_serial_number_new,
				"u_new_fluidics_serial" : $scope.ticketform.u_fluidics_serial_number_new,
				"u_new_controller_serial_no" : $scope.ticketform.u_controller_serial_id_new,
				"u_new_icc_skid_serial_no" : $scope.ticketform.u_icc_skid_serial_number_new
			};

			$http({
				method : 'POST',
				url : $rootScope.baserootURL + 'api/now/import/u_change_approval_stage?sysparm_input_display_value=false',
				data : serialCorrectionData,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			}).success(function(data, status, headers, config) {
				if (data && data.result && data.result[0] && data.result[0].display_value && data.result[0].display_value.length > 0 && data.result[0].display_value) {
					$rootScope.serialDisplayVal = data.result[0].display_value;
					Utils.showAlert("Change Approval " + data.result[0].display_value + " created for serial number correction");
					Utils.hidePleaseWait();
					$state.go('eventmenu.home');
				}

			}).error(function(data, status, headers, config) {
				Utils.showAlert(unableToUploadSerial);
				Utils.hidePleaseWait();
			});

		} else {
			Utils.hidePleaseWait();
			$state.go('eventmenu.home');
		}
	};

	$scope.uploadTicketProcess = function(savedItems) {

		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid) {
			//$scope.ticketform.ticketType = "ticket";

			//System current
			if ($scope.radio.systemName == 1) {
				savedItems.u_system_name_correction = '';
			}

			//Correction
			if ($scope.radio.controllerType == 1) {
				savedItems.u_controller_type_correction = '';
			}

			//Serial Correction
			if ($scope.radio.serialType == 1) {
				$scope.ticketform.u_cam_serial_number_new = '';
				$scope.ticketform.u_fluidics_serial_number_new = '';
				$scope.ticketform.u_controller_serial_id_new = '';
				$scope.ticketform.u_icc_skid_serial_number_new = '';
			}

			if ($rootScope.isOnline()) {

				Utils.showPleaseWait(uploadingCorrection);

				if ((savedItems.u_system_name_correction && savedItems.u_system_name_correction.length > 0) && (savedItems.u_controller_type_correction && savedItems.u_controller_type_correction.length > 0)) {
					$scope.onCorrectionUpload(savedItems, 'both');
				} else {
					if (savedItems.u_system_name_correction && savedItems.u_system_name_correction.length > 0) {
						//for system name correction
						$scope.onCorrectionUpload(savedItems, 'system');
					} else if (savedItems.u_controller_type_correction && savedItems.u_controller_type_correction.length > 0) {
						//for controller correction
						$scope.onCorrectionUpload(savedItems, 'controller');
					}
				}

				if ($scope.radio.serialType == 0 && $scope.radio.systemName == 1 && $scope.radio.controllerType == 1) {
					$scope.onSerialCorrectionUpload();
				}

			} else {
				if ($scope.sys_id_correction) {
					$scope.ticketform.sys_id_correction = $scope.sys_id_correction;
				}

				//System current
				if ($scope.radio.systemName == 1) {
					$scope.ticketform.u_system_name_correction = '';
					$scope.ticketform.systemName = 1;
				} else {
					$scope.ticketform.systemName = 0;
				}

				//Correction
				if ($scope.radio.controllerType == 1) {
					$scope.ticketform.u_controller_type_correction = '';
					$scope.ticketform.controllerType = 1;
				} else {
					$scope.ticketform.controllerType = 0;
				}

				// Serial correction
				if ($scope.radio.serialType == 1) {
					$scope.ticketform.u_cam_serial_number_new = '';
					$scope.ticketform.u_fluidics_serial_number_new = '';
					$scope.ticketform.u_controller_serial_id_new = '';
					$scope.ticketform.u_icc_skid_serial_number_new = '';
					$scope.ticketform.serialType = 1;
				} else {
					$scope.ticketform.serialType = 0;
				}

				//Save it locally for future upload process
				var d = new Date();
				var n = d.getTime();
				$scope.ticketform.ticketId = "" + n;
				$scope.ticketform.savedTS = "" + n;
				$scope.ticketform.userId = ssoid;
				$scope.ticketform.openedat = Utils.currentGMTDateTime();
				$scope.ticketform.sys_id_correction = $scope.sys_id_correction;
				database.storePendingTicket($scope.ticketform.ticketId, $scope.ticketform.userId, "CORRECTION", $scope.ticketform.savedTS, $scope.ticketform, function(status) {
					$scope.ticketform = {};
					$state.go('eventmenu.home');
				});

				//database.storeSerialCorrectionData($scope.sys_id_correction, ssoid, serialCorrectionData, function(status) {

				//});
			}
		}

	};

	/**
	 *On Ticket upload process
	 */
	$scope.ticketSubmit = function() {

		//Check for validation.
		var savedItems = $scope.ticketform;

		if (savedItems) {

			if (savedItems.u_cam_serial_number_new) {
				var newElectSerialFirst = savedItems.u_cam_serial_number_new.substring(0, 2);
				var newElectSerialSecon = savedItems.u_cam_serial_number_new.substring(2, 4);
				var newElectSerialThird = savedItems.u_cam_serial_number_new.substring(4, 8);
			} else {
				savedItems.u_cam_serial_number_new = ''
			}

			if (savedItems.u_fluidics_serial_number_new) {
				var newFluidicSerialFirst = savedItems.u_fluidics_serial_number_new.substring(0, 2);
				var newFluidicSerialSecon = savedItems.u_fluidics_serial_number_new.substring(2, 4);
				var newFluidicSerialThird = savedItems.u_fluidics_serial_number_new.substring(4, 8);
			} else {
				savedItems.u_fluidics_serial_number_new = ''
			}
			if (savedItems.u_controller_serial_id_new) {
				var newControllerSerialFirst = savedItems.u_controller_serial_id_new.substring(0, 2);
				var newControllerSerialSecon = savedItems.u_controller_serial_id_new.substring(2, 4);
				var newControllerSerialThird = savedItems.u_controller_serial_id_new.substring(4, 8);
			} else {
				savedItems.u_controller_serial_id_new = ''
			}
			if (savedItems.u_icc_skid_serial_number_new) {
				var newIccSkidSerialFirst = savedItems.u_icc_skid_serial_number_new.substring(0, 2);
				var newIccSkidSerialSecon = savedItems.u_icc_skid_serial_number_new.substring(2, 4);
				var newIccSkidSerialThird = savedItems.u_icc_skid_serial_number_new.substring(4, 8);
			} else {
				savedItems.u_icc_skid_serial_number_new = ''
			}

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
			} else if (!(savedItems.u_system_name_correction && savedItems.u_system_name_correction.length > 0) && ($scope.radio.systemName == '0')) {
				Utils.showAlert(systemCorrectionEmpty);
			} else if (!(savedItems.u_controller_type_correction && savedItems.u_controller_type_correction.length > 0) && ($scope.radio.controllerType == '0')) {
				Utils.showAlert(controllerCorrectionEmpty);
			} else if ($scope.radio.systemName == '1' && $scope.radio.controllerType == '1' && $scope.radio.serialType == '1') {
				Utils.showAlert(anyCorrection);
			} else if ((savedItems.u_master_asset_tag_no == savedItems.u_system_name_correction) && ($scope.radio.systemName == '0')) {
				Utils.showAlert(sameSystemName);
			} else if ((savedItems.u_controller_type == savedItems.u_controller_type_correction) && ($scope.radio.controllerType == '0')) {
				Utils.showAlert(sameControllerType);
			} else if ($scope.radio.serialType == '0') {
				if ((savedItems.u_cam_serial_number == savedItems.u_cam_serial_number_new) && (savedItems.u_fluidics_serial_number == savedItems.u_fluidics_serial_number_new) && (savedItems.u_controller_serial_id == savedItems.u_controller_serial_id_new) && (savedItems.u_icc_skid_serial_number == savedItems.u_icc_skid_serial_number_new)) {
					Utils.showAlert(sameSerialNumbers);
				} else if ((savedItems.u_cam_serial_number_new.length > 0) && (!(newElectSerialFirst > 0 && newElectSerialFirst <= 31) || !(newElectSerialSecon > 0 && newElectSerialSecon <= 12) || !(newElectSerialThird > 0 && newElectSerialThird <= 9999 && newElectSerialThird.length == 4))) {
					Utils.showAlert(electronicsFormatError);
				} else if ((savedItems.u_fluidics_serial_number_new.length > 0) && (!(newFluidicSerialFirst > 0 && newFluidicSerialFirst <= 31) || !(newFluidicSerialSecon > 0 && newFluidicSerialSecon <= 12) || !(newFluidicSerialThird > 0 && newFluidicSerialThird <= 9999 && newFluidicSerialThird.length == 4))) {
					Utils.showAlert(fluidicsFormatError);
				} else if ((savedItems.u_controller_serial_id_new.length > 0) && (!(newControllerSerialFirst > 0 && newControllerSerialFirst <= 31) || !(newControllerSerialSecon > 0 && newControllerSerialSecon <= 12) || !(newControllerSerialThird > 0 && newControllerSerialThird <= 9999 && newControllerSerialThird.length == 4))) {
					Utils.showAlert(controllersFormatError);
				} else if ((savedItems.u_icc_skid_serial_number_new.length > 0) && (!(newIccSkidSerialFirst > 0 && newIccSkidSerialFirst <= 31) || !(newIccSkidSerialSecon > 0 && newIccSkidSerialSecon <= 12) || !(newIccSkidSerialThird > 0 && newIccSkidSerialThird <= 9999 && newIccSkidSerialThird.length == 4))) {
					Utils.showAlert(iccskidFormatError);
				} else {
					$scope.uploadTicketProcess(savedItems);
				}
			} else {
				$scope.uploadTicketProcess(savedItems);
			}
		}
	};

	var usersCountryCode = $rootScope.usersCountryCode;

	if (usersCountryCode) {
		database.loadPwMasterData(usersCountryCode, 'MS_Change', function(result) {
			if (result && result.rows && result.rows.length > 0) {
				var ahArray = [];
				for (var i = 0; i < result.rows.length; i++) {
					ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
				}
				if (ahArray[0]['u_group.name']) {

					try {
						$scope.grpNotExists = false;
					} catch(e) {

					}

				} else {
					$scope.grpNotExists = true;
				}
			}

		});

	}

	$scope.uncheck = function() {

		Utils.showAlert(correctionGroupNotExist);
		$scope.checked = !$scope.checked;
	}

	$scope.serialCorrection = function() {

		$scope.ticketform.u_cam_serial_number_new = $scope.ticketform.u_cam_serial_number;
		$scope.ticketform.u_fluidics_serial_number_new = $scope.ticketform.u_fluidics_serial_number;
		$scope.ticketform.u_controller_serial_id_new = $scope.ticketform.u_controller_serial_id;
		$scope.ticketform.u_icc_skid_serial_number_new = $scope.ticketform.u_icc_skid_serial_number;
	};

	/**
	 *Correction Part
	 * @param {Object} details
	 */
	$scope.correctionEditPage = function(details) {
		//console.log(details)
		$localstorage.set('CORRECTION_DATA', angular.toJson(details));
		//$localstorage.set('SPARE_PART_EDIT_FROM', 'MY_TICKET');
		$state.go('eventmenu.correctionedit');
	};

	/**
	 * Get the saved data for Jump from Account hieararchy on correction page
	 */
	var jumpFromAcHier = $localstorage.get('Partial_Account_Hieararchy_Correction');
	if (jumpFromAcHier) {
		var jumpFromAcHierData = JSON.parse(jumpFromAcHier);

	}

	/**
	 *Fetch the account hie data from DB and group based on the city
	 */

	Utils.showPleaseWait(fetchingCities);
	$scope.visibleNoCityMsg = false;
	Utils.getSavedDBAccountHierarchy(database, Utils, function(data, ungrouped) {
		if (data && data.length > 0) {
			$scope.cities = data;
			Utils.hidePleaseWait();
			try {
				if (jumpFromAcHierData) {
					$scope.loadPartialData(jumpFromAcHierData);

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
