/**
 *Controller for account hierarchy
 */
angular.module('TrueSense.controllers').controller('accounthierarchyCtrl', function($scope, $ionicScrollDelegate, $localstorage, applicationServices, $rootScope, Utils, database, $state) {
	$scope.$parent.$parent.$parent.app_page_title = accountHierarchyTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.data = {};
	$scope.groups = [];
	$scope.pendingItems = [];
	$scope.items = [];
	$scope.groupss = null;
	$scope.searchItems = null;
	$scope.noMoreItemsAvailable = false;
	$scope.noMoreSearchItemsAvailable = false;
	$scope.noRecordFound = false;
	$rootScope.setupHttpAuthHeader();
	$localstorage.set('PARTIAL_FORM_DATA', '');
	$localstorage.set('PARTIAL_FORM_DATA_LOG', '');
	$localstorage.set('Partial_Account_Hieararchy_New', '');
	$localstorage.set('Partial_Account_Hieararchy_Log', '');
	$localstorage.set('Partial_Account_Hieararchy_Correction', '');
	$localstorage.set('Partial_Account_Hieararchy_Report', '');

	var countryCodeT = $localstorage.get('USERS_COUNTRY_TEMP');
	var countryCode = $localstorage.get('USERS_COUNTRY');
	if (countryCodeT) {
		$rootScope.usersCountryCode = countryCodeT;
	} else if (countryCode && $rootScope.allCountry != true) {
		$rootScope.usersCountryCode = countryCode;
	} else {
		$rootScope.usersCountryCode = '';
	}

	/**
	 * Load more data on page scroll
	 */
	$scope.loadMore = function() {
		if ($scope.groupss && $scope.groupss.length > 0) {
			$scope.items.push({
				cityname : $scope.groupss[$scope.items.length].label,
				groupedItems : $scope.groupss[$scope.items.length].groupedItems
			});
			if ($scope.items.length == $scope.groupss.length) {
				$scope.noMoreItemsAvailable = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	};

	/**
	 * Get the saved account hierarchy information from database
	 */
	Utils.getSavedDBAccountHierarchy(database, Utils, function(data, nongroupdata) {
		if (data && data.length > 0) {
			$scope.groupss = data;
			$scope.loadMore();
			if (nongroupdata && nongroupdata.length > 0) {
				$scope.searchItems = nongroupdata;
				//console.log($scope.searchItems)
			}
			Utils.hidePleaseWait();
		} else {
			$scope.noRecordFound = true;
			Utils.hidePleaseWait();
			$scope.noMoreItemsAvailable = true;
		}
	});

	/**
	 * Open the respective account hierarchy form page
	 */
	$scope.showAccountHierarchyDetails = function(selectedItem, accountMode) {
		$localstorage.set('SELECTED_ACCOUNT', angular.toJson(selectedItem));
		$localstorage.set('SELECTED_ACCOUNT_MODE', accountMode);
		$state.go('eventmenu.accounthierarchyform');
	};

	/**
	 * On off group accordion
	 */
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};

	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

	$scope.clearSearch = function() {
		$scope.search = '';
	};

	var ssoid = $localstorage.get('SN-LOGIN-SSO');
	if (ssoid) {
		database.getPendingTickets(ssoid, function(result) {
			if (result && result.rows && result.rows.length > 0) {
				for (var i = result.rows.length - 1; i >= 0; i--) {
					if (result.rows.item(i) && result.rows.item(i).Type && result.rows.item(i).Type == 'ACCOUNTHIERARCHY') {
						//console.log(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)))
						$scope.pendingItems.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
					}
				}
				$scope.pendingAccountItems = $scope.pendingItems;
				//console.log($scope.pendingAccountItem)
			}
		});
	}

});
