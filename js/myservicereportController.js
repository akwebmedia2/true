/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('myservicereportCntrl', function($scope, $rootScope, Utils, database, $state, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http) {

	$scope.$parent.$parent.$parent.app_page_title = "Service Report";
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.pendingItems = [];
	$scope.noPendingTicket = 'false';
	$rootScope.setupHttpAuthHeader();
	Utils.showPleaseWait(pleaseWait);
	var ssoid = $localstorage.get('SN-LOGIN-SSO')
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	
	/**
	 * Update the UI based on Database data
	 */
	$scope.createUI = function(ssoid) {
		try {
			database.getClosedTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					var serviceTickets = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).UserId == ssoid) {							
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).closedTicketData, $rootScope.dbpasscode)));
							if(compltedTaskArray[i].u_issue_type == "Service"){
								serviceTickets.push(compltedTaskArray[i])
							}
						}
					}
					$scope.noTicketFound = false;
					$scope.completedItems = serviceTickets;
					Utils.hidePleaseWait();


				} else {
					$scope.noTicketFound = true;
					$scope.completedItems = '';
					if ($rootScope.isOnline()) {// Do not hide the please wait message if online is true
					} else {
						Utils.hidePleaseWait();
					}
				}

			});
		} catch(e) {
			Utils.hidePleaseWait();
		}
	};

	/**
	 * Fetch the Closed ticket details from web service
	 */
	if ($rootScope.isOnline() && ssoid && ssoid.length > 0) {
		$scope.createUI(ssoid);
		Utils.showPleaseWait(pleaseWait);
		$http.get($rootScope.baserootURL + 'api/now/table/u_true_sense_process?sysparm_query=u_status=Closed^opened_by.user_name=' + ssoid + '^ORclosed_by.user_name="+ ssoid +"^ORDERBYDESCclosed_at&sysparm_limit=12&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,u_short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,sys_updated_on,u_additional_comment_mobile,u_order_spare_part_flag,u_account_manager,u_account_manager.name,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_account_manager.email,u_asset_number.u_asset_number,u_asset_type,u_market_sector,u_dsc_true_connection,u_country,u_service_report_flag,u_service_report,u_issue_type').success(function(data, status, headers, config) {
			if (data && status == 200 && data.result && data.result.length > 0) {
				if (data.result.length > 0) {
					$scope.closedData = data.result;
					//console.log($scope.closedData)
					database.deleteOldClosedTickets(ssoid, function(tmpdata) {
						database.storeClosedTickets(data.result, ssoid, function(data) {
						
						/**
							 * Get order spare parts details for closed tickets
							 */
							var itemsWithSpareParts = [];
							var allItems = $scope.closedData;
							for (var iTm = 0; iTm < allItems.length; iTm++) {
								if (allItems[iTm].u_order_spare_part_flag == 'true') {
									itemsWithSpareParts.push(allItems[iTm].number);
								}
							}

							if (itemsWithSpareParts && itemsWithSpareParts.length > 0) {
								var serviceRequestData = itemsWithSpareParts.join();
								var sparePartsPromise = applicationServices.fetchOrderSpareParts(serviceRequestData);
								sparePartsPromise.then(function(payload) {
									if (payload) {
										if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
											//Save the sparePart Records into the database
											database.deleteAllUploadedClosedSpareParts(ssoid, function(status) {
												database.storeBulkClosedSpareParts(payload.data.result, ssoid, function(status) {
												});
											});

										}
									}
								}, function(errorPayload) {
								});
							}
							$scope.createUI(ssoid);
						});
					});
				} else {
					Utils.hidePleaseWait();
				}
			} else {
				Utils.hidePleaseWait();
			}			
		}).error(function(data, status, headers, config) {
			//console.log(data.error.message)
			if (data && status == 404 && data.error.message == 'No Record found') {
				database.deleteOldClosedTickets(ssoid, function(tmpdata) {
					$scope.noTicketFound = true;
					Utils.hidePleaseWait();
					$scope.createUI(ssoid);

				});
			} else {
				Utils.showAlert("Not able to fetch the updated record");
				Utils.hidePleaseWait();
				$scope.createUI(ssoid);
			}
		});
	} else {
		$scope.createUI(ssoid);
	}

	/**
	 * Save the clicked ticket details in lcoal storage
	 */
	$scope.ticketDetailsPage = function(details, type) {
		$localstorage.set('CLOSED_TICKET_DETAIL', angular.toJson(details));
		$state.go('eventmenu.myservicereportdetail');
	};

	/**
	 *Show ticket details page for offline
	 */
	$scope.serviceReportDetailsPage = function(details, type) {
		$localstorage.set('TICKET_EDIT_MODE', angular.toJson(details));
		$localstorage.set('TICKET_TYPE', angular.toJson(type));
		$localstorage.set('TICKET_EDIT_FROM', 'MY_TICKET');
		$state.go('eventmenu.logticketdetailoffline');
	};

	var ssoid = $localstorage.get('SN-LOGIN-SSO');
	if (ssoid) {

		database.getPendingTickets(ssoid, function(result) {
			if (result && result.rows && result.rows.length > 0) {
				for (var i = result.rows.length - 1; i >= 0; i--) {
					if (result.rows.item(i) && result.rows.item(i).Type && result.rows.item(i).Type == 'SERVICE_REPORT') {
						//console.log(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)))
						$scope.pendingItems.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
					}
				}
				$scope.pendingItemsNonGroup = $scope.pendingItems;
				//console.log($scope.pendingItemsNonGroup.length)
				if($scope.pendingItemsNonGroup.length <= 0){
				//console.log($scope.pendingItemsNonGroup.length)
					$scope.noPendingTicket = 'true';
				}
				

			} else {
				$scope.pendingItemsNonGroup = "";
				//$scope.noPendingTicket = 'true';
			}

		});
	}

});
