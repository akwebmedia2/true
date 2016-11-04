/**
 *Controller for feedback module
 */
angular.module('TrueSense.controllers').controller('reportsCntrl', function($scope, $timeout, Utils, database, $ionicScrollDelegate, applicationServices, $localstorage, $rootScope, $state, databasecache, $http) {
	$scope.$parent.$parent.$parent.app_page_title = feedbackTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.feedbackform = {};
	$scope.show_section = {};
	$scope.reportsData = {};
	$scope.feedback = {};
	$rootScope.setupHttpAuthHeader();
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');
	/**
	 * On Off Accordion
	 * @param {Object} section : Section name
	 * @param {Object} $event : Event
	 */
	$scope.section_click = function(section, id) {
		for (var i = 1; i < 6; i++) {
			if (id != i) {
				$scope.show_section[section + i] = false;
			}
		}
		$scope.show_section[section + id] = !$scope.show_section[section + id];
		$scope.$broadcast('scroll.resize');
	};

	$scope.isOnline = $rootScope.isOnline();
	var ssoid = $localstorage.get('SN-LOGIN-SSO');

	/**
	 * Submit the feedback for Report a bug
	 * @param {Object} descText : Bug description entered by end user
	 */
	
	try {
			database.getCompletedTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).IsGroupTkt == 'false') {
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
						}
					}
					//console.log('open');
					
				//	console.log(compltedTaskArray.length);
					$scope.reportsData.openTickets = compltedTaskArray.length;					
				} else {
					
					$scope.reportsData.openTickets = 0;
				}
			});
		} catch(e) {
			
		}
		
		
		
		try {
			database.getClosedTickets(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var compltedTaskArray = [];
					var serviceTickets = [];
					for (var i = 0; i < result.rows.length; i++) {
						if (result.rows.item(i).UserId == ssoid) {
							compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).closedTicketData, $rootScope.dbpasscode)));
							if(compltedTaskArray[i].u_issue_type == "Log"){
								serviceTickets.push(compltedTaskArray[i])
							}
						}
					}
					
					$scope.reportsData.closedTickets = serviceTickets.length;
					//console.log('log');
					//console.log($scope.closedTickets.length);

				} else {
					$scope.reportsData.closedTickets = 0;
					$scope.completedItems = '';					
				}

			});
		} catch(e) {
			
		}
		
		
	
	try {
			database.getPendingTickets(ssoid, function(result) {
				$scope.pendingListItemsNonGroup = [];
				$scope.pendingSPItems = [];
				$scope.pendingODRSPItems = [];
				if (result && result.rows && result.rows.length > 0) {
					for (var i = result.rows.length - 1; i >= 0; i--) {
						var tktData = angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode));
						tktData.Type = result.rows.item(i).Type;
						if (result.rows.item(i).UserId == ssoid && result.rows.item(i).Type != "ACCOUNTHIERARCHY" && result.rows.item(i).Type != 'MY_GROUP_EDIT' && result.rows.item(i).Type != 'MY_SPARE_PART' && result.rows.item(i).Type != 'ORDER_SPARE_PART' && result.rows.item(i).Type != 'CORRECTION' && result.rows.item(i).Type != 'MY_GROUP_SPARE_PART' && result.rows.item(i).Type != 'CLOSED_TICKET' && result.rows.item(i).Type != 'SERVICE_REPORT') {
							$scope.pendingListItemsNonGroup.push(tktData);
						}
						

					}

					$scope.pendingItemsNonGroup = [];
					console.log('pending')
					console.log($scope.pendingListItemsNonGroup)
					$scope.reportsData.PendingTickets = $scope.pendingListItemsNonGroup.length;
				} else {
					
										
						$scope.reportsData.PendingTickets = 0;						
						$scope.$apply();
						//this triggers a $digest
					
				}
			});
		} catch(e) {
		}
	
	
	
		database.getSparePartsData(ssoid, function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var spareOrder = [];							
					for (var i = 0; i < result.rows.length; i++) {											
							spareOrder.push(angular.fromJson(Tea.decrypt(result.rows.item(i).spareData, $rootScope.dbpasscode)));						
					}
					console.log('order');
					console.log(spareOrder.length)
					$scope.reportsData.sparePart = spareOrder.length;
						console.log($scope.reportsData.sparePart)
				} else {
					$scope.reportsData.sparePart = 0;
				}
		});
	
	
	
	 var myConfig = {
      "type": "pie",
      "title": {
        "text": "Pie Charts"
      },
      "series": [{
        "values": [20]
      }, {
        "values": [20]
      }, {
        "values": [20]
      }, {
        "values": [20]
      }, {
        "values": [20]
      }]
    };

    zingchart.render({
      id: 'myChart',
      data: myConfig,
      height: 400,
      width: "100%"
    });
	
});
