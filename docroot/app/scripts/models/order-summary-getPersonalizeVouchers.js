/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.OrderSummaryGetPersonalizeVouchers = Backbone.Model.extend({

     
      sync: function (method, model, options) {
        var data = model.toJSON(),
        
            customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
            urlBase = URL_PROPERTIES.get('GET_PERSONALIZE_VOUCHER'),
            urlRoot = urlBase.replace("{customerId}", customerId),
            
            params = _.extend({
                type : 'GET',
                dataType : 'json',
                url : urlRoot,
                processData : false,
                data : $.param(data)
            }, options);
        
        return $.ajax(params);
      }
    });

})();
