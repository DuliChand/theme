/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.Notifications = Backbone.Model.extend({

            sync: function(method, model, options) {
                var data = model.toJSON(),

                    urlBase = URL_PROPERTIES.get('GET_SUBSCRIPTION_CHANNEL'),
                    fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                    urlRoot = urlBase.replace("{deviceId}", fnyToken),

                    params = _.extend({
                        type: 'GET',
                        dataType: 'json',
                        url: urlRoot,
                        processData: false,
                        data: $.param(data)
                    }, options);
                return $.ajax(params);
            }
        });
   
})();