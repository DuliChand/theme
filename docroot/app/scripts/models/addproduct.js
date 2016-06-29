/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.AddProduct = Backbone.Model.extend({

        sync: function(method, model, options) {
			
            var data = model.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                pincode = $.cookie('COOKIE_PINCODE_DELIVERABLE'),
                urlRoot = URL_PROPERTIES.get('ADD_PRODUCT'),
                json_data;
              

            if (pincode === undefined || pincode === "") {
                  json_data = JSON.stringify(data);
            } else {
                data.pinCode = parseInt(pincode);
				json_data = JSON.stringify(data);
            }

            var params = _.extend({
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
