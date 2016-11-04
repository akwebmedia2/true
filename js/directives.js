/**
 *Directives used in the application such as : Add/ Remove defect Category from Open ticket / issue
 */
angular.module('TrueSense.directives', ['ionic']).directive("addbuttonsbutton", function() {
	return {
		restrict : "E",
		template : "<button id='addDefect' addbuttons class='button button-small button-positive button-same-size-large'>Add Defect</button>"
	}
}).directive("removebuttonsbutton", function() {
	return {
		restrict : "E",
		template : "<button removebuttons class='button button-small button-positive button-same-size-large'>Remove Defect</button>"
	}
}).directive("addbuttons", function($compile, $injector) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var myService = $injector.get('Utils');
			//Check Condition Over here.
			try {
			//alert(scope.reportFlag)
				if (scope.reportFlag == "Service") {
					if (scope.count == 1) {
						//Check for first row .
						if (!scope.ticketform.u_defect_category1 || !scope.ticketform.u_defect_category2 || !scope.ticketform.u_defect_category3) {
							myService.showAlert("Module Category 1 is empty");
							return;
						}
					} else if (scope.count == 2) {
						if (!scope.ticketform.u_defect_category1_2 || !scope.ticketform.u_defect_category2_2 || !scope.ticketform.u_defect_category3_2) {
							myService.showAlert("Module Category 2 is empty");
							return;
						}
					} else if (scope.count == 3) {
						if (!scope.ticketform.u_defect_category1_3 || !scope.ticketform.u_defect_category2_3 || !scope.ticketform.u_defect_category3_3) {
							myService.showAlert("Module Category 3 is empty");
							return;
						}
					} else if (scope.count == 4) {
						if (!scope.ticketform.u_defect_category1_4 || !scope.ticketform.u_defect_category2_4 || !scope.ticketform.u_defect_category3_4) {
							myService.showAlert("Module Category 4 is empty");
							return;
						}
					} else if (scope.count == 5) {
						if (!scope.ticketform.u_defect_category1_5 || !scope.ticketform.u_defect_category2_5 || !scope.ticketform.u_defect_category3_5) {
							myService.showAlert("Module Category 5 is empty");
							return;
						}
					}

				}// end if
				else {
					if (scope.count == 1) {
						//Check for first row .
						if (!scope.ticketform.u_defect_category1 || !scope.ticketform.u_defect_category2 || !scope.ticketform.u_defect_category3) {
							myService.showAlert("Defect Category 1 is empty");
							return;
						}
					} else if (scope.count == 2) {
						if (!scope.ticketform.u_defect_category1_2 || !scope.ticketform.u_defect_category2_2 || !scope.ticketform.u_defect_category3_2) {
							myService.showAlert("Defect Category 2 is empty");
							return;
						}
					} else if (scope.count == 3) {
						if (!scope.ticketform.u_defect_category1_3 || !scope.ticketform.u_defect_category2_3 || !scope.ticketform.u_defect_category3_3) {
							myService.showAlert("Defect Category 3 is empty");
							return;
						}
					} else if (scope.count == 4) {
						if (!scope.ticketform.u_defect_category1_4 || !scope.ticketform.u_defect_category2_4 || !scope.ticketform.u_defect_category3_4) {
							myService.showAlert("Defect Category 4 is empty");
							return;
						}
					} else if (scope.count == 5) {
						if (!scope.ticketform.u_defect_category1_5 || !scope.ticketform.u_defect_category2_5 || !scope.ticketform.u_defect_category3_5) {
							myService.showAlert("Defect Category 5 is empty");
							return;
						}
					}
				}
			} catch(e) {
				if (scope.count == 1) {
					//Check for first row .
					if (!scope.ticketform.u_defect_category1 || !scope.ticketform.u_defect_category2 || !scope.ticketform.u_defect_category3) {
						myService.showAlert("Defect Category 1 is empty");
						return;
					}
				} else if (scope.count == 2) {
					if (!scope.ticketform.u_defect_category1_2 || !scope.ticketform.u_defect_category2_2 || !scope.ticketform.u_defect_category3_2) {
						myService.showAlert("Defect Category 2 is empty");
						return;
					}
				} else if (scope.count == 3) {
					if (!scope.ticketform.u_defect_category1_3 || !scope.ticketform.u_defect_category2_3 || !scope.ticketform.u_defect_category3_3) {
						myService.showAlert("Defect Category 3 is empty");
						return;
					}
				} else if (scope.count == 4) {
					if (!scope.ticketform.u_defect_category1_4 || !scope.ticketform.u_defect_category2_4 || !scope.ticketform.u_defect_category3_4) {
						myService.showAlert("Defect Category 4 is empty");
						return;
					}
				} else if (scope.count == 5) {
					if (!scope.ticketform.u_defect_category1_5 || !scope.ticketform.u_defect_category2_5 || !scope.ticketform.u_defect_category3_5) {
						myService.showAlert("Defect Category 5 is empty");
						return;
					}
				}
			}
			
		//	alert(scope.reportFlag)
			if(scope.reportFlag == "Service"){				
			if (scope.count < 5) {
				scope.count++;
				var idV = 'space-for-buttons' + scope.count;
				var idVID = 'space-for-buttons' + scope.count + 'ID';
				var itm1Model = 'u_defect_category1_' + scope.count;
				var itm1Mode2 = 'u_defect_category2_' + scope.count;
				var itm1Mode3 = 'u_defect_category3_' + scope.count;
				if (scope.count == 2) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange2('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_2\',\'ticketform.u_defect_category2_2\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s || u_defect_category2_2s.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange2('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_2\',\'ticketform.u_defect_category3_2\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Activity</div><select ng-disabled="!u_defect_category3_2s || u_defect_category3_2s.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange2('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 3) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange3('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_3\',\'ticketform.u_defect_category2_3\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s3 || u_defect_category2_2s3.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange3('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s3" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_3\',\'ticketform.u_defect_category3_3\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Activity</div><select ng-disabled="!u_defect_category3_2s3 || u_defect_category3_2s3.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange3('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s3" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 4) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange4('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_4\',\'ticketform.u_defect_category2_4\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s4 || u_defect_category2_2s4.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange4('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s4" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_4\',\'ticketform.u_defect_category3_4\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Activity</div><select ng-disabled="!u_defect_category3_2s4 || u_defect_category3_2s4.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange4('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s4" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 5) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange5('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_5\',\'ticketform.u_defect_category2_5\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s5 || u_defect_category2_2s5.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange5('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s5" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_5\',\'ticketform.u_defect_category3_5\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Activity</div><select ng-disabled="!u_defect_category3_2s5 || u_defect_category3_2s5.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange5('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s5" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				}
			}
			
			}
			
			
			else {
				if (scope.count < 5) {
				scope.count++;
				var idV = 'space-for-buttons' + scope.count;
				var idVID = 'space-for-buttons' + scope.count + 'ID';
				var itm1Model = 'u_defect_category1_' + scope.count;
				var itm1Mode2 = 'u_defect_category2_' + scope.count;
				var itm1Mode3 = 'u_defect_category3_' + scope.count;
				if (scope.count == 2) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Effected Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange2('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_2\',\'ticketform.u_defect_category2_2\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s || u_defect_category2_2s.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange2('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_2\',\'ticketform.u_defect_category3_2\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Defect</div><select ng-disabled="!u_defect_category3_2s || u_defect_category3_2s.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange2('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 3) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Effected Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange3('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_3\',\'ticketform.u_defect_category2_3\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s3 || u_defect_category2_2s3.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange3('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s3" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_3\',\'ticketform.u_defect_category3_3\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Defect</div><select ng-disabled="!u_defect_category3_2s3 || u_defect_category3_2s3.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange3('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s3" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 4) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Effected Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange4('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_4\',\'ticketform.u_defect_category2_4\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s4 || u_defect_category2_2s4.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange4('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s4" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_4\',\'ticketform.u_defect_category3_4\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Defect</div><select ng-disabled="!u_defect_category3_2s4 || u_defect_category3_2s4.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange4('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s4" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				} else if (scope.count == 5) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" style="margin: 10px;" class="list"><div class="row responsive-lg dynamicAddItems"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Effected Module</div> <select ng-disabled="!u_defect_category1s || u_defect_category1s.length == 0" ng-model="'+itm1Model+'" ng-change="onEffectedModuleChange5('+itm1Model+')" data-ng-options="item as item.currentItem.u_defect_category1 for item in u_defect_category1s" required="required"><option value="" selected>-- Select --</option></select> </label></div><div class="col"><label  ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_5\',\'ticketform.u_defect_category2_5\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Component</div><select ng-disabled="!u_defect_category2_2s5 || u_defect_category2_2s5.length == 0" ng-model="'+itm1Mode2+'" ng-change="onComponentChange5('+itm1Mode2+')" data-ng-options="item as item.currentItem.u_defect_category2 for item in u_defect_category2_2s5" required="required" ><option value="" selected>-- Select --</option></select></label></div><div class="col"><label ng-class="isInvalidWithCondition(\'ticketform.u_defect_category1_5\',\'ticketform.u_defect_category3_5\')" class="item item-input item-select item-select-break"><div class="input-label">'+scope.count+'. Defect</div><select ng-disabled="!u_defect_category3_2s5 || u_defect_category3_2s5.length == 0" ng-model="'+itm1Mode3+'" ng-change="onDefectChange5('+itm1Mode3+')" data-ng-options="item as item.currentItem.u_defect_category3 for item in u_defect_category3_2s5" required="required"><option value="" selected>-- Select --</option></select></label></div></div></div>')(scope));
				}
			}
			}
			
			
		});
	};
}).directive("removebuttons", function($compile, $ionicScrollDelegate) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			if (scope.count > 1) {
				var idV = 'space-for-buttons' + scope.count + "ID";
				angular.element(document.getElementById(idV)).remove();
				if (scope.count == 2) {
					//Remove the model
					scope.u_defect_category1_2 = '';
					scope.u_defect_category2_2 = '';
					scope.u_defect_category3_2 = '';
					scope.ticketform.u_defect_category1_2 = '';
					scope.ticketform.u_defect_category2_2 = '';
					scope.ticketform.u_defect_category3_2 = '';
				} else if (scope.count == 3) {
					scope.u_defect_category1_3 = '';
					scope.u_defect_category2_3 = '';
					scope.u_defect_category3_3 = '';
					scope.ticketform.u_defect_category1_3 = '';
					scope.ticketform.u_defect_category2_3 = '';
					scope.ticketform.u_defect_category3_3 = '';
				} else if (scope.count == 4) {
					scope.u_defect_category1_4 = '';
					scope.u_defect_category2_4 = '';
					scope.u_defect_category3_4 = '';
					scope.ticketform.u_defect_category1_4 = '';
					scope.ticketform.u_defect_category2_4 = '';
					scope.ticketform.u_defect_category3_4 = '';
				} else if (scope.count == 5) {
					scope.u_defect_category1_5 = '';
					scope.u_defect_category2_5 = '';
					scope.u_defect_category3_5 = '';
					scope.ticketform.u_defect_category1_5 = '';
					scope.ticketform.u_defect_category2_5 = '';
					scope.ticketform.u_defect_category3_5 = '';
				}
				scope.count--;
				$ionicScrollDelegate.resize()
			}
		});
	};
}).directive("addbuttonsservice", function() {
	return {
		restrict : "E",
		template : "<button id='addDefect' addbuttons class='button button-small button-positive button-same-size-large'>Add Activity</button>"
	}
}).directive("removebuttonsservice", function() {
	return {
		restrict : "E",
		template : "<button removebuttons class='button button-small button-positive button-same-size-large'>Remove Activity</button>"
	}
}).directive("addadditionalspare", function($compile) {
	return {
		restrict : "E",
		template : "<button addmorepares class='button button-small button-positive'>Add Additional Spare</button>"
	}
}).directive("removeadditional", function() {
	return {
		restrict : "E",
		template : "<button removemorespares class='button button-small button-positive'>Remove Additional Spare</button>"
	}
}).directive("addadditionalorder", function($compile) {
	return {
		restrict : "E",
		template : "<button addmoreorder class='button button-small button-positive'>Add Additional Part</button>"
	}
}).directive("removeadditionalorder", function() {
	return {
		restrict : "E",
		template : "<button removemoreorders class='button button-small button-positive'>Remove Additional Part</button>"
	}
}).directive("addmorepares", function($compile, $injector, $ionicScrollDelegate) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var myService = $injector.get('Utils');
			//Check Condition Over here.

			if (scope.count == 1) {
				//Check for first row .
				if (!scope.spareParts.u_spare_part_add || !scope.spareParts.u_quantity_add || !(scope.spareParts.u_quantity_add >= 1 && scope.spareParts.u_quantity_add <= 99)) {
					myService.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
					return;
				}
			} else if (scope.count == 2) {
				if (!(scope.spareParts.u_spare_part_add2) || !scope.spareParts.u_quantity_add2 || !(scope.spareParts.u_quantity_add2 >= 1 && scope.spareParts.u_quantity_add2 <= 99)) {
					myService.showAlert("Please provide the total quantity of Additional spare part between 1 to 99");
					return;
				}
			}

			if (scope.count < 3) {
				scope.count++;
				var odrBy = "'u_replacement_part_text'";
				var idV = 'space-for-buttons' + scope.count;
				var idVID = 'space-for-buttons' + scope.count + 'ID';
				var itm1Model = 'u_defect_category1_' + scope.count;
				var itm1Mode2 = 'u_defect_category2_' + scope.count;
				var itm1Mode3 = 'u_defect_category3_' + scope.count;
				if (scope.count == 2) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts2"  ng-change="onAdditionalSparePartChange2(u_spare_parts2)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add2" value="{{spareParts.u_spare_part_add2}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add2" ng-init="spareParts.u_quantity_add2 = 0" type="number" max="99" /></label></div></div></div></div></div></div>')(scope));
				}

				if (scope.count == 3) {
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts3"  ng-change="onAdditionalSparePartChange3(u_spare_parts3)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add3" value="{{spareParts.u_spare_part_add3}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add3" ng-init="spareParts.u_quantity_add3 = 0"  type="number" max="99" /></label></div></div></div></div></div></div>')(scope));
				}
$ionicScrollDelegate.resize()
			}
		});
	};
}).directive("addmoreorder", function($compile, $injector, $ionicScrollDelegate) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var myService = $injector.get('Utils');
			//Check Condition Over here.
			if (scope.count == 1) {
				//Check for first row .
				if (!scope.spareParts.u_spare_part_add || !scope.spareParts.u_quantity_add || !(scope.spareParts.u_quantity_add >= 1 && scope.spareParts.u_quantity_add <= 99)) {
					myService.showAlert("Please provide the Part description and total quantity of Additional spare part between 1 to 99");
					return;
				}
			} else if (scope.count == 2) {
				if (!(scope.spareParts.u_spare_part_add2) || !scope.spareParts.u_quantity_add2 || !(scope.spareParts.u_quantity_add2 >= 1 && scope.spareParts.u_quantity_add2 <= 99)) {
					myService.showAlert("Please provide the Part description and total quantity of Additional spare part between 1 to 99");
					return;
				}
			} else if (scope.count == 3) {
				if (!(scope.spareParts.u_spare_part_add3) || !scope.spareParts.u_quantity_add3 || !(scope.spareParts.u_quantity_add3 >= 1 && scope.spareParts.u_quantity_add3 <= 99)) {
					myService.showAlert("Please provide the Part description and total quantity of Additional spare part between 1 to 99");
					return;
				}
			} else if (scope.count == 4) {
				if (!(scope.spareParts.u_spare_part_add4) || !scope.spareParts.u_quantity_add4 || !(scope.spareParts.u_quantity_add4 >= 1 && scope.spareParts.u_quantity_add4 <= 99)) {
					myService.showAlert("Please provide the Part description and total quantity of Additional spare part between 1 to 99");
					return;
				}
			}

			if (scope.count < 5) {
				scope.count++;
				var odrBy = "'u_replacement_part_text'";
				var idV = 'space-for-buttons' + scope.count;
				var idVID = 'space-for-buttons' + scope.count + 'ID';
				var itm1Model = 'u_defect_category1_' + scope.count;
				var itm1Mode2 = 'u_defect_category2_' + scope.count;
				var itm1Mode3 = 'u_defect_category3_' + scope.count;
				if (scope.count == 2) {
					scope.spareParts.number = 2;
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts2"  ng-change="onAdditionalSparePartChange2(u_spare_parts2)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add2" value="{{spareParts.u_spare_part_add2}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add2" placeholder="0" type="tel" maxlength="2" /><input ng-model="spareParts.number" type="hidden" /></label></div></div></div></div></div></div>')(scope));
				}

				if (scope.count == 3) {
					scope.spareParts.number = 3;
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts3"  ng-change="onAdditionalSparePartChange3(u_spare_parts3)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'"" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add3" value="{{spareParts.u_spare_part_add3}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add3" placeholder="0" type="tel" maxlength="2" /><input ng-model="spareParts.number" type="hidden" /></label></div></div></div></div></div></div>')(scope));
				}
				
				if (scope.count == 4) {
					scope.spareParts.number = 4;
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts4"  ng-change="onAdditionalSparePartChange4(u_spare_parts4)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'"" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add4" value="{{spareParts.u_spare_part_add4}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add4" placeholder="0" type="tel" maxlength="2" /><input ng-model="spareParts.number" type="hidden" /></label></div></div></div></div></div></div>')(scope));
				}
				
				if (scope.count == 5) {
					scope.spareParts.number = 5;
					angular.element(document.getElementById(idV)).append($compile('<div id="'+idVID+'" class="list"><div class="paddingTen" style="padding-bottom:0px!important"><div class="col lightGreyPadMar"><div class="list whiteBg"><div class="row"><div class="col"><label class="item item-input item-select item-select-break"><div class="input-label">Part Description</div><select data-ng-model="u_spare_parts5"  ng-change="onAdditionalSparePartChange5(u_spare_parts5)" data-ng-options="item as item.u_replacement_part_text for item in uniquedefectList | orderBy:'+odrBy+'"" required="required"><option value="" selected>-- Select --</option></select></label></label><label class="item item-input item-stacked-label"><div class="input-label">Spare Part Number</div><input type="text" readonly="readonly" data-ng-model="spareParts.u_spare_part_add5" value="{{spareParts.u_spare_part_add5}}" /></label><label class="item item-input item-stacked-label"> <span class="input-label">Total Quantity</span><input ng-model="spareParts.u_quantity_add5" placeholder="0" type="tel" maxlength="2" /><input ng-model="spareParts.number" type="hidden" /></label></div></div></div></div></div></div>')(scope));
				}
				$ionicScrollDelegate.resize()
			}
		});
	};
}).directive("removemorespares", function($compile, $ionicScrollDelegate) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			if (scope.count > 1) {
				var idV = 'space-for-buttons' + scope.count + "ID";
				angular.element(document.getElementById(idV)).remove();
				if (scope.count == 2) {
					//Remove the model
					scope.u_spare_parts2 = '';
					scope.spareParts.u_replacement_part_text2 = ''
					scope.spareParts.u_spare_part_add2 = '';
					scope.spareParts.u_quantity_add2 = '';					

				} else if (scope.count == 3) {
					scope.u_spare_parts3 = '';
					scope.spareParts.u_replacement_part_text3 = '';
					scope.spareParts.u_spare_part_add3 = '';
					scope.spareParts.u_quantity_add3 = '';
					scope.spareParts.number = 2;
				}
				scope.count--;
				$ionicScrollDelegate.resize()
			}
		});
	};
}).directive("removemoreorders", function($compile, $ionicScrollDelegate) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			if (scope.count > 1) {
				var idV = 'space-for-buttons' + scope.count + "ID";
				angular.element(document.getElementById(idV)).remove();
				if (scope.count == 2) {
					//Remove the model
					scope.u_spare_parts2 = '';
					scope.spareParts.u_replacement_part_text2 = ''
					scope.spareParts.u_spare_part_add2 = '';
					scope.spareParts.u_quantity_add2 = '';
					scope.spareParts.number = 1;

				} else if (scope.count == 3) {
					scope.u_spare_parts3 = '';
					scope.spareParts.u_replacement_part_text3 = '';
					scope.spareParts.u_spare_part_add3 = '';
					scope.spareParts.u_quantity_add3 = '';
					scope.spareParts.number = 2;
				} else if (scope.count == 4) {
					scope.u_spare_parts4 = '';
					scope.spareParts.u_replacement_part_text4 = '';
					scope.spareParts.u_spare_part_add4 = '';
					scope.spareParts.u_quantity_add4 = '';
					scope.spareParts.number = 3;
				} else if (scope.count == 5) {
					scope.u_spare_parts5 = '';
					scope.spareParts.u_replacement_part_text5 = '';
					scope.spareParts.u_spare_part_add5 = '';
					scope.spareParts.u_quantity_add5 = '';
					scope.spareParts.number = 4;
				}
				scope.count--;
				$ionicScrollDelegate.resize()
			}
		});
	};
}).directive('validateEmail', function() {
	var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
	return {
		link : function(scope, elm) {
			elm.on("keyup", function() {
				var isMatchRegex = EMAIL_REGEXP.test(elm.val());
				if (isMatchRegex && elm.hasClass('warning') || elm.val() == '') {
					elm.removeClass('warning');
				} else if (isMatchRegex == false && !elm.hasClass('warning')) {
					elm.addClass('warning');
				}
			});
		}
	}
}).directive('ngFocus', function() {
	var FOCUS_CLASS = "ng-focused";
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ctrl) {
			ctrl.$focused = false;
			element.bind('focus', function(evt) {
				element.addClass(FOCUS_CLASS);
				scope.$apply(function() {
					ctrl.$focused = true;
				});
			}).bind('blur', function(evt) {
				element.removeClass(FOCUS_CLASS);
				scope.$apply(function() {
					ctrl.$focused = false;
				});
			});
		}
	}
}).directive('myMaxlength', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {		
      var maxlength = scope.setShiptoLimit;
      function fromUser(text) {
          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            return transformedInput;
          } 
          return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});
