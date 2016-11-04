/**
 *COntroller for open ticket edit  mode
 */
angular.module('TrueSense.controllers').controller('logticketEditCtrl', function($scope, $ionicScrollDelegate, $localstorage, applicationServices, $rootScope, Utils, database, $parse, $filter, $timeout) {
	$scope.$parent.$parent.$parent.app_page_title = editTicketTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.ticketform = {};
	$scope.allowticketform = {};
	$scope.allowticketform.enableUpdate = true;
	$scope.defectList = null;
	$scope.uniquedefectList = null;
	$scope.isShowControle = true;
	$scope.isGrpExist == true;
	$scope.orderSpareParts = {};
	$scope.orderSpareParts.sparePartButtonHide = 'false';
	$scope.spareParts = {};
	$scope.count = 1;
	$scope.spareParts.u_order_status = 'new';
	$rootScope.setupHttpAuthHeader();
	var tktDetail = angular.fromJson($localstorage.get('TICKET_EDIT_MODE'));
	//console.log(tktDetail)
	$scope.savedTicketForm = tktDetail.u_defect_category1;
	$scope.ticketform = tktDetail;
	//console.log($scope.ticketform)
	$scope.isEditTicket = true;
	$scope.visibleEscalateBtn = false;
	$scope.$on("$destroy", function() {
		var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
		delegate.forgetScrollPosition();
	});
	/**
	 * Create a blank object and assign a blank value to .label if defect information is not provided for below listed items:
	 */
	if (!$scope.ticketform.u_defect_category2_2) {
		$scope.ticketform.u_defect_category2_2 = [];
		$scope.ticketform.u_defect_category2_2.label = ''
	}
	if (!$scope.ticketform.u_defect_category2_3) {
		$scope.ticketform.u_defect_category2_3 = [];
		$scope.ticketform.u_defect_category2_3.label = ''
	}
	if (!$scope.ticketform.u_defect_category2_4) {
		$scope.ticketform.u_defect_category2_4 = [];
		$scope.ticketform.u_defect_category2_4.label = ''
	}
	if (!$scope.ticketform.u_defect_category2_5) {
		$scope.ticketform.u_defect_category2_5 = [];
		$scope.ticketform.u_defect_category2_5.label = ''
	}
	try {
		if ($scope.ticketform["assignment_group.name"]) {
			if ($scope.ticketform["assignment_group.name"].indexOf("PM") < 0) {
				$scope.visibleEscalateBtn = true;
			} else {
				$scope.visibleEscalateBtn = false;
			}
		}
	} catch(e) {
	}

	var tktType = angular.fromJson($localstorage.get('TICKET_TYPE'));
	if (tktType == 'uploaded') {
		// check for any pening
		//Check tktDetail.sys_id in pending Data base
		if (tktDetail && tktDetail.sys_id) {
			database.getPendingTicketBasedonTicketId(tktDetail.sys_id, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					$scope.isShowControle = false;
					$scope.allowticketform.enableUpdate = false;
					$scope.$apply();
					Utils.showAlert(openTicketPendingTab);
				} else {
					$scope.allowticketform.enableUpdate = true;
					$scope.$apply();
				}
			});
		}
	} else {
		$scope.allowticketform.enableUpdate = true;
	}

	//Setup view and order spare parts
	$scope.orderSpareParts = {};
	$scope.vspareParts = {};
	$scope.orderSpareParts.onViewSpareParts = 'false';
	if ($scope.ticketform && $scope.ticketform.u_order_spare_part_flag) {
		$scope.orderSpareParts.isUploadedSparePart = $scope.ticketform.u_order_spare_part_flag;
	}

	$scope.section_click = function(section, $event) {
		$scope.show_section[section] = !$scope.show_section[section];
		$ionicScrollDelegate.resize()
	};


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

	/**
	 * Fetch the Defect information from database print on page accordingly
	 */
	//alert($scope.ticketform.u_defect_category2)
	Utils.getSavedDBDefectHierarchy(database, Utils, function(data, nongroupdata) {

		/**
		 * First assigning the data for Replacement part & Additional Replacement part for Order spare part.
		 */
		if (nongroupdata && nongroupdata.length > 0) {
			//console.log(nongroupdata)
			var dataNew = [];
			
			try {
				if ( typeof $scope.ticketform.u_defect_category1 == "string") {
					for (var j = 0; j < nongroupdata.length; j++) {
						if (nongroupdata[j].u_active == 'true' && nongroupdata[j].u_defect_category4 != 'SERVICE' || (nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category1 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_2 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_3 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_4 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_5)) {
							dataNew.push(nongroupdata[j])
						}
						
					}
				} else if ( typeof $scope.ticketform.u_defect_category1 == "object") {

					for (var j = 0; j < nongroupdata.length; j++) {
						if (nongroupdata[j].u_active == 'true' && nongroupdata[j].u_defect_category4 != 'SERVICE' || (nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category1.label || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_2.label || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_3 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_4 || nongroupdata[j].u_defect_category1 == $scope.ticketform.u_defect_category_5)) {
							dataNew.push(nongroupdata[j])
						}
						
					}

				} else {
					dataNew = nongroupdata;
				}
			} catch(e) {
			}

			
			// Assigning for defect data in order spare part
			data = dataNew;
			

		}
		
		

		/**
		 * Assigining the defect data for Defect information
		 */

		try {
			if (data && data.length > 0) {

				data = Utils.getItemGroupedBy(data, "u_defect_category1");

				$scope.u_defect_category1s = data;

				if ($scope.ticketform.u_defect_category1 && $scope.ticketform.u_defect_category1.length > 0) {
					//console.log($scope.ticketform.u_defect_category3)
					for (var i = 0; i < data.length; i++) {

						if ((data[i].label.length > 0) && (data[i].label == $scope.ticketform.u_defect_category1)) {

							$scope.ticketform.u_defect_category1 = data[i];
							//console.log($scope.ticketform.u_defect_category1)

							$scope.u_defect_category2s = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category2");

							if ($scope.u_defect_category2s && $scope.u_defect_category2s.length > 0) {
								for (var j = 0; j < $scope.u_defect_category2s.length; j++) {
									if ($scope.u_defect_category2s[j].label == $scope.ticketform.u_defect_category2) {
										$scope.u_defect_category3s = Utils.getItemGroupedBy($scope.u_defect_category2s[j].groupedItems, "u_defect_category3");
									}
								}
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category_2 && $scope.ticketform.u_defect_category_2.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if ((data[i].label.length > 0) && (data[i].label == $scope.ticketform.u_defect_category_2)) {
							$scope.ticketform.u_defect_category1_2 = data[i];
							$scope.u_defect_category2_2s = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category2");
							//$scope.u_defect_category3_2s = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category3");
							if ($scope.u_defect_category2_2s && $scope.u_defect_category2_2s.length > 0) {
								for (var j = 0; j < $scope.u_defect_category2_2s.length; j++) {
									if ($scope.u_defect_category2_2s[j].label == $scope.ticketform.u_defect_category2_2) {
										$scope.u_defect_category3_2s = Utils.getItemGroupedBy($scope.u_defect_category2_2s[j].groupedItems, "u_defect_category3");
									}
								}
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category_3 && $scope.ticketform.u_defect_category_3.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if ((data[i].label.length > 0) && (data[i].label == $scope.ticketform.u_defect_category_3)) {
							$scope.ticketform.u_defect_category1_3 = data[i];
							$scope.u_defect_category2_2s3 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category2");
							//$scope.u_defect_category3_2s3 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category3");
							if ($scope.u_defect_category2_2s3 && $scope.u_defect_category2_2s3.length > 0) {
								for (var j = 0; j < $scope.u_defect_category2_2s3.length; j++) {
									if ($scope.u_defect_category2_2s3[j].label == $scope.ticketform.u_defect_category2_3) {
										$scope.u_defect_category3_2s3 = Utils.getItemGroupedBy($scope.u_defect_category2_2s3[j].groupedItems, "u_defect_category3");
									}
								}
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category_4 && $scope.ticketform.u_defect_category_4.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if ((data[i].label.length > 0) && (data[i].label == $scope.ticketform.u_defect_category_4)) {
							$scope.ticketform.u_defect_category1_4 = data[i];
							$scope.u_defect_category2_2s4 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category2");
							//$scope.u_defect_category3_2s4 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category3");
							if ($scope.u_defect_category2_2s4 && $scope.u_defect_category2_2s4.length > 0) {
								for (var j = 0; j < $scope.u_defect_category2_2s4.length; j++) {
									if ($scope.u_defect_category2_2s4[j].label == $scope.ticketform.u_defect_category2_4) {
										$scope.u_defect_category3_2s4 = Utils.getItemGroupedBy($scope.u_defect_category2_2s4[j].groupedItems, "u_defect_category3");
									}
								}
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category_5 && $scope.ticketform.u_defect_category_5.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if ((data[i].label.length > 0) && (data[i].label == $scope.ticketform.u_defect_category_5)) {
							$scope.ticketform.u_defect_category1_5 = data[i];
							$scope.u_defect_category2_2s5 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category2");
							//$scope.u_defect_category3_2s5 = Utils.getItemGroupedBy(data[i].groupedItems, "u_defect_category3");
							if ($scope.u_defect_category2_2s5 && $scope.u_defect_category2_2s5.length > 0) {
								for (var j = 0; j < $scope.u_defect_category2_2s5.length; j++) {
									if ($scope.u_defect_category2_2s5[j].label == $scope.ticketform.u_defect_category2_5) {
										$scope.u_defect_category3_2s5 = Utils.getItemGroupedBy($scope.u_defect_category2_2s5[j].groupedItems, "u_defect_category3");
									}
								}
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category2 && $scope.ticketform.u_defect_category2.length > 0) {
					if ($scope.u_defect_category2s) {
						for (var j = 0; j < $scope.u_defect_category2s.length; j++) {
							if ($scope.u_defect_category2s[j].label == $scope.ticketform.u_defect_category2) {
								$scope.ticketform.u_defect_category2 = $scope.u_defect_category2s[j];
							}
						}
					}
				}

				if ($scope.ticketform.u_defect_category3 && $scope.ticketform.u_defect_category3.length > 0) {
					if ($scope.u_defect_category3s) {
						for (var j = 0; j < $scope.u_defect_category3s.length; j++) {
							if ($scope.u_defect_category3s[j].label == $scope.ticketform.u_defect_category3) {
								$scope.ticketform.u_defect_category3 = $scope.u_defect_category3s[j];
							}
						}
					}
				}

				//2nd Defect
				if ($scope.ticketform.u_defect_category2_2 && $scope.ticketform.u_defect_category2_2.length > 0) {
					if ($scope.u_defect_category2_2s) {
						for (var j = 0; j < $scope.u_defect_category2_2s.length; j++) {
							if ($scope.u_defect_category2_2s[j].label == $scope.ticketform.u_defect_category2_2) {
								$scope.ticketform.u_defect_category2_2 = $scope.u_defect_category2_2s[j];
							}
						}
					}
				}
				if ($scope.ticketform.u_defect_category3_2 && $scope.ticketform.u_defect_category3_2.length > 0) {
					if ($scope.u_defect_category3_2s) {
						for (var j = 0; j < $scope.u_defect_category3_2s.length; j++) {
							if ($scope.u_defect_category3_2s[j].label == $scope.ticketform.u_defect_category3_2) {
								$scope.ticketform.u_defect_category3_2 = $scope.u_defect_category3_2s[j];
							}
						}
					}
				}

				//3rd Defect
				if ($scope.ticketform.u_defect_category2_3 && $scope.ticketform.u_defect_category2_3.length > 0) {
					if ($scope.u_defect_category2_2s3) {
						for (var j = 0; j < $scope.u_defect_category2_2s3.length; j++) {
							if ($scope.u_defect_category2_2s3[j].label == $scope.ticketform.u_defect_category2_3) {
								$scope.ticketform.u_defect_category2_3 = $scope.u_defect_category2_2s3[j];
							}
						}
					}
				}
				if ($scope.ticketform.u_defect_category3_3 && $scope.ticketform.u_defect_category3_3.length > 0) {
					if ($scope.u_defect_category3_2s3) {
						for (var j = 0; j < $scope.u_defect_category3_2s3.length; j++) {
							if ($scope.u_defect_category3_2s3[j].label == $scope.ticketform.u_defect_category3_3) {
								$scope.ticketform.u_defect_category3_3 = $scope.u_defect_category3_2s3[j];

							}
						}
					}
				}

				//4th Defect
				if ($scope.ticketform.u_defect_category2_4 && $scope.ticketform.u_defect_category2_4.length > 0) {
					if ($scope.u_defect_category2_2s4) {
						for (var j = 0; j < $scope.u_defect_category2_2s4.length; j++) {
							if ($scope.u_defect_category2_2s4[j].label == $scope.ticketform.u_defect_category2_4) {
								$scope.ticketform.u_defect_category2_4 = $scope.u_defect_category2_2s4[j];

							}
						}
					}
				}
				if ($scope.ticketform.u_defect_category3_4 && $scope.ticketform.u_defect_category3_4.length > 0) {
					if ($scope.u_defect_category3_2s4) {
						for (var j = 0; j < $scope.u_defect_category3_2s4.length; j++) {
							if ($scope.u_defect_category3_2s4[j].label == $scope.ticketform.u_defect_category3_4) {
								$scope.ticketform.u_defect_category3_4 = $scope.u_defect_category3_2s4[j];

							}
						}
					}
				}

				//5th Defect
				if ($scope.ticketform.u_defect_category2_5 && $scope.ticketform.u_defect_category2_5.length > 0) {
					if ($scope.u_defect_category2_2s5) {
						for (var j = 0; j < $scope.u_defect_category2_2s5.length; j++) {
							if ($scope.u_defect_category2_2s5[j].label == $scope.ticketform.u_defect_category2_5) {
								$scope.ticketform.u_defect_category2_5 = $scope.u_defect_category2_2s5[j];

							}
						}
					}
				}
				if ($scope.ticketform.u_defect_category3_5 && $scope.ticketform.u_defect_category3_5.length > 0) {
					if ($scope.u_defect_category3_2s5) {
						for (var j = 0; j < $scope.u_defect_category3_2s5.length; j++) {
							if ($scope.u_defect_category3_2s5[j].label == $scope.ticketform.u_defect_category3_5) {
								$scope.ticketform.u_defect_category3_5 = $scope.u_defect_category3_2s5[j];

							}
						}
					}
				}

			}
		} catch(e) {
		}
	});

	/**
	 *Set the spare pasrt based on the uploaded defect catageory
	 * @param {Object} groupedItems
	 */
	$scope.setSpareItems = function(groupedItems) {
		try {

			if ($scope.ticketform.u_defect_category1.label && $scope.ticketform.u_defect_category1.label.length > 0) {
				var groupedItem = Utils.getItemGroupedBy(groupedItems, 'u_defect_category1');
				if (groupedItem && groupedItem.length > 0) {
					for (var i = 0; i < groupedItem.length; i++) {
						if (groupedItem[i].label) {
							if (groupedItem[i].label.toLowerCase() == $scope.ticketform.u_defect_category1.label.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.ticketform.u_defect_category2.label.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.ticketform.u_defect_category3.label.toLowerCase()) {
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

							if (groupedItem[i].label.toLowerCase() == $scope.ticketform.u_defect_category_2.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.ticketform.u_defect_category2_2.label.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.ticketform.u_defect_category3_2.label.toLowerCase()) {
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

							if (groupedItem[i].label.toLowerCase() == $scope.ticketform.u_defect_category_3.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.ticketform.u_defect_category2_3.label.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.ticketform.u_defect_category3_3.label.toLowerCase()) {
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

							if (groupedItem[i].label.toLowerCase() == $scope.ticketform.u_defect_category_4.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.ticketform.u_defect_category2_4.label.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.ticketform.u_defect_category3_4.label.toLowerCase()) {
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

							if (groupedItem[i].label.toLowerCase() == $scope.ticketform.u_defect_category_5.toLowerCase()) {
								if (groupedItem[i].groupedItems && groupedItem[i].groupedItems.length > 0) {
									var groupedItem2 = Utils.getItemGroupedBy(groupedItem[i].groupedItems, 'u_defect_category2');
									if (groupedItem2 && groupedItem2.length > 0) {
										for (var i2 = 0; i2 < groupedItem2.length; i2++) {
											if (groupedItem2[i2].label.toLowerCase() == $scope.ticketform.u_defect_category2_5.label.toLowerCase()) {
												if (groupedItem2[i2].groupedItems && groupedItem2[i2].groupedItems.length > 0) {
													var grpItem = groupedItem2[i2].groupedItems;
													for (var i3 = 0; i3 < grpItem.length; i3++) {
														if (grpItem[i3].u_defect_category3.toLowerCase() == $scope.ticketform.u_defect_category3_5.label.toLowerCase()) {
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

});
