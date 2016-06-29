/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CreateReturnRequest = Backbone.Model.extend({


      sync: function (method, model, options) {
        var data = model.toJSON(),
        urlRoot = URL_PROPERTIES.get('CREATE_RETURN_REQUEST'),
        //urlRoot = urlTemp.replace("{imageUrl}",imageUrl).replace("{reasonForReturn}",reasonForReturn).replace("{orderLineId}",orderLineId),
        //urlRoot = 'http://172.16.34.24:8080/api/cir/business?operationType=createReturnRequest',
        json_data = JSON.stringify(data),

        params = _.extend({
            type: 'POST',
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            url: urlRoot,
            processData: false,
            data: json_data
            }, options);
            return $.ajax(params);
      }

    });

})();
