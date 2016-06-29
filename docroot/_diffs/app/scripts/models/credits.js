/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.Credits = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),

                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                urlBase = URL_PROPERTIES.get('STORED_CREDITS'),

                urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{customerId}", customerId),

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