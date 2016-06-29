/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.CreateAuthToken = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON(),
                urlRoot = URL_PROPERTIES.get('CREATE_TOKEN'),

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