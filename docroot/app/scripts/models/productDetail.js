/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProductDetail = Backbone.Model.extend({
    	sync : function(method, model, options) {
			var data = model.toJSON(),
				vendorProductId = $("#backbone-portlet-product").data("product-id"),
				eventId = $("#backbone-portlet-product").data("event-id"),
				urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_PRODUCT'),
				urlBase = urlBase.replace("{eventId}", eventId),
				urlRoot = urlBase.replace("{vendorProductId}", vendorProductId),
				
				params = _.extend({
					type : 'GET',
					dataType : 'json',
					url : urlRoot,
					processData : false,
					data : $.param(data)
				}, options);
			
			return $.ajax(params);
		}

    });
})();