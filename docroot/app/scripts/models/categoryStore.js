/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.CategoryStore = Backbone.Model.extend({

        sync: function (method, model, options) {
          
            var data = model.toJSON(),
            	groupCategory = $("#backbone-portlet-category-store").data("groupcategory"),
            	tag = $("#backbone-portlet-category-store").data("tag"),
                urlRoot = "",urlTemp= "", 
                productFilterData = {},
                json_data = "";
                urlTemp = URL_PROPERTIES.get('STORE_CATEGORY')
                //urlTemp = "http://172.16.2.150:8080/api/event/business?operationType=getStoredProducts&groupCategory={groupCategory}&tag={tag}";
                urlRoot = urlTemp.replace("{groupCategory}", groupCategory).replace("{tag}",tag);
                //console.log("data------------> "+JSON.stringify(data));
                productFilterData = {
                        
                            "limit": 99,
                            "from": data.skip,
                            "attributeList" : data.attributeList, 
                            "priceFilters" : data.priceFilters
                       
                };
                
                json_data = JSON.stringify(productFilterData);  
                //console.log("below data   ---"+json_data);  
                var params = _.extend({
                    type : 'POST',
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : json_data
                }, options);
            
            return $.ajax(params);       
      }
    });

})();