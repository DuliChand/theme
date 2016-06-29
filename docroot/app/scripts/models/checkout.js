/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.Checkout = Backbone.Model.extend({

        validation: {
            billing_firstname: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('first_name_required')
            }, {
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('first_name_required')
            }],
            billing_lastname: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('last_name_required')
            },
            billing_pincode: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }, {
                length: 6,
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }],
            billing_location: {
                required: false
            },
            billing_address: {
                required: true,
                msg: ADDRESS_PROPERTIES.get('address_required')
            },
            billing_landmark: {
                required: false
            },
            billing_city: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('city_required')
            },
            billing_state: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('state_required')
            },
            billing_country: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('country_required')
            },
            billing_mobile: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                length: 10,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }],
            billing_altno: [{
                required: false
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                length: 10,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                notEqualTo: 'billing_mobile'
            }],

            shipping_firstname: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('first_name_required')
            },
            shipping_lastname: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('last_name_required')
            },
            shipping_pincode: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }, {
                length: 6,
                msg: ADDRESS_PROPERTIES.get('zip_code_required')
            }],
            shipping_location: {
                required: false
            },
            shipping_address: {
                required: true,
                msg: ADDRESS_PROPERTIES.get('address_required')
            },
            shipping_landmark: {
                required: false
            },
            shipping_city: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('city_required')
            },
            shipping_state: {
                pattern: /^[a-zA-Z ]+$/,
                required: true,
                msg: ADDRESS_PROPERTIES.get('state_required')
            },
            shipping_country: {
                required: true,
                pattern: /^[a-zA-Z ]+$/,
                msg: ADDRESS_PROPERTIES.get('country_required')
            },
            shipping_mobile: [{
                required: true,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                length: 10,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }],
            shipping_altno: [{
                required: false
            }, {
                pattern: 'digits',
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                length: 10,
                msg: ADDRESS_PROPERTIES.get('phone_no_required')
            }, {
                notEqualTo: 'shipping_mobile'
            }]
        },
        sync: function(method, model, options) {

            var data = model.toJSON(),
                cart;
            if (data.billing_locationDetail != "Select Your Location") {
                cart = {
                    orderAddresses: [{
                        "address1": data.billing_address,
                        "landMark": data.billing_landmark,
                        "pinCodeMaster": {
                            "pinCode": data.billing_pincode,
                            "locationMaster": [{
                                "locationDetails": data.billing_locationDetail,
                                "locationId": data.billing_locationId
                            }]
                        },
                        "mobileNo": data.billing_mobile,
                        "fullName": (data.billing_firstname + " " + data.billing_lastname),
                        "alternateNo": data.billing_altno,
                        "addressType": "BILLING"
                    }, {
                        "address1": data.shipping_address,
                        "landMark": data.shipping_landmark,
                        "pinCodeMaster": {
                            "pinCode": data.shipping_pincode,
                            "locationMaster": [{
                                "locationDetails": data.shipping_locationDetail,
                                "locationId": data.shipping_locationId
                            }]
                        },
                        "mobileNo": data.shipping_mobile,
                        "fullName": (data.shipping_firstname + " " + data.shipping_lastname),
                        "alternateNo": data.shipping_altno,
                        "addressType": "SHIPPING"
                    }]
                };
            } else {
                cart = {
                    orderAddresses: [{
                        "address1": data.billing_address,
                        "landMark": data.billing_landmark,
                        "pinCodeMaster": {
                            "pinCode": data.billing_pincode,
                        },
                        "mobileNo": data.billing_mobile,
                        "fullName": (data.billing_firstname + " " + data.billing_lastname),
                        "alternateNo": data.billing_altno,
                        "addressType": "BILLING"
                    }, {
                        "address1": data.shipping_address,
                        "landMark": data.shipping_landmark,
                        "pinCodeMaster": {
                            "pinCode": data.shipping_pincode,
                        },
                        "mobileNo": data.shipping_mobile,
                        "fullName": (data.shipping_firstname + " " + data.shipping_lastname),
                        "alternateNo": data.shipping_altno,
                        "addressType": "SHIPPING"
                    }]
                };
            }


            var json_data = JSON.stringify({
                cart: cart
            });

            var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('CHECKOUT'),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),

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