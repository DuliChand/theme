/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.LogoutUser = Backbone.Model.extend({

        sync: function(method, model, options) {

            var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                loginId = $.cookie('COOKIE_FNY_LOGIN_ID'),
                urlBase = URL_PROPERTIES.get('LOGOUT_USER'),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),
                logout = {
                    "customer": {
                        "loginId": loginId,
                        "customerId": customerId
                    },
                    "incident": "LOGOUT_CLICKED"
                },
                json_data = JSON.stringify({
                    "logout": logout
                }),

                params = _.extend({
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                    data: json_data
                }, options);

            return $.ajax(params);
        }
    });

})();