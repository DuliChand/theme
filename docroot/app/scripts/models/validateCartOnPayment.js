/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.ValidateCartOnPayment = Backbone.Model.extend({
        sync: function (method, model, options) {
        var data = model.toJSON(),
            fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
            paymentChannel = data.paymentChannel,
            urlBase = URL_PROPERTIES.get('SERVICE_URL_VALIDATE_CART_ON_PAYMENT'),
            urlBase = urlBase.replace("{paymentChannel}", paymentChannel),
            urlRoot = urlBase.replace("{deviceId}", fnyToken),
            cartData = {
                cart : {
                    
                }
            },
            json_data = JSON.stringify(cartData),
            
            params = _.extend({
                type : 'POST',
                beforeSend : function(xhr) {
                    xhr.withCredentials = true;
                },
                contentType : "application/json; charset=utf-8",
                dataType : 'json',
                url : urlRoot,
                processData : false,
                data : json_data
            }, options);
        return $.ajax(params);
      }

    });

})();
