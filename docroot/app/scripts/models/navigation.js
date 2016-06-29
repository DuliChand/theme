/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.Navigation = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON(),
                urlRoot = URL_PROPERTIES.get('NAV'),

                params = _.extend({
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                    data: $.param(data)
                }, options);

            return $.ajax(params);
        }
    });

})();