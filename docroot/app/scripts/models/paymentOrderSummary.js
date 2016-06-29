/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.PaymentOrderSummary = Backbone.Model.extend({
    	 sync: function (method, model, options) {
			
    	  	var orderId = $("#backbone-portlet-after-sales").data("id"),
				urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_AGGREGATED_ORDER'),
				urlRoot = urlBase.replace("{orderId}", orderId),
							
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