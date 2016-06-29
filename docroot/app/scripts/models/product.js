/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.Product = Backbone.Model.extend({

        sync : function(method, model, options) {
            var data = model.toJSON(),
                productId = data.productId,
                title = data.title,
                urlBase = URL_PROPERTIES.get('GET_PRODUCT'),
                urlRoot = urlBase.replace("{title}", title).replace("{vendorProductId}", productId),
                
                params = _.extend({
                    type : 'GET',                    
                    dataType : 'json',
                    url : urlRoot,
                    processData : false
                }, options);
            return $.ajax(params);
        }
    });

})();