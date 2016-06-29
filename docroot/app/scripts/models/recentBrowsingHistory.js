/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.ProductBrowsingHistory = Backbone.Model.extend({
    	sync: function (method, model, options) {
    	  
    	  var data = model.toJSON(),
	      	  deviceId = $.cookie($('#FnyCustomToken').data('tokenid')),
	      	  urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_PRODUCT_BROWSING_HISTORY'),
	      	  urlRoot = urlBase.replace('{deviceId}', deviceId),
	      	  /*json_data = JSON.stringify(data),*/
        
        	params = _.extend({
	            type: 'GET',
	            dataType: 'json',
	            url: urlRoot,
	            processData: false,
	            data: $.param(data)
            }, options);
        return $.ajax(params);
      }
    	});

})();
