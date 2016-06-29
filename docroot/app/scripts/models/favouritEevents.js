/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.FavouriteEvents = Backbone.Model.extend({
   
        sync: function(method, model, options) {

            var data = model.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('GET_FAVOURITE_EVENT'),
                urlRoot = urlBase.replace("{deviceId}", fnyToken),
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