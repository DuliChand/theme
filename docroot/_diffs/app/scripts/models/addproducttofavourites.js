/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.AddProductToFavourites = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON(),
                urlBase = URL_PROPERTIES.get('ADD_FAVOURITE_PRODUCT'),
                urlRoot = urlBase.replace("{customerId}", data.product.customerId).replace("{productId}", data.product.productId);

                var params = _.extend({
                    type : 'GET',  
                    cache: false,                  
                    dataType : 'json',
                    url : urlRoot,
                    async : true,
                    processData : false,
                }, options);

            return $.ajax(params);
        }
    });

})();