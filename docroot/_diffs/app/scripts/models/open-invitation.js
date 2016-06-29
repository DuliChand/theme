/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.OpenInvitation = Backbone.Model.extend({
   
        sync: function(method, model, options) {

            var data = model.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),

                urlBase = URL_PROPERTIES.get('OPEN_INVITATION'),
                urlTemp = urlBase.replace("{deviceId}", fnyToken),
                urlRoot = urlTemp.replace("{customerId}", customerId),

                params = _.extend({
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                    data: $.param(data)
                }, options);

            return $.ajax(params);
        }
    });
    
})();