/*global Webshop, Backbone, JST*/

var searchKeyword = "";
val = [];
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.SearchView = Backbone.View.extend({

		templates: {
            searcheventresults: JST['app/scripts/templates/searcheventresults.hbs'],
            searchproductresults: JST['app/scripts/templates/searchproductresults.hbs'],
            searchresults: JST['app/scripts/templates/searchresults.hbs'],
            searchfilters: JST['app/scripts/templates/searchfilters.hbs'],
            topkeywords: JST['app/scripts/templates/topkeywords.hbs'],
            nosearchresult: JST['app/scripts/templates/nosearchresult.hbs']
        },
		el : '#backbone-portlet-search-results',
		events : {
			 "click .filter-bar-box h4" : "filterExpandCollapse",
			 "click #popularKeywords" : "getPopularKeywords",
			 "click .choose-option" : "chooseFilterOption",
	    	 "click #moreProducts" : "getMoreProductsData",
	    	 "click #moreEvents" : "getMoreEventsData",
	    	 'click #quickViewProduct' : 'quickView',
			 "click .reset-all" : "resetFilters"
		},
		initialize : function() {
			_.bindAll(this, 'render');
			this.searchResult = new Webshop.Models.SearchResult();
			this.searchEventResult = new Webshop.Models.SearchEventResult();
			this.topKeywords = new Webshop.Models.TopKeywords();
		},
		render : function() {
			var self = this;
			
			searchKeyword = $("#backbone-portlet-search-results").data("id");
			searchKeyword = (searchKeyword === null) ? "" : searchKeyword;  
			self.getSearchedData();
			
		},
		getSearchedData : function(){
			var self= this;
			self.searchResult.clear().fetch({
				success : function(model, response) {
					var data = response;
					
					/*console.log("data:--- ");
					console.log(data);*/
					
					if(data !== undefined) {
					
						if(data.aggregations.categoryGroup.buckets.length) {
							$(self.el).html(self.templates.searchresults(data));
							
							$('#filterleft').html(self.templates.searchfilters(data.aggregations));
							$('#loader').hide();
							$('.morebutton').hide();
							$('#products').html(self.templates.searchproductresults(data));
							
							/*productsCount = data.hits.total;
							
							if(productsCount <= 15){
								$('.morebutton').hide();
							}*/
							
							$('#keyword').text("\"" + searchKeyword + "\"");
							
							if($('.rolover-layer').length > 0) {
								$('.product-outer .prod-img').hover(function() {
									   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
								},function(){
									   $(this).find(".rolover-layer").animate({bottom: "-54"}, 'fast');
								});
							}
							//self.fetchSearchedEvents();
						} else {
							
							$(self.el).html(self.templates.searchresults());
							$('#notfound').html(self.templates.nosearchresult());
							
							$('#keyword').text("\"" + searchKeyword + "\"");
						}
						
					} else {
						$(self.el).html(self.templates.searchresults());
						$('#notfound').html(self.templates.nosearchresult());
						
						$('#keyword').text("\"" + searchKeyword + "\"");
					}
				}	
			});
		},
		fetchSearchedEvents : function(){
			var self = this;
			self.searchEventResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					$("#eventArea").append(self.templates.searcheventresults(data.hits));
					/*eventsCount = data.hits.total;
					if(eventsCount <= 15){
						$('#moreEvents').parents('.morebutton').hide();
					}*/
					/*$("#eventsCount").text(data.hits.total);*/
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
	           		/*console.log("error: >>>>........ " + response);*/
	           	}, 
                success: function (model, response) {
                 var data = response;
                 $('#showTopKeywords').html(self.templates.topkeywords(data));
                 $('#showTopKeywords').toggle();
                 $('#showTopKeywords').css("display", "block");
               }
             });
        },
		resetFilters : function(event){
			event.preventDefault();
			var self = this,
			filterList = $(event.currentTarget).closest("#filter-wrapper").find(".toggle-box");
	    		for(var j=0; j<filterList.length; j++) {
	            		var filterOptions = $(filterList[j]).children().find("input:checked");
	            		for(var i=0;i<filterOptions.length;i++) {
	            			$(filterOptions[i]).removeAttr('checked');
	            			$(filterOptions[i]).next("label").removeClass('choose');
	             }
	        }
	    	self.getSearchedData();
		},
		chooseFilterOption: function(e) {
        	$(e.currentTarget).next("label").toggleClass("choose");
        	this.filterList();
        },
        filterList: function(){
        	var self = this;
        	var category = "" ;
        	val = [];
        	$('.filter-bar-box').find('input:checked').each(function(i){
               val[i] = $(this).val();
               category = $(this).attr('name');
             });
        	
        	if($('.filter-bar-box').find('input:checked').val()){
        		self.getProductsLists(category);
        	}else{
        		self.getSearchedData();
        	}

        },
        
        getProductsLists : function(category){
        	var self= this;
			$('#loader').show();
			var filterData =  {
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
      	    			    "filtered": {
      	    			      "query": {
      	    			        "multi_match": {
      	    			          "query": searchKeyword,
      	    			          "fields": [
      	    			            "product.product.name.englishanalyzer^4",
					    "product.product.name.englishanalyzerps^4"
      	    			           
      	    			          ],
      	    			          "use_dis_max": true
      	    			        }
      	    			      },
      	    			      "filter": {
      	    			        "terms": {
      	    			          "categoryLevel2": 
      	    			              val
      	    			        }
      	    			      }
      	    			    }
      	    			  }
      	    			};
							
					if (self.searchEventResult.clear().set(filterData)) {
              		self.searchEventResult.fetch({
          				success : function(model, response) {
          					var data = model.toJSON();
          					$('#loader').hide();
          					if(data.hits.hits.length){
          						
          						$('#products').append(self.templates.searchproductresults(data.hits));
          						$('#product-loader').hide();
          						//var catList = $(".product-outer." + category + ":not" );
          						if(category.toLowerCase() === 'men'){
          							var catList  = $(".product-outer:not(.Men)");
              						catList.hide();
          						}else if(category.toLowerCase() === 'women'){
          							var catList  = $(".product-outer:not(.Women)");
              						catList.hide();
          						}
          						else if(category.toLowerCase() === 'home'){
          							var catList  = $(".product-outer:not(.Home)");
              						catList.hide();
          						}
          						else if(category.toLowerCase() === 'accessories'){
          							var catList  = $(".product-outer:not(.Accessories)");
              						catList.hide();
          						}else{
          							console.log(category.toLowerCase());
          						}
          						
          					   
          					          						
          						productsCount = data.hits.total;
          						if(productsCount > 30)
          							$('.morebutton').show();
          						
          						
          						if($('.rolover-layer').length > 0) {
          							$('.product-outer .prod-img').hover(function() {
          								   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
          							},function(){
          								   $(this).find(".rolover-layer").animate({bottom: "-54"}, 'fast');
          							});
          						}
          					
          					}
          					else{
          						$(self.el).html(self.templates.searchresults());
								$('#notfound').html(self.templates.nosearchresult());
          					}
          				
      						
          				}	
          			});
              	}
        },
        
        getEventsLists : function(){
        	var self = this;
			self.searchEventResult.clear().fetch({
				success : function(model, response) {
					var data = model.toJSON();
					/*console.log(data.hits);*/
					$(".prod-area-list").html(self.templates.searcheventresults(data.hits));
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
        },
		quickView : function(event) {

			event.preventDefault();
			var vendorProductId = $(event.currentTarget).closest(".prod-img").attr("id"),
				eventId = $(event.currentTarget).closest(".prod-img").data("event-id"),
				data = {
					"vendorProductId" : vendorProductId,
					"eventId" : eventId
				};
			
			this.productQuickView = new Webshop.Views.ProductQuickView();
			this.productQuickView.renderProductQuickView(data);
			
		}
	});

})();

