/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('newAccountCntrl', function($scope, $ionicScrollDelegate, $rootScope, Utils, database, $state, $parse, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http, $filter) {
	$scope.show_section = {};
	$scope.$parent.$parent.$parent.app_page_title = 'New Account/Asset';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.newaccountform = {};
	$scope.statesList = [];
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	Utils.showPleaseWait("Please wait...");
	$scope.ExistBtn = true;
	$scope.SeperateCamBtn = true;
	$scope.isShipToChange = false;	
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	
	if(ssoid == adminSso){
		$scope.setShiptoLimit = 20;
	} else {
		$scope.setShiptoLimit = 10;
	}
	

	var ssoid = $localstorage.get('SN-LOGIN-SSO');
	$scope.newaccountform.opened_by = ssoid;
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
	
	// Static Stage options
	$scope.stageOptions = [{
		name : "-- Select --",
		id : 1
	}, {
		name : "Open",
		id : 2
	}, {
		name : "Pending Approval",
		id : 3
	}, {
		name : "Closed",
		id : 4
	}, {
		name : "Escalate",
		id : 5
	}, {
		name : "Closed Rejected",
		id : 6
	}];
	$scope.selectedOption = $scope.stageOptions[1];

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
	 * Get the all Account hierarchy data from table
	 */
	Utils.getSavedDBAccountHierarchyAll(database, Utils, function(data, nongroupdata) {
		if (data && data.length > 0) {
			//console.log(nongroupdata)
			Utils.hidePleaseWait();
			$scope.searchItems = nongroupdata;
		}

	});

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
					if (allItems[iTm].label != 'New' && allItems[iTm].label != 'Moved' && allItems[iTm].label != '-- Select --') {// New and Moved is not required for Extended CR. Also ignoring the --Select-- value from web services
						$scope.operationalVal.push(allItems[iTm]);
					}
				}
			}

		}
	});

	/**
	 * Get the state list from account hieararchy table
	 */
	// Hard coding the 'Not used' state value as per desktop site
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
		if (data && data.length > 0) {			
			$scope.countryList = data;
			//Utils.hidePleaseWait();
			try {
				if ($rootScope.usersCountryCode) {
					$scope.newaccountform.u_country = $rootScope.usersCountryCode;
					/*for (var i = 0; i < $scope.countryList.length; i++) {
					 if ($scope.countryList[i].country == $rootScope.usersCountryCode) {
					 $scope.newaccountform.u_country = $rootScope.usersCountryCode;
					 break;
					 }
					 }*/
					 // Autofill the pole value based on country data
					 for(var i = 0; i<$scope.searchItems.length; i++ ){
						if($scope.searchItems[i].u_country == $rootScope.usersCountryCode){
							// console.log($scope.searchItems[i].u_pole)
							 $scope.newaccountform.u_pole = $scope.searchItems[i].u_pole;
							 break;
						}
					 }
					 
					
					 
				}
			} catch(e) {
			}

		} else {
			Utils.hidePleaseWait();
		}

	});
	
	$scope.countryChange = function(){ // Autofill the pole value based on country data
		try{		
		if($scope.newaccountform.u_country && $scope.newaccountform.u_country.length > 0){
		
		for(var i = 0; i<$scope.searchItems.length; i++ ){
						if($scope.searchItems[i].u_country ==  $scope.newaccountform.u_country){
							 //console.log($scope.searchItems[i].u_pole)
							 $scope.newaccountform.u_pole = $scope.searchItems[i].u_pole;
							 break;
						}
					 }	
		} else {
			 $scope.newaccountform.u_pole = '';
			}
		} catch(e){
		}
		
	}

	/**
	 * Get the Pole data from DB
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
					$scope.$apply();
				}
			}

		}
	});

	$scope.EditExistingAsset = function() {
		$scope.newaccountform.searchAssetNumber = '';
		$scope.newaccountform.u_controller_type = "";
		$scope.newaccountform.u_asset_type = "";
		$scope.newaccountform.u_cam_electronics_serial_no = "";
		$scope.newaccountform.u_fluidics_serial_no = "";
		$scope.newaccountform.u_controller_serial_id = "";
		$scope.newaccountform.u_icc_skid_serial_no = "";
		$scope.newaccountform.u_cooler = "";
		$scope.showAssetList = false;
		$scope.ExistBtn = !$scope.ExistBtn;
		$scope.serialErrorElect = false;
			$scope.serialErrorFlui = false;
			$scope.serialErrorCont = false;
			$scope.serialErrorIcc = false;
	}
	if ( typeof String.prototype.startsWith != 'function') {
		// see below for better implementation!
		String.prototype.startsWith = function(str) {
			return this.indexOf(str) === 0;
		};
	}

	// Deprioritize the Separate Cam feature as disccussed on 10th March 2016 Call
	/*$scope.Separatecam = function() {
	$scope.SeperateCamBtn = !$scope.SeperateCamBtn;
	//$scope.showAssetList = false;
	//$scope.ExistBtn = !$scope.ExistBtn;

	//console.log($scope.searchItems)
	$scope.CamList = [];
	Utils.getSavedDBAccountHierarchy(database, Utils, function(data, nongroupdata) {
	if (data && data.length > 0) {
	$scope.CamcmData = nongroupdata;
	for(var i = 0; i<nongroupdata.length; i++){
	if(nongroupdata[i].u_asset_type == "CAM & CM" && nongroupdata[i].u_operational_status == "Refurbishing"){
	$scope.CamList.push(nongroupdata[i]);
	//groupList.push({'country':name});
	}
	}

	//Utils.hidePleaseWait();
	//$scope.searchItems = nongroupdata;
	console.log($scope.CamList)

	}

	});
	$scope.CamCMChange = function(){
	for(var i = 0; i<$scope.CamcmData.length; i++){
	if($scope.CamcmData[i].u_asset_number == $scope.newaccountform.Sepcamval){
	$scope.newaccountform.u_account_name = $scope.CamcmData[i].u_account_name;
	}
	}

	}

	}*/

	//On click asset number change
	$scope.updateFilterData = function(searchTxt) {
		$scope.matching_regions = [];
		if (searchTxt && searchTxt.length < 8) {
			$scope.showAssetList = true;
			for (var i = 0; i < $scope.searchItems.length; i++) {
				if ($scope.searchItems[i].u_asset_number.startsWith(searchTxt)) {
					$scope.matching_regions.push($scope.searchItems[i]);
				}
			}
		} else if (searchTxt && searchTxt.length == 8) {
			$scope.setExistingData(searchTxt);
		} else {
			$scope.showAssetList = false;
		}
	}
	/**
	 * On click asset number
	 */
	$scope.setExistingData = function(assetNum) {
		var assetNumber = assetNum;
		$scope.newaccountform.searchAssetNumber = assetNumber;
		$scope.showAssetList = false;
		for (var i = 0; i < $scope.searchItems.length; i++) {
			if ($scope.searchItems[i].u_asset_number == assetNumber) {
				//console.log($scope.searchItems[i])
				$scope.newaccountform.u_controller_type = $scope.searchItems[i].u_controller_type;
				$scope.newaccountform.u_asset_type = $scope.searchItems[i].u_asset_type;
				$scope.newaccountform.u_cam_electronics_serial_no = $scope.searchItems[i].u_cam_serial_number;
				$scope.newaccountform.u_fluidics_serial_no = $scope.searchItems[i].u_fluidics_serial_number;
				$scope.newaccountform.u_controller_serial_id = $scope.searchItems[i].u_controller_serial_id;
				$scope.newaccountform.u_icc_skid_serial_no = $scope.searchItems[i].u_icc_skid_serial_number;
				$scope.newaccountform.u_cooler = $scope.searchItems[i].u_fluidic_cooler_option;
				
				$scope.assetTypeUpdate($scope.newaccountform.u_asset_type);
				
				//console.log($scope.searchItems[i].u_fluidic_cooler_option.toLowerCase())
				/*if($scope.searchItems[i].u_fluidic_cooler_option && $scope.searchItems[i].u_fluidic_cooler_option.toLowerCase() == 'yes'){
				 $scope.newaccountform.u_cooler = true;
				 } else{
				 $scope.newaccountform.u_cooler = false;
				 }*/

			}

		}
	}
	/**
	 * Autofill the Pole, Sold to, Account Name, State field based on Ship to value
	 */
	$scope.onShiptoChng = function(shipval) {
		$scope.searchResult = '';
		$scope.updateOn = [];
		$scope.modifiedDates = [];		
		for (var i = 0; i < $scope.searchItems.length; i++) {
			try {
				if ($scope.searchItems[i].u_ship_to == shipval && $scope.searchItems[i].u_operational_status != 'To Be Commissioned') { // To be commissioned data should not populated based on ship to value
					//$scope.searchResult = $scope.searchItems[i];
					$scope.updateOn.push($scope.searchItems[i])
					$scope.modifiedDates.push($scope.searchItems[i].sys_updated_on);
				}
			} catch(e) {
			}
		}

		if ($scope.modifiedDates && $scope.modifiedDates.length > 0) {
			var dates = $scope.modifiedDates, earliest = dates.reduce(function(pre, cur) {
				return Date.parse(pre) < Date.parse(cur) ? cur : pre;
			});
			//console.log(earliest);

			if ($scope.updateOn) {
				for (var j = 0; j < $scope.updateOn.length; j++) {
					if ($scope.updateOn[j].sys_updated_on == earliest) {
						//console.log($scope.updateOn[j])
						$scope.searchResult = $scope.updateOn[j];
						break;
					}

				}
			}

		}

		if ($scope.searchResult) {
			try {
				$scope.newaccountform.u_sold_to__ = $scope.searchResult.u_sold_to;
				$scope.newaccountform.u_country = $scope.searchResult.u_country;
				$scope.newaccountform.u_pole = $scope.searchResult.u_pole;
				if ($scope.searchResult.u_state == 'na' || $scope.searchResult.u_state == 'NA') {
					$scope.newaccountform.u_state = "Not Used";
				} else {
					$scope.newaccountform.u_state = $scope.searchResult.u_state;
				}
				$scope.newaccountform.u_account_name = $scope.searchResult.u_account_name;
				$scope.newaccountform.u_city = $scope.searchResult.u_city;
				$scope.isShipToChange = true;
			} catch(e) {
			}
		} else {
			try {
				$scope.newaccountform.u_sold_to__ = "";
				$scope.newaccountform.u_country = $rootScope.usersCountryCode;
				$scope.newaccountform.u_pole = "";
				$scope.newaccountform.u_state = "";
				$scope.newaccountform.u_account_name = "";
				$scope.newaccountform.u_city = "";
				$scope.isShipToChange = false;
				$scope.countryChange();
			} catch(e) {
				$scope.isShipToChange = false;
			}
		}
	}
	/**
	 *Upload ticket to server in online mode
	 */
	$scope.uploadTicket = function() {
		//console.log($scope.newaccountform.u_asset_number)
		$http({
			method : 'POST',
			url : $rootScope.baserootURL + 'api/now/import/u_extend_cr_stage?sysparm_input_display_value=false',
			data : $scope.newaccountform,
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

	$scope.uploadTicketProcess = function(savedItems) {
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid) {
			$scope.newaccountform.ticketType = "ticket";
			var d = new Date();
			var n = d.getTime();
			$scope.newaccountform.ticketId = "" + n;
			$scope.newaccountform.savedTS = "" + n;
			$scope.newaccountform.opened_by = ssoid;
			$scope.newaccountform.userId = ssoid;
			$scope.newaccountform.u_stage = 'Approval';

			if ($rootScope.isOnline()) {
				Utils.showPleaseWait(uploadingTicket);
				$scope.uploadTicket();
			} else {
				//Save it locally for future upload process
				database.storePendingTicket($scope.newaccountform.ticketId, ssoid, "NEWACCOUNT", $scope.newaccountform.savedTS, $scope.newaccountform, function(status) {
					$scope.newaccountform = {};
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
				$scope.newaccountform.u_ship_to = '';
				 $timeout(function () {
                      document.getElementById('shipTo').focus();
                    });
				
			}, 100);
		} else {
			
		}}

	$scope.ticketSubmit = function() {

		//$scope.grpName = '';

		/*var usersCountryCode = $scope.newaccountform.u_country;
		//console.log(usersCountryCode)

		if (usersCountryCode) {
			database.loadPwMasterDataAll(usersCountryCode, function(result) {
				if (result && result.rows && result.rows.length > 0) {					
					var ahArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
					}
					$scope.masterData = ahArray;
					//console.log('1')
					//console.log($scope.masterData)
				
				
				if ($scope.newaccountform.searchAssetNumber) {

					for (var i = 0; i < $scope.searchItems.length; i++) {
						if ($scope.searchItems[i].u_asset_number == $scope.newaccountform.searchAssetNumber) {
							$scope.depreciatedflag = $scope.searchItems[i].u_depreciatedflag;
						}
					}
					//console.log($scope.depreciatedflag)
					//getting depreciated flag value
					if ($scope.depreciatedflag == 'true') {// true

						//console.log('2')
						//console.log($scope.masterData)
						for (var i = 0; i < $scope.masterData.length; i++) {
							if ($scope.masterData[i].u_escalation_level == 4) {
								//alert('found1')
								$scope.grpName = $scope.masterData[i]['u_group.name'];

								break;

							}

						}

					} else {// false
						for (var i = 0; i < $scope.masterData.length; i++) {
							if ($scope.masterData[i].u_table == 'MS_Change') {
								//alert('found2')
								$scope.grpName = $scope.masterData[i]['u_group.name'];
								break;

							}

						}
					}

				} else {
					for (var i = 0; i < $scope.masterData.length; i++) {
						if ($scope.masterData[i].u_table == 'MS_Change') {
							//alert('found3')
							//alert($scope.masterData[i]['u_group.name']);
							$scope.grpName = $scope.masterData[i]['u_group.name'];
							break;
						}

					}
				}
				if ($scope.grpName && $scope.grpName.length > 0) {
					$scope.formValidation();
				} else {
					Utils.showAlert(newaccountGroupNotExist);

				}
} else {
			$scope.formValidation();
		}
			});

		} else {
			$scope.formValidation();
		}*/
$scope.formValidation();
	};

	$scope.formValidation = function() {
		//Check for validation.
		var savedItems = $scope.newaccountform;
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

			if (!$scope.ExistBtn && (!(savedItems.searchAssetNumber && savedItems.searchAssetNumber.length > 0))) {
				Utils.showAlert(assetNumEmptyCR);
			} else if (!(savedItems.u_ship_to && savedItems.u_ship_to.length > 0)) {
				Utils.showAlert(shiptoEmpty);
			} else if (!(savedItems.u_sold_to__ && savedItems.u_sold_to__.length > 0)) {
				Utils.showAlert(soldtoEmpty);
			} else if (!(savedItems.u_account_name && savedItems.u_account_name.length > 0)) {
				Utils.showAlert(accountEmpty);
			} else if (!(savedItems.u_country && savedItems.u_country.length > 0)) {
				Utils.showAlert(countryEmpty);
			} else if (!(savedItems.u_pole && savedItems.u_pole.length > 0)) {
				Utils.showAlert(poleEmpty);
			} else if (!(savedItems.u_city && savedItems.u_city.length > 0)) {
				Utils.showAlert(cityEmptyCR);
			} else if (!(savedItems.u_system_name && savedItems.u_system_name.length > 0)) {
				Utils.showAlert(systemEmpty);
			} else if (!(savedItems.u_asset_type && savedItems.u_asset_type.length > 0)) {
				Utils.showAlert(assetTypeEmpty);
			} else if (!(savedItems.u_operational_status && savedItems.u_operational_status.length > 0)) {
				Utils.showAlert(operationalEmpty);
			}  else if (!(savedItems.u_controller_type && savedItems.u_controller_type.length > 0)) {
				Utils.showAlert(controllerEmpty);
			}     else if (savedItems.u_asset_type == 'ICC' && (savedItems.u_cam_electronics_serial_no.length <= 0 || savedItems.u_fluidics_serial_no.length <= 0 || savedItems.u_controller_serial_id.length <= 0 || savedItems.u_icc_skid_serial_no.length <= 0)) {
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
	}

	$scope.ticketCancel = function() {
		$scope.newaccountform = {};
		$rootScope.onBackPress();
	};
	
	
	
	
	$scope.assetTypeUpdate = function(type){
		
		if(type == "CM"){
			$scope.serialErrorElect = false;
			$scope.serialErrorFlui = false;
			$scope.serialErrorCont = true;
			$scope.serialErrorIcc = false;
		} else if(type == "CAM"){
			$scope.serialErrorElect = true;
			$scope.serialErrorFlui = true;
			$scope.serialErrorCont = false;
			$scope.serialErrorIcc = false;
		} else if(type == "CAM & CM"){
			$scope.serialErrorElect = true;
			$scope.serialErrorFlui = true;
			$scope.serialErrorCont = true;
			$scope.serialErrorIcc = false;
		} else if(type == "ICC"){
			$scope.serialErrorElect = true;
			$scope.serialErrorFlui = true;
			$scope.serialErrorCont = true;
			$scope.serialErrorIcc = true;
		} else {
			$scope.serialErrorElect = false;
			$scope.serialErrorFlui = false;
			$scope.serialErrorCont = false;
			$scope.serialErrorIcc = false;
		}
		
	}

});
