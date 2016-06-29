/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Restorepassword = Backbone.Model.extend({

         /* validation: {
        email_id: {
            required: true,
            msg: "email address is required"
          },
        },*/
      sync: function (method, model, options) {
        var data = model.toJSON();
        var urlRoot = "http://172.16.7.153:8080/ProductListingMockService/services/productListing/mock/babaJiKaThullu";
        var params = _.extend({
            type: 'POST',
            dataType: 'json',
            url: urlRoot,
            processData: false,
            data: $.param(data)
          }, options);
        return $.ajax(params);
      }

    });

})();
