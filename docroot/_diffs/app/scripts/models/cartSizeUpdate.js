/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.CartSizeUpdate = Backbone.Model.extend({

        sync : function(method, model, options) {
            
            var data = model.toJSON(),
                urlBase = URL_PROPERTIES.get('CHANGE_VARIANT'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),
                json_data = JSON.stringify(data),
                
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
