/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.FeaturedCategories = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                categoryName = $("#backbone-portlet-home").data("category-name"),
                //urlRoot = URL_PROPERTIES.get('FEATURED_CATEGORIES');
            urlRoot = 'http://api.fashionandyou.com/api/category/business?operationType=getLiveCategoryEvents&category=666&env=live&_=1415353421832';

            var params = _.extend({
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