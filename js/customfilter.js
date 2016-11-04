/**
 *Custom filter used for application
 */
angular.module('TrueSense').filter('formatdatetime', function($filter) {
	return function(input) {
		if (input == null) {
			return "";
		}
		var _date = $filter('date')(new Date(input), "dd MMM, yyyy 'at' h:mma");
		return _date;
	};
}).filter('customFilter', function() {
	/**
	 *Custom search
	 */
	return function(items, search) {
		if (!search) {
			return items;
		}
		if (search && search.length < 4) {
			return items;
		}

		var searchType = search;
		if (!searchType || '' === searchType) {
			return items;
		}

		return items.filter(function(element, index, array) {
			return (element.label.toUpperCase().indexOf(searchType.toUpperCase()) != -1);
		});

	};
});

