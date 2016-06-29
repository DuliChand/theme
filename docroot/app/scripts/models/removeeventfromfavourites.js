/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.RemoveEventFromFavourites = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                createdTime = data.createdTime,
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('REMOVE_FAVOURITE_EVENT'),
                urlBase = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urlBase.replace("{createdTime}", createdTime),

                params = _.extend({
                    type: 'GET',
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                    data: ""
                }, options);

            return $.ajax(params);
        }
    });

})();
