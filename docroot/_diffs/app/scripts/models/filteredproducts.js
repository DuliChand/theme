/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

     Webshop.Models.Filteredproducts = Backbone.Model.extend({

        sync : function(method, model, options) {
                    var data = model.toJSON(),
					/*listingId = $("#backbone-portlet-product-listing").data("id"),
					listingType = $("#backbone-portlet-product-listing").data("type"),*/
					urlRoot = URL_PROPERTIES.get('EVENT_PRODUCTS'), 
					json_data = JSON.stringify(data),				
					               
                    params = _.extend({
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
