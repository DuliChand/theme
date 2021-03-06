/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.EventAddProductToFavourites = Backbone.Model.extend({
sync : function(method, model, options) {
				
				var json_data1 = JSON.stringify({
					favoriteDTO : model.toJSON()
				});
				var data = model.toJSON(),
					fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')), 
					urlBase = URL_PROPERTIES.get('SERVICE_URL_ADD_FAVOURITE_PRODUCT'),
					urlRoot = urlBase.replace("{deviceId}", fnyToken),
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