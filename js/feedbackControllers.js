/**
 *Controller for feedback module
 */
angular.module('TrueSense.controllers').controller('feedbackCtrl', function($scope, $timeout, Utils, database, $ionicScrollDelegate, applicationServices, $localstorage, $rootScope, $state, databasecache, $http) {
	$scope.$parent.$parent.$parent.app_page_title = feedbackTitle;
	$scope.$parent.$parent.$parent.showBackButton = 'showBackButton';
	$scope.$parent.$parent.$parent.showLogo = '';
	$scope.$parent.$parent.$parent.app_page_title_subtitle = '';
	$scope.feedbackform = {};
	$scope.show_section = {};
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
	$scope.reportbug = function(descText) {
		if (descText && descText.length > 0) {
			if (ssoid) {
				$scope.feedbackform.opened_by = ssoid;
				$scope.feedbackform.short_description = shortDescBug;
				$scope.feedbackform.description = descText;
				Utils.showPleaseWait(pleaseWait);
				$http({
					method : 'POST',
					url : $rootScope.baserootURL + 'api/now/import/u_paas_incident_module_stage?sysparm_input_display_value=true',
					data : $scope.feedbackform,
					headers : {
						'Content-Type' : 'application/json',
						'Accept' : 'application/json',
					},
				}).success(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					if (data.result[0].status != 'error') {
						if (data && data.result[0] && data.result[0].display_value.length > 0) {
							$scope.feedbackId = data.result[0].display_value;
							Utils.showAlert(yourBugReport + $scope.feedbackId + feedbackSubmitSuccess);
							$scope.feedback.bugDescription = "";
						}
					} else {
						Utils.hidePleaseWait();
						Utils.showAlert(unableSubmitFeedback);

					}
				}).error(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					Utils.showAlert(unableSubmitFeedback)
				});
			} else {
				Utils.showAlert(unableSubmitFeedback);
			}
		} else {
			Utils.showAlert(enterBugDes);
		}

	}
	/**
	 * Submit the feedback for Offer a suggestion
	 * @param {Object} descText : Suggestion description entered by end user
	 */
	$scope.offersuggestion = function(descText) {
		if (descText && descText.length > 0) {
			if (ssoid) {
				$scope.feedbackform.opened_by = ssoid;
				$scope.feedbackform.short_description = shortDescSuggestion;
				$scope.feedbackform.description = descText;
				Utils.showPleaseWait(pleaseWait);
				$http({
					method : 'POST',
					url : $rootScope.baserootURL + 'api/now/import/u_paas_incident_module_stage?sysparm_input_display_value=true',
					data : $scope.feedbackform,
					headers : {
						'Content-Type' : 'application/json',
						'Accept' : 'application/json',
					},
				}).success(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					if (data.result[0].status != 'error') {
						if (data && data.result[0] && data.result[0].display_value.length > 0) {
							$scope.feedbackId = data.result[0].display_value;
							Utils.showAlert(yourSuggestion + $scope.feedbackId + feedbackSubmitSuccess);
							$scope.feedback.suggestionDescription = "";
						}
					} else {
						Utils.hidePleaseWait();
						Utils.showAlert(unableSubmitFeedback);

					}
				}).error(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					Utils.showAlert(unableSubmitFeedback)
				});
			} else {
				Utils.showAlert(unableSubmitFeedback);
			}
		} else {
			Utils.showAlert(enterSuggestionDes);
		}
	}
	/**
	 * Submit the feedback for Ask a question
	 * @param {Object} descText : Question description entered by end user
	 */
	$scope.askquestion = function(descText) {
		if (descText && descText.length > 0) {
			if (ssoid) {
				$scope.feedbackform.opened_by = ssoid;
				$scope.feedbackform.short_description = shortDescQuesion;
				$scope.feedbackform.description = descText;
				Utils.showPleaseWait(pleaseWait);
				$http({
					method : 'POST',
					url : $rootScope.baserootURL + 'api/now/import/u_paas_incident_module_stage?sysparm_input_display_value=true',
					data : $scope.feedbackform,
					headers : {
						'Content-Type' : 'application/json',
						'Accept' : 'application/json',
					},
				}).success(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					if (data.result[0].status != 'error') {
						if (data && data.result[0] && data.result[0].display_value.length > 0) {
							$scope.feedbackId = data.result[0].display_value;
							// $timeout(function() {
							Utils.showAlert(yourQuestion + $scope.feedbackId + feedbackSubmitSuccess);
							// $scope.$parent.$parent.$parent.questionDescription = "";
							$scope.feedback.questionDescription = "";
							// }, 100);
						}
					} else {
						Utils.hidePleaseWait();
						// $timeout(function() {
						Utils.showAlert(unableSubmitFeedback);
						// }, 100);

					}
				}).error(function(data, status, headers, config) {
					Utils.hidePleaseWait();
					// $timeout(function() {
					Utils.showAlert(unableSubmitFeedback)
					// }, 100);

				});
			} else {
				Utils.showAlert(unableSubmitFeedback);
			}
		} else {
			Utils.showAlert(enterQuestion);
		}
	}
	
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
