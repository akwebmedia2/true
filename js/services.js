/**
 * Services Used in the application (~Code that can be shared by multiple controllers)
 */
angular.module('TrueSense.services', []).factory('$localstorage', ['$window', '$http',
function($window, $rootScope) {
	return {
		/**
		 * Set data in local storage in encrypted form
		 * @param {Object} key : Key for local storage
		 * @param {Object} value : Value associated
		 */
		set : function(key, value) {
			if (key == 'SN-LOGIN-SSO') {
				$window.localStorage[key] = value;
			} else {
				$window.localStorage[key] = Tea.encrypt(value, $rootScope.dbpasscode);
			}
		},

		/**
		 * Get data from local storage in deencrypted form
		 * @param {Object} key : Key for local storage
		 */
		get : function(key) {
			
			if (key == 'SN-LOGIN-SSO') {
				return $window.localStorage[key];
			} else {
				if ($window.localStorage[key]) {
					return Tea.decrypt($window.localStorage[key], $rootScope.dbpasscode);
				} else {
					return $window.localStorage[key];
				}
			}
		},

		/**
		 * Set data in local storage in without encrypted form
		 * @param {Object} key : Key for local storage
		 * @param {Object} value : Value associated
		 */
		setWithOutEncryption : function(key, value) {
			$window.localStorage[key] = value;
		},

		/**
		 * Get data from local storage in without decypyted form
		 * @param {Object} key : Key for local storage
		 */
		getWithOutEncryption : function(key) {
			return $window.localStorage[key];
		},
	}
}]).factory('applicationServices', function($http, $rootScope) {
	var rootURL = $rootScope.baserootURL;
	var rootInstance = 'd6435e965f510100a9ad2572f2b47744';
	return {
		/**
		 * Uplaod Order spare part to service now
		 * @param {Object} _data : data to upload
		 */
		orderSpareParts : function(_data) {
			return $http({
				method : 'POST',
				data : _data,
				url : rootURL + "api/now/import/u_order_spare_parts_stage",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 *Fetch order sparepart based on the provided Ticket Id(s)
		 * @param {Object} ticketIds: List of Id(s)
		 */
		fetchOrderSpareParts : function(ticketIds) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_order_spare_parts?sysparam_display_value=true&sysparm_query=u_ticket_number.numberINRMD0010357," + ticketIds + "&sysparm_fields=number,opened_by.name,u_ticket_number.number,u_1_component,u_1_spare_part,u_1_sap_part__,u_1_quantity,u_2_component,u_2_spare_part,u_2_sap_part__,u_2_quantity,u_3_component, u_3_spare_part,u_3_sap_part__,u_3_quantity,u_4_component,u_4_spare_part,u_4_sap_part__,u_4_quantity,u_5_component,u_5_spare_part,u_5_sap_part__,u_5_quantity,u_sap_part___add,u_spare_part_add,u_quantity_add,u_sap_part_desc_2,u_sap_part_num_2,u_sap_part_qty_2,u_sap_part_desc_3,u_sap_part_num_3,u_sap_part_qty_3,u_delivery_address,u_ship_to,u_expected_date,u_csc_mail_address,u_email,u_critical,u_order_status,u_sales_order_number,u_confirmed_delivery_date,sys_id",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * Update comments to service now
		 * @param {Object} sisId : ID for the record
		 * @param {Object} _data : Comment to update
		 */
		updateComments : function(sisId, _data) {
			return $http({
				method : 'PUT',
				data : _data,
				url : rootURL + "api/now/table/u_true_sense_process/" + sisId,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * update Account Hierarchy to Service now
		 * @param {Object} sisId : ID for the record
		 * @param {Object} _data : data to upload
		 */
		updateAccountHierarchy : function(sisId, _data) {
			return $http({
				method : 'PUT',
				data : _data,
				url : rootURL + "api/now/table/u_account_hierarchy/" + sisId,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * upload Account Hierarchy CorrectionData to service now
		 * @param {Object} param : Record uinque id
		 * @param {Object} _data : data to uplaod
		 */
		uploadAccountHierarchyCorrectionData : function(param, _data) {
			return $http({
				method : 'PUT',
				url : rootURL + "api/now/table/u_account_hierarchy/" + param,
				data : _data,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},
		
		
		/**
		 * get Account Hierarchy UpdatedData from Service now
		 * @param {Object} param : Time as string
		 */
		getAccountHierarchyUpdatedData : function(param) {
			return $http({
				method : 'GET',
				// url : rootURL + "api/now/table/u_account_hierarchy?sysparam_display_value=true&sysparm_query=sys_updated_on>=javascript:gs.dateGenerate(" + param + ")^u_operational_status!=Moved&sysparm_fields=sys_created_by,sys_created_on,sys_id,sys_mod_count,sys_updated_by,sys_updated_on,u_control_status,u_controller_serial_id,u_controller_type,u_cam_serial_number,u_date_of_upgrade,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_number,u_hw_kits,u_icc_skid_serial_number,u_mrc__psc_firmware_rev,u_operational_status,u_system_name,u_temperature_c_or_f,u_ts2_firmware_rev,u_region,u_salesdistrictid,u_salesorg,u_salesregionid,u_sap_pe_no,u_ship_date,u_contract_details,u_duns_number,u_ship_to,u_sold_to,u_state,u_notes,u_pole,u_account_name, u_country,u_city,u_account_manager.name,u_account_manager.email,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone",
				url : rootURL + "api/now/table/u_account_hierarchy?sysparam_display_value=true&sysparm_query=sys_updated_on>=javascript:gs.dateGenerate(" + param + ")&sysparm_fields=sys_created_by,sys_created_on,sys_id,sys_mod_count,sys_updated_by,sys_updated_on,u_control_status,u_controller_serial_id,u_controller_type,u_cam_serial_number,u_date_of_upgrade,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_number,u_hw_kits,u_icc_skid_serial_number,u_mrc__psc_firmware_rev,u_operational_status,u_system_name,u_temperature_c_or_f,u_ts2_firmware_rev,u_region,u_salesdistrictid,u_salesorg,u_salesregionid,u_sap_pe_no,u_ship_date,u_contract_details,u_duns_number,u_ship_to,u_sold_to,u_state,u_notes,u_pole,u_account_name, u_country,u_city,u_account_manager.name,u_account_manager.email,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_electrical_cover_box,u_dateofcommissing,u_flagdateofcommissing,u_asset_number,u_asset_type,u_market_sector,u_dcs_connection,u_depreciatedflag",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * get Defect Hierarchy Updated Data from SN
		 * @param {Object} param : date/Time as string
		 */
		getDefectHierarchyUpdatedData : function(param) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_defect_category_hierarchy?sysparam_display_value=true&sysparm_query=sys_updated_on>javascript:gs.dateGenerate(" + param + ")",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * get My Open Tickets Data from SN
		 * @param {Object} param : user Id
		 * @param {Object} reqTS : Date/Time
		 */
		getMyOpenTicketsData : function(param, reqTS) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=opened_by.user_name=" + param + "^u_status!=Closed^ORDERBYopened_at&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,u_short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,u_additional_comment_mobile,sys_updated_on,u_order_spare_part_flag,u_account_manager,u_account_manager.name,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_account_manager.email,u_asset_number.u_asset_number,u_asset_type,u_market_sector,u_dsc_true_connection,u_asset_number.u_country",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},	
		
				
		/**
		 * get Historical Tickets Data from SN
		 * @param {Object} param : user Id		
		 */
		getViewHistoricalTickets : function(param) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=u_status=Closed^opened_by.user_name="+ param + "^ORclosed_by.user_name="+ param +"^ORDERBYDESCclosed_at&sysparm_limit=5&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,u_short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,sys_updated_on,u_additional_comment_mobile,u_account_manager,u_account_manager.name,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_account_manager.email",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},	
		
		/**
		 * get Controller type and Operational Values		
		 */
		getControllersOperationalData : function() {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/sys_choice?sysparm_query=name=u_account_hierarchy^element=u_market_sector^ORelement=u_dcs_connection^ORelement=u_asset_type^ORelement=u_controller_type^ORelement=u_operational_status ^inactive=false^ORDERBYsequence&sysparam_display_value=true&sysparm_fields=element,label,value,sys_id,name",				
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * get Pole Data for Extended CR		
		 */
		getCountryPoleData : function() {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/sys_choice?sysparm_query=name=u_extend_cr^element=u_pole^ORelement=u_country &sysparam_display_value=true&sysparm_fields=element,label,value,sys_id,name",				
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},


		/**
		 * get PW Masater Data from SN		
		 */
		getPWMasterData : function() {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_pw_master_data?sysparam_display_value=true&sysparm_query=sys_updated_on>javascript:gs.dateGenerate('2014-9-30','23:59:59')&sysparm_fields=u_group.name,sys_tags,u_table,sys_updated_on,sys_id,sys_created_on,u_instance_name,u_escalation_level,u_country,sys_created_by,u_order_email",				
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},
		
		/**
		 * get PW Masater Data from SN		
		 */
		getAllCountryData : function() {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/sys_choice?sysparm_query=name=sys_user^element=country^inactive=false^sys_domain=dd109a9d7008d500665da286850aee87%20^inactive=false^ORDERBYsequence&sysparam_display_value=true&sysparm_fields=element,label,value,sys_id,name",				
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},


		/**
		 * get My And MyGroup Open Tickets Data
		 * @param {Object} ssoid
		 */
		getMyAndMyGroupOpenTicketsData : function(ssoid) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=assignment_groupDYNAMIC" + rootInstance + "^ORopened_by.user_name=" + ssoid + "^u_status!=Closed^ORu_status=NULL^&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,u_short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,sys_updated_on,u_additional_comment_mobile,opened_by.user_name,u_order_spare_part_flag,u_account_manager,u_account_manager.name,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_account_manager.email,u_asset_number.u_asset_number,u_asset_type,u_market_sector,u_dsc_true_connection,u_asset_number.u_country",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},

		/**
		 * get MyGroup Open Tickets Data
		 * @param {Object} ssoid
		 */
		getMyGroupOpenTicketsData : function(ssoid) {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=assignment_group=javascript:getMyGroupsSSO(" + ssoid + ")^u_status!=Closed&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,u_short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,sys_updated_on,u_additional_comment_mobile,u_account_manager,u_account_manager.name,u_account_manager.user_name,u_account_manager.phone,u_account_manager.mobile_phone,u_account_manager.email,u_order_spare_part_flag,u_asset_number.u_asset_number,u_asset_type,u_market_sector,u_dsc_true_connection,u_asset_number.u_country",
				// url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=assignment_group" + rootInstance + "^u_status!=Closed^ORu_status=NULL^&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,short_description,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,u_additional_comment_mobile,sys_updated_on, opened_by.user_name,assignment_group,u_order_spare_part_flag",
				// url : rootURL + "api/now/table/u_true_sense_process?sysparm_query=assignment_group" + rootInstance + "&sysparam_display_value=true&sysparm_fields=u_defect_category2,u_defect_category3,u_defect_category1,u_defect_category2_2,u_defect_category3_2,u_defect_category_2,u_defect_category2_3,u_defect_category3_3,u_defect_category_3,u_defect_category2_4,u_defect_category3_4,u_defect_category_4,u_defect_category2_5,u_defect_category3_5,u_defect_category_5,u_account_name,u_assetclass,u_city,u_customer_street,u_region,u_salesorg,u_salesdistrictid,u_salesregionid,u_ship_sold_to,u_state,u_cam_serial_no,u_control_status,u_controller_serial_id,u_controller_type,u_date_of_upgrade,u_temperature_c_or_f,u_ts2_firmware_rev,u_ethernet_kits,u_fluidic_cooler_option,u_fluidics_serial_no,u_hardware_kits,u_icc_skid_serial_no,u_mrc__psc_firmware_rev,u_operational_status,u_master_asset_tag_no,u_issue_end_date,u_issue_start_date,comments,work_notes,assignment_group.name,description,number,opened_at,u_priority,short_description,u_src_solved,u_status,sys_id,number,u_account_name,opened,opened_by.name,short_description,opened_at,sys_created_by,sys_created_on,sys_mod_count,sys_updated_by,u_additional_comment_mobile,sys_updated_on, opened_by.user_name,assignment_group,u_order_spare_part_flag",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},
		
		/**
		 * get SysId info for Deleted Defect Data from Service now
		 * @param {Object} param : Time as string
		 */
		getDeletedDefectData : function() {
			return $http({
				method : 'GET',
				url : rootURL + "api/now/table/u_pw_deleted_defect?sysparam_display_value=true&sysparm_query=sys_updated_on>javascript:gs.dateGenerate('2014-9-30','23:59:59')&sysparm_fields=u_defect_sys_id",				
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			});
		},
		
		
	}
}).factory('Utils', function($ionicLoading, $parse, $rootScope, databasecache) {
	return {
		/**
		 * Date Time in UTC format
		 * @param {Object} date
		 */
		currentUTCDateTime : function(date) {
			var now = new Date();
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			return now_utc;
		},

		/**
		 * Date Time in UTC format in Service Now Format
		 * @param {Object} date
		 */
		currentUTCDateTimeServiceNowFormat : function(date) {
			var now = new Date();
			var dateString = '';
			var mnth = now.getUTCMonth() + 1;
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			// alert( ("0" + now.getUTCSeconds()).slice(-2));
			dateString = now.getUTCFullYear() + '-' + mnth + '-' + now.getUTCDate() + ' ' + now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
			// dateString =
			return dateString;
		},

		/**
		 * Current Date Time in UTC format
		 */
		currentUTCDate : function() {
			var dateString = '';
			var now = new Date();
			var mnth = now.getUTCMonth() + 1;
			dateString = now.getUTCFullYear() + '-' + mnth + '-' + now.getUTCDate();			
			return dateString;
		},
		
		/**
		 * Current Date Time in UTC format
		 */
		currentGMTDate : function() {
			var dateString = '';
			var now = new Date();
			var mnth = now.getUTCMonth() + 1;
			var newFormattedMnth = ("0" + mnth).slice(-2);
			var newFormattedDate = ("0" + now.getUTCDate()).slice(-2);
			dateString = now.getUTCFullYear() + '-' + newFormattedMnth + '-' + newFormattedDate;
			return dateString;
		},
		

		
		currentGMTDateTime : function() {
			var dateString = '';
			var now = new Date();
			var mnth = now.getUTCMonth() + 1;
			var newFormattedMnth = ("0" + mnth).slice(-2);
			var newFormattedDate = ("0" + now.getUTCDate()).slice(-2);
			var newFormattedHour = ("0" + now.getUTCHours()).slice(-2);
			var newFormattedMinutes = ("0" + now.getUTCMinutes()).slice(-2);
			var newFormattedSeconds = ("0" + now.getUTCSeconds()).slice(-2);
			dateString = now.getUTCFullYear() + '-' + newFormattedMnth + '-' + newFormattedDate + ' ' + newFormattedHour + ':' + newFormattedMinutes + ':' + newFormattedSeconds;
			return dateString;
		},

		/**
		 * Check if UI is of mobile or tab
		 */
		isPhoneView : function() {
			if ($('#MainMenuForPhone').is(':hidden')) {
				return false;
			} else {
				return true;
			}
		},

		/**
		 * Show all tiles of landing screen
		 * @param {Object} scope
		 */
		/*showAllTiles : function(scope) {
			scope.dashboardaccess = {};
			scope.dashboardaccess.mod_my_open_ticket = true;
			scope.dashboardaccess.mod_open_ticket = true;
			scope.dashboardaccess.mod_log_issue = true;
			scope.dashboardaccess.mod_correct_account = true;
			scope.dashboardaccess.mod_extended_cr = true;
			scope.dashboardaccess.mod_closed_ticket = true;
			scope.dashboardaccess.mod_myGroup_assigned_ticket = true;
			scope.dashboardaccess.mod_account_hierarchy = true;
			scope.dashboardaccess.mod_defect_hierarchy = true;
			scope.dashboardaccess.mod_setting = true;
			scope.dashboardaccess.mod_feedback = true;
		},*/

		/**
		 * Show Plaese wait screen
		 * @param {Object} loadingMessage
		 */
		showPleaseWait : function(loadingMessage) {
			$ionicLoading.show({
				template : '<i class=" ion-loading-b"></i> ' + loadingMessage,
				maxWidth : 400,
			});
		},

		/**
		 * Hide wait screen
		 */
		hidePleaseWait : function() {
			$ionicLoading.hide();
		},

		/**
		 * Show alert based on the message
		 * @param {Object} msg
		 */
		showAlert : function(msg) {
			try {
				navigator.notification.alert(msg, // message
				function() {

				}, // callback
				'Alert', // title
				'Ok' // buttonName
				);
			} catch(e) {
				alert(msg);
			}
		},

		/**
		 * fetch Saveed AccountHierarchy
		 * @param {Object} _applicationServices
		 * @param {Object} database
		 * @param {Object} callback
		 */
		fetchSaveDBAccountHierarchy : function(_applicationServices, database, callback) {
			try {
				var me = this;
				database.getLatestSysUpdatedTimeTicketsForAccountHierarchy(function(results) {
					if (results && results.rows && results.rows.length > 0) {
						var reqTS = "'2014-10-10 23:59:59'";
						try {
							reqTS = "'" + results.rows.item(0).SysUpdatedOn + "'";
						} catch(e) {

						}
						var promise = _applicationServices.getAccountHierarchyUpdatedData(reqTS);
						promise.then(function(payload) {
							if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
								database.storeBulkAccountHierarchy(payload.data.result, function(status, data) {
									callback(true, payload);
								});
							} else {
								callback(false, payload);
							}
						}, function(errorPayload) {
							callback(false, errorPayload);
						});

					} else {
						me.showPleaseWait('Setting up account hierarchy data for very first time. This process will take some time to complete.');
						database.storeBulkAccountHierarchy(staticAccountHierarchyData, function(status, data) {
							me.hidePleaseWait();
						});
					}
				});
			} catch(e) {
				Utils.hidePleaseWait();
				callback(false, '600');
			}

		},

		/**
		 * fetch and Save DefectHierarchy in DB
		 * @param {Object} _applicationServices
		 * @param {Object} database
		 * @param {Object} callback
		 */
		fetchSaveDBDefectHierarchy : function(_applicationServices, database, callback) {
			try {
				var me = this;
				database.getLatestSysUpdatedTimeTicketsForDefectHierarchy(function(results) {
					if (results && results.rows && results.rows.length > 0) {
						var reqTS = "'2014-10-10 23:59:59'";
						try {
							reqTS = "'" + results.rows.item(0).SysUpdatedOn + "'";
						} catch(e) {
						}
						var promise = _applicationServices.getDefectHierarchyUpdatedData(reqTS);
						promise.then(function(payload) {
							if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
								// database.storeBulkDefectHierarchy(payload.data.result, callback);
								database.storeBulkDefectHierarchy(payload.data.result, function(status, data) {
									callback(true, payload);
								});
							} else {
								callback(false, payload);
							}
						}, function(errorPayload) {
							callback(false, errorPayload);
						});
					} else {
						// var reqTS = "'2013-10-10 23:59:59'";
						me.showPleaseWait('Setting up defect hierarchy data for very first time. This process will take some time to complete.');
						database.storeBulkDefectHierarchy(staticDefectHierarchyData, function(status, data) {
							me.hidePleaseWait();
						});
					}
				});
			} catch(e) {
				Utils.hidePleaseWait();
				callback(false, '600');
			}
		},

		/**
		 * Get saved DefectHierarchy from Database
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBDefectHierarchy : function(database, utils, callback) {
			/*if (databasecache.defectHierarchyCache && databasecache.defectHierarchyCache.length > 0 && databasecache.defectHierarchyGrouprdCache && databasecache.defectHierarchyGrouprdCache.length > 0) {
				callback(databasecache.defectHierarchyCache, databasecache.defectHierarchyGrouprdCache);
			} else */{
				database.getDefectHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var ahArray = [];
						for (var i = 0; i < result.rows.length; i++) {
							ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).DefectHierarchyData, $rootScope.dbcommonpass)));
						}
						var ahArray2 = [];
						for(var j = 0; j<ahArray.length; j++){
							if(ahArray[j].u_active == 'true' && ahArray[j].u_defect_category4 != 'SERVICE'){
								ahArray2.push(ahArray[j])
							}
						}
						var groups = utils.getItemGroupedBy(ahArray2, "u_defect_category1");
						databasecache.defectHierarchyCache = groups;
						databasecache.defectHierarchyGrouprdCache = ahArray2;
						callback(groups, ahArray2);
					} else {
						databasecache.defectHierarchyCache = null;
						databasecache.defectHierarchyGrouprdCache = null;
						callback(null, null);
					}
				});
			}
		},
		
		/**
		 * Get saved DefectHierarchy from Database
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBDefectHierarchyAll : function(database, utils, callback) {
			/*if (databasecache.defectHierarchyCache && databasecache.defectHierarchyCache.length > 0 && databasecache.defectHierarchyGrouprdCache && databasecache.defectHierarchyGrouprdCache.length > 0) {
				callback(databasecache.defectHierarchyCache, databasecache.defectHierarchyGrouprdCache);
			} else */{
				database.getDefectHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var ahArray = [];
						for (var i = 0; i < result.rows.length; i++) {
							ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).DefectHierarchyData, $rootScope.dbcommonpass)));
						}
						
						var groups = utils.getItemGroupedBy(ahArray, "u_defect_category1");
						databasecache.defectHierarchyCache = groups;
						databasecache.defectHierarchyGrouprdCache = ahArray;
						callback(groups, ahArray);
					} else {
						databasecache.defectHierarchyCache = null;
						databasecache.defectHierarchyGrouprdCache = null;
						callback(null, null);
					}
				});
			}
		},

		/**
		 *get Saved  AccountHierarchy
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBAccountHierarchy : function(database, utils, callback) {
			/*if (databasecache.accountHierarchyCache && databasecache.accountHierarchyCache.length > 0 && databasecache.accountHierarchyGrouprdCache && databasecache.accountHierarchyGrouprdCache.length > 0) {
				
				callback(databasecache.accountHierarchyCache, databasecache.accountHierarchyGrouprdCache);
			} else {*/
				database.getAccountHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var ahArray = [];
						for (var i = 0; i < result.rows.length; i++) {
							ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).AccountHierarchyData, $rootScope.dbcommonpass)));
						}
						var groups = utils.getItemGroupedBy(ahArray, "u_city");						
						//databasecache.accountHierarchyCache = groups;
						databasecache.accountHierarchyGrouprdCache = ahArray;
						callback(groups, ahArray);
						
					} else {
						//databasecache.accountHierarchyCache = null;
						databasecache.accountHierarchyGrouprdCache = null;
						callback(null, null);
					}
				});
			/*}*/
		},
           
		/**
		 * Get saved DefectHierarchy from Database
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBDefectHierarchyServiceReport : function(database, utils, callback) {
			/*if (databasecache.defectHierarchyCache && databasecache.defectHierarchyCache.length > 0 && databasecache.defectHierarchyGrouprdCache && databasecache.defectHierarchyGrouprdCache.length > 0) {
				callback(databasecache.defectHierarchyCache, databasecache.defectHierarchyGrouprdCache);
			} else */{
				database.getDefectHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var ahArray = [];
						for (var i = 0; i < result.rows.length; i++) {
							ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).DefectHierarchyData, $rootScope.dbcommonpass)));
						}
						var ahArray2 = [];
						for(var j = 0; j<ahArray.length; j++){
							if(ahArray[j].u_active == 'true' && ahArray[j].u_defect_category4 == 'SERVICE'){
								ahArray2.push(ahArray[j])
							}
						}
						var groups = utils.getItemGroupedBy(ahArray2, "u_defect_category1");
						
						callback(groups, ahArray2);
					} else {
						
						callback(null, null);
					}
				});
			}
		},
           /**
            *get Saved All AccountHierarchy
            * @param {Object} database
            * @param {Object} utils
            * @param {Object} callback
            */
           getSavedDBAccountHierarchyAll : function(database, utils, callback) {
           database.getAccountHierarchyAll(function(result) {
                                        if (result && result.rows && result.rows.length > 0) {
                                        var ahArray = [];
                                        for (var i = 0; i < result.rows.length; i++) {
                                        ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).AccountHierarchyData, $rootScope.dbcommonpass)));
                                        }
                                        var groups = utils.getItemGroupedBy(ahArray, "u_city");
                                        callback(groups, ahArray);
                                        } else {
                                        callback(null, null);
                                        }
                                        });
           /*}*/
           },
		
		/**
		 *get Country code from saved Account Hierarchy
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBCountryAccountHierarchy : function(database, utils, callback) {			
				database.getCountryFromAccountHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var chArray = [];
						for (var i = 0; i < result.rows.length; i++) {
								chArray.push(angular.fromJson(result.rows.item(i)));
						}
						var groups = utils.getCountryItemGroupedBy(chArray, "Country");				
						callback(groups);						
					} else {
						callback(null, null);
					}
				});			
		},
		
		/**
		 *get Country code from saved Account Hierarchy
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedAllCountry : function(database, utils, callback) {			
				database.getAllCountryFromDB(function(result) {
					if (result && result.rows && result.rows.length > 0) {						
						var chArray = [];
						for (var i = 0; i < result.rows.length; i++) {
								chArray.push(angular.fromJson(result.rows.item(i).GroupData));
						}						
						//var groups = utils.getCountryItemGroupedBy(chArray, "Country");				
						callback(chArray);						
					} else {
						callback(null, null);
					}
				});			
		},
		
		/**
		 *get State from saved Account Hierarchy
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBStateAccountHierarchy : function(database, utils, callback) {			
				database.getStateFromAccountHierarchy(function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var shArray = [];
						for (var i = 0; i < result.rows.length; i++) {
								shArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).AccountHierarchyData, $rootScope.dbcommonpass)));
								
						}						
						var groups = utils.getStateItemGroupedBy(shArray, "u_state");				
						callback(groups);						
					} else {						
						callback(null, null);
					}
				});			
		},
		
		

		/**
		 * get Saved DB AccountHierarchy Without Group
		 * @param {Object} database
		 * @param {Object} utils
		 * @param {Object} callback
		 */
		getSavedDBAccountHierarchyWithoutGroup : function(database, utils, callback) {
			database.getAccountHierarchy(function(result) {
				if (result && result.rows && result.rows.length > 0) {
					var ahArray = [];
					for (var i = 0; i < result.rows.length; i++) {
						ahArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).AccountHierarchyData, $rootScope.dbcommonpass)));
					}
					callback(ahArray);
				} else {
					callback(null);
				}
			});
		},

		/**
		 * get Unique Array based on the filed provided
		 * @param {Object} arr
		 * @param {Object} field
		 */
		getUniqueArray : function(arr, field) {
			var o = {}, i, l = arr.length, r = [];
			for ( i = 0; i < l; i += 1) {
				o[arr[i][field]] = arr[i];
			}
			for (i in o) {
				r.push(o[i]);
			}
			return r;
		},

		/**
		 * get Array With SeletedItem
		 * @param {Object} arr
		 * @param {Object} field
		 * @param {Object} selectedItem
		 */
		getArrayWithSeletedItem : function(arr, field, selectedItem) {
			var o = {}, i, l = arr.length, r = [];
			for ( i = 0; i < l; i += 1) {
				if (arr[i][field] === selectedItem) {
					r.push(arr[i]);
				}
			}
			return r;
		},

		/**
		 * get Unique Array With Selected/provided Item value
		 * @param {Object} arr
		 * @param {Object} field
		 */
		getUniqueArrayWithSelectedItem : function(arr, field) {
			var o = {}, i, l = arr.length, r = [];
			for ( i = 0; i < l; i += 1) {
				o[arr[i][field]] = arr[i];
			}
			for (i in o) {
				r.push(o[i][field]);
			}
			return r;
		},

		/**
		 * get Unique Array
		 * @param {Object} arr
		 */
		getUniqueArraySingleElements : function(arr) {
			var o = {}, i, l = arr.length, r = [];
			for ( i = 0; i < l; i += 1) {
				o[arr[i]] = arr[i];
			}
			for (i in o) {
				r.push(o[i]);
			}
			return r;
		},
		
		getCountryItemGroupedBy : function(list, group_by) {			
			var groupList = [];										
				if (list && list.length > 0) {				
				var lookup = {};
				var items = list;				
				for (var item, i = 0; item = items[i++];) {
				  var name = item[group_by];			
				  if (!(name in lookup)) {
					lookup[name] = 1;
					if(name){
						groupList.push({'country':name});
					}
				  }
				}
							
				return groupList;
			} else {
				return [];
			}
		},
		
		getStateItemGroupedBy : function(list, group_by) {			
			var groupList = [];										
				if (list && list.length > 0) {				
				var lookup = {};
				var items = list;				
				for (var item, i = 0; item = items[i++];) {
				  var nameNew = item[group_by];
				  var name = item[group_by].toLowerCase();			
				  if (!(name in lookup)) {
					lookup[name] = 1;
					if(name){
						groupList.push({'State':nameNew});
					}
				  }
				
				}				
				return groupList;
			} else {
				return [];
			}
		},
		
		getPWMasterDataGroupBy : function(list, group_by) {			
			var groupList = [];
										
				if (list && list.length > 0) {				
				var lookup = {};
				var items = list;				
				for (var item, i = 0; item = items[i++];) {
				  var name = item[group_by];			
				  if (!(name in lookup)) {
					lookup[name] = 1;
					groupList.push({'value':name});
				  }
				}
								
				return groupList;
			} else {
				return [];
			}
		},
		
		/**
		 * get Item array GroupedBy provided value
		 * @param {Object} list
		 * @param {Object} group_by
		 */
		getItemGroupedBy : function(list, group_by) {
			if (list && list.length > 0) {
				var groups = [];
				list.sort(function(a, b) {
					if (a[group_by] <= b[group_by]) {
						return (-1 );
					}
					return (1 );
				});
				var groupValue = "_INVALID_GROUP_VALUE_";
				for (var i = 0; i < list.length; i++) {
					var cuurItem = list[i];
					if (cuurItem[group_by] !== groupValue) {
						var group = {
							label : cuurItem[group_by],
							currentItem : cuurItem,
							groupedItems : []
						};
						groupValue = group.label;
						groups.push(group);
					}
					group.groupedItems.push(cuurItem);
				}
				return groups;
			} else {
				return [];
			}
			//alert(group_by)

		},
	}
}).factory('databasecache', function() {
	return {
		userInfoData : null,
		
		//accountHierarchyCache : null,
		accountHierarchyGrouprdCache : null,
		defectHierarchyGrouprdCache : null,
		defectHierarchyCache : null,
		completedItemsCache : [],

		/**
		 *  clear completed Items from Cache
		 */
		clearcompletedItemsCache : function() {
			this.completedItemsCache = [];
		},

		/**
		 * clear Account Hierarchy from Cache
		 */
		clearAccHierarchyCache : function() {
			//this.accountHierarchyCache = null;
			this.accountHierarchyGrouprdCache = null;
		},

		/**
		 * clear Defect Hierarchy from Cache
		 */
		clearDefHierarchyCache : function() {
			this.defectHierarchyCache = null;
			this.defectHierarchyGrouprdCache = null;
		},
		
		

		/**
		 * clear UserInfoData from Cache
		 */
		clearUserInfoDataCache : function() {
			userInfoData = null;
		}
	}
}).factory('database', function($ionicLoading, $parse, $rootScope, databasecache) {
	return {
		/**
		 * Create database table for the app. Can utilize web sql for desktop and sqlite from mobile application
		 */
		createDbAndTables : function() {
			if (desktopVersion) {
				$rootScope.db = openDatabase('myClientDB116', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
			} else {
				$rootScope.db = window.sqlitePlugin.openDatabase({
					name : "myClientDB116.db"
				});
			}

			$rootScope.db.transaction(function(tx) {
				// One time delete old account and defect hieararchy table				
				tx.executeSql('DROP TABLE IF EXISTS accountHierarchyGlobal');
				tx.executeSql('DROP TABLE IF EXISTS defectHierarchyNew');					
				
				tx.executeSql('CREATE TABLE IF NOT EXISTS User (UserId text primary key, UserInfo clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS pendingTickets (TicketId text primary key, UserId text,Type text, SysUpdatedOn datetime,TicketInfo clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS completedTickets (SysId text primary key, UserId text, OpenBy text,SysUpdatedOn datetime, TicketInfo clob, IsGroupTkt text)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS uploadedSpareParts (SysId text primary key, UserId text,RefTicketId text, SparePartInfo clob, IsGroupSparePart text)');				
				tx.executeSql('CREATE TABLE IF NOT EXISTS accountHierarchyData (SysId text primary key,SysUpdatedOn datetime, Country text, AccountHierarchyData clob)');			
				tx.executeSql('CREATE TABLE IF NOT EXISTS defectHierarchyData (SysId text primary key,SysUpdatedOn datetime, DefectHierarchyData clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS closedTickets (SysId text primary key, UserId text, closedTicketData clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS extendedCR (number text primary key, UserId text, extendedCRData clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS uploadedClosedSpareParts (SysId text primary key, UserId text,RefTicketId text, SparePartInfo clob, text)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS controllersData (Data clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS CountryPoleData (Data clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS pwMasterData (SysId text primary key,Country text,uTable text, GroupData clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS allCountryData (SysId text primary key, GroupData clob)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS sparePartsData (SysId text primary key, UserId text, spareData clob)');
				
			});
		},

		/**
		 * Store bulk record for spare parts
		 * @param {Object} sparePartsArray : Array to save
		 * @param {Object} ssoId : Array ti save on provided SSID
		 * @param {Object} isGroupSparePart : Is fall under group spare parts
		 * @param {Object} callback
		 */
		storeBulkSpareParts : function(sparePartsArray, ssoId, isGroupSparePart, callback) {
			if (sparePartsArray && sparePartsArray.length > 0) {
				$rootScope.db.transaction(function(tx) {
					var iSPIndex = 0;
					for (var i = 0; i < sparePartsArray.length; i++) {
						if (sparePartsArray[i] && sparePartsArray[i]['u_ticket_number.number']) {
							tx.executeSql('INSERT or REPLACE INTO uploadedSpareParts (SysId, UserId,RefTicketId, SparePartInfo,IsGroupSparePart) VALUES (?,?,?,?,?)', [sparePartsArray[i].sys_id, ssoId, sparePartsArray[i]['u_ticket_number.number'], Tea.encrypt(JSON.stringify(sparePartsArray[i]), $rootScope.dbpasscode), isGroupSparePart], function(tx, res) {
								iSPIndex++;
								if (iSPIndex == sparePartsArray.length) {
									callback(true);
								}
							});
						}
					}
				});
			} else {
				callback(false);
			}
		},

		/**
		 * Get the array of the uploaded Spare parts from the DB with refrence ticket id
		 * @param {Object} ssoId
		 * @param {Object} refTicketId
		 * @param {Object} callback
		 */
		getUploadedSpareParts : function(ssoId, refTicketId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM uploadedSpareParts WHERE UserId=? AND RefTicketId=?', [ssoId, refTicketId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						var records = [];
						for (var i = 0; i < results.rows.length; i++) {
							records.push(angular.fromJson(Tea.decrypt(results.rows.item(i).SparePartInfo, $rootScope.dbpasscode)));
						}
						callback(records);
					} else {
						callback(null);
					}
				});
			});
		},

		deleteAllUploadedSparePartsForUserGroupAndNonGroup : function(ssoid, isGroup, callback) {
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM uploadedSpareParts WHERE UserId=? AND IsGroupSparePart=?', [ssoid, isGroup], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							// alert(res.rowsAffected)
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},
		/**
		 * Store bulk record for spare parts
		 * @param {Object} sparePartsArray : Array to save
		 * @param {Object} ssoId : Array ti save on provided SSID
		 * @param {Object} isGroupSparePart : Is fall under group spare parts
		 * @param {Object} callback
		 */
		storeBulkClosedSpareParts : function(sparePartsArray, ssoId, callback) {
			if (sparePartsArray && sparePartsArray.length > 0) {
				$rootScope.db.transaction(function(tx) {
					var iSPIndex = 0;
					for (var i = 0; i < sparePartsArray.length; i++) {
						if (sparePartsArray[i] && sparePartsArray[i]['u_ticket_number.number']) {
							tx.executeSql('INSERT or REPLACE INTO uploadedClosedSpareParts (SysId, UserId,RefTicketId, SparePartInfo) VALUES (?,?,?,?)', [sparePartsArray[i].sys_id, ssoId, sparePartsArray[i]['u_ticket_number.number'], Tea.encrypt(JSON.stringify(sparePartsArray[i]), $rootScope.dbpasscode)], function(tx, res) {
								iSPIndex++;
								if (iSPIndex == sparePartsArray.length) {
									callback(true);
								}
							});
						}
					}
				});
			} else {
				callback(false);
			}
		},
		
		/**
		 * Get the array of the uploaded Spare parts from the DB with refrence ticket id
		 * @param {Object} ssoId
		 * @param {Object} refTicketId
		 * @param {Object} callback
		 */
		getUploadedClosedSpareParts : function(ssoId, refTicketId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM uploadedClosedSpareParts WHERE UserId=? AND RefTicketId=?', [ssoId, refTicketId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						var records = [];
						for (var i = 0; i < results.rows.length; i++) {
							records.push(angular.fromJson(Tea.decrypt(results.rows.item(i).SparePartInfo, $rootScope.dbpasscode)));
						}
						callback(records);
					} else {
						callback(null);
					}
				});
			});
		},
		
		deleteAllUploadedClosedSpareParts : function(ssoid, callback) {
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM uploadedClosedSpareParts WHERE UserId=?', [ssoid], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							// alert(res.rowsAffected)
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},
		
		
		// Delete Deleted defect data from database
		deleteDefectDataDeleted : function(data, callback) {			
			if (data) {				
				$rootScope.db.transaction(function(tx) {
				for(var itm = 0; itm < data.result.length; itm++){					
					var defectData = data.result[itm].u_defect_sys_id;
					//console.log(defectData)
					tx.executeSql('DELETE FROM defectHierarchyData WHERE SysId=?', [defectData], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {							
							callback(true);							
						} else {
							callback(false);							
						}
					});
				}
				});
				//}
			} else {
				callback(false);
			}
		},

		storeBulkDefectHierarchy : function(defectHierarchyArray, callback) {			
			if (defectHierarchyArray && defectHierarchyArray.length > 0) {
				$rootScope.db.transaction(function(tx) {
					var iIndex = 0;
					for (var i = 0; i < defectHierarchyArray.length; i++) {
						if (defectHierarchyArray[i] && defectHierarchyArray[i].sys_id && defectHierarchyArray[i].sys_updated_on) {
							tx.executeSql('INSERT or REPLACE INTO defectHierarchyData (SysId, SysUpdatedOn, DefectHierarchyData) VALUES (?,?,?)', [defectHierarchyArray[i].sys_id, defectHierarchyArray[i].sys_updated_on, Tea.encrypt(JSON.stringify(defectHierarchyArray[i]), $rootScope.dbcommonpass)], function(tx, res) {
								iIndex++;
								if (iIndex == defectHierarchyArray.length) {
									try {
										databasecache.clearDefHierarchyCache();
									} catch(e) {
										alert("ERROR IN THE CACHE")
									}
									callback(true, "");
								}
							});
						}
					}
				});
			}
		},

		getLatestSysUpdatedTimeTicketsForDefectHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT SysUpdatedOn FROM defectHierarchyData order by SysUpdatedOn desc limit 1', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getLatestSysUpdatedTimeTicketsForDefectHierarchyWithRecord : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM defectHierarchyData order by SysUpdatedOn desc limit 1', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getDefectHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM defectHierarchyData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		deleteAllCompletedTickets : function(ssoid, callback) {
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM completedTickets WHERE UserId=? AND OpenBy=?', [ssoid, ssoid], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},

		deleteAllGroupNonGroupCompletedTickets : function(ssoid, isGroup, callback) {
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM completedTickets WHERE UserId=? AND IsGroupTkt=?', [ssoid, isGroup], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},

		storeBulkCompletedTickets : function(completedTicketsArray, ssoid, callback) {
			if (completedTicketsArray && completedTicketsArray.length > 0) {
				$rootScope.db.transaction(function(tx) {
					try {
						if (ssoid && completedTicketsArray && completedTicketsArray.length > 0) {
							var iIndex = 0;
							for (var i = 0; i < completedTicketsArray.length; i++) {
								if (completedTicketsArray[i] && completedTicketsArray[i].sys_id) {
									tx.executeSql('INSERT or REPLACE INTO completedTickets (SysId,UserId,OpenBy,SysUpdatedOn,TicketInfo,IsGroupTkt) VALUES (?,?,?,?,?,?)', [completedTicketsArray[i].sys_id, ssoid, completedTicketsArray[i]["opened_by.user_name"], completedTicketsArray[i].sys_updated_on, Tea.encrypt(JSON.stringify(completedTicketsArray[i]), $rootScope.dbpasscode), 'false'], function(tx, res) {
										iIndex++;
										if (iIndex == completedTicketsArray.length) {
											callback(true);
										}
									});
								}
							}
						} else {
							callback(false);
						}
					} catch(e) {
						callback(false);
					}
				});
			}
		},
		
		storeClosedTickets : function(closedTicketData, ssoid, callback) {			
			if (closedTicketData && closedTicketData.length > 0) {
				$rootScope.db.transaction(function(tx) {
					try {
						if (ssoid && closedTicketData && closedTicketData.length > 0) {
							var iIndex = 0;
							for (var i = 0; i < closedTicketData.length; i++) {								
								tx.executeSql('INSERT or REPLACE INTO closedTickets (SysId,UserId,closedTicketData) VALUES (?,?,?)', [closedTicketData[i].sys_id, ssoid, Tea.encrypt(JSON.stringify(closedTicketData[i]), $rootScope.dbpasscode)], function(tx, res) {
									iIndex++;
									if (iIndex == closedTicketData.length) {
										callback(true);
									}
								});
							}
						} else {
							callback(false);
						}
					} catch(e) {
						callback(false);
					}
				});
			}
		},
		
		storeSpareData : function(spareData, ssoid, callback) {			
			if (spareData && spareData.length > 0) {
				$rootScope.db.transaction(function(tx) {
					try {
						if (ssoid && spareData && spareData.length > 0) {
							var iIndex = 0;
							for (var i = 0; i < spareData.length; i++) {							
								tx.executeSql('INSERT or REPLACE INTO sparePartsData (SysId,UserId,spareData) VALUES (?,?,?)', [spareData[i].sys_id, ssoid, Tea.encrypt(JSON.stringify(spareData[i]), $rootScope.dbpasscode)], function(tx, res) {
									iIndex++;
									if (iIndex == spareData.length) {
										callback(true);
									}
								});
							}
						} else {
							callback(false);
						}
					} catch(e) {
						callback(false);
					}
				});
			}
		},
		
		storeExtendedCRTickets : function(extendedCRData, ssoid, callback) {			
			if (extendedCRData && extendedCRData.length > 0) {
				$rootScope.db.transaction(function(tx) {
					try {
						if (ssoid && extendedCRData && extendedCRData.length > 0) {
							var iIndex = 0;
							for (var i = 0; i < extendedCRData.length; i++) {								
								tx.executeSql('INSERT or REPLACE INTO extendedCR (number,UserId,extendedCRData) VALUES (?,?,?)', [extendedCRData[i].number, ssoid, Tea.encrypt(JSON.stringify(extendedCRData[i]), $rootScope.dbpasscode)], function(tx, res) {
									iIndex++;
									if (iIndex == extendedCRData.length) {
										callback(true);
									}
								});
							}
						} else {
							callback(false);
						}
					} catch(e) {
						callback(false);
					}
				});
			}
		},
		
		getClosedTickets : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM closedTickets WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		getSparePartsData : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM sparePartsData WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		getExtendedCRTickets : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM extendedCR WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		deleteOldClosedTickets : function(ssoid, callback) {			
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM closedTickets WHERE UserId=?', [ssoid], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},
		
		deleteOldSpareData : function(ssoid, callback) {			
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM sparePartsData WHERE UserId=?', [ssoid], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},
		
		deleteOldExtendedCRData : function(ssoid, callback) {			
			if (ssoid) {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('DELETE FROM extendedCR WHERE UserId=?', [ssoid], function(tx, res) {
						if (res && res.rowsAffected && res.rowsAffected > 1) {
							callback(true);
						} else {
							callback(false);
						}
					});
				});
			} else {
				callback(false);
			}
		},
		
		storeBulkCompletedTicketsMyGroup : function(completedTicketsArray, ssoid, callback) {
			if (completedTicketsArray && completedTicketsArray.length > 0) {
				$rootScope.db.transaction(function(tx) {
					try {
						if (ssoid && completedTicketsArray && completedTicketsArray.length > 0) {
							var iIndex = 0;
							for (var i = 0; i < completedTicketsArray.length; i++) {
								if (completedTicketsArray[i] && completedTicketsArray[i].sys_id) {
									tx.executeSql('INSERT or REPLACE INTO completedTickets (SysId,UserId,OpenBy,SysUpdatedOn,TicketInfo,IsGroupTkt) VALUES (?,?,?,?,?,?)', [completedTicketsArray[i].sys_id, ssoid, completedTicketsArray[i]["opened_by.user_name"], completedTicketsArray[i].sys_updated_on, Tea.encrypt(JSON.stringify(completedTicketsArray[i]), $rootScope.dbpasscode), 'true'], function(tx, res) {
										iIndex++;
										if (iIndex == completedTicketsArray.length) {
											callback(true);
										}
									});
								}
							}
						} else {
							callback(false);
						}
					} catch(e) {
						callback(false);

					}
				});
			}
		},

		getLatestSysUpdatedTimeTickets : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT SysUpdatedOn FROM completedTickets WHERE UserId=? order by SysUpdatedOn desc limit 1', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getLatestSysUpdatedForUploadedTicketsWithRecords : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM completedTickets WHERE UserId=? order by SysUpdatedOn desc limit 1', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getCompletedTickets : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM completedTickets WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		storeBulkAccountHierarchy : function(accountHierarchyArray, callback) {
			if (accountHierarchyArray && accountHierarchyArray.length > 0) {
				//console.log(accountHierarchyArray)
				$rootScope.db.transaction(function(tx) {
					var iIndex = 0;
					for (var i = 0; i < accountHierarchyArray.length; i++) {
						if (accountHierarchyArray[i] && accountHierarchyArray[i].sys_id && accountHierarchyArray[i].sys_updated_on) {
							if (accountHierarchyArray[i] && accountHierarchyArray[i].u_operational_status && accountHierarchyArray[i].sys_id && accountHierarchyArray[i].sys_id.length > 0 && accountHierarchyArray[i].u_operational_status == 'Moved') {
								//Removed the moved oprational status
								var systemGenId = accountHierarchyArray[i].sys_id;
								tx.executeSql('DELETE FROM accountHierarchyData WHERE SysId=?', [systemGenId], function(tx, res) {
									iIndex++;
									if (iIndex == accountHierarchyArray.length) {
										try {
											databasecache.clearAccHierarchyCache();
										} catch(e) {
											alert("ERROR IN AC CACHE")
										}
										callback(true, "");
									}
								});
							} else {
								tx.executeSql('INSERT or REPLACE INTO accountHierarchyData (SysId,SysUpdatedOn,Country,AccountHierarchyData) VALUES (?,?,?,?)', [accountHierarchyArray[i].sys_id, accountHierarchyArray[i].sys_updated_on, accountHierarchyArray[i].u_country, Tea.encrypt(JSON.stringify(accountHierarchyArray[i]), $rootScope.dbcommonpass)], function(tx, res) {
									iIndex++;
									if (iIndex == accountHierarchyArray.length) {
										try {
											databasecache.clearAccHierarchyCache();
										} catch(e) {
											alert("ERROR IN AC CACHE")
										}
										callback(true, "");
									}
								});
							}

						}
					}
				});
			}
		},

		getLatestSysUpdatedTimeTicketsForAccountHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT SysUpdatedOn FROM accountHierarchyData order by SysUpdatedOn desc limit 1', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getLatestDetailsSysUpdatedTimeTicketsForAccountHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM accountHierarchyData order by SysUpdatedOn desc limit 1', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getAccountHierarchy : function(callback) {
			if($rootScope.usersCountryCode){
					$rootScope.db.transaction(function(tx) {										   
					tx.executeSql('SELECT * FROM accountHierarchyData WHERE Country=?', [$rootScope.usersCountryCode], function(tx, results) {
						if (results && results.rows && results.rows.length > 0) {
							callback(results);
						} else {
							callback(null);
						}
					});
				});
			} else{
				$rootScope.db.transaction(function(tx) {										   
				tx.executeSql('SELECT * FROM accountHierarchyData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
			}
			
			
		},
		
           getAccountHierarchyAll : function(callback) {
           
           $rootScope.db.transaction(function(tx) {										   
                                     tx.executeSql('SELECT * FROM accountHierarchyData', [], function(tx, results) {
                                                   if (results && results.rows && results.rows.length > 0) {
                                                   callback(results);
                                                   } else {
                                                   callback(null);
                                                   }
                                                   });
                                     });
          
           
           
           },
           
           
		getCountryFromAccountHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {										   
				tx.executeSql('SELECT Country FROM accountHierarchyData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		getAllCountryFromDB : function(callback) {
			$rootScope.db.transaction(function(tx) {										   
				tx.executeSql('SELECT * FROM allCountryData', [], function(tx, results) {					
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
					
					
					
					
				});
			});
		},
		
		getStateFromAccountHierarchy : function(callback) {
			$rootScope.db.transaction(function(tx) {										   
				tx.executeSql('SELECT * FROM accountHierarchyData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		storePendingTicket : function(ticketId, userId, type, sysUpdatedOn, ticketInfo, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('INSERT or REPLACE INTO pendingTickets (TicketId,UserId,Type,SysUpdatedOn,TicketInfo) VALUES (?,?,?,?,?)', [ticketId, userId, type, sysUpdatedOn, Tea.encrypt(JSON.stringify(ticketInfo), $rootScope.dbpasscode)], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
		
		getPendingTickets : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM pendingTickets WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},		
		

		getPendingTicketBasedonTicketId : function(ticketId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM pendingTickets WHERE TicketId=?', [ticketId], function(tx, results) {
					// alert('11')
					// alert(results.rows.length)
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		getPendingTicketBasedonTicketIdAndUserId : function(ticketId, userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM pendingTickets WHERE TicketId=? AND UserId=?', [ticketId, userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						var records = [];
						for (var i = 0; i < results.rows.length; i++) {
							records.push(angular.fromJson(Tea.decrypt(results.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
						}
						callback(records);
					} else {
						callback(null);
					}
				});
			});
		},

		getPendingTicketsCount : function(userId, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT COUNT(*) AS count FROM pendingTickets WHERE UserId=?', [userId], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},

		deletePendingTickets : function(ticketId, callback) {
			$rootScope.db.transaction(function(tx) {											   
				tx.executeSql('DELETE FROM pendingTickets WHERE TicketId=?', [ticketId], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},

		/**
		 * Store User info based on the ssoid
		 */
		storeUserInfo : function(userId, user, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('INSERT or REPLACE INTO User (UserId,UserInfo) VALUES (?,?)', [userId, Tea.encrypt(JSON.stringify(user), $rootScope.dbpasscode)], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						try {
							databasecache.clearUserInfoDataCache();
						} catch(e) {
							alert("ERROR IN DE clearUserInfoDataCache")
						}
						callback(true);
					} else {
						try {
							databasecache.clearUserInfoDataCache();
						} catch(e) {
							alert("ERROR IN DE clearUserInfoDataCache")
						}
						callback(false);
					}
				});
			});
		},

		/**
		 * Get complete user info based on the SSO
		 */
		getUserInfo : function(userId, callback) {
			if (databasecache.userInfoData) {
				callback(databasecache.userInfoData);
			} else {
				$rootScope.db.transaction(function(tx) {
					tx.executeSql('SELECT * FROM User WHERE UserId=?', [userId], function(tx, results) {
						if (results && results.rows && results.rows.length > 0) {
							databasecache.userInfoData = results;
							callback(results);
						} else {
							databasecache.userInfoData = null;
							callback(null);
						}
					});
				});
			}
		},
		
		/**
		 * Get the users groups detail from PW Master Data
		 */
		loadPwMasterData : function(country, group, callback) {			
			$rootScope.db.transaction(function(tx) {
					tx.executeSql('SELECT * FROM pwMasterData WHERE Country=? AND uTable=?', [country, group], function(tx, results) {						
						if (results && results.rows && results.rows.length > 0) {																		
							callback(results);
						} else {							
							callback(null);
						}
					});
				});			
		},
		
		loadPwMasterDataAll : function(country, callback) {		
			$rootScope.db.transaction(function(tx) {
					tx.executeSql('SELECT * FROM pwMasterData WHERE Country=?', [country], function(tx, results) {						
						if (results && results.rows && results.rows.length > 0) {																		
							callback(results);
						} else {							
							callback(null);
						}
					});
				});			
		},
		
		storeControllersOperationalData : function(data, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('INSERT or REPLACE INTO controllersData (Data) VALUES (?)', [Tea.encrypt(JSON.stringify(data), $rootScope.dbpasscode)], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
		storeCountryPoleData : function(data, callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('INSERT or REPLACE INTO CountryPoleData (Data) VALUES (?)', [Tea.encrypt(JSON.stringify(data), $rootScope.dbpasscode)], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
				
		storePwMasterData : function(data, callback) {
			if (data && data.length > 0) {
				$rootScope.db.transaction(function(tx) {
					var iIndex = 0;
					for (var i = 0; i < data.length; i++) {
						if (data[i] && data[i].sys_id) {
							tx.executeSql('INSERT or REPLACE INTO pwMasterData (SysId, Country, uTable, GroupData) VALUES (?,?,?,?)', [data[i].sys_id, data[i].u_country, data[i].u_table, Tea.encrypt(JSON.stringify(data[i]), $rootScope.dbcommonpass)], function(tx, res) {
								iIndex++;
								if (iIndex == data.length) {
									callback(true, "");
								}
							});
						}
					}
				});
			}
		},
		
		storeAllCountryData : function(data, callback) {
			if (data && data.length > 0) {
				$rootScope.db.transaction(function(tx) {
					var iIndex = 0;
					for (var i = 0; i < data.length; i++) {
						if (data[i] && data[i].sys_id) {
							tx.executeSql('INSERT or REPLACE INTO allCountryData (SysId, GroupData) VALUES (?,?)', [data[i].sys_id, JSON.stringify(data[i])], function(tx, res) {
								iIndex++;
								if (iIndex == data.length) {
									callback(true, "");
								}
							});
						}
					}
				});
			}
		},
		
		getControllersOperationalData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM controllersData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {						
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		getCountryPoleData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM CountryPoleData', [], function(tx, results) {
					if (results && results.rows && results.rows.length > 0) {						
						callback(results);
					} else {
						callback(null);
					}
				});
			});
		},
		
		deleteControllersOperationalData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('DELETE FROM controllersData', [], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
		
		deleteCountryPoleData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('DELETE FROM CountryPoleData', [], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
		
		deletePwMasterData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('DELETE FROM pwMasterData', [], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
		
		deleteAllCountryData : function(callback) {
			$rootScope.db.transaction(function(tx) {
				tx.executeSql('DELETE FROM allCountryData', [], function(tx, res) {
					if (res && res.rowsAffected && res.rowsAffected == 1) {
						callback(true);
					} else {
						callback(false);
					}
				});
			});
		},
	}
}).factory('pendingTicketUploadProcess', function($ionicLoading, $parse, $rootScope, $q, $http, database, applicationServices, $localstorage) {
	return {
		/**
		 * fetchRecords for My and My group open tickets
		 * @param {Object} ssoid
		 * @param {Object} reqTS
		 * @param {Object} callback
		 */
		fetchRecords : function(ssoid, reqTS, callback) {
			try {
				var promise = applicationServices.getMyAndMyGroupOpenTicketsData(ssoid);
				promise.then(function(payload) {
					if (payload) {
						if (payload && payload.status == 200 && payload.data && payload.data.result && payload.data.result.length > 0) {
							database.storeBulkCompletedTickets(payload.data.result, ssoid, function(data) {
								callback(data);
							});
						}
					}
				}, function(errorPayload) {
				});
			} catch(e) {
			}
		},

		/**
		 * Create the UI of pending items based on the SSOId
		 * @param {Object} ssoid
		 * @param {Object} scope
		 */
		createUI : function(ssoid, scope) {
			try {
				database.getCompletedTickets(ssoid, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						var compltedTaskArray = [];
						for (var i = 0; i < result.rows.length; i++) {
							if (result.rows.item(i).UserId == ssoid) {
								compltedTaskArray.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
							}
						}
						scope.completedItems = compltedTaskArray;
					} else {
						scope.completedItems = [];
					}
				});
			} catch(e) {
			}
		},

		/**
		 * Create the UI after upload for pending items
		 * @param {Object} scope
		 */
		uploadPendingTicketsUI : function(scope) {
			var ssoid = $localstorage.get('SN-LOGIN-SSO')
			if (ssoid) {
				database.getPendingTickets(ssoid, function(result) {
					if (result && result.rows && result.rows.length > 0) {
						for (var i = result.rows.length - 1; i >= 0; i--) {
							scope.pendingListItems.push(angular.fromJson(Tea.decrypt(result.rows.item(i).TicketInfo, $rootScope.dbpasscode)));
						}
						scope.pendingItems = scope.pendingListItems;
					} else {
						scope.pendingItems = [];
					}
				});
			}
		},

		hideServicePleaseWait : function() {
			$ionicLoading.hide();
		},

		/*
		pendingTicektsSettingUI : function(ssoid, scope) {
		try {
		database.getPendingTicketsCount(ssoid, function(results) {
		if (results && results.rows && results.rows.length > 0) {
		// console.log(scope.ptcount);
		setTimeout(function() {
		alert(results.rows.item(0).count);
		scope.ptcount = results.rows.item(0).count;
		scope.$apply();
		//this triggers a $digest
		}, 500);

		}
		});
		} catch(e) {
		}
		},*/

		/**
		 * Create the UI for the uploaded Tickets
		 * @param {Object} scope
		 */
		uploadCompletedTicketsUI : function(scope) {
			var me = this;
			var ssoid = $localstorage.get('SN-LOGIN-SSO')
			if (ssoid) {
				try {
					database.getLatestSysUpdatedTimeTickets(ssoid, function(results) {
						if (results && results.rows && results.rows.length > 0) {
							me.createUI(ssoid, scope);
							var reqTS = "'2014-10-10 23:59:59'";
							try {
								reqTS = results.rows.item(0).SysUpdatedOn;
							} catch(e) {

							}
							me.fetchRecords(ssoid, reqTS, function(data) {
								if (data) {
									me.createUI(ssoid, scope);
								}
							});
						} else {
							var reqTS = "'2014-10-10 23:59:59'";
							me.fetchRecords(ssoid, reqTS, function(data) {
								if (data) {
									me.createUI(ssoid, scope);
								}
							});
						}
					});
				} catch(e) {
				}
			}
		},

		/**
		 * Upload the pending items to service now one by one
		 * @param {Object} ticketform  : Details of the single ticket
		 */
		uploadSingleTicket : function(ticketform) {			
			return $http({
				method : ticketform.methodType,
				url : ticketform.url,
				data : ticketform.data,
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				},
			}).success(function(data, status, headers, config) {
				if (ticketform.deleteRecord) {
					if (ticketform.type) {
						
						if (ticketform.type == 'ACCOUNTHIERARCHY') {
							if (ticketform.data.ticketId) {
								database.deletePendingTickets('ACCOUNTHIERARCHY' + ticketform.data.ticketId, function(status) {
								});
							}
						} else if (ticketform.type == 'MY_SPARE_PART') {
							if (ticketform.data.number) {
								database.deletePendingTickets(ticketform.data.number + '_OSP', function(status) {
								});
							}
						} else if (ticketform.type == 'ORDER_SPARE_PART') {							
							if (ticketform.data.number) {
								database.deletePendingTickets(ticketform.data.number, function(status) {
								});
							}
						} else if (ticketform.type == 'MY_GROUP_SPARE_PART') {
							if (ticketform.data.number) {
								database.deletePendingTickets(ticketform.data.number + '_OSP', function(status) {
								});
							}
						} else if (ticketform.type == 'CORRECTION') {
							if (ticketform.number) {								
								database.deletePendingTickets(ticketform.number, function(status) {
								});
							}
						} else if (ticketform.type == 'NEWACCOUNT') {
							if (ticketform.data.ticketId) {							
								database.deletePendingTickets(ticketform.data.ticketId, function(status) {
								});
							}
						} else {
							//console.log(ticketform.data.ticketId)
							if (ticketform.data.ticketId) {
								database.deletePendingTickets(ticketform.data.ticketId, function(status) {
								});
							}
						}
					}
				}
			}).error(function(data, status, headers, config) {
				// console.log(data, status, headers, config);
			});
		},

		/**
		 * Start the process of uploading the tickets to SN.
		 * @param {Object} tickets : Ticket queue
		 */
		uploadTicketsSequential : function(tickets) {
			var me = this;
			var previous = $q.when(null)//initial start promise that's already resolved
			for (var i = 0; i < tickets.length; i++) {( function(i) {
						previous = previous.then(function() {//wait for previous operation
							return me.uploadSingleTicket(tickets[i])
						})
					}(i)) //create a fresh scope for i as the `then` handler is asynchronous
			}
			return previous
		},

		/**
		 * Create the request for each and every tickets to service now upload
		 * @param {Object} ticketforms
		 * @param {Object} scope
		 */
		uploadTicketsToServiceNow : function(ticketforms, scope, callback) {
			var tickets = [];
			var me = this;
			for (var i = 0; i < ticketforms.length; i++) {
				var requestType = {
					deleteRecord : "",
					url : "",
					methodType : "",
					type : "",
					data : ""
				};
				if (ticketforms[i] && ticketforms[i].Type && ticketforms[i].Type == 'ACCOUNTHIERARCHY') {
					if (ticketforms[i].sys_id) {
						if (ticketforms[i].flagofcommissing == 'true'){ // Setting flag for offline
						var itemsToUpload = {
							"u_account_name" : ticketforms[i].u_account_name,
							"u_pole" : ticketforms[i].u_pole,
							"u_sold_to" : ticketforms[i].u_sold_to,
							"u_city" : ticketforms[i].u_city,
							"u_ship_to" : ticketforms[i].u_ship_to,
							"u_state" : ticketforms[i].u_state,
							"u_duns_number" : ticketforms[i].u_duns_number,
							"u_country" : ticketforms[i].u_country,
							"u_notes" : ticketforms[i].u_notes,							
							"u_system_name" : ticketforms[i].u_system_name,
							"u_controller_type" : ticketforms[i].u_controller_type,
							"u_cam_serial_number" : ticketforms[i].u_cam_serial_number,
							"u_fluidics_serial_number" : ticketforms[i].u_fluidics_serial_number,
							"u_controller_serial_id" : ticketforms[i].u_controller_serial_id,
							"u_icc_skid_serial_number" : ticketforms[i].u_icc_skid_serial_number,							
							"u_sap_pe_no" : ticketforms[i].u_sap_pe_no,
							"u_salesorg" : ticketforms[i].u_salesorg,
							"u_ship_date" : ticketforms[i].u_ship_date,
							"u_salesdistrictid" : ticketforms[i].u_salesdistrictid,
							"u_region" : ticketforms[i].u_region,
							"u_salesregionid" : ticketforms[i].u_salesregionid,
							"u_contract_details" : ticketforms[i].u_contract_details,							
							"u_operational_status" : ticketforms[i].u_operational_status,
							"u_hw_kits" : ticketforms[i].u_hw_kits,
							"u_electrical_cover_box" : ticketforms[i].u_electrical_cover_box,
							"u_ethernet_kits" : ticketforms[i].u_ethernet_kits,
							"u_ts2_firmware_rev" : ticketforms[i].u_ts2_firmware_rev,
							"u_temperature_c_or_f" : ticketforms[i].u_temperature_c_or_f,
							"u_changes_from" : "Mobile",
							"u_mrc__psc_firmware_rev" : ticketforms[i].u_mrc__psc_firmware_rev,
							"u_date_of_upgrade" : ticketforms[i].u_date_of_upgrade,
							"u_update_date" : ticketforms[i].u_update_date,
							"u_control_status" : ticketforms[i].u_control_status,
							"u_fluidic_cooler_option" : ticketforms[i].u_fluidic_cooler_option,
							"u_changes_date" : '' + ticketforms[i].currentUTCDate,	
							"u_dateofcommissing" : '' + ticketforms[i].u_dateofcommissing,
							"u_flagdateofcommissing" : '' + ticketforms[i].flagofcommissing,					
							"ticketId" : '' + ticketforms[i].sys_id,
							"u_asset_number" : '' + ticketforms[i].u_asset_numbe,
							"u_asset_type" : '' + ticketforms[i].u_asset_type,
							"u_market_sector" : '' + ticketforms[i].u_market_sector,
							"u_dcs_connection" : '' + ticketforms[i].u_dcs_connection
						};
						}
						else{
							var itemsToUpload = {
							"u_account_name" : ticketforms[i].u_account_name,
							"u_pole" : ticketforms[i].u_pole,
							"u_sold_to" : ticketforms[i].u_sold_to,
							"u_city" : ticketforms[i].u_city,
							"u_ship_to" : ticketforms[i].u_ship_to,
							"u_state" : ticketforms[i].u_state,
							"u_duns_number" : ticketforms[i].u_duns_number,
							"u_country" : ticketforms[i].u_country,
							"u_notes" : ticketforms[i].u_notes,							
							"u_system_name" : ticketforms[i].u_system_name,
							"u_controller_type" : ticketforms[i].u_controller_type,
							"u_cam_serial_number" : ticketforms[i].u_cam_serial_number,
							"u_fluidics_serial_number" : ticketforms[i].u_fluidics_serial_number,
							"u_controller_serial_id" : ticketforms[i].u_controller_serial_id,
							"u_icc_skid_serial_number" : ticketforms[i].u_icc_skid_serial_number,							
							"u_sap_pe_no" : ticketforms[i].u_sap_pe_no,
							"u_salesorg" : ticketforms[i].u_salesorg,
							"u_ship_date" : ticketforms[i].u_ship_date,
							"u_salesdistrictid" : ticketforms[i].u_salesdistrictid,
							"u_region" : ticketforms[i].u_region,
							"u_salesregionid" : ticketforms[i].u_salesregionid,
							"u_contract_details" : ticketforms[i].u_contract_details,							
							"u_operational_status" : ticketforms[i].u_operational_status,
							"u_hw_kits" : ticketforms[i].u_hw_kits,
							"u_electrical_cover_box" : ticketforms[i].u_electrical_cover_box,
							"u_ethernet_kits" : ticketforms[i].u_ethernet_kits,
							"u_ts2_firmware_rev" : ticketforms[i].u_ts2_firmware_rev,
							"u_temperature_c_or_f" : ticketforms[i].u_temperature_c_or_f,
							"u_changes_from" : "Mobile",
							"u_mrc__psc_firmware_rev" : ticketforms[i].u_mrc__psc_firmware_rev,
							"u_date_of_upgrade" : ticketforms[i].u_date_of_upgrade,
							"u_update_date" : ticketforms[i].u_update_date,
							"u_control_status" : ticketforms[i].u_control_status,
							"u_fluidic_cooler_option" : ticketforms[i].u_fluidic_cooler_option,
							"u_changes_date" : '' + ticketforms[i].currentUTCDate,											
							"ticketId" : '' + ticketforms[i].sys_id,
							"u_asset_number" : '' + ticketforms[i].u_asset_numbe,
							"u_asset_type" : '' + ticketforms[i].u_asset_type,
							"u_market_sector" : '' + ticketforms[i].u_market_sector,
							"u_dcs_connection" : '' + ticketforms[i].u_dcs_connection
						};
						}					
						requestType.type = ticketforms[i].Type;
						requestType.deleteRecord = true;
						requestType.url = $rootScope.baserootURL + 'api/now/table/u_account_hierarchy/' + ticketforms[i].sys_id;
						requestType.methodType = 'PUT';
						requestType.data = itemsToUpload;
						tickets.push(requestType);
					}
				} else if ((ticketforms[i] && ticketforms[i].Type && ticketforms[i].Type == 'MY_SPARE_PART') || (ticketforms[i] && ticketforms[i].Type && ticketforms[i].Type == 'ORDER_SPARE_PART')) {
					//WIP
					requestType.type = ticketforms[i].Type;
					requestType.deleteRecord = true;
					requestType.url = $rootScope.baserootURL + "api/now/import/u_order_spare_parts_stage";
					requestType.methodType = 'POST';
					requestType.data = ticketforms[i];
					//console.log(requestType)
					tickets.push(requestType);
				} else if (ticketforms[i] && ticketforms[i].Type && ticketforms[i].Type == 'NEWACCOUNT') {
					//WIP
					requestType.type = ticketforms[i].Type;
					requestType.deleteRecord = true;
					requestType.url = $rootScope.baserootURL + "api/now/import/u_extend_cr_stage?sysparm_input_display_value=false";
					requestType.methodType = 'POST';
					requestType.data = ticketforms[i];
					//console.log(requestType)
					tickets.push(requestType);
				} else if (ticketforms[i] && ticketforms[i].Type && ticketforms[i].Type == 'CORRECTION'){					
					var isCorrection = false;
					var serialCorrection = false;
					var correctionItem = {};
					var SerialcorrectionItem = {};
					
					if ((ticketforms[i].u_system_name_correction && ticketforms[i].u_system_name_correction.length > 0) && (ticketforms[i].u_controller_type_correction && ticketforms[i].u_controller_type_correction.length > 0)) {
						correctionItem.u_controller_type = ticketforms[i].u_controller_type_correction;
						correctionItem.u_system_name = ticketforms[i].u_system_name_correction;

						correctionItem.u_master_asset_tag_no = ticketforms[i].u_system_name_correction;
						correctionItem.u_controller_type = ticketforms[i].u_controller_type_correction;
						isCorrection = true;
					} else {
						if (ticketforms[i].u_system_name_correction && ticketforms[i].u_system_name_correction.length > 0) {
							correctionItem.u_system_name = ticketforms[i].u_system_name_correction;
							correctionItem.u_master_asset_tag_no = ticketforms[i].u_system_name_correction;
							isCorrection = true;
						} else if (ticketforms[i].u_controller_type_correction && ticketforms[i].u_controller_type_correction.length > 0) {
							correctionItem.u_controller_type = ticketforms[i].u_controller_type_correction;
							correctionItem.u_controller_type = ticketforms[i].u_controller_type_correction;
							isCorrection = true;
						}
					}
					
					if ((ticketforms[i].u_cam_serial_number_new && ticketforms[i].u_cam_serial_number_new.length > 0)) {
						var serialCorrection = true;						

					}
					
					if (isCorrection && !serialCorrection) {
						requestType.type = ticketforms[i].Type;
						requestType.number = ticketforms[i].ticketId;
						requestType.deleteRecord = true;
						requestType.url = $rootScope.baserootURL + 'api/now/table/u_account_hierarchy/' + ticketforms[i].sys_id_correction;
						requestType.methodType = 'PUT';
						requestType.data = correctionItem;
						//console.log('correction'+ticketforms[i].Type)
						tickets.push(requestType);
					}
					if(serialCorrection && !isCorrection){						
							var serialCorrectionItem = {};						
							serialCorrectionItem = {
								"opened_by" : ticketforms[i].userId,
								"u_city" : ticketforms[i].serial_temp_sys_id,
								"state" : '1',
								"u_new_cam_elec_serial" : ticketforms[i].u_cam_serial_number_new,
								"u_new_fluidics_serial" : ticketforms[i].u_fluidics_serial_number_new,
								"u_new_controller_serial_no" : ticketforms[i].u_controller_serial_id_new,
								"u_new_icc_skid_serial_no" : ticketforms[i].u_icc_skid_serial_number_new							
							};							
							var requestTypeTmp = {
								deleteRecord : "",
								url : "",
								methodType : "",
								type : "",
								data : ""
							};
							requestTypeTmp.type = ticketforms[i].Type;
							requestTypeTmp.number = ticketforms[i].ticketId;
							requestTypeTmp.deleteRecord = true;
							requestTypeTmp.url = $rootScope.baserootURL + 'api/now/import/u_change_approval_stage?sysparm_input_display_value=false';
							requestTypeTmp.methodType = 'POST';
							requestTypeTmp.data = serialCorrectionItem;
							tickets.push(requestTypeTmp);						
					}
					if(isCorrection && serialCorrection){
						requestType.type = ticketforms[i].Type;
						requestType.deleteRecord = false;
						requestType.url = $rootScope.baserootURL + 'api/now/table/u_account_hierarchy/' + ticketforms[i].sys_id_correction;
						requestType.methodType = 'PUT';
						requestType.data = correctionItem;
						tickets.push(requestType);
						var serialCorrectionItem = {};						
							serialCorrectionItem = {
								"opened_by" : ticketforms[i].userId,
								"u_city" : ticketforms[i].serial_temp_sys_id,
								"state" : '1',
								"u_new_cam_elec_serial" : ticketforms[i].u_cam_serial_number_new,
								"u_new_fluidics_serial" : ticketforms[i].u_fluidics_serial_number_new,
								"u_new_controller_serial_no" : ticketforms[i].u_controller_serial_id_new,
								"u_new_icc_skid_serial_no" : ticketforms[i].u_icc_skid_serial_number_new							
							};							
							var requestTypeTmp = {
								deleteRecord : "",
								url : "",
								methodType : "",
								type : "",
								data : ""
							};
							requestTypeTmp.type = ticketforms[i].Type;
							requestTypeTmp.number = ticketforms[i].ticketId;
							requestTypeTmp.deleteRecord = true;
							requestTypeTmp.url = $rootScope.baserootURL + 'api/now/import/u_change_approval_stage?sysparm_input_display_value=false';
							requestTypeTmp.methodType = 'POST';
							requestTypeTmp.data = serialCorrectionItem;
							tickets.push(requestTypeTmp);						
						
					}
				}
				
				
				
				else {	
						
						var requestTypeAfterCorrection = {};
						requestTypeAfterCorrection.type = ticketforms[i].Type;
						requestTypeAfterCorrection.deleteRecord = true;
						requestTypeAfterCorrection.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process_stage?sysparm_input_display_value=false';
						requestTypeAfterCorrection.methodType = 'POST';
						requestTypeAfterCorrection.data = ticketforms[i];
						tickets.push(requestTypeAfterCorrection);
					
							
					/*		if (ticketforms[i].comments && ticketforms[i].comments.length > 0) {
							//Check if its comment update only?	
							
							var requestTypeForComments = {};
							requestTypeForComments.deleteRecord = false;
							requestTypeForComments.type = ticketforms[i].Type;
							requestTypeForComments.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process/' + ticketforms[i].sys_id;
							requestTypeForComments.methodType = 'PUT';
							var reqData = {};
							reqData.comments = ticketforms[i].comments;							
							reqData.u_fluidic_cooler_option = ticketforms[i].u_fluidic_cooler_option;
							reqData.ticketId = ticketforms[i].sys_id;
							requestType.data = reqData;
							tickets.push(requestTypeForComments);
							}
					*/		
							if(ticketforms[i].sys_id && ticketforms[i].sys_id.length > 0){
								requestType.deleteRecord = true;
								//console.log("ticketforms[i].Type is ",ticketforms[i].Type)
								requestType.type = ticketforms[i].Type;
								//requestType.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process_stage?sysparm_input_display_value=false';
								requestType.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process/' + ticketforms[i].sys_id;
								requestType.methodType = 'PUT';
								//requestType.methodType = 'POST';
								requestType.data = ticketforms[i];
								tickets.push(requestType);
							}
							/*else{
								requestType.deleteRecord = true;
								//console.log("ticketforms[i].Type is ",ticketforms[i].Type)
								requestType.type = ticketforms[i].Type;
								requestType.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process_stage?sysparm_input_display_value=false';
								//requestType.url = $rootScope.baserootURL + 'api/now/table/u_true_sense_process/' + ticketforms[i].sys_id;
								//requestType.methodType = 'PUT';
								requestType.methodType = 'POST';
								requestType.data = ticketforms[i];
								tickets.push(requestType);
							}*/
							
							
						
					
				}
			}
			var uploadOperation = this.uploadTicketsSequential(tickets);
			uploadOperation.then(function(file) {
				me.uploadPendingTicketsUI(scope);
				me.uploadCompletedTicketsUI(scope);
				me.hideServicePleaseWait();
				if (callback) {
					callback();
				}
			}, function(err) {
				me.hideServicePleaseWait();
			});
		},
	}
});
