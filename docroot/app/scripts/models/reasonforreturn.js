/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ReasonForReturn = Backbone.Model.extend({


      sync: function (method, model, options) {
        var data = model.toJSON(),
        urlRoot = URL_PROPERTIES.get('REASON_FOR_RETURN'),
        //urlRoot = "http://172.16.34.24:8080/api/cir/business?operationType=getReasonForReturn",
        //urlTemp = 'http://172.18.100.126:8282/api/cir/business?operationType=getReturnableOrderHistory&customerId={customerId}',
        //urlRoot = urlTemp.replace("{customerId}",customerId),
       
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
