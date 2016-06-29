/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.SizeMaster = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON();

            var urlRoot = URL_PROPERTIES.get('SIZE_GUIDE');

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
