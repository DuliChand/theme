/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CIRReturn = Backbone.Model.extend({


      sync: function (method, model, options) {
        var data = model.toJSON(),
        customerId =  $.cookie('COOKIE_FNY_CUSTOMER_ID'),
        urlTemp = URL_PROPERTIES.get('GET_RETURNABLE_ORDERS'),
        //urlRoot = "http://172.16.34.24:8080/api/cir/business?operationType=getOrderHistory&customerId=1617522&condition=RECENT",
        //urlTemp = 'http://172.18.100.126:8282/api/cir/business?operationType=getReturnableOrderHistory&customerId={customerId}',
        urlRoot = urlTemp.replace("{customerId}",customerId),
       
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
