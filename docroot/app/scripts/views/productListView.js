/*global Webshop, Backbone, JST*/
var timeVer;
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    var attrCriterias = [],
		attributeList =[],
		priceFilters= [],
        nonAttrCriterias = [],
        loadingMoreData = false,
        priceMinValue = 0,
        priceMaxValue = 0,
        currSKUQnty, selectedSKU, selectedInventoryId, skuPrefix, skuSuffix, prodImageRepo = [],
        imageServerBaseURL = "http://cdn1.fashionandyou.com/fny-event/",
        limit = 20,
        skip = 0,
        orderSort = 'asc',
        productlistevt,
        fixedFiltersData,
		goabalEventName;
		

    Webshop.Views.ProductListView = Backbone.View.extend({
        templates: {
            eventinfo: JST['app/scripts/templates/eventinfo.hbs'],
            //topcatinfo: JST['app/scripts/templates/topcatinfo.hbs'],
            categoryinfo: JST['app/scripts/templates/categoryinfo.hbs'],
            eventproductlist: JST['app/scripts/templates/eventproductlist.hbs'],
            categoryproductlist: JST['app/scripts/templates/categoryproductlist.hbs'],
            browsesimilarevents: JST['app/scripts/templates/browsesimilarevents.hbs'],
			soldoutproduct: JST['app/scripts/templates/soldoutproduct.hbs'],
            filters: JST['app/scripts/templates/filters.hbs'],
            product: JST['app/scripts/templates/product.hbs'],
			catelougelist: JST['app/scripts/templates/catelougelist.hbs'],
			eventlougelist: JST['app/scripts/templates/eventlougelist.hbs'],
			catelougefilter: JST['app/scripts/templates/catelougefilter.hbs'],
			newfilters: JST['app/scripts/templates/newfilters.hbs']
        },
        el: '#backbone-portlet-product-listing',
        events: {

            /* Event Info Related Events Start Here */
            //'click .event-info-details .add-favorites': 'addToFavouritesEvent',
           // 'click .event-info-details .remove-favorites': 'removeFromFavouritesEvent',
           //'click .event-info-details .social-share-link': 'eventSocialShareHandler',
            'click #eventName': 'toggleEventInfoPannel',
            'click #eventInfoPanel .closebutton': 'toggleEventInfoPannel',
            /* Event Info Related Events End Here */

            /* Event Filters Related Events Start Here */
			"click #sortSelect" : "filterProductList",
			'click #myTab a' : 'filterlistDisplay',
			'click .button-group span.crossIcon' : 'filterlistClose',
			"click .sortFilterOptions li a" : "sortProducts",
			"click .resetBtn" : "refreshFilter",
			"click .applyBtn" : "applyAllFilter",
            /* Event Filters Related Events End Here */

            /* Event Products Related Events Start Here */
            'click #quickViewProduct': 'productQuickView',
            'click .product-outer .social-share-link': 'productSocialShareHandler',
            'click .rush-hour': 'toggleRushHour'
            /* Event Products Related Events End Here */
        },
        initialize: function() {

            _.bindAll(this, 'render');
            this.liveProducts = new Webshop.Models.LiveProducts();
            //this.addEventToFavourites = new Webshop.Models.AddEventToFavourites();
            //this.removeEventFromFavourites = new Webshop.Models.RemoveEventFromFavourites();
            //this.eventFavouriteStatus = new Webshop.Models.EventFavouriteStatus();
            this.browseSimilarEvents = new Webshop.Models.BrowseSimilarEvents();
			this.model2  = new Webshop.Models.Filteredproducts();

        },
        render: function(data) {

            var self = this;
            productlistevt = data;
			if(data.event){
				goabalEventName = data.event.eventName;
			}
			self.renderEventInfo(data);
            self.renderFilters(data);
			
			var currentUrldata = window.location.href,
			currentcategory = currentUrldata.split('/').pop(-1) || "",
			previouscategory = $.cookie('categoryvisted');
			
			/* this code is not using at that time */

			if(currentcategory == previouscategory){
				$('#filterSatus').attr('data-status','false');
				if(sessionStorage.getItem("FILTER_DATA") != null ){
					var data = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					if(data.priceFilters){
						nonAttrCriterias = data.priceFilters ;
					 	$.each(data.priceFilters.length,function(index ,data){
						if(data.key == 'Category'){
						  $('.select.choose-option.Category').val(data.values)
						}
						else if(data.key == 'Brand'){
						  $('.select.choose-option.Brand').val(data.values)
						}
					  });
					}
					if(data.attributeList.length){
						 attrCriterias = data.attributeList;
					  $.each(data.attributeList,function(index ,data){
						if(data.key == 'Size'){
						  $('.select.choose-option.Size').val(data.values)
						}
						else if(data.key == 'Color'){
						  $('.select.choose-option.Color').val(data.values)
						}
						else if(data.key == 'Price'){
						  $('.select.choose-option.Price').val(data.values)
						}

					  });
					}
					var sessionfilterData = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					self.sessionFilter(sessionfilterData)
				}
				else{
					
					self.renderProducts(data);
					$.cookie('categoryvisted', "", {
								expires: 1,
								path: '/'
					});
				}
			}
					
			else if(sessionStorage.getItem("FILTER_DATA") != null ){
				var filterSessData = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA")); 
				if(data.categoryWrapper){
					if(currentcategory != previouscategory){
						sessionStorage.removeItem("FILTER_DATA");
					}
				}
				else {
					if(filterSessData.eventId != data.event.eventId){
						$('#filterSatus').attr('data-status','false');
						sessionStorage.removeItem("FILTER_DATA");
					}
				}
			}
			
			if(sessionStorage.getItem("FILTER_DATA") != null)
			var filterstatus = $('#filterSatus').attr('data-status').toString();
			if(filterstatus === 'true'){
				if(sessionStorage.getItem("FILTER_DATA") != null){
					var data = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					if(data.priceFilters.length){
					  nonAttrCriterias = data.priceFilters ;
					  
					  $.each(data.priceFilters.length,function(index ,data){
						if(data.key == 'Category'){
						  $('.select.choose-option.Category').val(data.values)
						}
						else if(data.key == 'Brand'){
						  $('.select.choose-option.Brand').val(data.values)
						}
					  });
					}
					if(data.attributeList.length){
					  attrCriterias = data.attributeList;
					
					  $.each(data.attributeList,function(index ,data){
						if(data.key == 'Size'){
						  $('.select.choose-option.Size').val(data.values)
						}
						else if(data.key == 'Color'){
						  $('.select.choose-option.Color').val(data.values)
						}
						else if(data.key == 'Price'){
						  $('.select.choose-option.Price').val(data.values)
						}
						
						
					  });
					}
					var sessionfilterData = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					self.sessionFilter(sessionfilterData)
				}
				else{
					self.renderProducts(data);
				}
			}
			else{
			
				self.renderProducts(data);
			}

			//Komli pixel fired----
			if(data.categoryWrapper){
				var catId = data.categoryWrapper.category.categoryName , catName = $('#backbone-portlet-product-listing').attr('data-id');
				self.renderKomliPixel(catId , catName )
			}
             
			//self.updateFavouriteLinkEvent();
        
        },
		renderSoldoutEvents: function(){
			var self = this,
			scrolldone = true;
			if(loadingMoreData){
			}
			else{
				if(soldOutArry.length)
				{	
					$("#productListing").append(self.templates.soldoutproduct(JSON.parse(JSON.stringify({"soldout":soldOutArry,"globalEvent":goabalEventName}))));
					/*--event-name in filters implementation--*/
						$('.product-outer.product .prod-detail .event-name').each(function(){
							$(this).html(goabalEventName);
						});
					/*---event name ends here----*/
					$(window).scroll(function(e) {
						var scrollbyproducts = this;
							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 200) - $(window).height())) {
								
								if(loadingMoreData){}
								else{
									var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
									if (is_chrome) {
										var price = $('.product-outer:last-child').data('price'),
										eventId = $('.product-outer:last-child').data('event-id'),
										id = $('.product-outer:last-child').attr('event-id');
										var soldsecondData = $('.product-outer').eq(1).html();
										var lastproductData = $('.product-outer:last-child').html();
										$('.product-outer').eq(1).remove();
										$('.product-outer:last-child').remove();
										$('#productListing').append('<div class="product-outer product" >'+soldsecondData+'</div>');
										$('#productListing').prepend('<div class="product-outer product" data-price="'+price+'" data-event-id="'+eventId+'" id="'+id+'">'+lastproductData+'</div>');
										
									}
								}
								
							}
					});	
					$(scrollbyproducts).unbind('scroll').scroll(function(){});
				}
			}	
		},

        /* Event Info Related Methods Start Here */
        renderEventInfo: function(data , eventFavData) {

            var self = this;
            data.currTime = timeVer;   //this code for currTime check
            var listingType = $("#backbone-portlet-product-listing").attr("data-type");
			var currentCatUrl = window.location.pathname.split('/');
            var subCatUrlName = currentCatUrl[2];
            data.subCatUrlName = subCatUrlName;
            
            if(data.listingType == 'catalog') {
              // $("#eventInfo").html("<h1 class='page-heading'>" + subCatUrlName + "</h1>");
                $("#eventInfo").html(self.templates.eventinfo(data));             
            }

            if (data.event) {
                $("#eventInfo").html(self.templates.eventinfo(data));		
               
                //self.updateFavouriteOnloadLinkEvent(eventFavData);
                var eventTimeHolder = $("#eventTimer"),
                    eventExpireDateTime = eventTimeHolder.data("expire-datetime");

                setTimeout(function() {
                    eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                        eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                    }).on('finish.countdown', function() {
                        eventTimeHolder.html("EXPIRED");
                    });

                }, 500);

            }
        },
        /*addToFavouritesEvent: function(e) {
			if($.cookie('COOKIE_FNY_CUSTOMER_ID'))	{
				e.preventDefault();
				
				var self = this,
					eventImage = $("#eventMainImage").data("favsrc"),
					eventName = $("#eventName").text(),
					eventId = $("#backbone-portlet-product-listing").attr("data-id"),
					eventData = {
						"eventCassandra": [{
							"eventName": eventName,
							"eventId": eventId,
							"thumbnailUrl": eventImage
						}]
					};

				if (self.addEventToFavourites.clear().set(eventData)) {

					self.addEventToFavourites.save({}, {
						error: function(model, response) {
						},
						success: function(model, response) {

							if (response.eventCassandraWrapper.responseCode === "SUCCESS") {
								self.updateFavouriteLinkEvent();
							} else {
								if (response.eventCassandraWrapper.errorMessage != undefined) {
								} else {
									/*console.log("Add to Favourite Event Service Failure.");
								}

							}
						}
					});

				} else {

					this.$('.alert-error').fadeIn();
				}
			}
			else{
				$("#invalid-popup h2").text("please login to add events to favourite list");
				$("#invalid-popup .row p").text("");
				$.fancybox($('#invalid-popup'),{
					 helpers : { 
						  overlay : {closeClick: false}
						},
					 'afterShow'     : function () {
					}
				});
			}
        },*/
        /*removeFromFavouritesEvent: function(e) {
            e.preventDefault();
            var self = this,
                createdTime = $(".remove-favorites").data("created-time"),
                eventData = {
                    "createdTime": createdTime
                };

            if (self.removeFromFavourites.clear().set(eventData)) {
                self.removeFromFavourites.fetch({
                    error: function(response) {
                        /*console.log(response);
                    },
                    success: function(model, response) {
                        /*console.log(response);
                        self.render();
                    }
                });
            }
        },*/
        /*updateFavouriteLinkEvent: function() {

            var self = this,
                eventId = $("#backbone-portlet-product-listing").attr("data-id"),
                eventData = {
                    "eventId": eventId
                };

            if (self.eventFavouriteStatus.clear().set(eventData)) {
                self.eventFavouriteStatus.fetch({
                    error: function(response) {
                        /*console.log(response);
                    },
                    success: function(model, response) {
                        /*console.log(response);

                        if (response.isFavourite) {
                            $(".favorite-icon")
                                .addClass("remove-favorites")
                                .removeClass("add-favorites")
                                .attr("data-created-time", response.createdTime);
                        } else {
                            $(".favorite-icon")
                                .addClass("add-favorites")
                                .removeClass("remove-favorites")
                                .removeAttr("data-created-time");
                        }
                    }
                });
            }
        },

        updateFavouriteOnloadLinkEvent: function(eventFavData) {
            var response = eventFavData;
            if (response.isFavourite) {
                $(".favorite-icon")
                    .addClass("remove-favorites")
                    .removeClass("add-favorites")
                    .attr("data-created-time", response.createdTime);
            } else {
                $(".favorite-icon")
                    .addClass("add-favorites")
                    .removeClass("remove-favorites")
                    .removeAttr("data-created-time");
            }
        },*/

       /* eventSocialShareHandler: function(e) {

            e.preventDefault();

            var classesList = $(e.currentTarget).attr("class").split(' '),
                curEventId = $("#backbone-portlet-event-detail").data('id'),
                sharingData = {
                    url: window.location.href,
                    title: $("#eventName").text(),
                    imageUrl: $('#eventMainImage').data("favsrc"),
                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                    handlerName: classesList[1]
                };

            socialShare(e, sharingData);
        },*/
        toggleEventInfoPannel: function(e) {
            e.preventDefault();
            $("#eventInfoPanel").toggle();
        },
        /* Event Info Related Methods End Here */



        /* Event Filters Related Methods Start Here */
        renderFilters: function(data) {
            var self = this,
                filtersData = {};
				
                filtersData.currTime = timeVer; 
           	 if (data.listingType.toLowerCase() === 'catalog') {
                     filtersData.filters = data.productListing.filters;
		            $("#filters").html(self.templates.newfilters(filtersData));
            }

            if (data.listingType.toLowerCase() === 'event') {
                      filtersData.filters = data.productListing.filters;
                     $("#filters").html(self.templates.newfilters(filtersData));

                     // $("#filters").html(self.templates.catelougefilter(filtersData));
	        		//self.filterRemove();
	        		/*var selectList = $('select.choose-option.Size  option');
					selectList.sort(function(a,b){
						a = a.id;
						b = b.id;
						return a-b;
					});
				  $('select.choose-option.Size').html(selectList);
				  $('select.choose-option.Size').val('select'); */
                  
            }

        },
	        filterlistDisplay : function(e){
	        	e.preventDefault();
	        	 $('#myTab a:last').tab('show');
	        	},
	    	filterlistClose : function(e){
	    	 e.preventDefault();
  		    	$('#myTab li').removeClass('active');
  		    	$('.tab-content .tab-pane').removeClass('active');
	    	},

			refreshFilter: function(e){
				e.preventDefault();
				var self = this,
        	 	filtersData = {},
        		listingId = $("#backbone-portlet-product-listing").attr("data-id"),
				listingType = $("#backbone-portlet-product-listing").attr("data-type");
				var categoryIdDatatest = $('#catchangeval').val();
			
        	listingType = listingType.toLowerCase();
        	setTimeout(function(){
        	 if(listingType === "event") {
				var eventId = $("#backbone-portlet-product-listing").attr("data-id");
				filtersData = {	    			
						"eventId" : eventId,
						"from": skip,
						"limit": limit,
						"sortBy": orderSort
					};
			}
        	
			if(listingType === "category") {
				var menuCatId = $("#backbone-portlet-product-listing").attr("data-id");
				filtersData = {
					"menuCatId" : menuCatId,
					"from": skip,
					"limit": limit,
					"sortBy": orderSort
										  			
	    		};
			}
			self.renderFilters(productlistevt);
			self.render2(filtersData);

			attributeList = [];
        	priceFilters = [];
		},1000);
            
        },

       
        filterProductList: function(event) {
			duplicateProduct = [];repeatedProducts= [];
			$(event.currentTarget).addClass("active");
			var priceFlag, sortByFilter;
            var self = this;
                     
        	var listingId = $("#backbone-portlet-product-listing").attr("data-id"),
			listingType = $("#backbone-portlet-product-listing").attr("data-type");
				//var categoryIdDatatest = $('#catchangeval').val();

			var attributeList =[];
			var priceFilters =[];
			 var tempFilterObj = {};
			 var priceTempFilterObj = {};
			var listele = $('.choose-option.active');
			$.each(listele , function(i,ele){
			   var listArry = [];
				var checkbox = $(this).find('.checkbox-custom:checked');
				$.each(checkbox ,function(i,ele){
			        listArry.push($(this).val());
			    })
			    if($(this).attr('data-filter-name') == 'price'){
				    
				    priceTempFilterObj = listArry ;
				    priceFilters= priceTempFilterObj;
			    }else{
				    attributeList= [];
				    var filter = $(this).attr('data-filter-name').toString();
					tempFilterObj[filter] = listArry ;
				    //attributeList[$(this).attr('data-filter-name')]=listArry;
				    attributeList.push(tempFilterObj);
				    
				}
			});
			 //onsole.log("select filter item" + JSON.stringify(attributeList));
			 //onsole.log("slect price item"+ JSON.stringify(priceFilters));
			
        		listingType = listingType.toLowerCase();            	
				 	setTimeout(function(){   
			        	if(listingType === "event") {
							var eventId = $("#backbone-portlet-product-listing").attr("data-id");
							var filtersData = {	    			
									"eventId" : eventId,
									"from": skip,
									"limit": limit,
									"sortBy": orderSort,
									"attributeList": attributeList,
                    				"priceFilters": priceFilters
				    		};

				    		console.log(filtersData);

				    		self.filterapply(filtersData);
						}
						if(listingType === "category") {
							var menuCatId = $("#backbone-portlet-product-listing").attr("data-id");
							var filtersData = {
								"menuCatId" : menuCatId,
								"from": skip,
								"limit": limit,
								"sortBy": orderSort,
								"attributeList": attributeList,
                    			"priceFilters": priceFilters				  			
				    		};
	
						     console.log(filtersData);

				    		self.filterapply(filtersData);
						}
						
	        	 },1000);
			
        },
        filterapply : function(filtersData ){
    	  var self = this;   	
    	  
    	  if (this.model2.clear().set(filtersData)) {
    		  this.model2.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	
            	    var data = model.toJSON();
            	    console.log(JSON.stringify(data));
            	    var filtersData;
            	     filtersData = data.productListing.filters;
                           var listele = $( ".choose-option" ).not( ".active" );
							$.each(listele , function(i,ele){
							var activeList =  $(this).find('li');
							var selectFilterName =  $(this).attr('data-filter-name');
							$(activeList).remove();
        	                  console.log(JSON.stringify(filtersData));
								$.each(filtersData ,function(index ,obj){
									
								 $.each(obj.buckets, function(key, value){
										if(index === selectFilterName){
										 $( ".choose-option." + selectFilterName ).append('<li><input type="checkbox" value="'+value.key+'" id="'+value.key+'" class="checkbox-custom"><label for="'+value.key+'" class="checkbox-custom-label">'+value.key + '</label></li>');
									    }
									})	
								});
							})

                  }
              })
    		}
        },
        
        clearAllFilters: function(event) {
            event.preventDefault();
            var filterList = $(event.currentTarget).closest("#filter-wrapper").find(".toggle-box");

            for (var j = 0; j < filterList.length; j++) {
                if ($(filterList[j]).hasClass("price") || $(filterList[j]).hasClass("discount")) {

                    if ($(filterList[j]).hasClass("price")) {
                        this.resetPriceSlider();
                    }

                } else {

                    var filterOptions = $(filterList[j]).children().find("input:checked");

                    for (var i = 0; i < filterOptions.length; i++) {
                        $(filterOptions[i]).removeAttr('checked');
                        $(filterOptions[i]).next("label").removeClass('choose');
                    }
                }
            }

            this.filterProductList();
        },
        
        renderProducts: function(productData) {
            var self = this,
                data = {
                    "limit": limit,
                    "from": skip,
                    "sortBy": orderSort,
                    "attributeList": attributeList,
                    "priceFilters": priceFilters
                },
                productListData = productData;
            self.getProductData(data , productListData);

            $(window).scroll(function() {

                if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {

                    if (loadingMoreData) {

                        $(".product-loader").hide();
                        loadingMoreData = false;

                        self.infiniteScroll(productListData);
                    }
                }
            });
        },
        sortProducts: function(event) {
			var self = this;
			event.preventDefault();
			var sortvalue = $(event.currentTarget).attr("data-value");
            skip = 0;
			var filterList = $('.choose-option'),
				filtersData = {},
        		listingId = $("#backbone-portlet-product-listing").attr("data-id"),
				listingType = $("#backbone-portlet-product-listing").attr("data-type");

				if(sortvalue === 'high_to_low'){
					var Sort = 'desc';
					}
					if(sortvalue === 'low_to_high'){
					var Sort = 'asc';
					}				
					
				listingType = listingType.toLowerCase();            	
				 	setTimeout(function(){   
			        	if(listingType === "event") {
							var eventId = $("#backbone-portlet-product-listing").attr("data-id");
							filtersData = {	    			
									"eventId" : eventId,
									"from": skip,
									"limit": limit,
									"sortBy": Sort
				    		};
				    		// $('.tab-pane').toggleClass('active');
				    		  $('.tab-pane').removeClass('active');
	    		      	      $('#myTab li').removeClass('active');
				    		self.render2(filtersData);
						}
						if(listingType === "category") {
							var menuCatId = $("#backbone-portlet-product-listing").attr("data-id");
							filtersData = {
								"menuCatId" : menuCatId,
								"from": skip,
								"limit": limit,
								"sortBy": Sort				  			
				    		};

				    		 //$('.tab-pane').toggleClass('active');
				    		   $('.tab-pane').removeClass('active');
	    		     			$('#myTab li').removeClass('active');

				    		self.render2(filtersData);
						}
						
	        	 },1000);

			
			 
			$("img.lazy").lazyload({
				effect : "fadeIn"
			});
			
        },
        applyAllFilter: function(e){
				e.preventDefault();
				var self = this,
        	 	filtersData = {},
        		listingId = $("#backbone-portlet-product-listing").attr("data-id"),
				listingType = $("#backbone-portlet-product-listing").attr("data-type");
				var categoryIdDatatest = $('#catchangeval').val();

/*
				var obj ={}
				var listele = $('.choose-option.active');
				$.each(listele , function(i,ele){
				   var listArry = []
					var checkbox = $(this).find('.checkbox-custom:checked')
					$.each(checkbox ,function(i,ele){
				        listArry.push($(this).val())
				    })
				    obj[$(this).attr('data-filter-name')]=listArry;
				});
				console.log(obj)
*/

				var attributeList =[];
				var priceFilters =[];
				 var tempFilterObj = {};
				 var priceTempFilterObj = {};
				var listele = $('.choose-option.active');
				$.each(listele , function(i,ele){
				   var listArry = [];
					var checkbox = $(this).find('.checkbox-custom:checked');
					$.each(checkbox ,function(i,ele){
				        listArry.push($(this).val());
				    })
				    if($(this).attr('data-filter-name') == 'price'){
					    
					    priceTempFilterObj = listArry ;
					    priceFilters= priceTempFilterObj;
				    }else{
					    attributeList= [];
					    var filter = $(this).attr('data-filter-name').toString();
						tempFilterObj[filter] = listArry ;
					    //attributeList[$(this).attr('data-filter-name')]=listArry;
					    attributeList.push(tempFilterObj);
					    
					}
				});
			  //console.log(JSON.stringify(attributeList));
			 // console.log(JSON.stringify(priceFilters));
			
        	listingType = listingType.toLowerCase();
        	setTimeout(function(){
        	 if(listingType === "event") {
				var eventId = $("#backbone-portlet-product-listing").attr("data-id");
				filtersData = {	    			
						"eventId" : eventId,
						"from": skip,
						"limit": limit,
						"sortBy": orderSort,
						"attributeList": attributeList,
						"priceFilters" : priceFilters
					};
					  $('.tab-pane').removeClass('active');
	    		     $('#myTab li').removeClass('active');
					self.render2(filtersData);
			}
        	
			if(listingType === "category") {
				var menuCatId = $("#backbone-portlet-product-listing").attr("data-id");
				filtersData = {
					"menuCatId" : menuCatId,
					"from": skip,
					"limit": limit,
					"sortBy": orderSort,
					"attributeList": attributeList,
					"priceFilters" : priceFilters
										  			
	    		};
	    		 $('.tab-pane').removeClass('active');
	    		     $('#myTab li').removeClass('active');
	    		self.render2(filtersData);
			}
			
		},1000);

            
        },
        clearSingleFilter: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var filterList = $(event.currentTarget).closest("h4").next(".toggle-box");
            if (filterList.hasClass("price") || filterList.hasClass("discount")) {

                if (filterList.hasClass("price")) {
                    this.resetPriceSlider();
                }

            } else {

                var filterOptions = filterList.children().find("input:checked");

                for (var i = 0; i < filterOptions.length; i++) {
                    $(filterOptions[i]).removeAttr('checked');
                    $(filterOptions[i]).next("label").removeClass('choose');
                }
            }
            this.filterProductList();
        },

        toggleFilterPannel: function(e) {
            e.preventDefault();
            $("#product-filter-wrapper").toggle();
            $(".title-filter-left").toggleClass('active');
        },

		renderKomliPixel: function(catId , catName) {
			var self = this,
			pixelData = {
				pageType : "b",
				prdtId: "",
				prdtName: "",
				salePrice: "",
				qtyAvailable: "",
				catId: catId,
				catName:catName,
				cartVal:""
			},
			
			//Komli pixel view rendered-----
			komliPixel = new  Webshop.Views.Pixlet();
			komliPixel.globalPixel(pixelData);
			
		
		},
        productQuickView: function(event) {
        	
            event.preventDefault();
            event.stopPropagation();
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
            e.stopPropagation();
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
        },
        infiniteScroll: function(productListData) {
            skip += limit;
            var listing = $('#backbone-portlet-product-listing').attr('data-type');
            var self = this;
            if(listing.toLowerCase() == 'event')
            {
                var data = {
                    "eventId":$('#backbone-portlet-product-listing').attr('data-id'),
                    "limit": limit,
                    "from": skip,
                    "sortBy": orderSort,
                    "attributeList": attributeList,
                    "priceFilters": priceFilters
             		} 
         	}
             else if(listing.toLowerCase() == 'category'){
             	var data = {
                    "menuCatId":$('#backbone-portlet-product-listing').attr('data-id'),
                    "limit": limit,
                    "from": skip,
                    "sortBy": orderSort,
                    "attributeList": attributeList,
                    "priceFilters": priceFilters
             		} 	
                };
            self.pagining(data); 
            //self.getProductData(data , productListData);
        },
        pagining: function(data) {

            var self = this;
            var skip = {"skipdata" : skipData};
            if (self.liveProducts.clear().set(data)) {
                self.liveProducts.fetch({
                    error: function(response) {
                        console.log("error");
                    },
                    success: function(model, response) {
                        var data = response;  
                        var test; 
						if(data.listingType.toLowerCase() === 'catalog'){
							self.pagingCategoryView(data);
						}
						else if(data.listingType.toLowerCase() === 'event'){
							self.pagingCategoryView(data);
						}
                       
                    }
                });
            }
        },
		
		pagingCategoryView: function(data){
			var self = this;
			var  availableProductCount = 0;
			
           	$(".product-loader").hide();
			//console.log("paging Category view Data----" +  JSON.stringify(data));
			$("#productListing").append(self.templates.catelougelist(data));
			
			setTimeout(function(){
				$("img.lazy").lazyload({
					effect : "fadeIn"
				});
			},1000);	

			if ($('.rolover-layer').length > 0) {
				$('.product-outer .prod-img').hover(function() {
					$(this).find(".rolover-layer").animate({
						bottom: "0"
					}, 'fast');
				}, function() {
					$(this).find(".rolover-layer").animate({
						bottom: "-140"
					}, 'fast');
				});
			}
			$.each(data.productListing.products, function(argument, value) {
				$.each(value.source.variants, function(index, value)
				{
					var nullVariants = value.name;
					if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
					{
						$(".notvalue-"+nullVariants).hide();
					}
					else{}
				})	
			})
			availableProductCount = parseInt(data.productListing.total - skip);
			console.log("avialable product count with skip --=" + availableProductCount);
			
			if($('.product-outer').size() > 0){
				$('#notfound').css('display','none');
			}
			else{
				$('#notfound').css('display','block');
			}
			loadingMoreData = (availableProductCount < limit) ? false : true;	
			
		},
		
        getProductData: function(data , productListData) {
            var self = this;
              var  availableProductCount = 0;           
              $(".product-loader").hide();						
            	if (productListData.listingType.toLowerCase() === 'catalog') {                           
                    $("#productListing").html(self.templates.catelougelist(productListData));
                  	
					setTimeout(function(){
						$("img.lazy").lazyload({
							effect : "fadeIn",
							 threshold : 400,
							failure_limit : 0
						});
					},1000);	

                    if ($('.rolover-layer').length > 0) {
                        $('.product-outer .prod-img').hover(function() {
                            $(this).find(".rolover-layer").animate({
                                bottom: "0"
                            }, 'fast');
                        }, function() {
                            $(this).find(".rolover-layer").animate({
                                bottom: "-140"
                            }, 'fast');
                        });
                    }
                    $.each(productListData.productListing.products, function(argument, value) {
						$.each(value.source.variants, function(index, value)
						{
							var nullVariants = value.name;
							if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
							{
								$(".notvalue-"+nullVariants).hide();
							}
							else{}
						})	
					})

                    availableProductCount = parseInt(productListData.productListing.total - skip);
                    console.log("avialable getProductData count with skip 1== " + availableProductCount);
                    if($('.product-outer').size() > 0){
                        $('#notfound').css('display','none');
                    }
                    else{
                        $('#notfound').css('display','block');
                    }
					
                    loadingMoreData = (availableProductCount < limit) ? false : true;
                }

            if (productListData.listingType.toLowerCase() === 'event') {
            	productListData.golbalEvtName = goabalEventName;
				$("#productListing").html(self.templates.catelougelist(productListData));
					setTimeout(function(){
						$("img.lazy").lazyload({
							effect : "fadeIn",
							 threshold : 400,
							failure_limit : 0
						});
					},1000);
                    if ($('.rolover-layer').length > 0) {
                        $('.product-outer .prod-img').hover(function() {
                            $(this).find(".rolover-layer").animate({
                                bottom: "0"
                            }, 'fast');
                        }, function() {
                            $(this).find(".rolover-layer").animate({
                                bottom: "-140"
                            }, 'fast');
                        });
                    }
                    $.each(productListData.productListing.products, function(argument, value) {
						$.each(value.source.variants, function(index, value)
						{
							var nullVariants = value.name;
							if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
							{
								$(".notvalue-"+nullVariants).hide();
							}
							else{}
						})	
					});
					if(attrCriterias.length){
						var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
						if(filterKey === "Size"){
							var temp = '.product-sizing'+" ."+filterValue+".sold";
							var productList = $('.product');
							$.each(productList , function(index ,data){
							  var test = $(data).find(temp);
							  if(test.length){
							  $(data).remove();
							  }
							});
						}
					}
                    availableProductCount = parseInt(productListData.productListing.total - skip);
                    console.log("avialable getProductData count with skip 2 --= " + availableProductCount);
                    if($('.product-outer').size() > 0){
                        $('#notfound').css('display','none');
                    }
                    else{
                        $('#notfound').css('display','block');
                    }
                    loadingMoreData = (availableProductCount < limit) ? false : true;
                }  
               /* loadingMoreData = (availableProductCount < limit) ? false : true;
            	$(".prod-area-right").show();*/
                   
        },  
                   
        toggleRushHour: function(e) {

            e.preventDefault();
            $(e.currentTarget).find('span').toggleClass("active")
        },
        /* Event Products Related Methods End Here */
		render2: function (filtersData){
    	  var self = this,   	
            filteredProductList;
    	 
    	  if (this.model2.clear().set(filtersData)) {
    		  this.model2.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	
            	    var data = model.toJSON(),
            	    	availableProductCount = 0;
                	 
            	    if (data.listingType === 'catalog') {
                         /*  filtersData.filters = data.productListing.filters;
                          $("#filters").html(self.templates.newfilters(filtersData));*/
                          	
                                $("#productListing").html(self.templates.catelougelist(data));
								setTimeout(function(){
									$("img.lazy").lazyload({
										effect : "fadeIn",
										 threshold : 400,
										failure_limit : 0
									});
								},1000);
                                  
								/* var filterList = $('.choose-option li .checkbox-custom');	
								 $.each(filterList, function( i, elem ) {
								  $(elem).find();		
								 });
								 $('filterList:contains('+ clickValue+')').filter(function() {
								  return $(this).text() == "findthis";
								}).addClass('active');*/

                                if ($('.rolover-layer').length > 0) {
                                    $('.product-outer .prod-img').hover(function() {
                                        $(this).find(".rolover-layer").animate({
                                            bottom: "0"
                                        }, 'fast');
                                    }, function() {
                                        $(this).find(".rolover-layer").animate({
                                            bottom: "-140"
                                        }, 'fast');
                                    });
                                }
                                availableProductCount = data.productListing.total;
                                console.log("avialable filterdata count with skip " + availableProductCount);
								
                                if($('.product-outer').size() > 0){
                                    $('#notfound').css('display','none');
                                }
                                else{
                                    $('#notfound').css('display','block');
                                }
								
                                loadingMoreData = (availableProductCount < limit) ? false : true;
                        } 
            	    
					if (data.listingType === 'event') {
						data.golbalEvtName = goabalEventName;
                        data.currTime = timeVer;
                       /* filtersData.filters = data.productListing.filters;
                          $("#filters").html(self.templates.newfilters(filtersData));*/
						$("#productListing").html(self.templates.catelougelist(data));
							$('.product-outer.product .prod-detail .event-name').each(function(){
							$(this).html(goabalEventName);
						});
						
						/*---event name ends here----*/
						setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn",
								 threshold : 400,
								failure_limit : 0
							});
						},1000);
						$.each(data.productListing.products, function(argument, value) {
							$.each(value.source.variants, function(index, value)
							{
								var nullVariants = value.name;
								if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
								{
									$(".notvalue-"+nullVariants).hide();
								}
								else{}
							})	
						})
						if(attrCriterias.length){
							var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
								
							if(filterKey === "Size"){
								var temp = '.product-sizing'+" ."+filterValue+".sold";
								var productList = $('.product');
								$.each(productList , function(index ,data){
								  var test = $(data).find(temp);
								  if(test.length){
								  $(data).remove();
								  }
								});
							}
						}
						
						availableProductCount = data.productListing.total;
						console.log("avialable filterdata count with skip  2==" + availableProductCount);
						if($('.product-outer').size() > 0){
							$('#notfound').css('display','none');
						}
						else{
							$('#notfound').css('display','block');
						}
					}
					
					if($('.rolover-layer').length > 0) {
						$('.product-outer .prod-img').hover(function() {
							   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
						},function(){
							   $(this).find(".rolover-layer").animate({bottom: "-140"}, 'fast');
						});
					}
					
					loadingMoreData = (availableProductCount < limit) ? false : true;
					//self.renderSoldoutEvents();
                  }
              });							
		  }
      },
	  
	  sessionFilter: function (filtersData){
    	  var self = this;    	
    	 var filteredProductList;
    	  
    	  if (this.model2.clear().set(filtersData)) {
    		  this.model2.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	
            	    var data = model.toJSON(),
            	    	availableProductCount = 0;                	 
                     
            	    if (data.listingType === 'catalog') {

            	    	//console.log("filtersData " +filtersData);

						$("#productListing").html(self.templates.catelougelist(data));
						
						setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn",
								 threshold : 400,
								failure_limit : 0
							});		
						},1000);
						$.each(data.productListing.products, function(argument, value) {
							$.each(value.source.variants, function(index, value)
							{
								var nullVariants = value.name;
								if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
								{
									$(".notvalue-"+nullVariants).hide();
								}
								else{}
							})	
						})
						$(window).scroll(function() {

							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 100) - $(window).height())) {

								if (loadingMoreData) {

									$(".product-loader").hide();
									loadingMoreData = false;

									self.infiniteScroll(data);
								}
							}
						});
						
						availableProductCount = data.productListing.total;
						console.log("avialable sessionfilter count with skip " + availableProductCount);
						if($('.product-outer').size() > 0){
							$('#notfound').css('display','none');
						}
						else{
							$('#notfound').css('display','block');
						}
					}
            	    
					 if (data.listingType === 'event') {
						data.golbalEvtName = goabalEventName;
                        data.currTime = timeVer;

                        $("#productListing").html(self.templates.eventproductlist(data));
                        
						/*--event-name in filters implementation--*/
						//console.log("event-name ----"+goabalEventName);
						$('.product-outer.product .prod-detail .event-name').each(function(){
							$(this).html(goabalEventName);
						});
						
						/*---event name ends here----*/
						setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn",
								 threshold : 400,
								failure_limit : 0
							});
									
						},1000);
						$.each(data.productListing.products, function(argument, value) {
							$.each(value.source.variants, function(index, value)
							{
								var nullVariants = value.name;
								if(nullVariants.toLowerCase() === '' ||  nullVariants.toLowerCase() =='undefined'  || nullVariants.toLowerCase() ==null )
								{
									$(".notvalue-"+nullVariants).hide();
								}
								else{}
							})	
						})
						$(window).scroll(function() {
						
							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 100) - $(window).height())) {

								if (loadingMoreData) {

									$(".product-loader").hide();
									loadingMoreData = false;

									self.infiniteScroll(data);
								}
							}
						});
						$(".product-loader").show();
						
						if(attrCriterias.length){
							var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
							//console.log("filterKey----> "+filterKey+" filterValue-------> "+filterValue);
							
							if(filterKey === "Size"){
								var temp = '.product-sizing'+" ."+filterValue+".sold";
								//console.log(temp);
								var productList = $('.product');
								//console.log(productList);
								$.each(productList , function(index ,data){
								      console.log($(data).find(temp));
								  var test = $(data).find(temp);
								  //console.log("test "+test.length);
								  if(test.length){
								  $(data).remove();
								  }
								});
							}
						}
						
						availableProductCount = data.productListing.total;
						console.log("avialable filterdata count with skip  2--=" + availableProductCount);
						if($('.product-outer').size() > 0){
							$('#notfound').css('display','none');
						}
						else{
							$('#notfound').css('display','block');
						}
					}
					
					if($('.rolover-layer').length > 0) {
						$('.product-outer .prod-img').hover(function() {
							   $(this).find(".rolover-layer").animate({bottom: "0"}, 'fast');
						},function(){
							   $(this).find(".rolover-layer").animate({bottom: "-140"}, 'fast');
						});
					}
					
					loadingMoreData = (availableProductCount < limit) ? false : true;
					
					//self.renderSoldoutEvents();					
					
					
                  }
              });							
		  }
      }
    });
})();