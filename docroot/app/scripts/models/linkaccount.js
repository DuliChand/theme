/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.LinkAccount = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON(),

                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                urlBase = URL_PROPERTIES.get('LINK_ACCOUNTS'),
                urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{customerId}", customerId).replace("{email}", data.email).replace("{sourceCode}", data.sourceCode),

                params = _.extend({
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                }, options);

            return $.ajax(params);
        }
    });

})();