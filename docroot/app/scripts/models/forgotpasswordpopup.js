/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.ForgotPasswordPopUp = Backbone.Model.extend({

        validation: {
            loginId: [{
                required: true,
                msg: LOGIN_PROPERTIES.get('login_email_required')
            }, {
                pattern: "email",
                msg: LOGIN_PROPERTIES.get('login_email_valid')
            }]
        },
        sync: function(method, model, options) {

            var data = model.toJSON(),
                loginId = data.loginId,
                urlBase = URL_PROPERTIES.get('FORGOT_PASSWORD'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlRoot = urlBase.replace("{loginId}", loginId).replace("{deviceId}", fnyToken),


                params = _.extend({
                    type: 'GET',
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                    data: ""
                }, options);
            return $.ajax(params);
        }
    });

})();
