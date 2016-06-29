/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Payment = Backbone.Model.extend({

 sync: function (method, model, options) {
        var data = model.toJSON(),
            urlRoot =URL_PROPERTIES.get('SERVICE_URL_PAYMENT_CHANNELS'),
        
            params = _.extend({
                type: 'GET',
                dataType: 'json',
                url: urlRoot,
                processData: false,
                data: ""
            }, options);
        return $.ajax(params);
      }
    });

})();
