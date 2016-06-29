/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

var FnyCustomToken = $('#FnyCustomToken').data('tokenid');

(function() {
    'use strict';

    Webshop.Models.EventFavouriteStatus = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                eventId = data.eventId,
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('IS_FAVOURITE_EVENT'),
                urlBase = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urlBase.replace("{eventId}", eventId),

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