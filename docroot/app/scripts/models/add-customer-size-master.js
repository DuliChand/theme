/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.AddCustomerSizeMaster = Backbone.Model.extend({

        sync: function(method, model, options) {

            var json_data1 = JSON.stringify({
                customerSizeMaster: [model.toJSON()]
            });

            var urlRoot = 'http://172.18.123.81:8081/business-web/account/business?operationType=insertCustomerSizeMaster';
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
                        if (jsonObject.domainResponse.message == 'SUCCESS') {
                            alert("Successfully Added to the Customer Size Preferences!!!");
                        } else {
                            alert("Failed to Add to the Customer Size Preferences!!!");
                        }

                    },
                    dataType: 'json'
                });
        }
    });

})();
