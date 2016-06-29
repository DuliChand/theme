/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CartContentLiveInventory = Backbone.Model.extend({

       sync : function(method, model, options) {
                    var data = model.toJSON();

                    var urlRoot = URL_PROPERTIES.get('SERVICE_URL_SKU_INVENTORY'), 
                        json_data = data.currSKU;

                    var params = _.extend({
                        type : 'POST',
                        beforeSend : function(xhr) {
                            xhr.withCredentials = true;
                        },
                        contentType : "application/json; charset=utf-8",
                        dataType : 'json',
                        url : urlRoot,
                        processData : false,
                        data : json_data
                    }, options);
                    return $.ajax(params);
                }
    });

})();
