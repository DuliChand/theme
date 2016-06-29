/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.Subscription = Backbone.Model.extend({

        sync: function(method, model, options) {


            var urlBase = URL_PROPERTIES.get('SUBSCRIPTION'),

                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                loginId = $.cookie('COOKIE_FNY_LOGIN_ID'),

                urltemp = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urltemp.replace("{loginId}", loginId),

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
