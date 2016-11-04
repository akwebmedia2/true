/**
 *COntroller of the open spare form in edit mode.
 */
angular.module('TrueSense.controllers').controller('ordersparepartEditCtrl', function($scope, $ionicScrollDelegate, Utils, $filter, $rootScope, database, $parse, $http, $localstorage, $timeout, applicationServices, $state) {
	$scope.$parent.$parent.$parent.app_page_title = EditSparePartTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.vespareParts = {};
	$scope.uniquedefectList = null;
	$rootScope.setupHttpAuthHeader();
	$scope.vespareParts.u_delivery_address = '';
	Utils.showPleaseWait("Please wait...");

	/**
	 *On Off accordian
	 * @param {Object} section
	 * @param {Object} $event
	 */
	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};

	/**
	 *Sets the save spart part on the display form
	 * @param {Object} viewEditSPDetailsObj
	 */
	$scope.setFormElements = function(viewEditSPDetailsObj) {
		var defaultValue = 0;
		if (viewEditSPDetailsObj) {
			
			if (viewEditSPDetailsObj.u_quantity_add) {
				$scope.vespareParts.u_quantity_add = parseInt(viewEditSPDetailsObj.u_quantity_add, 10);
			} else {
				$scope.vespareParts.u_quantity_add = defaultValue;
			}
			if (viewEditSPDetailsObj.u_sap_part_qty_2) {
				$scope.vespareParts.u_sap_part_qty_2 = parseInt(viewEditSPDetailsObj.u_sap_part_qty_2, 10);
			} else {
				$scope.vespareParts.u_sap_part_qty_2 = defaultValue;
			}
			if (viewEditSPDetailsObj.u_sap_part_qty_3) {
				$scope.vespareParts.u_sap_part_qty_3 = parseInt(viewEditSPDetailsObj.u_sap_part_qty_3, 10);
			} else {
				$scope.vespareParts.u_sap_part_qty_3 = defaultValue;
			}
			if (viewEditSPDetailsObj.u_sap_part_qty_4) {
				$scope.vespareParts.u_sap_part_qty_4 = parseInt(viewEditSPDetailsObj.u_sap_part_qty_4, 10);
			} else {
				$scope.vespareParts.u_sap_part_qty_4 = defaultValue;
			}
			if (viewEditSPDetailsObj.u_sap_part_qty_5) {
				$scope.vespareParts.u_sap_part_qty_5 = parseInt(viewEditSPDetailsObj.u_sap_part_qty_5, 10);
			} else {
				$scope.vespareParts.u_sap_part_qty_5 = defaultValue;
			}
			
		}
	};

	//Get the selected Spare Part and set the form based on the last saved value.
	var viewEditSPDetails = $localstorage.get('SPARE_PART_EDIT_MODE');
	if (viewEditSPDetails && viewEditSPDetails.length > 0) {
		var viewEditSPDetailsObj = angular.fromJson(viewEditSPDetails);
		if (viewEditSPDetailsObj && viewEditSPDetailsObj.number && viewEditSPDetailsObj.number.length > 0) {
			$scope.tempData = viewEditSPDetailsObj;
			$scope.vespareParts = viewEditSPDetailsObj;
			$scope.setFormElements(viewEditSPDetailsObj);

		}
	}
	
	$scope.onSparePartCritical = function(isCritical) {
		if (isCritical) {
			$scope.vespareParts.u_expected_date = $filter("date")((Date.now() + 86400000), 'yyyy-MM-dd');
		} else {
			$scope.vespareParts.u_expected_date = '';
		}
	};


$scope.isInvalidCheck = function(field) {
		try {
			var data = $scope.$eval($parse(field));			
			if (data && (data.length == 10 || data.length == 6)) {
				if(data.length == 6){					
					if(data.toString()[0] != 7){
						return true;	
					} else {
						return false;
					}
				}
				return false;
			} else {
				return true;
			}
		} catch(e) {
			return true;
		}
	};
	
	$scope.isInvalidCheckDt = function(field) {
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
	
Utils.getSavedDBAccountHierarchyAll(database, Utils, function(data, nongroupdata) {
		$scope.accountData = data;
		$scope.accountNonGrpData = nongroupdata;
	});
	

	$scope.validateShipTo = function(shipval){
		Utils.showPleaseWait("Please wait...");
		var shipToFound = false;
		if(isNaN(shipval)){
			Utils.hidePleaseWait();
			$timeout(function() {				
				Utils.showAlert("Ship To value should be either 6 digits(should be started from '7') or 10 digits numeric data");
				$scope.vespareParts.u_ship_to = '';
				
			}, 100);
		} else {
		if(shipval && shipval.length == 10){			
			if ($scope.accountData && $scope.accountData.length > 0) {				
				if ($scope.accountNonGrpData && $scope.accountNonGrpData.length > 0) {
					for (var i = 0; i < $scope.accountNonGrpData.length; i++) {
						if ($scope.accountNonGrpData[i].u_ship_to == shipval) {
							Utils.hidePleaseWait();
							shipToFound = true;
							break;							
						}
					}
					if(!shipToFound){						
					Utils.hidePleaseWait();
						$timeout(function() {							
							Utils.showAlert("Please enter a valid 10 digit Numeric Ship To value");
							$scope.vespareParts.u_ship_to = '';							
						}, 100);
					}
				}
			} else {
					Utils.hidePleaseWait();
							Utils.showAlert("Unable to match the Ship to value");
			}
			
		} else if(shipval && shipval.length == 6){
			Utils.hidePleaseWait();
			if(shipval.toString()[0] != 7){				
				$timeout(function() {							
							Utils.showAlert("Please enter 6 digit value starting from '7'");
							$scope.vespareParts.u_ship_to = '';							
			}, 100);
			}				
		} else {
			Utils.hidePleaseWait();			
		}
		}
	}



	/**
	 * on Additional Spare Part Change
	 */
	$scope.onAdditionalSparePartChange = function(item) {
		if ($scope.uniquedefectList && $scope.uniquedefectList.length > 0) {
			for (var i = 0; i < $scope.uniquedefectList.length; i++) {
				var itm = $scope.uniquedefectList[i];
				if (itm) {
					if (itm.u_replacement_part_text == item) {
						$scope.vespareParts.u_replacement_part_text = itm.u_replacement_part_text;
						$scope.vespareParts.u_spare_part_add = itm.u_replacement_part_no;
						$scope.vespareParts.u_quantity_add = 0;
						return;
					} else {
						$scope.vespareParts.u_replacement_part_text = '';
						$scope.vespareParts.u_spare_part_add = '';
						$scope.vespareParts.u_quantity_add = 0;
					}
				} else {
					$scope.vespareParts.u_replacement_part_text = '';
					$scope.vespareParts.u_spare_part_add = '';
					$scope.vespareParts.u_quantity_add = 0;
				}
			}
		}
	};

	$scope.onAdditionalSparePartChange2 = function(item) {
		if ($scope.uniquedefectList && $scope.uniquedefectList.length > 0) {
			for (var i = 0; i < $scope.uniquedefectList.length; i++) {
				var itm = $scope.uniquedefectList[i];
				if (itm) {
					if (itm.u_replacement_part_text == item) {
						$scope.vespareParts.u_sap_part_desc_2 = itm.u_replacement_part_text;
						$scope.vespareParts.u_sap_part_num_2 = itm.u_replacement_part_no;
						$scope.vespareParts.u_sap_part_qty_2 = 0;
						return;
					} else {
						$scope.vespareParts.u_sap_part_desc_2 = '';
						$scope.vespareParts.u_sap_part_num_2 = '';
						$scope.vespareParts.u_sap_part_qty_2 = 0;
					}
				} else {
					$scope.vespareParts.u_sap_part_desc_2 = '';
					$scope.vespareParts.u_sap_part_num_2 = '';
					$scope.vespareParts.u_sap_part_qty_2 = 0;
				}
			}
		}
	};

	$scope.onAdditionalSparePartChange3 = function(item) {
		if ($scope.uniquedefectList && $scope.uniquedefectList.length > 0) {
			for (var i = 0; i < $scope.uniquedefectList.length; i++) {
				var itm = $scope.uniquedefectList[i];
				if (itm) {
					if (itm.u_replacement_part_text == item) {
						$scope.vespareParts.u_sap_part_desc_3 = itm.u_replacement_part_text;
						$scope.vespareParts.u_sap_part_num_3 = itm.u_replacement_part_no;
						$scope.vespareParts.u_sap_part_qty_3 = 0;
						return;
					} else {
						$scope.vespareParts.u_sap_part_desc_3 = '';
						$scope.vespareParts.u_sap_part_num_3 = '';
						$scope.vespareParts.u_sap_part_qty_3 = 0;
					}
				} else {
					$scope.vespareParts.u_sap_part_desc_3 = '';
					$scope.vespareParts.u_sap_part_num_3 = '';
					$scope.vespareParts.u_sap_part_qty_3 = 0;
				}
			}
		}
	};
	
	$scope.onAdditionalSparePartChange4 = function(item) {
		if ($scope.uniquedefectList && $scope.uniquedefectList.length > 0) {
			for (var i = 0; i < $scope.uniquedefectList.length; i++) {
				var itm = $scope.uniquedefectList[i];
				if (itm) {
					if (itm.u_replacement_part_text == item) {
						$scope.vespareParts.u_sap_part_desc_4 = itm.u_replacement_part_text;
						$scope.vespareParts.u_sap_part_num_4 = itm.u_replacement_part_no;
						$scope.vespareParts.u_sap_part_qty_4 = 0;
						return;
					} else {
						$scope.vespareParts.u_sap_part_desc_4 = '';
						$scope.vespareParts.u_sap_part_num_4 = '';
						$scope.vespareParts.u_sap_part_qty_4 = 0;
					}
				} else {
					$scope.vespareParts.u_sap_part_desc_4 = '';
					$scope.vespareParts.u_sap_part_num_4 = '';
					$scope.vespareParts.u_sap_part_qty_4 = 0;
				}
			}
		}
	};
	
	$scope.onAdditionalSparePartChange5 = function(item) {
		if ($scope.uniquedefectList && $scope.uniquedefectList.length > 0) {
			for (var i = 0; i < $scope.uniquedefectList.length; i++) {
				var itm = $scope.uniquedefectList[i];
				if (itm) {
					if (itm.u_replacement_part_text == item) {
						$scope.vespareParts.u_sap_part_desc_5 = itm.u_replacement_part_text;
						$scope.vespareParts.u_sap_part_num_5 = itm.u_replacement_part_no;
						$scope.vespareParts.u_sap_part_qty_5 = 0;
						return;
					} else {
						$scope.vespareParts.u_sap_part_desc_5 = '';
						$scope.vespareParts.u_sap_part_num_5 = '';
						$scope.vespareParts.u_sap_part_qty_5 = 0;
					}
				} else {
					$scope.vespareParts.u_sap_part_desc_5 = '';
					$scope.vespareParts.u_sap_part_num_5 = '';
					$scope.vespareParts.u_sap_part_qty_5 = 0;
				}
			}
		}
	};

	

	Utils.getSavedDBDefectHierarchyAll(database, Utils, function(data, nongroupdata) {
			if (nongroupdata && nongroupdata.length > 0) {
				var defectListData = [];
				try {
					for (var j = 0; j < nongroupdata.length; j++) {
						if ((nongroupdata[j].u_active == 'true' || nongroupdata[j].u_active == 'True') && nongroupdata[j].u_replacement_part_text != 'NA' && nongroupdata[j].u_replacement_part_text != '' && nongroupdata[j].u_replacement_part_text != 'N/A' && nongroupdata[j].u_replacement_part_text != '#N/A' ) {// for additional replacement text where only true data will appear
							defectListData.push(nongroupdata[j])
						}
					}

				} catch(e) {
				}

				
				// For defect data in order spare part
				try {
					$scope.uniquedefectList = Utils.getUniqueArray(defectListData, 'u_replacement_part_text');
					$scope.$apply();
					Utils.hidePleaseWait();
				} catch(e) {
				}
				
			} else {
				Utils.hidePleaseWait();
				Utils.showAlert(defectInformationNotFound);
			}
		});

	$scope.onSparePartsUploadCancel = function() {
		$rootScope.onBackPress();
	};

	/**
	 *On upload the spare part. if online upload and go back to previous screen. If offline saved into the database
	 */
	$scope.onSparePartsUpload = function() {

		

		// Additional Spare part quantitly validation

		if ($scope.vespareParts.u_sap_part___add == 'null' || $scope.vespareParts.u_quantity_add <= 0) {			
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;			
		}
		if($scope.vespareParts.u_sap_part_desc_2 != undefined){
		if ($scope.vespareParts.u_sap_part_desc_2 == 'null' || $scope.vespareParts.u_sap_part_qty_2 <= 0) {			
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;			
		}
		}
		if($scope.vespareParts.u_sap_part_desc_3 != undefined){
		if ($scope.vespareParts.u_sap_part_desc_3 == 'null' || $scope.vespareParts.u_sap_part_qty_3 <= 0) {			
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;			
		}
		}
		
		if($scope.vespareParts.u_sap_part_desc_4 != undefined){
		if ($scope.vespareParts.u_sap_part_desc_4 == 'null' || $scope.vespareParts.u_sap_part_qty_4 <= 0) {			
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;			
		}
		}
		
		if($scope.vespareParts.u_sap_part_desc_5 != undefined){
		if ($scope.vespareParts.u_sap_part_desc_5 == 'null' || $scope.vespareParts.u_sap_part_qty_5 <= 0) {			
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;			
		}
		}
				
		
			if(!$scope.vespareParts.u_ship_to || $scope.vespareParts.u_ship_to == 'undefined'  || !($scope.vespareParts.u_ship_to.length == 10 || $scope.vespareParts.u_ship_to.length == 6)){
			Utils.showAlert("Ship To value should be either 6 or 10 digit numeric data");
			return;
		}
		
		if ($("#email").hasClass("warning")) {
			Utils.showAlert(validEmailAddr)
			return;
		}

		
			if ($scope.vespareParts.u_expected_date && $scope.vespareParts.u_expected_date.length > 0) {
				//Check that expected date should be greter than current date.
				var selectedExpectedDate = new Date($scope.vespareParts.u_expected_date);
				var todayDate = new Date();
				if (!(selectedExpectedDate > todayDate)) {
					Utils.showAlert(expectedDatevalidationFaildMessage);
					return;
				}
				var ssoid = $localstorage.get('SN-LOGIN-SSO');
				var d = new Date();
				var n = d.getTime();
				var reqData = {
					"opened_by" : '' + ssoid,
					//"u_ticket_number" : "" + $scope.ticketform.sys_id,
					//"number" : "" + $scope.ticketform.number,				
					"number" : "" + $scope.vespareParts.number,
					"u_sap_part___add" : "" + $scope.vespareParts.u_sap_part___add,
					"u_spare_part_add" : "" + $scope.vespareParts.u_spare_part_add,
					"u_quantity_add" : $scope.vespareParts.u_quantity_add,
					"u_delivery_address" : "" + $scope.vespareParts.u_delivery_address,
					"u_ship_to" : "" + $scope.vespareParts.u_ship_to,
					"u_expected_date" : "" + $scope.vespareParts.u_expected_date,
					"u_csc_mail_address" : "" + $scope.vespareParts.u_csc_mail_address,
					"u_email" : "" + $scope.vespareParts.u_email,
					"u_local_save_time" : "" + n,					
					"u_critical" : true
				};
				
				if ($scope.vespareParts.u_critical && $scope.vespareParts.u_critical != 'undefined') {
					reqData.u_critical = true;
				} else {
					reqData.u_critical = false;
				}

				if (!$scope.vespareParts.u_email) {
					reqData.u_email = '';
				}
				
				if (!$scope.vespareParts.u_csc_mail_address || $scope.vespareParts.u_csc_mail_address == 'undefined') {
					reqData.u_csc_mail_address = '';
				}

				

				if ($scope.vespareParts.u_sap_part_desc_2 && $scope.vespareParts.u_sap_part_desc_2 != 'undefined') {
					reqData.u_sap_part_desc_2 = "" + $scope.vespareParts.u_sap_part_desc_2;
					reqData.u_sap_part_num_2 = "" + $scope.vespareParts.u_sap_part_num_2;
					reqData.u_sap_part_qty_2 = $scope.vespareParts.u_sap_part_qty_2;
				}

				if ($scope.vespareParts.u_sap_part_desc_3 && $scope.vespareParts.u_sap_part_desc_3 != 'undefined') {
					reqData.u_sap_part_desc_3 = "" + $scope.vespareParts.u_sap_part_desc_3;
					reqData.u_sap_part_num_3 = "" + $scope.vespareParts.u_sap_part_num_3;
					reqData.u_sap_part_qty_3 = $scope.vespareParts.u_sap_part_qty_3;
				}
				
				if ($scope.vespareParts.u_sap_part_desc_4 && $scope.vespareParts.u_sap_part_desc_4 != 'undefined') {
					reqData.u_sap_part_desc_4 = "" + $scope.vespareParts.u_sap_part_desc_4;
					reqData.u_sap_part_num_4 = "" + $scope.vespareParts.u_sap_part_num_4;
					reqData.u_sap_part_qty_4 = $scope.vespareParts.u_sap_part_qty_4;
				}
				
				if ($scope.vespareParts.u_sap_part_desc_5 && $scope.vespareParts.u_sap_part_desc_5 != 'undefined') {
					reqData.u_sap_part_desc_5 = "" + $scope.vespareParts.u_sap_part_desc_5;
					reqData.u_sap_part_num_5 = "" + $scope.vespareParts.u_sap_part_num_5;
					reqData.u_sap_part_qty_5 = $scope.vespareParts.u_sap_part_qty_5;
				}

				if (ssoid) {
					if ($rootScope.isOnline()) {
						Utils.showPleaseWait(pleaseWait);
						var promise = applicationServices.orderSpareParts(reqData);
						promise.then(function(payload) {
							if (payload && payload.status == 201 && payload.data && payload.data.result && payload.data.result[0].display_value && payload.data.result[0].display_value.length > 0) {
								Utils.hidePleaseWait();
								Utils.showAlert(sparePartPlaced + payload.data.result[0].display_value);
								$rootScope.onBackPress();
							} else {
								Utils.showAlert(unablePlaceOrder);
							}
						}, function(errorPayload) {
							if (errorPayload && errorPayload.statusText && errorPayload.statusText.length > 0) {
								Utils.showAlert(errorPayload.statusText);
							}
							Utils.hidePleaseWait();
						});
					} else {

						var editFrom = $localstorage.get('TICKET_EDIT_FROM');
						if (editFrom == 'MY_GROUP') {
							//Save it locally for future upload process
							var d = new Date();
							var savedTimeStamp = d.getTime();
							database.storePendingTicket($scope.vespareParts.u_local_ticket_id + "_OSP", $scope.vespareParts.opened_by, "MY_GROUP_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$rootScope.onBackPress();
							});
						} else {
							//Save it locally for future upload process
							var d = new Date();
							var savedTimeStamp = d.getTime();							
							database.storePendingTicket(reqData.number, $scope.vespareParts.opened_by, "ORDER_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$rootScope.onBackPress();
							});
						}
					}
				}
			} else {
				Utils.showAlert(expectedDateEmpty);
			}
		
	};

});
