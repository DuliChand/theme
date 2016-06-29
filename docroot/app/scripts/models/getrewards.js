/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.GetRewards = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),

                deviceId = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('REWARD_POINTS'),
                urlRoot = urlBase.replace("{deviceId}", deviceId),

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