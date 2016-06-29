/*global Webshop, Backbone*/
Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';
    Webshop.Models.SearchEventResult = Backbone.Model.extend({
  	 
      sync: function (method, model, options) {
   		var searchUrl = $('#searchUrl').attr('action');
    	var data = model.toJSON();
    	var urlBase = URL_PROPERTIES.get('SEARCH_RESULT'),
    	/*urlBase = 'http://staging1.fashionandyou.com/api/search/business?operationType=performSearch&searchOps=product&size={size}&from={from}',*/
	    urlRoot = urlBase.replace("{size}", productSize).replace("{from}", productFrom),
	    			
	    json_data = JSON.stringify(data),
	    
	   
	    params = _.extend({
			type : 'POST',
			dataType : 'json',
			url : searchUrl,
			data : {"size":productSize ,"from" :productFrom,"searchJSON": json_data }
		}, options);
        return $.ajax(params);
      }
    });
 
})();