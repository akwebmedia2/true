/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('editExtendedCrCntrl', function($scope, $ionicScrollDelegate, $rootScope, Utils, database, $state, $parse, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http, $filter) {
	$scope.show_section = {};
	$scope.$parent.$parent.$parent.app_page_title = 'My Open Account/Asset';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.extendedData = {};
	$scope.statesList = [];
	Utils.showPleaseWait("Please wait...");	
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	
	if(ssoid == adminSso){
		$scope.setShiptoLimit = 20;
	} else {
		$scope.setShiptoLimit = 10;
	}

	var ssoid = $localstorage.get('SN-LOGIN-SSO');
	$scope.extendedData.opened_by = ssoid;
	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});
	$scope.hideSparePartDefectItems = function() {
		$scope.orderSpareParts.sparePartButtonHide = 'false';
	};

	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
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

	$scope.isInvalidShip = function(field) {
		try {
			var data = $scope.$eval($parse(field));
			if ((data && data.length > 0) && (!(isNaN(data))|| ssoid == adminSso )) {
				return false;
			} else {
				return true;
			}
		} catch(e) {
			return true;
		}
	};

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
			$scope.assetType = [];
			var allItems = compltedTaskArray[0];
			for (var iTm = 0; iTm < allItems.length; iTm++) {
				if (allItems[iTm].element == 'u_controller_type') {
					$scope.controllerval.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_asset_type') {
					$scope.assetType.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_operational_status') {
					if (allItems[iTm].label != 'New' && allItems[iTm].label != 'Moved' && allItems[iTm].label != '-- Select --') {// New & Moved is not required for Extended CR
						$scope.operationalVal.push(allItems[iTm]);
					}
				}
			}
			$scope.$apply();
		}
	});

	/**
	 * Get the state list from account hieararchy table
	 */

	Utils.getSavedDBStateAccountHierarchy(database, Utils, function(data) {
		if (data && data.length > 0) {
			for ( i = 0; i < data.length; i++) {
				if (data[i].State == 'na' || data[i].State == 'NA') {
					var staticState = [{
						"State" : "Not Used"
					}, {
						"State" : "na"
					}];
					break;
				} else {
					var staticState = [{
						"State" : "Not Used"
					}];
				}
			}
			//$scope.statesList = data;
			for (var key in data) {
				$scope.statesList[key] = data[key];
			}
			for (var key in staticState) {
				$scope.statesList[key] = staticState[key];
			}

			var flags = [], output = [], l = $scope.statesList.length, i;
			for ( i = 0; i < l; i++) {
				if (flags[$scope.statesList[i].State])
					continue;
				flags[$scope.statesList[i].State] = true;
				output.push($scope.statesList[i]);
				//console.log($scope.statesList[i])
			}
			//console.log($scope.statesList)
			Utils.hidePleaseWait();

		} else {
			Utils.hidePleaseWait();
		}
	});

	/**
	 * Get the Country list from account hieararchy table
	 */
	Utils.getSavedAllCountry(database, Utils, function(data) {
		$scope.countryList = data;
		$scope.$apply();

	});

	/**
	 * Get the Controller type data from DB
	 */
	database.getCountryPoleData(function(result) {
		if (result && result.rows && result.rows.length > 0) {
			var compltedTaskArray = [];
			for (var i = 0; i < result.rows.length; i++) {
				compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).Data, $rootScope.dbpasscode)));
			}

			$scope.poleList = [];
			var allItems = compltedTaskArray[0];
			for (var iTm = 0; iTm < allItems.length; iTm++) {
				if (allItems[iTm].element == 'u_pole') {
					$scope.poleList.push(allItems[iTm]);
				}
			}
			$scope.$apply();
		}
	});

	var selectedItem = $localstorage.get('SELECTED_EXTENDED_CR');

	$timeout(function() {
		$scope.extendedData = angular.fromJson(selectedItem);

		if ($scope.extendedData.number) {
			$scope.disableAll = true;
		} else {
			$scope.disableAll = false;
		}

		if ($scope.extendedData.u_stage == 'Approval') {
			$scope.extendedData.u_stage = 'Pending Approval';
		}
		if ($scope.extendedData.u_state == 'na' || $scope.extendedData.u_state == 'NA') {
			$scope.extendedData.u_state = 'Not Used';
		}
		$scope.$apply();
	}, 0);

	/**
	 *Upload ticket to server in online mode
	 */
	$scope.uploadTicket = function() {
		//console.log($scope.extendedData.u_asset_number)
		$http({
			method : 'POST',
			url : $rootScope.baserootURL + 'api/now/import/u_extend_cr_stage?sysparm_input_display_value=false',
			data : $scope.extendedData,
			headers : {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
			},
		}).success(function(data, status, headers, config) {
			if (data && data.result && data.result[0] && data.result[0].display_value && data.result[0].display_value.length > 0 && data.result[0].display_value) {
				Utils.showAlert("Ticket #" + data.result[0].display_value + createdSuccess);
				Utils.hidePleaseWait();
				$state.go('eventmenu.openaccountasset');
			}

		}).error(function(data, status, headers, config) {
			Utils.showAlert(unableToUpload);
			Utils.hidePleaseWait();
		});
	};

	$scope.uploadTicketProcess = function(extendedData) {
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid) {
			//$scope.extendedData.ticketType = "ticket";
			//var d = new Date();
			//var n = d.getTime();
			//$scope.extendedData.ticketId = "" + n;
			//$scope.extendedData.savedTS = "" + n;
			//$scope.extendedData.opened_by = ssoid;
			//$scope.extendedData.userId = ssoid;
			//if ($scope.extendedData.u_cooler) {
			//	$scope.extendedData.u_cooler = true;
			//} else {
			//	$scope.extendedData.u_cooler = false;
			//}

			//if ($scope.extendedData.u_stage == 'Pending Approval') {
			//	$scope.extendedData.u_stage = 'Approval';
			//}

			if ($rootScope.isOnline()) {
				Utils.showPleaseWait(uploadingTicket);
				$scope.uploadTicket();

			} else {
				//Save it locally for future upload process
				var tempTicketId = $scope.extendedData.ticketId;
				database.storePendingTicket(tempTicketId, ssoid, "NEWACCOUNT", tempTicketId, $scope.extendedData, function(status) {
					//$scope.extendedData = {};
					$state.go('eventmenu.openaccountasset');
				});
			}
		}
	};

$scope.shiptovalidate = function(shipval){	
		if(isNaN(shipval) && (ssoid != adminSso)){
			Utils.hidePleaseWait();
			$timeout(function() {				
				Utils.showAlert("Ship To value should be 10 digits numerica data");
				$scope.extendedData.u_ship_to = '';
				 $timeout(function () {
                      document.getElementById('shipTo').focus();
                    });
				
			}, 100);
		} else {
			
		}}


	$scope.ticketSubmit = function() {

		//Check for validation.
		var savedItems = $scope.extendedData;
		//console.log(savedItems.u_asset_number)
		if (savedItems) {

			if (savedItems.u_cam_electronics_serial_no) {
				var newElectSerialFirst = savedItems.u_cam_electronics_serial_no.substring(0, 2);
				var newElectSerialSecon = savedItems.u_cam_electronics_serial_no.substring(2, 4);
				var newElectSerialThird = savedItems.u_cam_electronics_serial_no.substring(4, 8);
			} else {
				savedItems.u_cam_electronics_serial_no = ''
			}

			if (savedItems.u_fluidics_serial_no) {
				var newFluidicSerialFirst = savedItems.u_fluidics_serial_no.substring(0, 2);
				var newFluidicSerialSecon = savedItems.u_fluidics_serial_no.substring(2, 4);
				var newFluidicSerialThird = savedItems.u_fluidics_serial_no.substring(4, 8);
			} else {
				savedItems.u_fluidics_serial_no = ''
			}
			if (savedItems.u_controller_serial_id) {
				var newControllerSerialFirst = savedItems.u_controller_serial_id.substring(0, 2);
				var newControllerSerialSecon = savedItems.u_controller_serial_id.substring(2, 4);
				var newControllerSerialThird = savedItems.u_controller_serial_id.substring(4, 8);
			} else {
				savedItems.u_controller_serial_id = ''
			}
			if (savedItems.u_icc_skid_serial_no) {
				var newIccSkidSerialFirst = savedItems.u_icc_skid_serial_no.substring(0, 2);
				var newIccSkidSerialSecon = savedItems.u_icc_skid_serial_no.substring(2, 4);
				var newIccSkidSerialThird = savedItems.u_icc_skid_serial_no.substring(4, 8);
			} else {
				savedItems.u_icc_skid_serial_no = ''
			}

			if (!(savedItems.u_city && savedItems.u_city.length > 0)) {
				Utils.showAlert(cityEmptyCR);
			} else if (!(savedItems.u_operational_status && savedItems.u_operational_status.length > 0)) {
				Utils.showAlert(operationalEmpty);
			} else if (!(savedItems.u_country && savedItems.u_country.length > 0)) {
				Utils.showAlert(countryEmpty);
			} else if (!(savedItems.u_controller_type && savedItems.u_controller_type.length > 0)) {
				Utils.showAlert(controllerEmpty);
			} else if (!(savedItems.u_pole && savedItems.u_pole.length > 0)) {
				Utils.showAlert(poleEmpty);
			} else if (!(savedItems.u_asset_type && savedItems.u_asset_type.length > 0)) {
				Utils.showAlert(assetTypeEmpty);
			} else if (!(savedItems.u_account_name && savedItems.u_account_name.length > 0)) {
				Utils.showAlert(accountEmpty);
			} else if (!(savedItems.u_system_name && savedItems.u_system_name.length > 0)) {
				Utils.showAlert(systemEmpty);
			} else if (savedItems.u_asset_type == 'ICC' && (savedItems.u_cam_electronics_serial_no.length <= 0 || savedItems.u_fluidics_serial_no.length <= 0 || savedItems.u_controller_serial_id.length <= 0 || savedItems.u_icc_skid_serial_no.length <= 0)) {
				Utils.showAlert(ICCRule);
			} else if (savedItems.u_asset_type == 'CAM & CM' && (savedItems.u_cam_electronics_serial_no.length <= 0 || savedItems.u_fluidics_serial_no.length <= 0 || savedItems.u_controller_serial_id.length <= 0)) {
				Utils.showAlert(CAMCMRule);
			} else if (savedItems.u_asset_type == 'CAM' && (savedItems.u_cam_electronics_serial_no.length <= 0 || savedItems.u_fluidics_serial_no.length <= 0)) {
				Utils.showAlert(CAMRule);
			} else if (savedItems.u_asset_type == 'CM' && savedItems.u_controller_serial_id.length <= 0) {
				Utils.showAlert(CMRule);
			} else if (savedItems.u_asset_type == 'CM' && (savedItems.u_cam_electronics_serial_no.length > 0 || savedItems.u_fluidics_serial_no.length > 0 || savedItems.u_icc_skid_serial_no.length > 0)) {
				Utils.showAlert(CMRuleAg);
			} else if (savedItems.u_asset_type == 'CAM' && (savedItems.u_controller_serial_id.length > 0 || savedItems.u_icc_skid_serial_no.length > 0)) {
				Utils.showAlert(CAMRuleAg);
			} else if (savedItems.u_asset_type == 'CAM & CM' && savedItems.u_icc_skid_serial_no.length > 0) {
				Utils.showAlert(CAMCMRuleAg);
			} else if ((savedItems.u_cam_electronics_serial_no.length > 0) && (!(newElectSerialFirst > 0 && newElectSerialFirst <= 31) || !(newElectSerialSecon > 0 && newElectSerialSecon <= 12) || !(newElectSerialThird > 0 && newElectSerialThird <= 9999 && newElectSerialThird.length == 4))) {
				Utils.showAlert(electronicsFormatErrorCR);
			} else if ((savedItems.u_fluidics_serial_no.length > 0) && (!(newFluidicSerialFirst > 0 && newFluidicSerialFirst <= 31) || !(newFluidicSerialSecon > 0 && newFluidicSerialSecon <= 12) || !(newFluidicSerialThird > 0 && newFluidicSerialThird <= 9999 && newFluidicSerialThird.length == 4))) {
				Utils.showAlert(fluidicsFormatErrorCR);
			} else if ((savedItems.u_controller_serial_id.length > 0) && (!(newControllerSerialFirst > 0 && newControllerSerialFirst <= 31) || !(newControllerSerialSecon > 0 && newControllerSerialSecon <= 12) || !(newControllerSerialThird > 0 && newControllerSerialThird <= 9999 && newControllerSerialThird.length == 4))) {
				Utils.showAlert(controllersFormatErrorCR);
			} else if ((savedItems.u_icc_skid_serial_no.length > 0) && (!(newIccSkidSerialFirst > 0 && newIccSkidSerialFirst <= 31) || !(newIccSkidSerialSecon > 0 && newIccSkidSerialSecon <= 12) || !(newIccSkidSerialThird > 0 && newIccSkidSerialThird <= 9999 && newIccSkidSerialThird.length == 4))) {
				Utils.showAlert(iccskidFormatErrorCR);
			} else {
				$scope.uploadTicketProcess(savedItems);
			}
		}

	};
	$scope.ticketCancel = function() {
		$scope.newaccountform = {};
		$rootScope.onBackPress();
	};
});
