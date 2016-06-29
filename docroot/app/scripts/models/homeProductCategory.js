/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.HomeProductCategory = Backbone.Model.extend({
    	sync : function(method, model, options) {
			var data = model.toJSON(), 
				categoryName = $("backbone-portlet-featured-categories").data("category-name"),
				urlRoot = URL_PROPERTIES.get('SERVICE_URL_GET_FEATURED_CATEGORIES');

			var params = _.extend({
				type : 'GET',
				dataType : 'json',
				url : urlRoot,
				processData : false,
				data : $.param(data)
			}, options);
			return $.ajax(params);
		}

    });
})();