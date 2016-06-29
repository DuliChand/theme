/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.LatestOrder = Backbone.Model.extend({
   
        sync: function(method, model, options) {

            var data = model.toJSON(),

                urlBase = URL_PROPERTIES.get('GET_LAST_ORDER'),

                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),

                urltemp = urlBase.replace("{deviceId}", fnyToken),

                urlRoot = urltemp.replace("{customerId}", customerId),

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