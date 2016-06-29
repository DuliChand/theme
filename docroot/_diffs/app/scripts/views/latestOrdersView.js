/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.LatestOrderView = Backbone.View.extend({
			templates: {
            latestOrder: JST['app/scripts/templates/latestOrder.hbs'],
         },

		el : '#backbone-portlet-latest-order',
		events : {
		},
		
		initialize : function() {
			_.bindAll(this, 'render');
			this.model = new Webshop.Models.LatestOrder();
			this.container = $('#backbone-portlet-latest-order');
		},
		render : function() {
			this.model.fetch({
				error : function(response) {
					console.log("error: >>>>........ " + response);
				},
				success : function(model, response) {
					var jsonObject = model.toJSON(),str;
					if(jsonObject.orderHeaderWrapper.responseCode === "SUCCESS"){
						str = jsonObject.orderHeaderWrapper; 
						console.log("last order response --- " +  str);
						console.log("last order response --- " +  JSON.stringify(str));

						$('#backbone-portlet-latest-order').html(self.templates.latestOrder(str));
						
						if ($(".sidebar-floating").length > 0) {
							
							/*console.log("floating is ready for initialized...");*/

							$(window).on("scroll scrollstart", function() {
								
					            var outer=$('#left');
					            var inner=$('#sidebar');
					            var length = outer.height() - inner.height() + outer.offset().top;
					            var scroll = $(this).scrollTop();
					            var height = inner.height() + 'px';

					            if (scroll < outer.offset().top) {

					                inner.css({
					                    'position': 'absolute',
					                    'top': '0',
										'bottom': 'auto'					
					                });

					            } else if (scroll > length) {

					                inner.css({
					                    'position': 'absolute',
					                    'bottom': '0',
					                    'top': 'auto'
					                });

					            } else {

					                inner.css({
					                    'position': 'fixed',
					                    'top': '35px',
										'bottom': 'auto'
					                });
					            }
					        });
					    }
					}
					else{
						alert(jsonObject.orderHeaderWrapper.errorCode);
					}
	            	 
					
				}
			});
		}

	});
	
})();