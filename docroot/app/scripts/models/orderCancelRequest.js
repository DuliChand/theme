/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';
    Webshop.Models.OrderCancelRequest = Backbone.Model.extend({
          sync : function(method, model, options) {
          var data = model.toJSON(),
           urlBase =URL_PROPERTIES.get('ORDER_CANCEL'),
          urlRoot = urlBase.replace("{orderNumber}", data.orderno).replace("{orderLineId}", data.orderLineId),
          json_data = JSON.stringify(data);
          
            var params = _.extend({
              type: 'GET',
              cache: false,
              dataType: 'json',
              url: urlRoot,
              processData: false,
              async : true,
              data: json_data
          }, options);
          return $.ajax(params);
        }
    });

})();