/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.FilteredSearchResults = Backbone.Model.extend({

sync : function(method, model, options) {
                var data = model.toJSON(),

                //urlRoot = URL_PROPERTIES.get('SERVICE_URL_FILTERED_PRODUCTS'), 
                urlBase = 'http://172.16.1.182:8080/business-web/search/business?operationType=performSearch&searchOps=product&size={size}&from={from}',
                urlRoot = urlBase.replace("{size}", size).replace("{from}", from),
                json_data = JSON.stringify(data);
                
                console.log("data we are sending to service"),
                
                console.log(json_data);

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
