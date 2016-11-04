/**
 * Router of the application. App start from here.
 */
angular.module('TrueSense', ['ionic', 'TrueSense.services', 'TrueSense.controllers', 'TrueSense.directives']).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('eventmenu', {
		url : "/event",
		abstract : true,
		templateUrl : "templates/event-menu.html"
	}).state('eventmenu.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "templates/homelanding.html",
				controller : 'HomeLandingCtrl'
			}
		}
	}).state('eventmenu.settings', {
		url : '/settings',
		views : {
			'menuContent' : {
				templateUrl : 'templates/settings.html',
				controller : 'settingsCtrl'
			}
		}
	}).state('eventmenu.groupassignedticket', {
		url : '/groupassignedticket',
		views : {
			'menuContent' : {
				templateUrl : 'templates/groupassignedticket.html',
				controller : 'groupassignedticketCtrl'
			}
		}
	}).state('eventmenu.accounthierarchy', {
		url : '/accounthierarchy',
		views : {
			'menuContent' : {
				templateUrl : 'templates/accounthierarchy.html',
				controller : 'accounthierarchyCtrl'
			}
		}
	}).state('eventmenu.defectcategory', {
		url : '/defectcategory',
		views : {
			'menuContent' : {
				templateUrl : 'templates/defectcategorylist.html',
				controller : 'defecthierarchyCtrl'
			}
		}
	}).state('eventmenu.openticket', {
		url : '/openticket',
		views : {
			'menuContent' : {
				templateUrl : 'templates/openticket.html',
				controller : 'openticketCtrl'
			}
		}
	}).state('eventmenu.logissue', {
		url : '/logissue',
		views : {
			'menuContent' : {
				templateUrl : 'templates/logissue.html',
				controller : 'openissuecontrollersCtrl'
			}
		}
	}).state('eventmenu.correctaccount', {
		url : '/correctaccount',
		views : {
			'menuContent' : {
				templateUrl : 'templates/correctaccount.html',
				controller : 'correctaccountCtrl'
			}
		}
	}).state('eventmenu.correctionedit', {
		url : '/correctionedit',
		views : {
			'menuContent' : {
				templateUrl : 'templates/correctionedit.html',
				controller : 'correctioneditCtrl'
			}
		}
	}).state('eventmenu.myopenticketphone', {
		url : '/myopenticketphone',
		views : {
			'menuContent' : {
				templateUrl : 'templates/myopenticketphone.html',
				controller : 'myopenticketphoneCtrl'
			}
		}
	}).state('eventmenu.defectdetails', {
		url : '/defectdetails',
		views : {
			'menuContent' : {
				templateUrl : 'templates/defectdetails.html',
				controller : 'defectdetailsCtrl'
			}
		}
	}).state('eventmenu.accounthierarchyform', {
		url : '/accounthierarchyform',
		views : {
			'menuContent' : {
				templateUrl : 'templates/accounthierarchyform.html',
				controller : 'accounthierarchyformCtrl'
			}
		}
	}).state('eventmenu.openticketedit', {
		url : '/openticketedit',
		views : {
			'menuContent' : {
				templateUrl : 'templates/editticket.html',
				controller : 'openticketEditCtrl'
			}
		}
	}).state('eventmenu.logticketdetailoffline', {
		url : '/logticketdetailoffline',
		views : {
			'menuContent' : {
				templateUrl : 'templates/logeditticket.html',
				controller : 'logticketEditCtrl'
			}
		}
	}).state('eventmenu.opensparepartedit', {
		url : '/opensparepartedit',
		views : {
			'menuContent' : {
				templateUrl : 'templates/opensparepartedit.html',
				controller : 'opensparepartEditCtrl'
			}
		}
	}).state('eventmenu.myorderdetails', {
		url : '/myorderdetails',
		views : {
			'menuContent' : {
				templateUrl : 'templates/myorderdetails.html',
				controller : 'myorderdetailsCtrl'
			}
		}
	}).state('eventmenu.ordersparepartedit', {
		url : '/ordersparepartedit',
		views : {
			'menuContent' : {
				templateUrl : 'templates/ordersparepartedit.html',
				controller : 'ordersparepartEditCtrl'
			}
		}
	}).state('eventmenu.feedback', {
		url : '/feedback',
		views : {
			'menuContent' : {
				templateUrl : 'templates/feedback.html',
				controller : 'feedbackCtrl'
			}
		}
	}).state('eventmenu.closedticket', {
		url : '/closedticket',
		views : {
			'menuContent' : {
				templateUrl : 'templates/closedticket.html',
				controller : 'closedTicketCntrl'
			}
		}
	}).state('eventmenu.closedticketdetail', {
		url : '/closedticketdetail',
		views : {
			'menuContent' : {
				templateUrl : 'templates/closedticketdetail.html',
				controller : 'closedTicketDetailCntrl'
			}
		}
	}).state('eventmenu.newaccountasset', {
		url : '/newaccountasset',
		views : {
			'menuContent' : {
				templateUrl : 'templates/newaccountasset.html',
				controller : 'newAccountCntrl'
			}
		}
	}).state('eventmenu.openaccountasset', {
		url : '/openaccountasset',
		views : {
			'menuContent' : {
				templateUrl : 'templates/openaccountasset.html',
				controller : 'openAccountCntrl'
			}
		}
	}).state('eventmenu.editExtendedCRform', {
		url : '/editExtendedCRform',
		views : {
			'menuContent' : {
				templateUrl : 'templates/editextendedcr.html',
				controller : 'editExtendedCrCntrl'
			}
		}
	}).state('eventmenu.servicereport', {
		url : '/servicereport',
		views : {
			'menuContent' : {
				templateUrl : 'templates/servicereport.html',
				controller : 'servicereportCntrl'
			}
		}
	}).state('eventmenu.myservicereport', {
		url : '/myservicereport',
		views : {
			'menuContent' : {
				templateUrl : 'templates/myservicereport.html',
				controller : 'myservicereportCntrl'
			}
		}
	}).state('eventmenu.myservicereportdetail', {
		url : '/myservicereportdetail',
		views : {
			'menuContent' : {
				templateUrl : 'templates/myservicereportdetail.html',
				controller : 'serviceReportDetailCntrl'
			}
		}
	}).state('eventmenu.ordersparepart', {
		url : '/ordersparepart',
		views : {
			'menuContent' : {
				templateUrl : 'templates/ordersparepart.html',
				controller : 'orderSparePart'
			}
		}
	}).state('eventmenu.myordersparepart', {
		url : '/myordersparepart',
		views : {
			'menuContent' : {
				templateUrl : 'templates/myordersparepart.html',
				controller : 'myorderSparePart'
			}
		}
	}).state('splash', {
		url : '/splash',
		templateUrl : 'templates/splash.html',
		controller : 'SplashCtrl'
	}).state('pinregister', {
		url : '/pinregister',
		templateUrl : 'templates/pinregister.html',
		controller : 'pinregisterCtrl'
	}).state('pinlogin', {
		url : '/pinlogin',
		templateUrl : 'templates/pinlogin.html',
		controller : 'pinloginCtrl'
	}).state('pinnotset', {
		url : '/pinnotset',
		templateUrl : 'templates/pinnotset.html',
	}).state('nonvaliduser', {
		url : '/nonvaliduser',
		templateUrl : 'templates/nonvaliduser.html',
	});
	/**
	 * If no URL is specified the start the application from splash screen.
	 */
	$urlRouterProvider.otherwise('/splash');
});

