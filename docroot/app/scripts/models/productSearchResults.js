/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProductSearchResults = Backbone.Model.extend({
		sync: function (method, model, options) {
        //urlBase = URL_PROPERTIES.get('SERVICE_URL_SEARCH_RESULT'),
        var urlBase = 'http://172.16.1.182:8080/business-web/search/business?operationType=performSearch&searchOps=product&size={size}&from={from}',
	    urlRoot = urlBase.replace("{size}", productSize).replace("{from}", productFrom),
	    
	    search_data = {
	    		  "query": {
	    			    "query_string": {
	    			      "query": searchKeyword
	    			    }
	    			  },
	    		   "aggs" : {
	    			        "maxRange" : { "max" : { "field" : "spWithVAT" } },
	    			    "minRange" : { "min" : { "field" : "spWithVAT" } }
	    			    },
		    		"sort": {
			    			    "modifiedDate": {
			    			      "order": "desc"
			    			    }
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
