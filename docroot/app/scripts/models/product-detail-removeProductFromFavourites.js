/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.ProductDetailRemoveProductFromFavourites = Backbone.Model.extend({

    sync : function(method, model, options) {
            var data = model.toJSON(),
                productId = data.product.productId,
                customerId = data.product.customerId,
                createdTime = data.createdTime,
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                urlBase = URL_PROPERTIES.get('REMOVE_FAVOURITE_PRODUCT'),
                urlRoot = urlBase.replace("{customerId}", customerId).replace("{productId}", productId);
                
                params = _.extend({
                    type : 'GET',
                    
                    contentType : "application/json; charset=utf-8",
                    dataType : 'json',,
                    url : urlRoot,
                    processData : false,
                    data : ""
                }, options);
            
            return $.ajax(params);
        }
    });

})();
