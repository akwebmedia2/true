/**
 *Controller for home landing page
 */
angular.module('TrueSense.controllers').controller('myorderSparePart', function($scope, $rootScope, Utils, database, $state, $localstorage, $timeout, applicationServices, $q, databasecache, pendingTicketUploadProcess, $window, $http) {

	$scope.$parent.$parent.$parent.app_page_title = "My Orders";
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
			database.getSparePartsData(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					var finalData = [];					
					for (var i = 0; i < result.rows.length; i++) {											
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).spareData, $rootScope.dbpasscode)));						
					}
					
					if(compltedTaskArray.length>0){
					for (var i = 0; i < compltedTaskArray.length; i++) {						
						if(compltedTaskArray[i].u_delivery_date){							
							var currentCalDate = Utils.currentGMTDate();
							var orderDeliveryDate = compltedTaskArray[i].u_delivery_date;
							var orderDate = new Date(orderDeliveryDate);
							var currentDate = new Date(currentCalDate);							
							var start = Math.floor(orderDate.getTime() / (3600 * 24 * 1000));						
							var end = Math.floor(currentDate.getTime() / (3600 * 24 * 1000));						
							var diffDays = end - start;
							var validData = compltedTaskArray[i]["u_opened_by.name"].indexOf(ssoid);							
							if (validData > 0 && diffDays <= 14) {								
								finalData.push(compltedTaskArray[i]);
							}
						} else {
							finalData.push(compltedTaskArray[i]);
						}
						
					}
					}
				//	console.log(compltedTaskArray)
					$scope.noTicketFound = false;
					$scope.completedItems = finalData;
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
		$http.get($rootScope.baserootURL + 'api/now/table/u_order_spare_parts?sysparm_query=u_opened_by.user_name=' + ssoid + '^ORDERBYDESCsys_created_on&sysparm_limit=10&sysparm_fields=u_number,u_order_status,u_opened_by.name,u_1_component,u_1_spare_part,u_1_sap_part__,u_1_quantity,u_2_component,u_2_spare_part,u_2_sap_part__,u_2_quantity,u_3_component, u_3_spare_part,u_3_sap_part__,u_3_quantity,u_4_component,u_4_spare_part,u_4_sap_part__,u_4_quantity,u_5_component,u_5_spare_part,u_5_sap_part__,u_5_quantity,u_sap_part___add,u_spare_part_add,u_quantity_add,u_sap_part_desc_2,u_sap_part_num_2,u_sap_part_qty_2,u_sap_part_desc_3,u_sap_part_num_3,u_sap_part_qty_3,u_sap_part_desc_4,u_sap_part_num_4,u_sap_part_qty_4,u_sap_part_desc_5,u_sap_part_num_5,u_sap_part_qty_5,u_delivery_address,u_ship_to,u_expected_date,u_csc_mail_address,u_email,u_critical,u_sales_order_number,u_confirmed_delivery_date,sys_id,u_delivery_date').success(function(data, status, headers, config) {
			if (data && status == 200 && data.result && data.result.length > 0) {								
					$scope.closedData = data.result;					
					database.deleteOldSpareData(ssoid, function(tmpdata) {
						database.storeSpareData(data.result, ssoid, function(data) {	
							$scope.createUI(ssoid);
						});
					});				
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
		//console.log(details)
		$localstorage.set('SPARE_PART_EDIT_MODE', angular.toJson(details));
		$state.go('eventmenu.myorderdetails');
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

});
