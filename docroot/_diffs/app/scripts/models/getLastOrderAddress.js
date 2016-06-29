/*global Webshop, Backbone*/
var FnyCustomToken = $('#FnyCustomToken').data('tokenid');

Webshop.Models = Webshop.Models || {};



(function() {
    'use strict';

    Webshop.Models.GetLastOrderAddress = Backbone.Model.extend({

		validation : {

		},
		sync : function(method, model, options) {
			//console.log("newtoken in billing addr  --"+FnyCustomToken);
			
			var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
				fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
				urlBase = URL_PROPERTIES.get('GET_LAST_ORDER_ADDRESS'),
				tempUrlRoot = urlBase.replace("{deviceId}", fnyToken),
				urlRoot = tempUrlRoot.replace("{customerId}", customerId),
				
				params = _.extend({
					type : 'GET',
					dataType : 'json',
					url : urlRoot,
					processData : false,
					data : ""
				}, options);
		
			return $.ajax(params);
		}
	});
	
})();