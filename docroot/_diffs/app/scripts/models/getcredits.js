/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.GetCredits = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),

                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                deviceId = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('GET_CREDIT_BALANCE'),
                urlBase = urlBase.replace("{deviceId}", deviceId),
                urlRoot = urlBase.replace("{customerId}", customerId),

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