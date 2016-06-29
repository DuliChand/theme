/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.SearchFilter = Backbone.Model.extend({

    sync : function(method, model, options) {
                    var keyword = $("#backbone-portlet-search-results").data("id"),
                        
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
                        dataType : 'json',
                        url : urlRoot,
                        processData : false,
                        cache : false,
                        data : data
                    }, options);
                    return $.ajax(params);
                }
    });

})();
