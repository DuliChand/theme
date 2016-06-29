/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.StylePreference = Backbone.Model.extend({

        sync: function(method, model, options) {

            var urlBase = URL_PROPERTIES.get('ADD_CUSTOMER_STYLE_PREFERENCES'),

                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),
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
