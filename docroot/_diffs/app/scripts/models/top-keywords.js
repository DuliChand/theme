/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';
	    Webshop.Models.TopKeywords = Backbone.Model.extend({
	

			sync : function(method, model, options) {

				var urlRoot = URL_PROPERTIES.get('TOP_KEYWORDS'),
				
				params = _.extend({
					type : 'GET',
					beforeSend : function(xhr) {
						xhr.withCredentials = true;
					},
					contentType : "application/json; charset=utf-8",
					dataType : 'json',
					url : urlRoot,
					processData : false,
				}, options);
				return $.ajax(params);
			}
		});

})();