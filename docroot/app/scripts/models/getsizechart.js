/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
        'use strict';

        Webshop.Models.GetSizeChart = Backbone.Model.extend({
		sync : function(method, model, options) {
			var modelData = model.toJSON();
			var webShopId = modelData.webShopId;
				var urlBase = URL_PROPERTIES.get('SIZE_CHART'),
            	urlRoot = urlBase.replace("{webshopId}", webShopId),
            	json_data = JSON.stringify(modelData),
                
                params = _.extend({
                    type : 'GET',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : json_data
                }, options);
           
            return $.ajax(params);
        }
    });
})();