/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProfileNavOrderHistory = Backbone.Model.extend({

    	sync: function (method, model, options) {
        var data = model.toJSON();
        var customerId =  $.cookie(URL_PROPERTIES.getCookie('COOKIE_FNY_CUSTOMER_ID'));
        var urlRoot =URL_PROPERTIES.get('SERVICE_URL_ORDER_HISTORY')+customerId;
       
        //var urlRoot = "http://172.16.7.119:8080/business-web/order/business?operationType=getOrderHistory&customerId="+customerId;
        var params = _.extend({
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