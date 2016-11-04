/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('closedTicketDetailCntrl', function($scope, $ionicScrollDelegate, $rootScope, Utils, database, $state, $localstorage, $parse, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http, $filter) {
	$scope.show_section = {};
	$scope.$parent.$parent.$parent.app_page_title = closedTicketDetailTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.defectList = null;
	$scope.uniquedefectList = null;
	$scope.orderSpareParts = {};
	$scope.orderSpareParts.sparePartButtonHide = 'false';
	$scope.isGrpExist = true;
	$scope.spareParts = {};
	$scope.count = 1;
	$scope.spareParts.u_order_status = 'new';
	$scope.spareParts.u_delivery_address = '';
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

	

	/**
	 * Get the Market Sector and DCS Connection data from DB
	 */
	database.getControllersOperationalData(function(result) {
		if (result && result.rows && result.rows.length > 0) {
			var compltedTaskArray = [];
			for (var i = 0; i < result.rows.length; i++) {
				compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).Data, $rootScope.dbpasscode)));
			}
			$scope.marketSectorVal = [];
			$scope.dcsConnectionVal = [];
			var allItems = compltedTaskArray[0];

			for (var iTm = 0; iTm < allItems.length; iTm++) {
				if (allItems[iTm].element == 'u_market_sector') {
					$scope.marketSectorVal.push(allItems[iTm]);
				} else if (allItems[iTm].element == 'u_dcs_connection') {
					$scope.dcsConnectionVal.push(allItems[iTm]);
				}
			}
		}
	});

	/**
	 * Get the data from local storage to display the Closed ticket details page
	 */
	var tktDetail = angular.fromJson($localstorage.get('CLOSED_TICKET_DETAIL'));
	$scope.closedTicketForm = tktDetail;
	//console.log($scope.closedTicketForm)
	$scope.savedTicketForm = $scope.closedTicketForm.u_defect_category1;
	Utils.hidePleaseWait();

	//Setup view and order spare parts
	$scope.orderSpareParts = {};
	$scope.vspareParts = {};
	$scope.orderSpareParts.onViewSpareParts = 'false';
	if ($scope.closedTicketForm && $scope.closedTicketForm.u_order_spare_part_flag) {
		$scope.orderSpareParts.isUploadedSparePart = $scope.closedTicketForm.u_order_spare_part_flag;
	}

	$scope.orderSpareParts.sparePartButton = 'true';

	if ($scope.savedTicketForm && $scope.savedTicketForm.length > 0) {
		$scope.orderSpareParts.sparePartButton = 'true';
	} else {
		$scope.orderSpareParts.sparePartButton = 'false';
	}

	

	/**
	 *Show the spare parts as view if its already uploaded.
	 */
	$scope.onShowViewSpareParts = function() {
		Utils.showPleaseWait(pleaseWait);
		//fetch the record from the saved database.
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid && ssoid.length > 0) {
			var refTicketId = $scope.closedTicketForm.number;
			if (refTicketId && refTicketId.length > 0) {

				database.getUploadedClosedSpareParts(ssoid, refTicketId, function(result) {
					if (result && result.length > 0) {
						$scope.vspareParts = result[0];
						$scope.orderSpareParts.onViewSpareParts = 'true';
						Utils.hidePleaseWait();
					} else {
						Utils.showAlert(unableFetchSpare);
						Utils.hidePleaseWait();
					}
				});
			} else {
				Utils.hidePleaseWait();
				Utils.showAlert(unableFetchSpare);
			}
		} else {
			Utils.hidePleaseWait();
			Utils.showAlert(unableFetchSpare);
		}
	};

	$scope.onHideViewSpareParts = function() {
		$scope.orderSpareParts.onViewSpareParts = 'false';
	};

	$scope.onHideViewSpareParts = function() {
		$scope.orderSpareParts.onViewSpareParts = 'false';
	};

	$scope.createReport = function() {

	}

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
			}
	});

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

	/**
	 *  On Additional spare part change
	 * @param {Object} item
	 */
	$scope.onAdditionalSparePartChange = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add = 0;
		} else {
			$scope.spareParts.u_replacement_part_text = '';
			$scope.spareParts.u_spare_part_add = '';
			$scope.spareParts.u_quantity_add = 0;
		}
	};

	$scope.onAdditionalSparePartChange2 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text2 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add2 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add2 = 0;
		} else {
			$scope.spareParts.u_replacement_part_text = '';
			$scope.spareParts.u_spare_part_add2 = '';
			$scope.spareParts.u_quantity_add2 = 0;
		}
	};

	$scope.onAdditionalSparePartChange3 = function(item) {
		if (item && item.u_replacement_part_no) {
			$scope.spareParts.u_replacement_part_text3 = item.u_replacement_part_text;
			// $scope.spareParts.u_replacement_part_text = item.u_replacement_part_no;
			$scope.spareParts.u_spare_part_add3 = item.u_replacement_part_no;
			$scope.spareParts.u_quantity_add3 = 0;
		} else {
			$scope.spareParts.u_replacement_part_text = '';
			$scope.spareParts.u_spare_part_add3 = '';
			$scope.spareParts.u_quantity_add3 = 0;
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
		// alert("ss");
	};

	$scope.orderSparePartDefectItems = function() {
		//console.log($scope.defectList.length)
		//First Check if any pending form present.
		if ($scope.isGrpExist == false) {
			Utils.showAlert(orderSpareGroupNotExist);
		} else {

			Utils.showPleaseWait('Please Wait...');
			var ssoid = $localstorage.get('SN-LOGIN-SSO');
			if (ssoid && ssoid.length > 0) {
				if ($scope.closedTicketForm && $scope.closedTicketForm.number && $scope.closedTicketForm.number.length > 0) {
					database.getPendingTicketBasedonTicketIdAndUserId($scope.closedTicketForm.number + '_OSP', ssoid, function(record) {
						if (record && record.length > 0) {
							if (record[0].number == $scope.closedTicketForm.number) {
								Utils.hidePleaseWait();
								Utils.showAlert(sparePartAlreadyPending);
							}
						} else {
							$timeout(function() {
								$scope.spareParts.u_ship_to = $scope.closedTicketForm.u_ship_sold_to;

								//console.log($scope.spareParts.u_ship_to)
								//alert($scope.spareParts.u_ship_to)
								//Fetch the Defect Heir from Data base.
								if ($scope.defectList && $scope.defectList.length > 0) {
									$scope.orderSpareParts.sparePartButtonHide = 'true';
									$scope.setSpareItems($scope.defectList);
									$scope.$apply();
									Utils.hidePleaseWait();
									//alert('2')
								} else {
									Utils.getSavedDBDefectHierarchyAll(database, Utils, function(data, nongroupdata) {
										if (nongroupdata && nongroupdata.length > 0) {
											$scope.defectList = nongroupdata;
											$scope.orderSpareParts.sparePartButtonHide = 'true';
											$scope.setSpareItems(nongroupdata);
											$scope.$apply();
											Utils.hidePleaseWait();
										} else {
											Utils.hidePleaseWait();
											Utils.showAlert(defectInformationNotFound);
										}
									});
								}
							}, 10, false);
						}
					});
				} // end of if before database
			}
		}
	};

	$scope.setSpareItems = function(groupedItems) {
		//console.log(groupedItems)

		try {
			if ($scope.closedTicketForm.u_defect_category1 && $scope.closedTicketForm.u_defect_category1.length > 0) {
				var groupedItem = Utils.getItemGroupedBy(groupedItems, 'u_defect_category1');
				if (groupedItem && groupedItem.length > 0) {
					for (var i = 0; i < groupedItem.length; i++) {
						if (groupedItem[i].label) {
							if (groupedItem[i].label.toLowerCase() == $scope.closedTicketForm.u_defect_category1.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.closedTicketForm.u_defect_category2.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.closedTicketForm.u_defect_category3.toLowerCase()) {
															$scope.spareParts.u_1_spare_part = grpItem[i3].u_replacement_part_text;
															$scope.spareParts.u_1_sap_part__ = grpItem[i3].u_replacement_part_no;
														}
													}
												}
											}
										}
									}
								}
							}
							if (groupedItem[i].label.toLowerCase() == $scope.closedTicketForm.u_defect_category_2.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.closedTicketForm.u_defect_category2_2.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.closedTicketForm.u_defect_category3_2.toLowerCase()) {
															$scope.spareParts.u_2_spare_part = grpItem[i3].u_replacement_part_text;
															$scope.spareParts.u_2_sap_part__ = grpItem[i3].u_replacement_part_no;
														}
													}
												}
											}
										}
									}
								}
							}

							if (groupedItem[i].label.toLowerCase() == $scope.closedTicketForm.u_defect_category_3.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.closedTicketForm.u_defect_category2_3.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.closedTicketForm.u_defect_category3_3.toLowerCase()) {
															$scope.spareParts.u_3_spare_part = grpItem[i3].u_replacement_part_text;
															$scope.spareParts.u_3_sap_part__ = grpItem[i3].u_replacement_part_no;
														}
													}
												}
											}
										}
									}
								}
							}

							if (groupedItem[i].label.toLowerCase() == $scope.closedTicketForm.u_defect_category_4.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.closedTicketForm.u_defect_category2_4.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.closedTicketForm.u_defect_category3_4.toLowerCase()) {
															$scope.spareParts.u_4_spare_part = grpItem[i3].u_replacement_part_text;
															$scope.spareParts.u_4_sap_part__ = grpItem[i3].u_replacement_part_no;
														}
													}
												}
											}
										}
									}
								}
							}

							if (groupedItem[i].label.toLowerCase() == $scope.closedTicketForm.u_defect_category_5.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.closedTicketForm.u_defect_category2_5.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.closedTicketForm.u_defect_category3_5.toLowerCase()) {
															$scope.spareParts.u_5_spare_part = grpItem[i3].u_replacement_part_text;
															$scope.spareParts.u_5_sap_part__ = grpItem[i3].u_replacement_part_no;
														}
													}
												}
											}
										}
									}
								}
							}

						}
					}
				}
			}
		} catch(e) {
		}
	};

	$scope.onSparePartsUpload = function() {

		if ($scope.closedTicketForm.u_defect_category2 && $scope.closedTicketForm.u_defect_category2.length > 0 && $scope.spareParts.u_1_quantity < 1) {
			if ($scope.spareParts.u_1_quantity < 1 || $scope.spareParts.u_1_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2);
				return;
			}
		}

		if ($scope.closedTicketForm.u_defect_category2_2 && $scope.closedTicketForm.u_defect_category2_2.length > 0 && $scope.spareParts.u_2_quantity < 1) {
			if ($scope.spareParts.u_2_quantity < 1 || $scope.spareParts.u_2_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_2);
				return;
			}
		}

		if ($scope.closedTicketForm.u_defect_category2_3 && $scope.closedTicketForm.u_defect_category2_3.length > 0 && $scope.spareParts.u_3_quantity < 1) {
			if ($scope.spareParts.u_3_quantity < 1 || $scope.spareParts.u_3_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_3);
				return;
			}
		}

		if ($scope.closedTicketForm.u_defect_category2_4 && $scope.closedTicketForm.u_defect_category2_4.length > 0 && $scope.spareParts.u_4_quantity < 1) {
			if ($scope.spareParts.u_4_quantity < 1 || $scope.spareParts.u_4_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_4);
				return;
			}
		}

		if ($scope.closedTicketForm.u_defect_category2_5 && $scope.closedTicketForm.u_defect_category2_5.length > 0 && $scope.spareParts.u_5_quantity < 1) {
			if ($scope.spareParts.u_5_quantity < 1 || $scope.spareParts.u_5_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_5);
				return;
			}
		}

		// Additional Spare part quantitly validation
		if ($scope.spareParts.u_replacement_part_text.length > 0 && $scope.spareParts.u_quantity_add < 1) {
			if (!$scope.spareParts.u_spare_part_add || !$scope.spareParts.u_quantity_add || !($scope.spareParts.u_quantity_add >= 1 && $scope.spareParts.u_quantity_add <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		if ($scope.spareParts.u_replacement_part_text2 && $scope.spareParts.u_quantity_add2 < 1) {
			if (!$scope.spareParts.u_spare_part_add2 || !$scope.spareParts.u_quantity_add2 || !($scope.spareParts.u_quantity_add2 >= 1 && $scope.spareParts.u_quantity_add2 <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		if ($scope.spareParts.u_replacement_part_text3 && $scope.spareParts.u_quantity_add3 < 1) {
			if (!$scope.spareParts.u_spare_part_add3 || !$scope.spareParts.u_quantity_add3 || !($scope.spareParts.u_quantity_add3 >= 1 && $scope.spareParts.u_quantity_add3 <= 99)) {
				Utils.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
				return;
			}
		}

		//Validation for any one value should be filled
		if ($scope.closedTicketForm.u_defect_category2 && $scope.closedTicketForm.u_defect_category2.length > 0) {
			if (!($scope.spareParts.u_1_quantity > 0 && $scope.spareParts.u_1_quantity < 100) && !($scope.spareParts.u_2_quantity > 0 && $scope.spareParts.u_2_quantity < 100) && !($scope.spareParts.u_3_quantity > 0 && $scope.spareParts.u_3_quantity < 100) && !($scope.spareParts.u_4_quantity > 0 && $scope.spareParts.u_4_quantity < 100) && !($scope.spareParts.u_5_quantity > 0 && $scope.spareParts.u_5_quantity < 100)) {
				//Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2.label);
				Utils.showAlert(sparePartQtyvalidationFaildMsg);
				return;
			}
		}

		if ($("#email").hasClass("warning")) {
			Utils.showAlert(validEmailAddr)
			return;
		}

		/*if ($scope.closedTicketForm.u_defect_category2 && $scope.closedTicketForm.u_defect_category2.length > 0) {
		 if (!($scope.spareParts.u_1_quantity > 0 && $scope.spareParts.u_1_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2);
		 return;
		 }
		 }

		 if ($scope.closedTicketForm.u_defect_category2_2 && $scope.closedTicketForm.u_defect_category2_2.length > 0) {
		 if (!($scope.spareParts.u_2_quantity > 0 && $scope.spareParts.u_2_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_2);
		 return;
		 }
		 }

		 if ($scope.closedTicketForm.u_defect_category2_3 && $scope.closedTicketForm.u_defect_category2_3.length > 0) {
		 if (!($scope.spareParts.u_3_quantity > 0 && $scope.spareParts.u_3_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_3);
		 return;
		 }
		 }

		 if ($scope.closedTicketForm.u_defect_category2_4 && $scope.closedTicketForm.u_defect_category2_4.length > 0) {
		 if (!($scope.spareParts.u_4_quantity > 0 && $scope.spareParts.u_4_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_4);
		 return;
		 }
		 }

		 if ($scope.closedTicketForm.u_defect_category2_5 && $scope.closedTicketForm.u_defect_category2_5.length > 0) {
		 if (!($scope.spareParts.u_5_quantity > 0 && $scope.spareParts.u_5_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.closedTicketForm.u_defect_category2_5);
		 return;
		 }
		 } else {
		 $scope.closedTicketForm.u_defect_category2_5 = ''
		 }*/
		
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
					"u_ticket_number" : "" + $scope.closedTicketForm.sys_id,
					"number" : "" + $scope.closedTicketForm.number,
					"u_1_component" : "" + $scope.closedTicketForm.u_defect_category2,
					"u_1_spare_part" : "" + $scope.spareParts.u_1_spare_part,
					"u_1_sap_part__" : "" + $scope.spareParts.u_1_sap_part__,
					"u_1_quantity" : "" + $scope.spareParts.u_1_quantity,
					"u_2_component" : "" + $scope.closedTicketForm.u_defect_category2_2,
					"u_2_spare_part" : "" + $scope.spareParts.u_2_spare_part,
					"u_2_sap_part__" : "" + $scope.spareParts.u_2_sap_part__,
					"u_2_quantity" : "" + $scope.spareParts.u_2_quantity,
					"u_3_component" : "" + $scope.closedTicketForm.u_defect_category2_3,
					"u_3_spare_part" : "" + $scope.spareParts.u_3_spare_part,
					"u_3_sap_part__" : "" + $scope.spareParts.u_3_sap_part__,
					"u_3_quantity" : "" + $scope.spareParts.u_3_quantity,
					"u_4_component" : "" + $scope.closedTicketForm.u_defect_category2_4,
					"u_4_spare_part" : "" + $scope.spareParts.u_4_spare_part,
					"u_4_sap_part__" : "" + $scope.spareParts.u_4_sap_part__,
					"u_4_quantity" : "" + $scope.spareParts.u_4_quantity,
					"u_5_component" : "" + $scope.closedTicketForm.u_defect_category2_5,
					"u_5_spare_part" : "" + $scope.spareParts.u_5_spare_part,
					"u_5_sap_part__" : "" + $scope.spareParts.u_5_sap_part__,
					"u_5_quantity" : "" + $scope.spareParts.u_5_quantity,
					"u_sap_part___add" : "" + $scope.spareParts.u_replacement_part_text,
					"u_spare_part_add" : "" + $scope.spareParts.u_spare_part_add,
					"u_quantity_add" : "" + $scope.spareParts.u_quantity_add,
					"u_delivery_address" : "" + $scope.spareParts.u_delivery_address,
					"u_ship_to" : "" + $scope.spareParts.u_ship_to,
					"u_expected_date" : "" + $scope.spareParts.u_expected_date,
					"u_csc_mail_address" : "" + $scope.spareParts.u_csc_mail_address,
					"u_email" : "" + $scope.spareParts.u_email,
					"u_local_save_time" : "" + n,
					"u_local_ticket_id" : "" + $scope.closedTicketForm.number,
					"u_critical" : true
				};

				if ($scope.spareParts.u_critical) {
					reqData.u_critical = true;
				} else {
					reqData.u_critical = false;
				}

				if (!$scope.spareParts.u_email) {
					reqData.u_email = '';
				}

				if (!$scope.spareParts.u_1_spare_part) {
					reqData.u_1_spare_part = '';
				}
				if (!$scope.spareParts.u_1_sap_part__) {
					reqData.u_1_sap_part__ = '';
				}

				if (!$scope.spareParts.u_2_spare_part) {
					reqData.u_2_spare_part = '';
				}
				if (!$scope.spareParts.u_2_sap_part__) {
					reqData.u_2_sap_part__ = '';
				}

				if (!$scope.spareParts.u_3_spare_part) {
					reqData.u_3_spare_part = '';
				}
				if (!$scope.spareParts.u_3_sap_part__) {
					reqData.u_3_sap_part__ = '';
				}

				if (!$scope.spareParts.u_4_spare_part) {
					reqData.u_4_spare_part = '';
				}
				if (!$scope.spareParts.u_4_sap_part__) {
					reqData.u_4_sap_part__ = '';
				}

				if (!$scope.spareParts.u_5_spare_part) {
					reqData.u_5_spare_part = '';
				}
				if (!$scope.spareParts.u_5_sap_part__) {
					reqData.u_5_sap_part__ = '';
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
							var tempTicketId = $scope.closedTicketForm.number + "_OSP";
							reqData.u_local_save_time = savedTimeStamp;
							database.storePendingTicket(tempTicketId, ssoid, "MY_GROUP_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$scope.closedTicketForm = {};
								$rootScope.onBackPress();
							});
						} else {
							//Save it locally for future upload process
							var d = new Date();
							var savedTimeStamp = d.getTime();
							var tempTicketId = $scope.closedTicketForm.number + "_OSP";
							reqData.u_local_save_time = savedTimeStamp;
							database.storePendingTicket(tempTicketId, ssoid, "MY_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$scope.closedTicketForm = {};
								$rootScope.onBackPress();
							});
						}
					}
				}
			} else {
				Utils.showAlert(expectedDateEmpty);
			}
		
	};

	/**
	 * Fetch the warrant date from account hierarchy table based on Cam serial number
	 */

	if ($scope.savedTicketForm && $scope.savedTicketForm.length > 0) {
		Utils.getSavedDBAccountHierarchyAll(database, Utils, function(data, nongroupdata) {
			if (data && data.length > 0) {
				if (nongroupdata && nongroupdata.length > 0) {
					for (var i = 0; i < nongroupdata.length; i++) {
						if (nongroupdata[i].u_asset_number == $scope.closedTicketForm["u_asset_number.u_asset_number"]) {
							$scope.oldWarrantyDate = nongroupdata[i].u_dateofcommissing;
							break;
						}
					}
				}
			} else {
				$scope.oldWarrantyDate = '';
			}

			/**
			 * Calculate the warranty date based on current date and warranty date
			 */

			var ticketCountry = tktDetail.u_country;
			// getting ticket country

			try {
				if ($scope.oldWarrantyDate && $scope.oldWarrantyDate.length > 0) {
					var currentDate = Utils.currentGMTDate();
					var oldSavedDate = $scope.oldWarrantyDate;
					var firstDate = new Date(oldSavedDate);
					var secondDate = new Date(currentDate);

					var start = Math.floor(firstDate.getTime() / (3600 * 24 * 1000));
					//days as integer from..
					var end = Math.floor(secondDate.getTime() / (3600 * 24 * 1000));
					//days as integer from..
					var diffDays = end - start;
					// exact dates

					if (diffDays <= 90) {
						if (ticketCountry) {
							try {
								database.loadPwMasterData(ticketCountry, 'MS_Warranty', function(result) {
									if (result && result.rows && result.rows.length > 0) {
										var ahArray = [];
										for (var i = 0; i < result.rows.length; i++) {
											ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
										}
										$scope.spareParts.u_csc_mail_address = ahArray[0].u_order_email;
										if ($scope.spareParts.u_csc_mail_address) {
											$scope.isGrpExist = true;
										} else {
											$scope.isGrpExist = false;
										}
									}
								});
							} catch(e) {
							}
						}
						//$scope.spareParts.u_csc_mail_address = warantyEmail;
					} else {
						if (ticketCountry) {
							try {
								database.loadPwMasterData(ticketCountry, 'MS_Spare', function(result) {
									if (result && result.rows && result.rows.length > 0) {
										var ahArray = [];
										for (var i = 0; i < result.rows.length; i++) {
											ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
										}
										$scope.spareParts.u_csc_mail_address = ahArray[0].u_order_email;
										if ($scope.spareParts.u_csc_mail_address) {
											$scope.isGrpExist = true;
										} else {
											$scope.isGrpExist = false;
										}
									}
								});
							} catch(e) {
							}
						}
						//$scope.spareParts.u_csc_mail_address = cscEmail;
					}
				} else {
					if (ticketCountry) {
						try {
							database.loadPwMasterData(ticketCountry, 'MS_Spare', function(result) {
								if (result && result.rows && result.rows.length > 0) {
									var ahArray = [];
									for (var i = 0; i < result.rows.length; i++) {
										ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).GroupData, $rootScope.dbcommonpass)));
									}
									$scope.spareParts.u_csc_mail_address = ahArray[0].u_order_email;
									if ($scope.spareParts.u_csc_mail_address) {
										$scope.isGrpExist = true;
									} else {
										$scope.isGrpExist = false;
									}
								}
							});
						} catch(e) {
						}
					}
					//$scope.spareParts.u_csc_mail_address = cscEmail;
				}
			} catch(e) {
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
				}
				//$scope.spareParts.u_csc_mail_address = cscEmail;
			}

		});
	}

	
});
