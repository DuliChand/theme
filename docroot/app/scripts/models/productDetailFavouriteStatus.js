/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.ProductDetailFavouriteStatus = Backbone.Model.extend({

    	sync : function(method, model, options) {
			var data = model.toJSON(),
				vendorProductId = data.vendorProductId,
				fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
				urlBase = URL_PROPERTIES.get('SERVICE_URL_IS_FAVOURITE_PRODUCT'),
				urlBase = urlBase.replace("{deviceId}", fnyToken),
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