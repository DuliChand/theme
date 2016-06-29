/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.removeFromFavourites = Backbone.Model.extend({
	
				sync : function(method, model, options) {
					var json_data1 = JSON.stringify({
						favoriteDTO : model.toJSON()
					});
					var urlRoot = URL_PROPERTIES
							.get('REMOVE_FAVOURITES');
					return $
							.ajax({
								type : 'POST',
								url : urlRoot,
								crossDomain : true,
								data : json_data1,
								beforeSend : function(xhr) {
									xhr.withCredentials = true;
								},
								contentType : "application/json; charset=utf-8",
								success : function(data) {

									var jsonObject = data;
									if (jsonObject.domainResponse.responseCode == 'FAILURE') {
										alert(jsonObject.domainResponse.errorMessage);
									} else {
										alert("Successfully Removed from Favourites");
										
										if ($(".listing-fav").length > 0) {
									       
									        $(this).toggleClass("listing-fav-selected");
									        e.preventDefault();
									      
									    }
									}

								},
								dataType : 'json'
							});
				}
			});

})();