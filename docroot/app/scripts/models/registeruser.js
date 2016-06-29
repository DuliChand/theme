/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.RegisterUser = Backbone.Model.extend({

        validation: {

            firstName: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                minLength: 2,
                maxLength: 50
            },
            lastName: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                minLength: 2,
                maxLength: 50
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
                minLength: 5,
                maxLength: 12,
                msg: SIGN_UP_PROPERTIES.get('user_pass_required')
            }],
            confirmPassword: [{
                required: true,
                msg: SIGN_UP_PROPERTIES.get('confirm_pass_required')
            }, {
                equalTo: 'password',
                msg: SIGN_UP_PROPERTIES.get('confirm_pass_mismatch')
            }]/*,
            address1: {
                required: true,
                msg: ADDRESS_PROPERTIES.get('address_required')
            },
            pinCode: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('zip_code_digit')
            }, {
            	minLength: 6,
                maxLength: 6,
                msg: ADDRESS_PROPERTIES.get('zip_code_invalid')
            }],
            location: {
                required: false
            },
            city: {
                required: true,
                pattern: /^[a-zA-Z ]+$/
            },
            state: {
                required: true,
                pattern: /^[a-zA-Z ]+$/
            },
            country: {
                required: true,
                pattern: /^[a-zA-Z ]+$/
            },
            usr_contact: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                length: 10,
                msg: ADDRESS_PROPERTIES.get('phone_no_length')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('phone_no_digit')
            }]*/,
            gender: {
                required: true
            }
        },
        sync: function(method, model, options) {
            $("#invalid-popup").removeClass('invalid');
            $("span").removeClass('icon');
            $("#invalid-popup h2").text("signing up");
            $("#invalid-popup .row p").html('<div class="product-loader"><span></span></div>');
            $.fancybox($('#invalid-popup'),{
                 helpers : { 
                      overlay : {closeClick: false}
                    },
                 'afterShow'     : function () {
                            $('.fancybox-close').hide();
                            
                        }
            });
            var data = model.toJSON(),
                json_data, pinCodeMaster,
                currDateTime = new Date(),
                registrationDate = currDateTime.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlNormaltemp = URL_PROPERTIES.get('REGISTER_USER'),
                urlSocial = URL_PROPERTIES.get('SOCIAL_LOGIN'),
                urlNormal = urlNormaltemp.replace("{deviceId}", fnyToken),
                urlRoot = "";


            if (data.sourceCode == "" || data.sourceCode == undefined) {

                var customer_countryMaster = {
                        countryname: data.country
                    },

                    customer_stateMaster = {
                        stateName: data.state,
                        countryMaster: customer_countryMaster
                    },

                    customer_cityMaster = {
                        cityName: data.city,
                        stateMaster: customer_stateMaster
                    };

                if (data.locationDetail != "Select Your Location") {
                    pinCodeMaster = {
                        pinCode: data.pinCode
                    };
                } else {
                    pinCodeMaster = {
                        pinCode: data.pinCode,
                        "locationMaster": [{
                            "locationDetails": data.locationDetail,
                            "locationId": data.locationId
                        }]
                    };
                };

                var loginSourceMaster = [{
                        "sourceMaster": {
                            "sourceCode": "APP"
                        }
                    }],

                    customerAddresses = [{
                        addressType: "BILLING",
                        address1: data.address1,
                        cityMaster: customer_cityMaster,
                        pinCodeMaster: pinCodeMaster
                    }],

                    contact = [{
                        value: data.usr_contact,
                        contactType: "phone"
                    }],

                    customerData = [{
                        loginSource: loginSourceMaster,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        loginType: "EMAIL",
                        loginId: data.emailId,
                        password: data.password,
                        /*registrationDate: registrationDate,
                        contact: contact,
                        customerAddresses: customerAddresses*/
                    }];

                json_data = JSON.stringify({
                    customer: customerData
                });

                urlRoot = urlNormal;
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