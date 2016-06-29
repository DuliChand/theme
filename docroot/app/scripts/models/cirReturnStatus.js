/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CIRReturnStatus = Backbone.Model.extend({

      sync: function (method, model, options) {
        var data = model.toJSON(),
        orderLineId =  data.orderLineId,
        urlTemp = URL_PROPERTIES.get('GET_RETURN_REQUEST_STATUS'),
        //urlTemp = 'http://172.16.34.24:8080/api/cir/business?operationType=getReturnRequestStatusByOrderLineId&orderLineId={orderLineId}',
        urlRoot = urlTemp.replace("{orderLineId}",orderLineId),
       
        params = _.extend({
            type: 'GET',
            dataType: 'json',
            url: urlRoot,
            processData: false,
            data: data
          }, options);
        return $.ajax(params);
      }
    });

})();
