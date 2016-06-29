/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.OrderSummaryOrderSummary = Backbone.Model.extend({

     
      sync: function (method, model, options) {
        var data = model.toJSON(),
            fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
            /*customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,*/
            urlBase = URL_PROPERTIES.get('GET_CART'),
            /*cartInfo = 'deviceId=' + fnyToken + '&customerId=' + customerId,*/
            urlRoot = urlBase.replace("{deviceId}", fnyToken),
            
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
