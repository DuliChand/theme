/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProductDetailRemoveFromFavourites = Backbone.Model.extend({
    	sync : function(method, model, options) {
			var data = model.toJSON(),
				createdTime = data.createdTime,
				fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
				urlBase = URL_PROPERTIES.get('SERVICE_URL_REMOVE_FAVOURITE_PRODUCT'),
				urlBase = urlBase.replace("{deviceId}", fnyToken),
				urlRoot = urlBase.replace("{createdTime}", createdTime),
				
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