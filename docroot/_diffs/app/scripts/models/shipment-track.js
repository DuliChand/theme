/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.ShipmentTrack = Backbone.Model.extend({
 
	 
      sync: function (method, model, options) {
    	  
       var urlBase =URL_PROPERTIES.get('SHIPMENT_TRACK'),
    /*	var urlBase = "http://172.16.7.14:8080/api/shipping/business?operationType=getShipmentTrack&awbNumber={awbNumber}&orderLineId={orderLineId}&deviceId={deviceId}",*/
    	data = model.toJSON(),
    	//awbNumber = data.awbNumber,
    	orderLineId = data.orderLineId,
        //fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
       // urlRoot = urlBase.replace("{awbNumber}", awbNumber).replace("{orderLineId}", orderLineId).replace("{deviceId}", fnyToken),
       urlRoot = urlBase.replace("{orderLineId}", orderLineId),
       
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