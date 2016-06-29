/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.Size = Backbone.Model.extend({

        sync: function(method, model, options) {
            var json_data1 = JSON.stringify(model.toJSON()),
                urlRoot = URL_PROPERTIES.get('SIZE_GUIDE');

            return $
                .ajax({
                    type: 'POST',
                    url: urlRoot,
                    crossDomain: true,
                    data: json_data1,
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    success: function(data) {

                        var jsonObject = data;
                        if (jsonObject.domainResponse.message == "SUCCESS") {
                            alert("Your Size data successfully Stored!!");
                        } else {
                            alert("Unable to store your size data!!");
                        }

                    },
                    dataType: 'json'
                });
        }
    });

})();
