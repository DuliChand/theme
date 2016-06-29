/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.OrderLine = Backbone.Model.extend({
 
	 
      sync: function (method, model, options) {
    	  
        var urlBase =URL_PROPERTIES.get('ORDER_LINE'),
        fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
        urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{orderNumber}", orderId),
       
        params = _.extend({
            type: 'GET',
            dataType: 'json',
            url: urlRoot,
            processData: false
          }, options);
        return $.ajax(params);
      }
    });
  
})();