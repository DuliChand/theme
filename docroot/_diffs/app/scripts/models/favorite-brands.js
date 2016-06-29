/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.FavoriteBrands = Backbone.Model.extend({

        sync: function(method, model, options) {

            var urlBase = URL_PROPERTIES.get('GET_FAVORITE_BRANDS'),

                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),

                urlRoot = urlBase.replace("{deviceId}", fnyToken),

                params = _.extend({
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                }, options);
            return $.ajax(params);
        }
    });
    
})();