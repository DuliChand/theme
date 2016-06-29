/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.RecentlyBrowsed = Backbone.Model.extend({

        sync: function(method, model, options) {
            var data = model.toJSON();
            var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');

            var urlRoot = URL_PROPERTIES.get('CUSTOMER_RECENTLY_BROWSED') + customerId;

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
