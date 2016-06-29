/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.OrderShipmentTrack = Backbone.Model.extend({

	 
      sync: function (method, model, options) {
    	  
        var urlBase =URL_PROPERTIES.get('ORDER_SHIPMENT_TRACK'),
    	/*var urlBase = "http://172.16.7.14:8080/api/shipping/business?operationType=getAggregatedShipmentTrack&orderId={orderId}&deviceId={deviceId}",*/
        fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
        urlRoot = urlBase.replace("{orderId}", orderId).replace("{deviceId}", fnyToken),
       
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