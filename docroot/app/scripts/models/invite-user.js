/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.InviteUser = Backbone.Model.extend({
           validation: {
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                msg: SIGN_UP_PROPERTIES.get('user_firstname_required')
            },
            emailId: [{
                required: true,
                msg: SIGN_UP_PROPERTIES.get('user_email_required')
            }, {
                pattern: "email",
                msg: SIGN_UP_PROPERTIES.get('user_email_valid')
            }],
            password: [{
                required: true,
                minLength: 6,
                maxLength: 12,
                msg: SIGN_UP_PROPERTIES.get('user_pass_required')
            }],
            gender: {
                required: true
            }
        },
        sync: function(method, model, options) {
            var data = model.toJSON(),
                json_data,
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                urlBase = URL_PROPERTIES.get('INVITE_REGISTRATION'),
                urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{invitedEmailId}", data.invitedEmailId).replace("{customerId}", data.customerId),

                loginSourceMaster = [{
                    "sourceMaster": {
                        "sourceCode": "APP"
                    }
                }],

                customerData = {
                    "customer": [{
                        loginSource: loginSourceMaster,
                        firstName: data.firstName,
                        gender: data.gender,
                        loginType: "EMAIL",
                        loginId: data.emailId,
                        password: data.password
                    }]
                };

            json_data = JSON.stringify(customerData);

            var params = _.extend({
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