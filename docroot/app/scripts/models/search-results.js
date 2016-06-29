/*global Webshop, Backbone*/
var productSize = 30, productFrom = 0, eventSize = 12, eventFrom = 0, eventsCount, productsCount;

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';
     Webshop.Models.SearchResult = Backbone.Model.extend({
 	 
      sync: function (method, model, options) {
    	var searchUrl = $('#searchUrl').attr('action');  
    	var urlBase = URL_PROPERTIES.get('SEARCH_RESULT'),
	    	urlRoot = urlBase.replace("{size}", productSize).replace("{from}", productFrom),
	    	search_data = {
    		      "fields": [
    		             "product.name.englishanalyzer",
    		             "event.eventName.englishanalyzer",
    		             "product.status"
    		      ],
	    		  "_source": {
	    		    "exclude": [
	    		      "product.guaranty",
	    		      "product.dimension",
	    		      "product.otherInfo",
	    		      "vendorProductEvents",
	    		      "event",
	    		      "attributes"
	    		    ]
	    		  },
	    		  "query": {
	    		    "multi_match": {
	    		      "query":searchKeyword,
	    		      "fields": [
	    		        "product.product.name.englishanalyzer^4",
						"product.product.name.englishanalyzerps^4"
	    		      
	    		      ],
	    		      "use_dis_max": true
	    		    }
	    		  },
	    		  "aggs": {
	    		    "categoryGroup": {
	    		      "terms": {
	    		        "field": "categoryGroup"
	    		      },
	    		      "aggs": {
	    		        "categoryLevel1": {
	    		          "terms": {
	    		            "field": "categoryLevel1"
	    		          },
	    		          "aggs": {
	    		            "categoryLevel2": {
	    		              "terms": {
	    		                "field": "categoryLevel2"
	    		              }
	    		            }
	    		          }
	    		        }
	    		      }
	    		    }
	    		  }
	    		},
	    			 
	    data = JSON.stringify(search_data),			
	    params = _.extend({
			type : 'POST',
			dataType : 'json',
			url : searchUrl,
			data : {"size":productSize ,"from" :productFrom,"searchJSON": data }
		}, options);
        return $.ajax(params);
      }
    });
 
})();