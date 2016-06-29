/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.BillingAddress = Backbone.Model.extend({

       sync : function(method, model, options) {

            var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                urlBase = URL_PROPERTIES.get('SERVICE_URL_BILLING_ADDRESS'),
                urlRoot = urlBase.replace("{customerId}", customerId),
            
                params = _.extend({
                    type : 'GET',
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : ""
                }, options);
        
            return $.ajax(params);
        }
    });

})();
