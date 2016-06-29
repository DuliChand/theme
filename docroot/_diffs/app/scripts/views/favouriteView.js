/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
			var favourites = {};
			 Webshop.Views.FavouriteView = Backbone.View.extend({			

				templates: {
	            favouritelisting: JST['app/scripts/templates/favouritelisting.hbs']
	          	},

				el : '#backbone-portlet-favouritelisting',
				events : {
					'click .listing-fav' : 'removeFromFavouriteList',
					'click #quickViewProduct' : 'quickView',
					'click .product-outer .social-share-link': 'productSocialShareHandler',
				},
				initialize : function() {
					this.removeProductFromFavourites = new Webshop.Models.RemoveProductFromFavourites();
					this.removeEventFromFavourites = new Webshop.Models.RemoveEventFromFavourites();
				},
				render : function(productsData) {
					this.getProductFavouriteList(productsData);
					
				},
				getProductFavouriteList : function(productsData) {
					var self = this;
					
					if(productsData.responseCode === "SUCCESS") {
						//favourites.products = (productsData.productListing.products != undefined) ? productsData.productListing.products : "";
						self.getEventFavouriteList(productsData);
						} 
						if(productsData.responseCode === "ERROR") {

						self.getEventFavouriteList(productsData);

					}
				},
				getEventFavouriteList : function(productsData) {
					var self = this;
					if(productsData.responseCode === "SUCCESS") {
						//favourites = (eventsData.productListing.products != undefined) ? eventsData.productListing.products : "";
						console.log("productsData tmp" + productsData);
						$(self.el).html(self.templates.favouritelisting(productsData));
									
						if($('.rolover-layer').length > 0) {
							$('.product-outer .prod-img').hover(function() {
								$(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
							},function(){
								$(this).find(".rolover-layer").animate({bottom: "-54"}, 'fast');
							});
						}
					}
					else
					{
						$(self.el).html(self.templates.favouritelisting(productsData));
					}
				},
				removeFromFavouriteList : function(e) {
					
					e.preventDefault();
					var self = this,
						currFavourite = e.currentTarget,
						createdTime = $(e.currentTarget).data("created-time"),
						favouriteType = $(currFavourite).data("type"),
						favouriteData = { "createdTime" : createdTime };

					
					if(favouriteType === "event") {
						if (self.removeEventFromFavourites.clear().set(favouriteData)) {
							self.removeEventFromFavourites.fetch({
			                    error: function (response) {
			                        /*console.log(response);*/
			                    },
			                    success: function (model, response) {
									window.location.href = '/favourites';
			                    	//self.render();
			                	}
			                });
						}
					}
					
					if(favouriteType === "product") {
						if (self.removeProductFromFavourites.clear().set(favouriteData)) {
							self.removeProductFromFavourites.fetch({
			                    error: function (response) {
			                        //console.log(response);
			                    },
			                    success: function (model, response) {
			                    	window.location.href = '/favourites';
			                	}
			                });
						}
					}
					
				},
				quickView : function(event) {

					event.preventDefault();
		            var productId = $(event.currentTarget).closest(".product").attr("id"),
		                title = $(event.currentTarget).closest(".product").data("product-name"),
		                newTitle =  title.split(" ").join("_").toLowerCase(),
		                data = {
		                    "productId": productId,
		                    "title": newTitle
		                };

		            this.productQuickView = new Webshop.Views.ProductQuickView();
		            this.productQuickView.renderProductQuickView(data);
					
				},
				 productSocialShareHandler: function(e) {

			            e.preventDefault();

			            var classesList = $(e.currentTarget).attr("class").split(' '),
			                curProductId = $(e.currentTarget).closest(".product").attr('id'),
			                curEventId = $(e.currentTarget).closest(".product").data('event-id'),
			                sharingData = {
			                    url: window.location.origin + '/product-detail/product/' + curEventId + '/' + curProductId,
			                    title: $(e.currentTarget).closest(".product").find(".ev-prod-name").attr("title"),
			                    imageUrl: $(e.currentTarget).closest(".product").find(".prod-img img").attr("src"),
			                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
			                    handlerName: classesList[1]
			                };

			            socialShare(e, sharingData);
			        	}
			});
			
		})();