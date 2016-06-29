/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.LiveProducts = Backbone.Model.extend({
        sync: function (method, model, options) {          
            var data = model.toJSON(),
                listingId = $("#backbone-portlet-product-listing").attr("data-id"),
                listingType = $("#backbone-portlet-product-listing").attr("data-type"),
                urlRoot = "", 
                productFilterData = {},
                json_data = "";
                listingType = listingType.toLowerCase();
                if(listingType === "event") {
                    urlRoot = URL_PROPERTIES.get('EVENT_PRODUCTS');
                   //urlRoot = 'http://172.16.2.208:8080/search-new/products/';
                    productFilterData = {                       
                            "eventId": listingId,
                            "limit": data.limit,
                            "from": data.from,
                            "sortBy": data.sortBy,
                            "attributeList" : data.attributeList, 
                            "priceFilters" : data.priceFilters
                    };
                }
                
                if(listingType === "category") {
                    urlRoot = URL_PROPERTIES.get('EVENT_PRODUCTS');
                    productFilterData = {                       
                            "menuCatId": listingId,
                            "limit": data.limit,
                            "from": data.from,
                            "sortBy": data.sortBy,
                            "attributeList" : data.attributeList, 
                            "priceFilters" : data.priceFilters                        
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