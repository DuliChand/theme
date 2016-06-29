/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.ProductSearchResultView = Backbone.View.extend({
    		el : '#backbone-portlet-search-results',

		events : {
			 "click .filter-bar-box h4" : "filterExpandCollapse",
			 "click #popularKeywords" : "getPopularKeywords",
	    	 "click .choose-option" : "filterList",
	    	 "click #moreProducts" : "getMoreProductsData",
	    	 "click #moreEvents" : "getMoreEventsData"
		},

		initialize : function() {
			_.bindAll(this, 'render');
			this.searchResult = new SearchResult();
			this.searchEventResult = new SearchEventResult();
			this.topKeywords = new TopKeywords();
		},

		render : function() {
			var self = this;
			
			searchKeyword = $("#backbone-portlet-search-results").data("id"),
			
			self.getSearchedData();
			self.fetchSearchedEvents();
			
		},
		
		getSearchedData : function(){
			var self= this;
			self.searchResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					
					if(data.hits.hits.length){
						$(self.el).html(Handlebars.templates.searchresults(data.hits));
						
						$('#filterleft').html(Handlebars.templates.searchfilters(data));
						
						$('#products').html(Handlebars.templates.searchproductresults(data.hits));
						
						productsCount = data.hits.total;
						
						if(productsCount <= 15){
							$('.morebutton').find('#moreProducts').hide();
						}
						
						$('#keyword').text(searchKeyword);
						
						if($('.rolover-layer').length > 0) {
							$('.product-outer .prod-img').hover(function() {
								   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
							},function(){
								   $(this).find(".rolover-layer").animate({bottom: "-54"}, 'fast');
							});
						}
					
					}
					else{
						$(self.el).html(Handlebars.templates.searchresults());
						$('#notfound').html(Handlebars.templates.nosearchresult());
					}
				}	
			});
		},
		
		fetchSearchedEvents : function(){
			var self = this;
			self.searchEventResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					$("#eventArea").append(Handlebars.templates.searcheventresults(data.hits));
					eventsCount = data.hits.total;
					if(eventsCount <= 15){
						$('.morebutton').find('#moreEvents').hide();
					}
					$("#eventsCount").text(data.hits.total);
				}
			});
			
		},
		 
		filterExpandCollapse : function(e){
			e.preventDefault();
        	
        	$('.filter-bar-box h4').removeClass('active');
		    if ($(e.currentTarget).next("div").is(":visible")) {
		        $(e.currentTarget).removeClass('active').next("div").slideUp("slow");
		    } else {
		        $(".filter-bar-box .toggle-box").slideUp("slow");
		        $(e.currentTarget).addClass('active').next("div").slideToggle("slow");
		    }
	    },
	    
	    getPopularKeywords: function(e){
        	e.preventDefault();
        	 var self = this;
        	 self.topKeywords.fetch({
	           	error: function(response){
	           		console.log("error: >>>>........ " + response);
	           	}, 
                success: function (model, response) {
                 var data = response;
                 $('#showTopKeywords').html(Handlebars.templates.topkeywords(data));
                 $('#showTopKeywords').toggle();
                 $('#showTopKeywords').css("display", "block");
               }
             });
        },
        filterList: function(e){
        	e.preventDefault();
        	var self = this;
        	
        	$(e.currentTarget).next("label").toggleClass("choose");
        	
        	var keyword = $(e.currentTarget).val();
        	
        	if(keyword === "products"){
        		self.getProductsLists();
        	}
        	else if(keyword === "events"){
        		self.getEventsLists();
        	}else{
        		var selectedTopKeywordsArr = $("#showTopKeywords").find("label.choose").siblings("input:checkbox"),
        		selectedTopKeywords = $.map(selectedTopKeywordsArr, function(elem, i) { return $(elem).val() });
        		searchKeyword = selectedTopKeywords.join(" ");
        		
        		console.log(searchKeyword);
        		
        		self.searchResult.clear().fetch({
    				success : function(model, response) {
    					var data = model.toJSON();
    					console.log(data.hits);
    					$(".prod-area-list").html(Handlebars.templates.searchproductresults(data.hits));
    					
    					$('#keyword').text(searchKeyword);
    					
    					if($('.rolover-layer').length > 0) {
                            $('.prod-img').contenthover({
                                effect: 'slide',
                                data_selector: '.rolover-layer',
                                width: 0,
                                height: 76,
                                overlay_width: 0,
                                overlay_height: 76,
                                overlay_x_position: 'center',
                                overlay_y_position: 'bottom',
                                overlay_background: '',
                                overlay_opacity: 1,
                                slide_speed: 400,
                                slide_direction: 'bottom',
                                zindex: 2,
                                wrapper_class: 'ch_wrapper',
                                normal_class: 'ch_normal',
                                hover_class: 'ch_hover'
                            });
                        }
    					self.fetchSearchedEvents();
    				}
    			});
        	}

        },
        
        getProductsLists : function(){
        	var self= this;
			self.searchResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					
					if(data.hits.hits.length){
						
						$('#products').append(Handlebars.templates.searchproductresults(data.hits));
						
						if($('.rolover-layer').length > 0) {
							$('.product-outer .prod-img').hover(function() {
								   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
							},function(){
								   $(this).find(".rolover-layer").animate({bottom: "-54"}, 'fast');
							});
						}
					
					}
					else{
						$(self.el).html(Handlebars.templates.searchresults());
						$('#notfound').html(Handlebars.templates.nosearchresult());
					}
				}	
			});
        },
        
        getEventsLists : function(){
        	var self = this;
			self.searchEventResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					console.log(data.hits);
					$(".prod-area-list").html(Handlebars.templates.searcheventresults(data.hits));
					$("#eventsCount").text(data.hits.total);
				}
        });
        },
        
        getMoreProductsData : function(event){
        	event.preventDefault();
        	productSize = productSize + 12;
        	productFrom = productFrom + 12;
        	if(productFrom <= productsCount){
        		var self= this;
    			self.getProductsLists();
        	}else{
        		$('#moreProducts').prop('disabled',true);
        	}
        },
        
        getMoreEventsData : function(event){
        	event.preventDefault();
        	eventSize = eventSize + 12;
        	eventFrom = eventFrom + 12;
        	if(eventSize <= productsCount){
        		
        		var self = this;
        		self.fetchSearchedEvents();
        		
        	}else{
        		$('#moreEvents').prop('disabled',true);
        	}
        }
      
      });

})();
