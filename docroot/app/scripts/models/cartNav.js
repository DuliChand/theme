/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CartNav = Backbone.Model.extend({

       sync: function (method, model, options) {
       /* var data = model.toJSON();
        var cartId = 14;
        var urlRoot ="http://182.74.46.39:8080/business-web/cart/business?operationType=getCart&id="+cartId;
        var params = _.extend({
            type: 'GET',
            dataType: 'json',
            url: urlRoot,
            processData: false,
            data: $.param(data)
          }, options);
        return $.ajax(params);*/
      }
    });

})();
