/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.RecentOrders = Backbone.Model.extend({
 

        sync: function(method, model, options) {

            var data = model.toJSON(),
                urlBase = URL_PROPERTIES.get('GET_RECENT_ORDERS'),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                loginId = $.cookie('COOKIE_FNY_LOGIN_ID'),
                urltemp = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urltemp.replace("{loginId}", loginId),

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