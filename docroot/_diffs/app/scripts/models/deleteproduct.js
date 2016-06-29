/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function() {
    'use strict';

    Webshop.Models.DeleteProduct = Backbone.Model.extend({

        sync: function(method, model, options) {

            var data = model.toJSON(),
                fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                pincode = $.cookie('COOKIE_PINCODE_DELIVERABLE'),
                urlBase = URL_PROPERTIES.get('DELETE_PRODUCT'),
                json_data = JSON.stringify(data),
                urlRoot;

            if (pincode === undefined || pincode === "") {
                urlRoot = urlBase.replace("{deviceId}", fnyToken);
            } else {
                urlRoot = urlBase.replace("{deviceId}", fnyToken + "&pincode=" + pincode);
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
