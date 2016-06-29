/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.RegisterUserPopUp = Backbone.Model.extend({

        validation: {
            firstName: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                minLength: 2,
                maxLength: 50,
                msg: SIGN_UP_PROPERTIES.get('user_firstname_required')
            },
            lastName: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                minLength: 2,
                maxLength: 50,
                msg: SIGN_UP_PROPERTIES.get('user_lastname_required')
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
                currDateTime = new Date(),
                registrationDate = currDateTime.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlNormal = URL_PROPERTIES.get('REGISTER_USER'),
                urlSocial = URL_PROPERTIES.get('SOCIAL_LOGIN'),
                urlRoot = "";

            if (data.sourceCode == "" || data.sourceCode == undefined) {

                var loginSourceMaster = [{
                        "sourceMaster": {
                            "sourceCode": "APP"
                        }
                    }],

                    customerData = [{
                        loginSource: loginSourceMaster,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        loginType: "EMAIL",
                        loginId: data.emailId,
                        password: data.password
                    }];

                json_data = JSON.stringify({
                    customer: customerData
                });

                urlRoot = urlNormal.replace("{deviceId}", fnyToken);
            } else {

                var loginSourceMaster = [{
                    "sourceMaster": {
                        "sourceCode": data.sourceCode
                    }
                }];

                var contact = [{
                	contactType: "EMAIL",
                    value: data.email
                }];


                var customer = {
                    loginSource: loginSourceMaster,
                    contact: contact,
                    customerType: "EMAIL",
                    firstName: data.firstName,
                    gender: data.gender,
                    lastName: data.lastName,
                    loginId: data.email,
                    loginType: "EMAIL",
                    title: "Mr"
                };

                var customerData = {
                    customer: customer,
                    cartId: $.cookie("CARTID"),
                    deviceId: $.cookie($('#FnyCustomToken').data('tokenid'))
                };

                json_data = JSON.stringify(customerData);
                urlRoot = urlSocial;
            }

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