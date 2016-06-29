/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.SearchFilterSearchResults = Backbone.Model.extend({

       sync: function (method, model, options) {
        var searchKeyword = $("#backbone-portlet-search-results").data("id"),
        //urlBase = URL_PROPERTIES.get('SERVICE_URL_SEARCH_RESULT'),
        urlBase = 'http://172.16.1.182:8080/business-web/search/business?operationType=performSearch&searchOps=product&size={size}&from={from}',
        urlRoot = urlBase.replace("{size}", size).replace("{from}", from),
        
        search_data = {
                  "query": {
                        "query_string": {
                          "query": keyword
                        }
                      },
                     "aggs" : {
                            "maxRange" : { "max" : { "field" : "spWithVAT" } },
                        "minRange" : { "min" : { "field" : "spWithVAT" } }
                        }
                    },
                     
        data = JSON.stringify(search_data),         

        params = _.extend({
            type : 'POST',
            beforeSend : function(xhr) {
                xhr.withCredentials = true;
            },
            contentType : "application/json; charset=utf-8",
            dataType : 'json',
            url : urlRoot,
            processData : false,
            data : data
        }, options);
        return $.ajax(params);
      }
    });

})();
