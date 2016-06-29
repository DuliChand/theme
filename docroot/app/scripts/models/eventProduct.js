/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.EventProduct = Backbone.Model.extend({
sync : function(method, model, options) {
			var data = model.toJSON(),
				vendorProductId = data.vendorProductId,
				eventId = data.eventId, 
				urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_PRODUCT'),
				urlBase = urlBase.replace("{eventId}", eventId),
				urlRoot = urlBase.replace("{vendorProductId}", vendorProductId),
				
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
		