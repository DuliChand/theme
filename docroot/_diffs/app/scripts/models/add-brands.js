/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.AddFavoriteBrands = Backbone.Model.extend({

        sync: function(method, model, options) {

            var urlBase = URL_PROPERTIES.get('ADD_FAVORITE_BRANDS'),

                data = model.toJSON(),

                json_data = JSON.stringify(data),

                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),

                urlTemp = urlBase.replace("{customerId}", customerId),
                urlRoot = urlTemp.replace("{deviceId}", fnyToken),

                params = _.extend({
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: urlRoot,
                    data: json_data,
                    processData: false,
                }, options);
            return $.ajax(params);
        }
    });

})();