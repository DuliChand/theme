/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.EventFilteredProducts = Backbone.Model.extend({
    	sync : function(method, model, options) {
				var data = model.toJSON(),
					listingId = $("#backbone-portlet-event-product-listing").data("id"),
					listingType = $("#backbone-portlet-event-product-listing").data("type"),

					urlRoot = "", 
					json_data = JSON.stringify(data);
				
				if(listingType === "event") {
					
					urlRoot = URL_PROPERTIES.get('SERVICE_URL_FILTERED_PRODUCTS');
				}
				
				if(listingType === "category") {
					
					urlRoot = URL_PROPERTIES.get('SERVICE_URL_CATEGORY_PRODUCTS');
				}

				var params = _.extend({
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