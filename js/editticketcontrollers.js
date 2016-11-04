/**
 *COntroller for open ticket edit  mode
 */
angular.module('TrueSense.controllers').controller('openticketEditCtrl', function($scope, $ionicScrollDelegate, $localstorage, applicationServices, $rootScope, Utils, database, $parse, $filter, $timeout) {
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
	$scope.isGrpExist = true;
	$scope.orderSpareParts = {};
	$scope.orderSpareParts.sparePartButtonHide = 'false';
	$scope.spareParts = {};
	$scope.count = 1;
	$scope.spareParts.u_order_status = 'new';
	$scope.spareParts.u_delivery_address = '';
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
	if (!tktDetail.number) {
		$scope.ticketform['u_asset_number.u_asset_number'] = tktDetail.u_asset_number;
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

	/**
	 * Check the Open Ticket Edit access is available or not based ticket's country code and users group access
	 */

	var usersCountryCode = tktDetail['u_asset_number.u_country'];

	if (usersCountryCode) {
		Utils.showPleaseWait(pleaseWait);
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
									//console.log('user groups' + $scope.usergroups)
									try {
										for (var i = 0; i < $scope.groups.length; i++) {
											if ($scope.usergroups.indexOf($scope.groups[i].value) > -1) {
												$scope.isEditTicket = true;
												$scope.$apply();
												Utils.hidePleaseWait();
												break;
											}
										}
										Utils.hidePleaseWait();
									} catch(e) {
										Utils.hidePleaseWait();
									}
								} else {
									Utils.hidePleaseWait();
								}
							} else {
								Utils.hidePleaseWait();
							}
						} else {
							Utils.hidePleaseWait();
						}

					});

				} else {
					Utils.hidePleaseWait();
				}

			} else {
				Utils.hidePleaseWait();
			}
		});
	}
	/*var ssoid = $localstorage.get('SN-LOGIN-SSO')
	if (ssoid) {
	database.getUserInfo(ssoid, function(result) {
	if (result && result.rows && result.rows.length > 0) {
	var applicationAccess = result.rows.item(0);
	if (applicationAccess) {
	var applicationAccessJSON = angular.fromJson(Tea.decrypt(applicationAccess.UserInfo, $rootScope.dbpasscode));
	if (applicationAccessJSON) {
	$scope.isEditTicket = applicationAccessJSON.access_edit_ticket;
	}
	}
	}
	});
	}*/

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

	$scope.onEffectedModuleChange2 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			//$scope.ticketform.u_defect_category1_2 = selectedEffectedModule.currentItem.u_defect_category1;

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
			//$scope.ticketform.u_defect_category2_2 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_2 = '';
		}

	};

	$scope.onDefectChange2 = function(selectedComponent) {
		if (selectedComponent) {
			//$scope.ticketform.u_defect_category3_2 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_2 = '';
		}

	};

	$scope.onEffectedModuleChange3 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s3 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			//$scope.ticketform.u_defect_category1_3 = selectedEffectedModule.currentItem.u_defect_category1;
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
			//$scope.ticketform.u_defect_category2_3 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s3 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_3 = '';
		}
	};

	$scope.onDefectChange3 = function(selectedComponent) {
		if (selectedComponent) {
			//$scope.ticketform.u_defect_category3_3 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_3 = '';
		}
	};

	$scope.onEffectedModuleChange4 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s4 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			//$scope.ticketform.u_defect_category1_4 = selectedEffectedModule.currentItem.u_defect_category1;
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
			//$scope.ticketform.u_defect_category2_4 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s4 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_4 = '';
		}
	};

	$scope.onDefectChange4 = function(selectedComponent) {
		if (selectedComponent) {
			//$scope.ticketform.u_defect_category3_4 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3_4 = '';
		}

	};

	$scope.onEffectedModuleChange5 = function(selectedEffectedModule) {
		if (selectedEffectedModule) {
			$scope.u_defect_category2_2s5 = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			//$scope.ticketform.u_defect_category1_5 = selectedEffectedModule.currentItem.u_defect_category1;
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
			//$scope.ticketform.u_defect_category2_5 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.u_defect_category3_2s5 = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2_5 = '';
		}

	};

	$scope.onDefectChange5 = function(selectedComponent) {
		if (selectedComponent) {
			//$scope.ticketform.u_defect_category3_5 = selectedComponent.currentItem.u_defect_category3;
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
			//console.log(selectedEffectedModule)
			$scope.u_defect_category2s = Utils.getItemGroupedBy(selectedEffectedModule.groupedItems, "u_defect_category2");
			//console.log($scope.u_defect_category2s)
			//$scope.ticketform.u_defect_category1 = selectedEffectedModule.currentItem.u_defect_category1;
		} else {
			$scope.u_defect_category2s = Utils.getItemGroupedBy('', "u_defect_category2");
			$scope.ticketform.u_defect_category1 = '';
		}

	};

	$scope.onComponentChange = function(selectedComponent) {
		if (selectedComponent) {
			$scope.ticketform.u_defect_category3 = null;
			$scope.u_defect_category3s = Utils.getItemGroupedBy(selectedComponent.groupedItems, "u_defect_category3");
			//$scope.ticketform.u_defect_category2 = selectedComponent.currentItem.u_defect_category2;
		} else {
			$scope.ticketform.u_defect_category3 = null;
			$scope.u_defect_category3s = Utils.getItemGroupedBy('', "u_defect_category3");
			$scope.ticketform.u_defect_category2 = '';
		}
	};

	$scope.onDefectChange = function(selectedComponent) {
		if (selectedComponent) {
			//$scope.ticketform.u_defect_category3 = selectedComponent.currentItem.u_defect_category3;
		} else {
			$scope.ticketform.u_defect_category3 = '';
		}
	};
	/**
	 *Show the spare parts as view if its already uploaded.
	 */
	$scope.onShowViewSpareParts = function() {
		Utils.showPleaseWait(pleaseWait);
		//fetch the record from the saved database.
		var ssoid = $localstorage.get('SN-LOGIN-SSO');
		if (ssoid && ssoid.length > 0) {
			var refTicketId = $scope.ticketform.number;
			if (refTicketId && refTicketId.length > 0) {
				database.getUploadedSpareParts(ssoid, refTicketId, function(result) {
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
			$scope.spareParts.u_replacement_part_text2 = '';
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
			$scope.spareParts.u_replacement_part_text3 = '';
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
	};

	$scope.onSparePartsUpload = function() {
		if ($scope.ticketform.u_defect_category2.label && $scope.ticketform.u_defect_category2.label.length > 0 && $scope.spareParts.u_1_quantity < 1) {
			if ($scope.spareParts.u_1_quantity < 1 || $scope.spareParts.u_1_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2.label);
				return;
			}
		}

		if ($scope.ticketform.u_defect_category2_2.label && $scope.ticketform.u_defect_category2_2.label.length > 0 && $scope.spareParts.u_2_quantity < 1) {

			if ($scope.spareParts.u_2_quantity < 1 || $scope.spareParts.u_2_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_2.label);
				return;
			}
		}

		if ($scope.ticketform.u_defect_category2_3.label && $scope.ticketform.u_defect_category2_3.label.length > 0 && $scope.spareParts.u_3_quantity < 1) {
			if ($scope.spareParts.u_3_quantity < 1 || $scope.spareParts.u_3_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_3.label);
				return;
			}
		}

		if ($scope.ticketform.u_defect_category2_4.label && $scope.ticketform.u_defect_category2_4.label.length > 0 && $scope.spareParts.u_4_quantity < 1) {
			if ($scope.spareParts.u_4_quantity < 1 || $scope.spareParts.u_4_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_4.label);
				return;
			}
		}

		if ($scope.ticketform.u_defect_category2_5.label && $scope.ticketform.u_defect_category2_5.label.length > 0 && $scope.spareParts.u_5_quantity < 1) {
			if ($scope.spareParts.u_5_quantity < 1 || $scope.spareParts.u_5_quantity > 99) {
				Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_5.label);
				return;
			}
		}
		//console.log($scope.spareParts.u_quantity_add.toString().charAt(0))
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

		if ($scope.ticketform.u_defect_category2.label && $scope.ticketform.u_defect_category2.label.length > 0) {
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

		/*		if ($scope.ticketform.u_defect_category2_2.label && $scope.ticketform.u_defect_category2_2.label.length > 0) {
		 if (!($scope.spareParts.u_2_quantity > 0 && $scope.spareParts.u_2_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_2.label);
		 return;
		 }
		 }

		 if ($scope.ticketform.u_defect_category2_3.label && $scope.ticketform.u_defect_category2_3.label.length > 0) {
		 if (!($scope.spareParts.u_3_quantity > 0 && $scope.spareParts.u_3_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_3.label);
		 return;
		 }
		 }

		 if ($scope.ticketform.u_defect_category2_4.label && $scope.ticketform.u_defect_category2_4.label.length > 0) {
		 if (!($scope.spareParts.u_4_quantity > 0 && $scope.spareParts.u_4_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_4.label);
		 return;
		 }
		 }

		 if ($scope.ticketform.u_defect_category2_5.label && $scope.ticketform.u_defect_category2_5.label.length > 0) {
		 if (!($scope.spareParts.u_5_quantity > 0 && $scope.spareParts.u_5_quantity < 1000)) {
		 Utils.showAlert(sparePartQtyvalidationFaildMessage + ' for spare part component ' + $scope.ticketform.u_defect_category2_5.label);
		 return;
		 }
		 } else {
		 $scope.ticketform.u_defect_category2_5.label = ''
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
					"u_ticket_number" : "" + $scope.ticketform.sys_id,
					"number" : "" + $scope.ticketform.number,
					"spare_number" : "",
					"u_1_component" : "" + $scope.ticketform.u_defect_category2.label,
					"u_1_spare_part" : "" + $scope.spareParts.u_1_spare_part,
					"u_1_sap_part__" : "" + $scope.spareParts.u_1_sap_part__,
					"u_1_quantity" : "" + $scope.spareParts.u_1_quantity,
					"u_2_component" : "" + $scope.ticketform.u_defect_category2_2.label,
					"u_2_spare_part" : "" + $scope.spareParts.u_2_spare_part,
					"u_2_sap_part__" : "" + $scope.spareParts.u_2_sap_part__,
					"u_2_quantity" : "" + $scope.spareParts.u_2_quantity,
					"u_3_component" : "" + $scope.ticketform.u_defect_category2_3.label,
					"u_3_spare_part" : "" + $scope.spareParts.u_3_spare_part,
					"u_3_sap_part__" : "" + $scope.spareParts.u_3_sap_part__,
					"u_3_quantity" : "" + $scope.spareParts.u_3_quantity,
					"u_4_component" : "" + $scope.ticketform.u_defect_category2_4.label,
					"u_4_spare_part" : "" + $scope.spareParts.u_4_spare_part,
					"u_4_sap_part__" : "" + $scope.spareParts.u_4_sap_part__,
					"u_4_quantity" : "" + $scope.spareParts.u_4_quantity,
					"u_5_component" : "" + $scope.ticketform.u_defect_category2_5.label,
					"u_5_spare_part" : "" + $scope.spareParts.u_5_spare_part,
					"u_5_sap_part__" : "" + $scope.spareParts.u_5_sap_part__,
					"u_5_quantity" : $scope.spareParts.u_5_quantity,
					"u_sap_part___add" : "" + $scope.spareParts.u_replacement_part_text,
					"u_spare_part_add" : "" + $scope.spareParts.u_spare_part_add,
					"u_quantity_add" : "" + $scope.spareParts.u_quantity_add,
					"u_delivery_address" : "" + $scope.spareParts.u_delivery_address,
					"u_ship_to" : "" + $scope.spareParts.u_ship_to,
					"u_expected_date" : "" + $scope.spareParts.u_expected_date,
					"u_csc_mail_address" : "" + $scope.spareParts.u_csc_mail_address,
					"u_email" : "" + $scope.spareParts.u_email,
					"u_local_save_time" : "" + n,
					"u_local_ticket_id" : "" + $scope.ticketform.number,
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
								$rootScope.onBackPress();
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
								$rootScope.onBackPress();
							});
						} else {
							//Save it locally for future upload process
							var d = new Date();
							var savedTimeStamp = d.getTime();
							var tempTicketId = $scope.ticketform.number + "_OSP";
							reqData.u_local_save_time = savedTimeStamp;
							database.storePendingTicket(tempTicketId, ssoid, "MY_SPARE_PART", savedTimeStamp, reqData, function(status) {
								$scope.ticketform = {};
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

	$scope.orderSparePartDefectItems = function() {

		if ($scope.isGrpExist == false) {
			Utils.showAlert(orderSpareGroupNotExist);
		} else {

			//First Check if any pending form present.
			Utils.showPleaseWait('Please Wait...');
			var ssoid = $localstorage.get('SN-LOGIN-SSO');
			if (ssoid && ssoid.length > 0) {
				if ($scope.ticketform && $scope.ticketform.number && $scope.ticketform.number.length > 0) {
					database.getPendingTicketBasedonTicketIdAndUserId($scope.ticketform.number + '_OSP', ssoid, function(record) {
						if (record && record.length > 0) {
							if (record[0].number == $scope.ticketform.number) {
								Utils.hidePleaseWait();
								Utils.showAlert(sparePartAlreadyPending);
							}
						} else {
							$timeout(function() {
								$scope.spareParts.u_ship_to = $scope.ticketform.u_ship_sold_to;
								//Fetch the Defect Heir from Data base.
								if ($scope.defectList && $scope.defectList.length > 0) {
									$scope.orderSpareParts.sparePartButtonHide = 'true';
									$scope.setSpareItems($scope.defectList);
									$scope.$apply();
									Utils.hidePleaseWait();
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
				}
			}
		}
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

	/**
	 *Submit the ticket works only for comments
	 */
	$scope.ticketSubmit = function(escalate) {
		if ($scope.ticketform/* && $scope.ticketform.additionalComments && $scope.ticketform.additionalComments.length > 0*/) {
			if ($scope.ticketform.u_defect_category1) {
				if (!$scope.ticketform.u_defect_category2 || !$scope.ticketform.u_defect_category3) {
					Utils.showAlert("Defect Category 1 is empty");
					return;
				}
			}

			if ($scope.ticketform.u_defect_category1_2) {
				if (!$scope.ticketform.u_defect_category2_2 || !$scope.ticketform.u_defect_category3_2) {
					Utils.showAlert("Defect Category 2 is empty");
					return;
				}
			}

			if ($scope.ticketform.u_defect_category1_3) {
				if (!$scope.ticketform.u_defect_category2_3 || !$scope.ticketform.u_defect_category3_3) {
					Utils.showAlert("Defect Category 3 is empty");
					return;
				}
			}

			if ($scope.ticketform.u_defect_category1_4) {
				if (!$scope.ticketform.u_defect_category2_4 || !$scope.ticketform.u_defect_category3_4) {
					Utils.showAlert("Defect Category 4 is empty");
					return;
				}
			}

			if ($scope.ticketform.u_defect_category1_5) {
				if (!$scope.ticketform.u_defect_category2_5 || !$scope.ticketform.u_defect_category3_5) {
					Utils.showAlert("Defect Category 5 is empty");
					return;
				}
			}

			var ssoid = $localstorage.get('SN-LOGIN-SSO');

			if (ssoid) {
				database.getUserInfo(ssoid, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var userProfile = result.rows.item(0);
						var userProfileAccessJSON = angular.fromJson(Tea.decrypt(userProfile.UserInfo, $rootScope.dbpasscode));
						var reqData = {};

						if ($scope.ticketform.additionalComments && $scope.ticketform.additionalComments.length > 0) {
							reqData.comments = commentBy + userProfileAccessJSON.login_user_name_sso + ' : ' + $scope.ticketform.additionalComments;
						}

						if (escalate && escalate.length > 0) {
							reqData.u_escalate_flag = "true";
							$scope.ticketform.u_escalate_flag = "true";
						}
						$scope.oldticketform = angular.fromJson($localstorage.get('TICKET_EDIT_MODE'));

						if ($scope.oldticketform.u_status != $scope.ticketform.u_status) {
							reqData.u_status = $scope.ticketform.u_status;
						}
						if ($scope.oldticketform.u_src_solved != $scope.ticketform.u_src_solved) {
							reqData.u_src_solved = $scope.ticketform.u_src_solved;
						}
						if ($scope.oldticketform.u_priority != $scope.ticketform.u_priority) {
							reqData.u_priority = $scope.ticketform.u_priority;
						}
						if ($scope.oldticketform.u_short_description != $scope.ticketform.u_short_description) {
							reqData.u_short_description = $scope.ticketform.u_short_description;
						}
						if ($scope.oldticketform.description != $scope.ticketform.description) {
							reqData.description = $scope.ticketform.description;
						}
						if ($scope.oldticketform.u_issue_start_date != $scope.ticketform.u_issue_start_date) {
							reqData.u_issue_start_date = $scope.ticketform.u_issue_start_date;
						}
						if ($scope.oldticketform.u_issue_end_date != $scope.ticketform.u_issue_end_date) {
							reqData.u_issue_end_date = $scope.ticketform.u_issue_end_date;
						}

						if ($scope.ticketform.u_defect_category1) {
							reqData.u_defect_category1 = $scope.ticketform.u_defect_category1.label;
							reqData.u_defect_category2 = $scope.ticketform.u_defect_category2.label;
							reqData.u_defect_category3 = $scope.ticketform.u_defect_category3.label;
						} else {
							reqData.u_defect_category1 = "";
							reqData.u_defect_category2 = "";
							reqData.u_defect_category3 = "";
						}

						if ($scope.ticketform.u_defect_category1_2) {
							reqData.u_defect_category_2 = $scope.ticketform.u_defect_category1_2.label;
							reqData.u_defect_category1_2 = $scope.ticketform.u_defect_category1_2.label;
							reqData.u_defect_category2_2 = $scope.ticketform.u_defect_category2_2.label;
							reqData.u_defect_category3_2 = $scope.ticketform.u_defect_category3_2.label;
						} else {
							reqData.u_defect_category_2 = "";
							reqData.u_defect_category1_2 = "";
							reqData.u_defect_category2_2 = "";
							reqData.u_defect_category3_2 = "";
						}

						if ($scope.ticketform.u_defect_category1_3) {
							reqData.u_defect_category_3 = $scope.ticketform.u_defect_category1_3.label;
							reqData.u_defect_category1_3 = $scope.ticketform.u_defect_category1_3.label;
							reqData.u_defect_category2_3 = $scope.ticketform.u_defect_category2_3.label;
							reqData.u_defect_category3_3 = $scope.ticketform.u_defect_category3_3.label;
						} else {
							reqData.u_defect_category_3 = "";
							reqData.u_defect_category1_3 = "";
							reqData.u_defect_category2_3 = "";
							reqData.u_defect_category3_3 = "";
						}

						if ($scope.ticketform.u_defect_category1_4) {
							reqData.u_defect_category_4 = $scope.ticketform.u_defect_category1_4.label;
							reqData.u_defect_category1_4 = $scope.ticketform.u_defect_category1_4.label;
							reqData.u_defect_category2_4 = $scope.ticketform.u_defect_category2_4.label;
							reqData.u_defect_category3_4 = $scope.ticketform.u_defect_category3_4.label;
						} else {
							reqData.u_defect_category_4 = "";
							reqData.u_defect_category1_4 = "";
							reqData.u_defect_category2_4 = "";
							reqData.u_defect_category3_4 = "";
						}

						if ($scope.ticketform.u_defect_category1_5) {
							reqData.u_defect_category_5 = $scope.ticketform.u_defect_category1_5.label;
							reqData.u_defect_category1_5 = $scope.ticketform.u_defect_category1_5.label;
							reqData.u_defect_category2_5 = $scope.ticketform.u_defect_category2_5.label;
							reqData.u_defect_category3_5 = $scope.ticketform.u_defect_category3_5.label;
						} else {
							reqData.u_defect_category_5 = "";
							reqData.u_defect_category1_5 = "";
							reqData.u_defect_category2_5 = "";
							reqData.u_defect_category3_5 = "";
						}

						// Setting the Edit data for offline storage

						if ($scope.oldticketform.u_status != $scope.ticketform.u_status) {
							$scope.ticketform.u_status = $scope.ticketform.u_status;
						}
						if ($scope.oldticketform.u_src_solved != $scope.ticketform.u_src_solved) {
							$scope.ticketform.u_src_solved = $scope.ticketform.u_src_solved;
						}
						if ($scope.oldticketform.u_priority != $scope.ticketform.u_priority) {
							$scope.ticketform.u_priority = $scope.ticketform.u_priority;
						}
						if ($scope.oldticketform.u_short_description != $scope.ticketform.u_short_description) {
							$scope.ticketform.u_short_description = $scope.ticketform.u_short_description;
						}
						if ($scope.oldticketform.description != $scope.ticketform.description) {
							$scope.ticketform.description = $scope.ticketform.description;
						}
						if ($scope.oldticketform.u_issue_start_date != $scope.ticketform.u_issue_start_date) {
							$scope.ticketform.u_issue_start_date = $scope.ticketform.u_issue_start_date;
						}
						if ($scope.oldticketform.u_issue_end_date != $scope.ticketform.u_issue_end_date) {
							$scope.ticketform.u_issue_end_date = $scope.ticketform.u_issue_end_date;
						}

						if ($scope.ticketform.u_defect_category1) {
							$scope.ticketform.u_defect_category1 = $scope.ticketform.u_defect_category1.label;
							$scope.ticketform.u_defect_category2 = $scope.ticketform.u_defect_category2.label;
							$scope.ticketform.u_defect_category3 = $scope.ticketform.u_defect_category3.label;
						} else {
							$scope.ticketform.u_defect_category1 = "";
							$scope.ticketform.u_defect_category2 = "";
							$scope.ticketform.u_defect_category3 = "";
						}

						if ($scope.ticketform.u_defect_category1_2) {
							$scope.ticketform.u_defect_category_2 = $scope.ticketform.u_defect_category1_2.label;
							$scope.ticketform.u_defect_category1_2 = $scope.ticketform.u_defect_category1_2.label;
							$scope.ticketform.u_defect_category2_2 = $scope.ticketform.u_defect_category2_2.label;
							$scope.ticketform.u_defect_category3_2 = $scope.ticketform.u_defect_category3_2.label;
						} else {
							$scope.ticketform.u_defect_category_2 = "";
							$scope.ticketform.u_defect_category1_2 = "";
							$scope.ticketform.u_defect_category2_2 = "";
							$scope.ticketform.u_defect_category3_2 = "";
						}

						if ($scope.ticketform.u_defect_category1_3) {
							$scope.ticketform.u_defect_category_3 = $scope.ticketform.u_defect_category1_3.label;
							$scope.ticketform.u_defect_category1_3 = $scope.ticketform.u_defect_category1_3.label;
							$scope.ticketform.u_defect_category2_3 = $scope.ticketform.u_defect_category2_3.label;
							$scope.ticketform.u_defect_category3_3 = $scope.ticketform.u_defect_category3_3.label;
						} else {
							$scope.ticketform.u_defect_category_3 = "";
							$scope.ticketform.u_defect_category1_3 = "";
							$scope.ticketform.u_defect_category2_3 = "";
							$scope.ticketform.u_defect_category3_3 = "";
						}

						if ($scope.ticketform.u_defect_category1_4) {
							$scope.ticketform.u_defect_category_4 = $scope.ticketform.u_defect_category1_4.label;
							$scope.ticketform.u_defect_category1_4 = $scope.ticketform.u_defect_category1_4.label;
							$scope.ticketform.u_defect_category2_4 = $scope.ticketform.u_defect_category2_4.label;
							$scope.ticketform.u_defect_category3_4 = $scope.ticketform.u_defect_category3_4.label;
						} else {
							$scope.ticketform.u_defect_category_4 = "";
							$scope.ticketform.u_defect_category1_4 = "";
							$scope.ticketform.u_defect_category2_4 = "";
							$scope.ticketform.u_defect_category3_4 = "";
						}

						if ($scope.ticketform.u_defect_category1_5) {
							$scope.ticketform.u_defect_category_5 = $scope.ticketform.u_defect_category1_5.label;
							$scope.ticketform.u_defect_category1_5 = $scope.ticketform.u_defect_category1_5.label;
							$scope.ticketform.u_defect_category2_5 = $scope.ticketform.u_defect_category2_5.label;
							$scope.ticketform.u_defect_category3_5 = $scope.ticketform.u_defect_category3_5.label;
						} else {
							$scope.ticketform.u_defect_category_5 = "";
							$scope.ticketform.u_defect_category1_5 = "";
							$scope.ticketform.u_defect_category2_5 = "";
							$scope.ticketform.u_defect_category3_5 = "";
						}
						$scope.ticketform.ticketId = $scope.ticketform.sys_id;

						if ($rootScope.isOnline()) {
							Utils.showPleaseWait(pleaseWait);
							var promise = applicationServices.updateComments($scope.ticketform.sys_id, reqData);
							promise.then(function(payload) {
								if (payload && payload.status == 200) {
									Utils.hidePleaseWait();
									$rootScope.onBackPress();
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
								var n = d.getTime();
								$scope.ticketform.savedTS = "" + n;
								if ($scope.ticketform.additionalComments && $scope.ticketform.additionalComments.length > 0) {
									$scope.ticketform.comments = commentBy + userProfileAccessJSON.login_user_name_sso + ' : ' + $scope.ticketform.additionalComments;
								}
								database.storePendingTicket($scope.ticketform.sys_id, ssoid, "MY_GROUP_EDIT", $scope.ticketform.savedTS, $scope.ticketform, function(status) {
									$scope.ticketform = {};
									$rootScope.onBackPress();
								});
							} else {
								//Save it locally for future upload process
								var d = new Date();
								var n = d.getTime();
								$scope.ticketform.savedTS = "" + n;
								if ($scope.ticketform.additionalComments && $scope.ticketform.additionalComments.length > 0) {
									$scope.ticketform.comments = commentBy + userProfileAccessJSON.login_user_name_sso + ' : ' + $scope.ticketform.additionalComments;
								}

								database.storePendingTicket($scope.ticketform.sys_id, $scope.ticketform['opened_by.user_name'], "EDIT", $scope.ticketform.savedTS, $scope.ticketform, function(status) {
									$scope.ticketform = {};
									$rootScope.onBackPress();
								});
							}
						}
					}
				});
			}
		} else {
			//Utils.showAlert(additionalCommentsEmpty);
		}
	};

	$scope.orderSpareParts.sparePartButton = 'true';
	if ($scope.savedTicketForm && $scope.savedTicketForm.length > 0) {
		$scope.orderSpareParts.sparePartButton = 'true';
	} else {
		$scope.orderSpareParts.sparePartButton = 'false';
	}

	/**
	 * Fetch the warranty date from account hierarchy table based on Cam serial number
	 */

	if ($scope.savedTicketForm && $scope.savedTicketForm.length > 0) {
		Utils.getSavedDBAccountHierarchyAll(database, Utils, function(data, nongroupdata) {
			if (data && data.length > 0) {
				if (nongroupdata && nongroupdata.length > 0) {
					for (var i = 0; i < nongroupdata.length; i++) {
						if (nongroupdata[i].u_asset_number == $scope.ticketform["u_asset_number.u_asset_number"]) {
							//console.log(nongroupdata[i])
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
			if (tktDetail.u_issue_type == 'Log') {
				var ticketCountry = tktDetail.u_country;
			} else {
				var ticketCountry = tktDetail["u_asset_number.u_country"];
			}
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

					if (diffDays <= 90) {// Under Warranty

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
					} else {// Without warranty

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
					// If warranty date is not available
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
			}

		});
	}
});
