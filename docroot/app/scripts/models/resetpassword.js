/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.ResetPassword = Backbone.Model.extend({

        sync: function(method, model, options) {

            var loginId = $.cookie('COOKIE_FNY_LOGIN_ID'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                urlBase = URL_PROPERTIES.get('RESET_PASSWORD'),

                urlTemp = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urlTemp.replace("{loginId}", loginId),

                json_data = JSON.stringify(model.toJSON()),

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
