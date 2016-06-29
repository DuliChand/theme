/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProductTopKeyword = Backbone.Model.extend({
		sync : function(method, model, options) {

				//var urlRoot = URL_PROPERTIES.get('SERVICE_URL_FILTERED_PRODUCTS'), 
				var urlRoot = 'http://172.16.1.182:8080/business-web/search/business?operationType=getTopSearchTerms',
				
				params = _.extend({
					type : 'GET',
					beforeSend : function(xhr) {
						xhr.withCredentials = true;
					},
					contentType : "application/json; charset=utf-8",
					dataType : 'json',
					url : urlRoot,
					processData : false,
				}, options);
				return $.ajax(params);
			}

});

})();
