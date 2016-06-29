/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.EventBrowseSimilarEvents = Backbone.Model.extend({

sync : function(method, model, options) {

					var urlBase = "http://172.16.7.231:8080/business-web/event/business?operationType=getSimilarEvents&eventId={eventId}", 
					
					eventId = $("#backbone-portlet-event-product-listing").data("id"),
					urlRoot = urlBase.replace('{eventId}',eventId ),
					
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