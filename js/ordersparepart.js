/**
 *COntroller for open ticket edit  mode
 */
angular.module('TrueSense.controllers').controller('orderSparePart', function($scope, $ionicScrollDelegate, $localstorage, applicationServices, $rootScope, Utils, database, $parse, $filter, $timeout, $state) {
	$scope.$parent.$parent.$parent.app_page_title = orderSpareTicketTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.ticketform = {};
	$scope.allowticketform = {};
	$scope.allowticketform.enableUpdate = true;	
	$scope.uniquedefectList = null;
	$scope.isShowControle = true;
	$scope.orderSpareParts = {};
	$scope.spareParts = {};
	$scope.count = 1;
	$scope.spareParts.u_order_status = 'new';
	$scope.spareParts.u_delivery_address = '';
	$rootScope.setupHttpAuthHeader();
	Utils.showPleaseWait("Please wait...");
	var tktDetail = angular.fromJson($localstorage.get('TICKET_EDIT_MODE'));
	$scope.spareParts.number = 1;
	
	$scope.spareParts.u_replacement_part_text2 = ''
	
	//console.log(tktDetail)
	//$scope.savedTicketForm = tktDetail.u_defect_category1;
	$scope.ticketform = tktDetail;
	//console.log($scope.ticketform)
	$scope.isEditTicket = true;
	$scope.visibleEscalateBtn = false;
	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});
	

	//Setup view and order spare parts
	$scope.orderSpareParts = {};
	$scope.vspareParts = {};
	$scope.orderSpareParts.onViewSpareParts = 'false';	
	$scope.backToTicketsListing = function() {
		if($rootScope.isOnline()){
			$state.go('eventmenu.myordersparepart');	
		} else {
			$state.go('eventmenu.home');	
		}
	};
	
	Utils.getSavedDBAccountHierarchyAll(database, Utils, function(data, nongroupdata) {
		$scope.accountData = data;
		$scope.accountNonGrpData = nongroupdata;
	});
	
	/**
	 * Fetch the Defect information from database print on page accordingly
	 */
	//alert($scope.ticketform.u_defect_category2)
	Utils.getSavedDBDefectHierarchyAll(database, Utils, function(data, nongroupdata) {
		/**
		 * First assigning the data for Replacement part & Additional Replacement part for Order spare part.
		 */
		 var defectListData = [];
		if (nongroupdata && nongroupdata.length > 0) {			
			try {
				for (var j = 0; j < nongroupdata.length; j++) {						
						if ((nongroupdata[j].u_active == 'true' || nongroupdata[j].u_active == 'True') && nongroupdata[j].u_replacement_part_text != 'NA' && nongroupdata[j].u_replacement_part_text != '' && nongroupdata[j].u_replacement_part_text != 'N/A' && nongroupdata[j].u_replacement_part_text != '#N/A' ) {// for additional replacement text where only true data will appear, service may appear
							defectListData.push(nongroupdata[j])
						}
					}
					
					$scope.uniquedefectList = Utils.getUniqueArray(defectListData, 'u_replacement_part_text');
					Utils.hidePleaseWait();
					$scope.$apply();
			} catch(e) {
				Utils.hidePleaseWait();
			}
		} else {
			Utils.hidePleaseWait();
			Utils.showAlert(defectInformationNotFound);

			}
	});

	$scope.isInvalidWithCondition = function(rootFiled, field) {
		try {
			var rootData = $scope.$eval($parse(rootFiled));
			if (rootData && rootData.label && rootData.label.length > 0) {
				var data = $scope.$eval($parse(field));				
				if (data && data.label && data.label.length > 0) {
					return "has-success";
				} else {
					return "has-error";
				}
			} else if (rootData && rootData.length == 0) {
				return "has-error";
			} else {
				return "";
			}
		} catch(e) {
			return "";
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

	

	/**
	 *  On Additional spare part change
	 * @param {Object} item
	 */
	$scope.onAdditionalSparePartChange = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add = '';
		} else {
			$scope.spareParts.u_replacement_part_text = '';
			$scope.spareParts.u_spare_part_add = '';
			

		}
	};

	$scope.onAdditionalSparePartChange2 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text2 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add2 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add2 = '';
		} else {
			$scope.spareParts.u_replacement_part_text2 = '';
			$scope.spareParts.u_spare_part_add2 = '';
			$scope.spareParts.u_quantity_add2 = '';
		}
	};

	$scope.onAdditionalSparePartChange3 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text3 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add3 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add3 = '';
		} else {
			$scope.spareParts.u_replacement_part_text3 = '';
			$scope.spareParts.u_spare_part_add3 = '';
			$scope.spareParts.u_quantity_add3 = '';
		}
	};
	
	$scope.onAdditionalSparePartChange4 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text4 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add4 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add4 = '';
		} else {
			$scope.spareParts.u_replacement_part_text4 = '';
			$scope.spareParts.u_spare_part_add4 = '';
			$scope.spareParts.u_quantity_add4 = '';
		}
	};
	
	$scope.onAdditionalSparePartChange5 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text5 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add5 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add5 = '';
		} else {
			$scope.spareParts.u_replacement_part_text5 = '';
			$scope.spareParts.u_spare_part_add5 = '';
			$scope.spareParts.u_quantity_add5 = '';
		}
	};

	$scope.onSparePartCritical = function(isCritical) {
		if (isCritical) {
			$scope.spareParts.u_expected_date = $filter("date")((Date.now() + 86400000), 'yyyy-MM-dd');
		} else {
			$scope.spareParts.u_expected_date = '';
		}
	};

	$scope.onSparePartsUploadCancel = function() {
	};
	
	
	

	$scope.validateShipTo = function(shipval){
		Utils.showPleaseWait("Please wait...");
		var shipToFound = false;
		if(isNaN(shipval)){
			Utils.hidePleaseWait();
			$timeout(function() {				
				Utils.showAlert("Ship To value should be either 6 digits(should be started from '7') or 10 digits numeric data");
				$scope.spareParts.u_ship_to = '';
				
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
							$scope.spareParts.u_ship_to = '';							
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
							$scope.spareParts.u_ship_to = '';							
			}, 100);
			}				
		} else {
			Utils.hidePleaseWait();			
		}
		}
	}

	$scope.onSparePartsUpload = function() {
		
		
		if($scope.spareParts.u_replacement_part_text.length == 0){
			Utils.showAlert("Please select atleast one part description");
				return;
		}		
		
		if ($scope.spareParts.u_replacement_part_text) {
			if ($scope.spareParts.u_quantity_add < 1 || $scope.spareParts.u_quantity_add > 99 || $scope.spareParts.u_quantity_add == '') {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}
		
	
		
		if(($scope.spareParts.number == 2) && ($scope.spareParts.u_replacement_part_text2 == '' || $scope.spareParts.u_replacement_part_text2 == undefined)) {
			Utils.showAlert("Please provide the Part description2");
			return;
		}
		
		if ($scope.spareParts.u_replacement_part_text2) {
			if ($scope.spareParts.u_quantity_add2 < 1 || $scope.spareParts.u_quantity_add2 > 99 || $scope.spareParts.u_quantity_add2 == '') {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}
		
		
		if(($scope.spareParts.number == 3) && ($scope.spareParts.u_replacement_part_text3 == '' || $scope.spareParts.u_replacement_part_text3 == undefined)) {
			Utils.showAlert("Please provide the Part description3");
			return;
		}
		
		if ($scope.spareParts.u_replacement_part_text3) {
			if ($scope.spareParts.u_quantity_add3 < 1 || $scope.spareParts.u_quantity_add3 > 99 || $scope.spareParts.u_quantity_add3 == '') {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}
		
		if(($scope.spareParts.number == 4) && ($scope.spareParts.u_replacement_part_text4 == '' || $scope.spareParts.u_replacement_part_text4 == undefined)) {
			Utils.showAlert("Please provide the Part description4");
			return;
		}
		if ($scope.spareParts.u_replacement_part_text4) {
			if ($scope.spareParts.u_quantity_add4 < 1 || $scope.spareParts.u_quantity_add4 > 99 || $scope.spareParts.u_quantity_add4 == '') {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}
		
		if(($scope.spareParts.number == 5) && ($scope.spareParts.u_replacement_part_text5 == '' || $scope.spareParts.u_replacement_part_text5 == undefined)) {
			Utils.showAlert("Please provide the Part description5");
			return;
		}
		if ($scope.spareParts.u_replacement_part_text5) {
			if ($scope.spareParts.u_quantity_add5 < 1 || $scope.spareParts.u_quantity_add5 > 99 || $scope.spareParts.u_quantity_add5 == '') {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}		
		
		
		if(!$scope.spareParts.u_ship_to || $scope.spareParts.u_ship_to == 'undefined' || !($scope.spareParts.u_ship_to.length == 10 || $scope.spareParts.u_ship_to.length == 6)){
			Utils.showAlert('Ship To value should be either 6 or 10 digit numeric data')
			return;
		}
		
		
		if ($("#email").hasClass("warning")) {
			Utils.showAlert(validEmailAddr)
			return;
		}


		
			if ($scope.spareParts.u_expected_date && $scope.spareParts.u_expected_date.length > 0) {
				//Check that expected date should be greter than current date.
				var selectedExpectedDate = new Date($scope.spareParts.u_expected_date);
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
					
					"u_sap_part___add" : "" + $scope.spareParts.u_replacement_part_text,
					"u_spare_part_add" : "" + $scope.spareParts.u_spare_part_add,
					"u_quantity_add" : "" + $scope.spareParts.u_quantity_add,
					"u_delivery_address" : "" + $scope.spareParts.u_delivery_address,
					"u_ship_to" : "" + $scope.spareParts.u_ship_to,
					"u_expected_date" : "" + $scope.spareParts.u_expected_date,
					"u_csc_mail_address" : "" + $scope.spareParts.u_csc_mail_address,
					"u_email" : "" + $scope.spareParts.u_email,
					"u_local_save_time" : "" + n,					
					"u_critical" : true
				};
				//console.log($rootScope.usersCountryCode)
				if($rootScope.usersCountryCode != undefined){
					reqData.u_country = $rootScope.usersCountryCode;
				} else {
					reqData.u_country = '';
				}
			
				
				if ($scope.spareParts.u_critical && $scope.spareParts.u_critical != 'undefined') {
					reqData.u_critical = true;
				} else {
					reqData.u_critical = false;
				}

				if (!$scope.spareParts.u_email) {
					reqData.u_email = '';
				}
				
				if (!$scope.spareParts.u_csc_mail_address || $scope.spareParts.u_csc_mail_address == 'undefined') {
					reqData.u_csc_mail_address = '';
				}

				

				if ($scope.spareParts.u_replacement_part_text2 && $scope.spareParts.u_replacement_part_text2 != 'undefined') {
					reqData.u_sap_part_desc_2 = "" + $scope.spareParts.u_replacement_part_text2;
					reqData.u_sap_part_num_2 = "" + $scope.spareParts.u_spare_part_add2;
					reqData.u_sap_part_qty_2 = $scope.spareParts.u_quantity_add2;
				}

				if ($scope.spareParts.u_replacement_part_text3 && $scope.spareParts.u_replacement_part_text3 != 'undefined') {
					reqData.u_sap_part_desc_3 = "" + $scope.spareParts.u_replacement_part_text3;
					reqData.u_sap_part_num_3 = "" + $scope.spareParts.u_spare_part_add3;
					reqData.u_sap_part_qty_3 = $scope.spareParts.u_quantity_add3;
				}
				
				if ($scope.spareParts.u_replacement_part_text4 && $scope.spareParts.u_replacement_part_text4 != 'undefined') {
					reqData.u_sap_part_desc_4 = "" + $scope.spareParts.u_replacement_part_text4;
					reqData.u_sap_part_num_4 = "" + $scope.spareParts.u_spare_part_add4;
					reqData.u_sap_part_qty_4 = $scope.spareParts.u_quantity_add4;
				}
				
				if ($scope.spareParts.u_replacement_part_text5 && $scope.spareParts.u_replacement_part_text5 != 'undefined') {
					reqData.u_sap_part_desc_5 = "" + $scope.spareParts.u_replacement_part_text5;
					reqData.u_sap_part_num_5 = "" + $scope.spareParts.u_spare_part_add5;
					reqData.u_sap_part_qty_5 = $scope.spareParts.u_quantity_add5;
				}

				if (ssoid) {
					if ($rootScope.isOnline()) {
						Utils.showPleaseWait(pleaseWait);
						var promise = applicationServices.orderSpareParts(reqData);
						promise.then(function(payload) {
							if (payload && payload.status == 201 && payload.data && payload.data.result && payload.data.result[0].display_value && payload.data.result[0].display_value.length > 0) {
								Utils.hidePleaseWait();
								$scope.backToTicketsListing();
								Utils.showAlert(sparePartPlaced + payload.data.result[0].display_value);
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
							var tempTicketId = $scope.ticketform.number + "_OSP";
							reqData.u_local_save_time = savedTimeStamp;
							database.storePendingTicket(tempTicketId, ssoid, "MY_GROUP_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$scope.ticketform = {};
								$scope.backToTicketsListing();
							});
						} else {
							//Save it locally for future upload process
							var d = new Date();
							var savedTimeStamp = d.getTime();							
							var tempTicketId = savedTimeStamp + "_OSP";
							reqData.u_local_save_time = savedTimeStamp;
							reqData.number = tempTicketId;
							database.storePendingTicket(tempTicketId, ssoid, "ORDER_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$scope.ticketform = {};
								$scope.backToTicketsListing();
							});
						}
					}
				}
			} else {
				Utils.showAlert(expectedDateEmpty);
			}		
	};

	/**
	 *Set the spare pasrt based on the uploaded defect catageory
	 * @param {Object} groupedItems
	 */
	$scope.setSpareItems = function(groupedItems) {
		
	};

	

	$scope.hideSparePartDefectItems = function() {
		$scope.orderSpareParts.sparePartButtonHide = 'false';
	};

	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};

	$scope.ticketCancel = function() {
		$rootScope.onBackPress();
	};

	$scope.isInvalid = function(field) {
		try {
			var data = $scope.ticketform.additionalComments;
			if (data && data.length > 0) {
				return false;
			} else {
				return true;
			}
		} catch(e) {
			return true;
		}
	};

	

	
			if ($rootScope.usersCountryCode && $rootScope.usersCountryCode != 'undefined') {
				var ticketCountry = $rootScope.usersCountryCode;
			} else {
				var ticketCountry = '';
			}
			
			try {				
						if (ticketCountry) {
							try {
								database.loadPwMasterData(ticketCountry, 'MS_Spare', function(result) {
									if (result && result.rows && result.rows.length > 0) {
										var ahArray = [];
										for (var i = 0; i < result.rows.length; i++) {
											ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
										}
										$scope.spareParts.u_csc_mail_address = ahArray[0].u_order_email;										
									}
								});
							} catch(e) {
							}
						
						//$scope.spareParts.u_csc_mail_address = cscEmail;
					} else {
						$scope.spareParts.u_csc_mail_address = '';
					}
				
			} catch(e) {
				$scope.spareParts.u_csc_mail_address = '';				
			}
	
});
