/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Filter = Backbone.Model.extend({

        sync : function(method, model, options) {
                    var data = model.toJSON(),
                        listingId = $("#backbone-portlet-filter").data("id"),
                        listingType = $("#backbone-portlet-filter").data("type"),
                        urlRoot = "", 
                        productFilterData = {}, json_data = "";
                    
                    listingType = listingType.toLowerCase();
                        
                    if(listingType === "event") {
                        
                        urlRoot = URL_PROPERTIES.get('SERVICE_URL_FILTERED_PRODUCTS');
                        
                        productFilterData = {
                            "productfilters": {
                                "eventId": listingId,
                                "limit": 12,
                                "from": 0
                            }
                        };
                    }
                    
                    if(listingType === "category") {
                        
                        urlRoot = URL_PROPERTIES.get('SERVICE_URL_CATEGORY_PRODUCTS');
                        
                        productFilterData = {
                            "productfilters": {
                                "categoryId": listingId,
                                "limit": 12,
                                "from": 0
                            }
                        };
                    }
                    
                    json_data = JSON.stringify(productFilterData); 
                        
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
