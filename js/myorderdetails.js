/**
 *COntroller of the open spare form in edit mode.
 */
angular.module('TrueSense.controllers').controller('myorderdetailsCtrl', function($scope, $ionicScrollDelegate, Utils, $filter, $rootScope, database, $parse, $http, $localstorage, $timeout, applicationServices, $state) {
	$scope.$parent.$parent.$parent.app_page_title = 'My Order Details';
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.show_section = {};
	$scope.vespareParts = {};
	

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
	
	//Get the selected Spare Part and set the form based on the last saved value.
	var viewEditSPDetails =$localstorage.get('SPARE_PART_EDIT_MODE');	
	
	if (viewEditSPDetails && viewEditSPDetails.length > 0) {
		var viewEditSPDetailsObj = angular.fromJson(viewEditSPDetails);
		
		if (viewEditSPDetailsObj && viewEditSPDetailsObj.u_number && viewEditSPDetailsObj.u_number.length > 0) {
			$scope.tempData = viewEditSPDetailsObj;
			$scope.vespareParts = viewEditSPDetailsObj;			
			if($scope.vespareParts.u_critical == 'true'){
				$scope.vespareParts.u_critical = true;
			} else {
				$scope.vespareParts.u_critical = false;
			}
		}
	}
	
	


$scope.isInvalidCheck = function(field) {
		try {
			var data = $scope.$eval($parse(field));			
			if (data && data.length > 0 && (data.length == 10 || data.length == 6)) {
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

	



	

});
