/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';
    Webshop.Models.GetCancelRequest = Backbone.Model.extend({
          sync : function(method, model, options) {

          var data = model.toJSON(),
          customerData;
           // var modeOfReturn = data.modeOfReturn,

            var customerData =  {
                  "cancelReason":data.cancelReason,
                  "comment":data.comment,
                  "modeOfReturn": data.modeOfReturn
                };
                
           console.log("customerData =  " + customerData);

          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
          urlBase =URL_PROPERTIES.get('GET_CANCEL_ORDER'),
          urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{orderNumber}", data.orderno).replace("{orderLineId}", data.orderLineId),
          json_data = JSON.stringify(customerData);
          
          console.log(urlRoot);
            var params = _.extend({
              type: 'POST',
              cache: false,
              dataType: 'json',
              url: urlRoot,
              processData: false,
              async : true,
              data: json_data
          }, options);
            // console.log("params-----------" + params);   
          return $.ajax(params);
        }
    });

})();