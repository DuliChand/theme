/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.CategoryEvents = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON(),
                categoryName = data.categoryName;

            var urlBase = URL_PROPERTIES.get('CATEGORY_EVENTS'),
                urlRoot = "";

            if (categoryName === "" || categoryName === undefined) {
                urlRoot = urlBase.replace("{categoryName}", "0");
            } else {
                urlRoot = urlBase.replace("{categoryName}", categoryName);
            }

            var params = _.extend({
                type: 'GET',
                dataType: 'json',
                url: urlRoot,
                processData: false,
                data: $.param("")
            }, options);
            return $.ajax(params);
        }
    });

})();