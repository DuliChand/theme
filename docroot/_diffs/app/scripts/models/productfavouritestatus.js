/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.ProductFavouriteStatus = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                customerId = data.customerId,
                productId = data.productId,
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('IS_FAVOURITE_PRODUCT'),
                 urlRoot = urlBase.replace("{customerId}", customerId).replace("{productId}", productId),

                params = _.extend({
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    url: urlRoot,
                    async : true,
                    processData: false
                }, options);

            return $.ajax(params);
        }
   });

})();