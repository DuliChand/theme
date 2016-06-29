/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.FeaturedProducts = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                categoryName = $("#backbone-portlet-home").data("category-name"),
                urlRoot = URL_PROPERTIES.get('FEATURED_PRODUCTS'),

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