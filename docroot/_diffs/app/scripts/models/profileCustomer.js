/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.ProfileCustomer = Backbone.Model.extend({
    	sync : function(method, model, options) {
			
			var urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_CUSTOMER'),
			fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
			urlRoot = urlBase.replace("{deviceId}", fnyToken),
		    
			data = {
			    	customerWrapper:{
						customers : [ {
							customerId : $.cookie('COOKIE_FNY_CUSTOMER_ID')
						} ]
			       }
			   },
				
		    json_data = JSON.stringify(data),
			
			params = _.extend({
				type : 'POST',
				beforeSend : function(xhr) {
					xhr.withCredentials = true;
				},
				contentType : "application/json; charset=utf-8",
				dataType : 'json',
				url : urlRoot,
				processData : false,
				data : json_data
			}, options);
			return $.ajax(params);
	
		}

    });
})();