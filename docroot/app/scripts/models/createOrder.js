/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.CreateOrder = Backbone.Model.extend({

 sync: function (method, model, options) {
          
        var data = model.toJSON(),
            orderId = data.orderId,
            paymentChannel = data.paymentCode,
            fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
            urlBase = URL_PROPERTIES.get('CREATE_ORDER'),
            urlBase = urlBase.replace("{deviceId}", fnyToken),
            urlRoot = urlBase.replace("{paymentChannel}", paymentChannel),
        
            params = _.extend({
                type : 'POST',
                beforeSend : function(xhr) {
                    xhr.withCredentials = true;
                },
                contentType : "application/json; charset=utf-8",
                dataType : 'json',
                url : urlRoot,
                processData : false,
                data : ""
            }, options);
        
        return $.ajax(params);
      }
    });

})();
