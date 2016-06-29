/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.ApplyPromotion = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                /*cartId = $.cookie('CARTID'),*/
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
                promotionValue = data.promotionValue,
                promotionType = data.promotionType,
                urlBase = URL_PROPERTIES.get('APPLY_VOUCHER'),
                urlBase = urlBase.replace("{promotionType}", promotionType),
                urlBase = urlBase.replace("{promotionValue}", promotionValue),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),
                cartData = {
                    cart: {
                        /*cartId : cartId,
                    customer : {
                        customerId: customerId
                    }*/
                    }
                },
                json_data = JSON.stringify(cartData),

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
