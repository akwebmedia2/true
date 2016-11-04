/**
 *COntroller of the open spare form in edit mode.
 */
angular.module('TrueSense.controllers').controller('opensparepartEditCtrl', function($scope, $ionicScrollDelegate, Utils, $filter, $rootScope, database, $parse, $http, $localstorage, $timeout, applicationServices, $state) {
	$scope.$parent.$parent.$parent.app_page_title = EditSparePartTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.vespareParts = {};
	$rootScope.setupHttpAuthHeader();
	$scope.vespareParts.u_delivery_address = '';

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
			if (viewEditSPDetailsObj.u_1_quantity) {
				$scope.vespareParts.u_1_quantity = parseInt(viewEditSPDetailsObj.u_1_quantity, 10);
			} else {
				$scope.vespareParts.u_1_quantity = defaultValue;
			}
			if (viewEditSPDetailsObj.u_2_quantity) {
				$scope.vespareParts.u_2_quantity = parseInt(viewEditSPDetailsObj.u_2_quantity, 10);
			} else {
				$scope.vespareParts.u_2_quantity = defaultValue;
			}
			if (viewEditSPDetailsObj.u_3_quantity) {
				$scope.vespareParts.u_3_quantity = parseInt(viewEditSPDetailsObj.u_3_quantity, 10);
			} else {
				$scope.vespareParts.u_3_quantity = defaultValue;
			}
			if (viewEditSPDetailsObj.u_4_quantity) {
				$scope.vespareParts.u_4_quantity = parseInt(viewEditSPDetailsObj.u_4_quantity, 10);
			} else {
				$scope.vespareParts.u_4_quantity = defaultValue;
			}
			if (viewEditSPDetailsObj.u_5_quantity) {
				$scope.vespareParts.u_5_quantity = parseInt(viewEditSPDetailsObj.u_5_quantity, 10);
			} else {
				$scope.vespareParts.u_5_quantity = defaultValue;
			}
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
			$scope.vespareParts.u_sap_part___add = viewEditSPDetailsObj.u_sap_part___add;
		}
	};

	//Get the selected Spare Part and set the form based on the last saved value.
	var viewEditSPDetails = $localstorage.get('SPARE_PART_EDIT_MODE');
	if (viewEditSPDetails && viewEditSPDetails.length > 0) {
		var viewEditSPDetailsObj = angular.fromJson(viewEditSPDetails);
		if (viewEditSPDetailsObj && viewEditSPDetailsObj.number && viewEditSPDetailsObj.number.length > 0) {
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

	$scope.defectList = null;
	$scope.uniquedefectList = null;
	if ($scope.defectList && $scope.defectList.length > 0) {
		$scope.orderSpareParts.sparePartButtonHide = 'true';
		$scope.setSpareItems($scope.defectList);
		try {
			$scope.uniquedefectList = Utils.getUniqueArray($scope.defectList, 'u_replacement_part_text');
		} catch(e) {
		}
		$scope.$apply();
		Utils.hidePleaseWait();
	} else {
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

				$scope.defectList = nongroupdata;
				// For defect data in order spare part
				try {
					$scope.uniquedefectList = Utils.getUniqueArray(defectListData, 'u_replacement_part_text');
					// For additional spare part
				} catch(e) {
				}
			} else {
				Utils.showAlert(defectInformationNotFound);
			}
		});
	}

	$scope.onSparePartsUploadCancel = function() {
		$rootScope.onBackPress();
	};

	/**
	 *On upload the spare part. if online upload and go back to previous screen. If offline saved into the database
	 */
	$scope.onSparePartsUpload = function() {

		if ($scope.vespareParts.u_1_component && $scope.vespareParts.u_1_component.length > 0 && $scope.vespareParts.u_1_quantity != '') {
			if ($scope.vespareParts.u_1_quantity < 1 || $scope.vespareParts.u_1_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.vespareParts.u_1_component);
				return;
			}
		}
		if ($scope.vespareParts.u_2_component && $scope.vespareParts.u_2_component.length > 0 && $scope.vespareParts.u_2_quantity != null && $scope.vespareParts.u_2_quantity != '') {
			if ($scope.vespareParts.u_2_quantity < 1 || $scope.vespareParts.u_2_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.vespareParts.u_2_component);
				return;
			}
		}

		if ($scope.vespareParts.u_3_component && $scope.vespareParts.u_3_component.length > 0 && $scope.vespareParts.u_3_quantity != null && $scope.vespareParts.u_3_quantity != '') {
			if ($scope.vespareParts.u_3_quantity < 1 || $scope.vespareParts.u_3_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.vespareParts.u_3_component);
				return;
			}
		}

		if ($scope.vespareParts.u_4_component && $scope.vespareParts.u_4_component.length > 0 && $scope.vespareParts.u_4_quantity != null && $scope.vespareParts.u_4_quantity != '') {
			if ($scope.vespareParts.u_4_quantity < 1 || $scope.vespareParts.u_4_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.vespareParts.u_4_component);
				return;
			}
		}

		if ($scope.vespareParts.u_5_component && $scope.vespareParts.u_5_component.length > 0 && $scope.vespareParts.u_5_quantity != null && $scope.vespareParts.u_5_quantity != '') {
			if ($scope.vespareParts.u_5_quantity < 1 || $scope.vespareParts.u_5_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.vespareParts.u_5_component);
				return;
			}
		}

		// Additional Spare part quantitly validation

		if ($scope.vespareParts.u_sap_part___add.length) {
			if (!$scope.vespareParts.u_spare_part_add || !$scope.vespareParts.u_quantity_add || !($scope.vespareParts.u_quantity_add >= 1 && $scope.vespareParts.u_quantity_add <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		if ($scope.vespareParts.u_sap_part_desc_2) {
			if (!$scope.vespareParts.u_sap_part_num_2 || !$scope.vespareParts.u_sap_part_qty_2 || !($scope.vespareParts.u_sap_part_qty_2 >= 1 && $scope.vespareParts.u_sap_part_qty_2 <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		if ($scope.vespareParts.u_sap_part_desc_3) {
			if (!$scope.vespareParts.u_sap_part_num_3 || !$scope.vespareParts.u_sap_part_qty_3 || !($scope.vespareParts.u_sap_part_qty_3 >= 1 && $scope.vespareParts.u_sap_part_qty_3 <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		//Validation for any one value should be filled
		if ($scope.vespareParts.u_1_component && $scope.vespareParts.u_1_component.length > 0) {
			if (!($scope.vespareParts.u_1_quantity > 0 && $scope.vespareParts.u_1_quantity < 100) && !($scope.vespareParts.u_2_quantity > 0 && $scope.vespareParts.u_2_quantity < 100) && !($scope.vespareParts.u_3_quantity > 0 && $scope.vespareParts.u_3_quantity < 100) && !($scope.vespareParts.u_4_quantity > 0 && $scope.vespareParts.u_4_quantity < 100) && !($scope.vespareParts.u_5_quantity > 0 && $scope.vespareParts.u_5_quantity < 100)) {
				//Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2.label);
				Utils.showAlert(sparePartQtyvalidationFaildMsg);
				return;
			}
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
					"opened_by" : '' + $scope.vespareParts.opened_by,
					"u_ticket_number" : "" + $scope.vespareParts.u_ticket_number,
					"number" : "" + $scope.vespareParts.number,
					"u_1_component" : "" + $scope.vespareParts.u_1_component,
					"u_1_spare_part" : "" + $scope.vespareParts.u_1_spare_part,
					"u_1_sap_part__" : "" + $scope.vespareParts.u_1_sap_part__,
					"u_1_quantity" : "" + $scope.vespareParts.u_1_quantity,
					"u_2_component" : "" + $scope.vespareParts.u_2_component,
					"u_2_spare_part" : "" + $scope.vespareParts.u_2_spare_part,
					"u_2_sap_part__" : "" + $scope.vespareParts.u_2_sap_part__,
					"u_2_quantity" : "" + $scope.vespareParts.u_2_quantity,
					"u_3_component" : "" + $scope.vespareParts.u_3_component,
					"u_3_spare_part" : "" + $scope.vespareParts.u_3_spare_part,
					"u_3_sap_part__" : "" + $scope.vespareParts.u_3_sap_part__,
					"u_3_quantity" : "" + $scope.vespareParts.u_3_quantity,
					"u_4_component" : "" + $scope.vespareParts.u_4_component,
					"u_4_spare_part" : "" + $scope.vespareParts.u_4_spare_part,
					"u_4_sap_part__" : "" + $scope.vespareParts.u_4_sap_part__,
					"u_4_quantity" : "" + $scope.vespareParts.u_4_quantity,
					"u_5_component" : "" + $scope.vespareParts.u_5_component,
					"u_5_spare_part" : "" + $scope.vespareParts.u_5_spare_part,
					"u_5_sap_part__" : "" + $scope.vespareParts.u_5_sap_part__,
					"u_5_quantity" : "" + $scope.vespareParts.u_5_quantity,
					"u_sap_part___add" : "" + $scope.vespareParts.u_sap_part___add,
					"u_spare_part_add" : "" + $scope.vespareParts.u_spare_part_add,
					"u_quantity_add" : $scope.vespareParts.u_quantity_add,
					"u_delivery_address" : "" + $scope.vespareParts.u_delivery_address,
					"u_ship_to" : "" + $scope.vespareParts.u_ship_to,
					"u_expected_date" : "" + $scope.vespareParts.u_expected_date,
					"u_csc_mail_address" : "" + $scope.vespareParts.u_csc_mail_address,
					"u_email" : "" + $scope.vespareParts.u_email,
					"u_local_save_time" : "" + n,
					"u_local_ticket_id" : "" + $scope.vespareParts.u_local_ticket_id,
					"u_critical" : true
				};
				if (+$scope.vespareParts.u_critical) {
					reqData.u_critical = true;
				} else {
					reqData.u_critical = false;
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
							database.storePendingTicket($scope.vespareParts.u_local_ticket_id + "_OSP", $scope.vespareParts.opened_by, "MY_SPARE_PART", savedTimeStamp, reqData, function(status) {
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
