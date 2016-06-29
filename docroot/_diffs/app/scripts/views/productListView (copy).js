/*global Webshop, Backbone, JST*/
var timeVer;
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    var attrCriterias = [],
		attributeList =[],
        nonAttrCriterias = [],
        loadingMoreData = false,
        priceMinValue = 0,
        priceMaxValue = 0,
        currSKUQnty, selectedSKU, selectedInventoryId, skuPrefix, skuSuffix, prodImageRepo = [],
        imageServerBaseURL = "http://static.fashionandyou.com/",
        limit = 6,
        skip = 0,
        productlistevt,
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
			catelougefilter: JST['app/scripts/templates/catelougefilter.hbs']
        },
        el: '#backbone-portlet-product-listing',
        events: {

            /* Event Info Related Events Start Here */
            'click .event-info-details .add-favorites': 'addToFavouritesEvent',
            'click .event-info-details .remove-favorites': 'removeFromFavouritesEvent',
            'click .event-info-details .social-share-link': 'eventSocialShareHandler',
            'click #eventName': 'toggleEventInfoPannel',
            'click #eventInfoPanel .closebutton': 'toggleEventInfoPannel',
            /* Event Info Related Events End Here */

            /* Event Filters Related Events Start Here */
			"change #sortSelect" : "filterProductList",
			'change #sortOrderSelect' : 'sortProducts',
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
            this.addEventToFavourites = new Webshop.Models.AddEventToFavourites();
            this.removeEventFromFavourites = new Webshop.Models.RemoveEventFromFavourites();
            this.eventFavouriteStatus = new Webshop.Models.EventFavouriteStatus();
            this.browseSimilarEvents = new Webshop.Models.BrowseSimilarEvents();
			this.model2  = new Webshop.Models.Filteredproducts();

        },
        render: function(data) {

            var self = this;
            
            productlistevt = data;
			/*if(data.event){
				goabalEventName = data.event.eventName;
			}*/
			
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
					if(data.productfilters.criterias.length){
						nonAttrCriterias = data.productfilters.criterias ;
					  $.each(data.productfilters.criterias,function(index ,data){
						if(data.key == 'Category'){
						  $('.select.choose-option.Category').val(data.values)
						}
						else if(data.key == 'Brand'){
						  $('.select.choose-option.Brand').val(data.values)
						}
					  });
					}
					if(data.productfilters.attributesCriterias.length){
						 attrCriterias = data.productfilters.attributesCriterias;
					  $.each(data.productfilters.attributesCriterias,function(index ,data){
						if(data.key == 'Size'){
						  $('.select.choose-option.Size').val(data.values)
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
					if(filterSessData.productfilters.eventId != data.event.eventId){
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
					if(data.productfilters.criterias.length){
					  nonAttrCriterias = data.productfilters.criterias ;
					  
					  $.each(data.productfilters.criterias,function(index ,data){
						if(data.key == 'Category'){
						  $('.select.choose-option.Category').val(data.values)
						}
						else if(data.key == 'Brand'){
						  $('.select.choose-option.Brand').val(data.values)
						}
					  });
					}
					if(data.productfilters.attributesCriterias.length){
					  attrCriterias = data.productfilters.attributesCriterias;
					
					  $.each(data.productfilters.attributesCriterias,function(index ,data){
						if(data.key == 'Size'){
						  $('.select.choose-option.Size').val(data.values)
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
             
			self.updateFavouriteLinkEvent();
                
        
        },
		renderSoldoutEvents: function(){
			//console.log("Looading data----"+loadingMoreData);
			var self = this,
			scrolldone = true;
			if(loadingMoreData){
				//console.log("more data is available----");
			}
			else{
				if(soldOutArry.length)
				{	
					
		
					$("#productListing").append(self.templates.soldoutproduct(JSON.parse(JSON.stringify({"soldout":soldOutArry,"globalEvent":goabalEventName}))));
					
					/*--event-name in filters implementation--*/
						//console.log("event-name ----"+goabalEventName);
						$('.product-outer.product .prod-detail .event-name').each(function(){
							$(this).html(goabalEventName);
						});
											
					/*---event name ends here----*/

					/*$(window).scroll(function(e) {
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
					
					$(scrollbyproducts).unbind('scroll').scroll(function(){});*/
							
					
					
					
					
				}
			}	
		},

        /* Event Info Related Methods Start Here */
        renderEventInfo: function(data , eventFavData) {

            var self = this;

            //data.currTime = timeVer;   //this code for currTime check
            
            //console.log("eventInfo log");
            //console.log(JSON.stringify(data));

            if (data.categoryWrapper) {
                $("#eventInfo").html(self.templates.categoryinfo(data.categoryWrapper.category));

                //$("#eventInfo").html(self.templates.topcatinfo(data));

                
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
        addToFavouritesEvent: function(e) {
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
							/*console.log(response);*/
						},
						success: function(model, response) {

							if (response.eventCassandraWrapper.responseCode === "SUCCESS") {
								//console.log(productlistevt);
								self.updateFavouriteLinkEvent();
							} else {
								if (response.eventCassandraWrapper.errorMessage != undefined) {
									/*console.log(response.eventCassandraWrapper.errorMessage);*/
								} else {
									/*console.log("Add to Favourite Event Service Failure.");*/
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
        },
        removeFromFavouritesEvent: function(e) {

            e.preventDefault();

            var self = this,
                createdTime = $(".remove-favorites").data("created-time"),
                eventData = {
                    "createdTime": createdTime
                };

            if (self.removeFromFavourites.clear().set(eventData)) {
                self.removeFromFavourites.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        /*console.log(response);*/
                        self.render();
                    }
                });
            }
        },
        updateFavouriteLinkEvent: function() {

            var self = this,
                eventId = $("#backbone-portlet-product-listing").attr("data-id"),
                eventData = {
                    "eventId": eventId
                };

            if (self.eventFavouriteStatus.clear().set(eventData)) {
                self.eventFavouriteStatus.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        /*console.log(response);*/

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
   
        },

        eventSocialShareHandler: function(e) {

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
        },
        toggleEventInfoPannel: function(e) {
            e.preventDefault();
            $("#eventInfoPanel").toggle();
        },
        /* Event Info Related Methods End Here */

        /* Event Filters Related Methods Start Here */
        renderFilters: function(data) {
            var self = this,
                filtersData = {};
				
                //filtersData.currTime = timeVer; 
            if (data.listingType.toLowerCase() === 'catalog') {
                //filtersData.filters = data.categoryWrapper.category.productFilters.filters;
                      filtersData.filters = data.productListing.filters;
					  console.log('catelogue filters---'+JSON.stringify(filtersData));
                      $("#filters").html(self.templates.catelougefilter(filtersData));
/*
                      	CatFilsterPopulate: function() {
						    var $this = $(this);
							
						    $('p a').each(function () {
						        $this.append('<option value="">' + $(this).text() + '</option>');
						    });
						  
						}

                      	$('#catSelect').CatFilsterPopulate();
*/

					  var selectList = $('select.choose-option.Size  option');

						selectList.sort(function(a,b){
							a = a.id;
							b = b.id;
						 
							return a-b;
						});

					  $('select.choose-option.Size').html(selectList);
					  $('select.choose-option.Size').val('select');  
            }

            if (data.event) {
               // filtersData.filters = data.event.productFilters.filters;
                if(data.event.status === 'EXPIRED'){
                      
                  }else{
                      filtersData.filters = data.event.productFilters.filters;
                      $("#filters").html(self.templates.filters(filtersData));
					  var selectList = $('select.choose-option.Size  option');

						selectList.sort(function(a,b){
							a = a.id;
							b = b.id;
						 
							return a-b;
						});

						$('select.choose-option.Size').html(selectList);
						$('select.choose-option.Size').val('select');
                     // $(".filter-with-categories").html(Handlebars.templates.filterdropdown(filtersData));
                  }
            }

            //$("#filters").html(self.templates.filters(filtersData));

           

            /*console.log("parseInt(priceMaxValue - priceMinValue): " + parseInt(priceMaxValue - priceMinValue));*/

            

        },

        filterProductList: function() {
			duplicateProduct = [];repeatedProducts= [];
            var self = this;
            skip = 0;
               var filterList = $('.choose-option'),
        		filtersData = {},
        		listingId = $("#backbone-portlet-product-listing").attr("data-id"),
				listingType = $("#backbone-portlet-product-listing").attr("data-type");
				var categoryIdDatatest = $('#catchangeval').val();
			
        		
        	
        	attributeList = [];
			var tempFilterArry = [],
			tempFilterObj = {};
    		nonAttrCriterias = [];
        	
        	listingType = listingType.toLowerCase();
        	        	
        	$.each(filterList, function( i, elem ) {
        		
        		var currFilter = $(elem),
        			currFilterName = currFilter.data("filter-name"),
        			currFilterType = currFilter.data("filter-type"),
        			currFilterOptionList = currFilter.val();

        		
        		if((currFilterName != undefined) && (currFilterOptionList != 'select')) {
					tempFilterArry = [] ;
                	tempFilterArry.push(currFilterOptionList.toString());
					tempFilterObj[currFilterName] = tempFilterArry ;
        		}
        	});
			
			attributeList.push(tempFilterObj);
			
        	
        	
        	//$('#sortSelect.Category .defaultCat').attr('id',listingId);
        	
        	setTimeout(function(){ 
        
       			
       			
        	if(listingType === "event") {
				
				filtersData = {	    			
						"eventId" : listingId,
						"from": skip,
						"limit": limit,
						"sortBy": "asc" ,
						"attributeList": attributeList 	    		
	    		};
			}
        	
    			
        	
        	//var catdataid = $('#sortSelect.Category option:selected').attr('id');
        
			if(listingType === "category") {
				
				filtersData = {
					"catId" : "134",
					"from": skip,
					"limit": limit,
					"sortBy": "asc" ,
					"attributeList": attributeList    			
	    		};
			}
			
			//sessionStorage.setItem("FILTER_DATA",  JSON.stringify(filtersData));
			soldOutArry = [];
			self.render2(filtersData);
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

        clearAllFilters: function(event) {

            event.preventDefault();
            /*event.stopPropagation();*/

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
        /* Event Filters Related Methods End Here */

        /* Event Products Related Methods Start Here */
        renderProducts: function(productData) {

            var self = this,
                data = {
                    "limit": limit,
                    "from": skip,
                    "attrCriterias": attrCriterias || [],
                    "nonAttrCriterias": nonAttrCriterias || []
                },
                productListData = productData;

            self.getProductData(data , productListData);

            $(window).scroll(function() {

                if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {

                    if (loadingMoreData) {

                        $(".product-loader").show();
                        loadingMoreData = false;

                        self.infiniteScroll(productListData);
                    }
                }
            });
        },
        sortProducts: function(event) {
			var self = this;
            event.preventDefault();

            var sortType = $(event.currentTarget).val(),
                list = $('.products .product');

            if (sortType == 'LOW_TO_HIGH') {
                list.datasort({
                    datatype: 'number',
                    sortAttr: 'data-price'
                });
            } else if (sortType == 'HIGH_TO_LOW') {
                list.datasort({
                    datatype: 'number',
                    sortAttr: 'data-price',
                    reverse: true
                });
            } else {
                list.datasort({
                    datatype: 'number',
                    sortAttr: 'data-defaultOrder'
                });
            }
			
			$('.soldout').filter(function(){
				$(this).parents('.product-outer').remove();
			});
			
			self.renderSoldoutEvents();	
			
			$("img.lazy").lazyload({
				effect : "fadeIn"
			});
			
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
            var vendorProductId = $(event.currentTarget).closest(".product").attr("id"),
                eventId = $(event.currentTarget).closest(".product").data("event-id"),
                data = {
                    "vendorProductId": vendorProductId,
                    "eventId": eventId
                };

            this.productQuickView = new Webshop.Views.ProductQuickView();
            this.productQuickView.renderProductQuickView(data);

        },
        productSocialShareHandler: function(e) {

            e.preventDefault();

            /*console.log("clicked");
                            console.log(e);*/

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

            var self = this,
                data = {
                    "eventId":$('#backbone-portlet-product-listing').attr('data-id'),
                    "limit": limit,
                    "from": skip,
                    "attrCriterias": (attrCriterias != undefined) ? attrCriterias : [],
                    "nonAttrCriterias": (nonAttrCriterias != undefined) ? nonAttrCriterias : []

                };
            //console.log('from view'+JSON.stringify(data))    
            self.pagining(data);    

            //self.getProductData(data , productListData);
        },
        pagining: function(data) {

            var self = this;
            var skip = {"skipdata" : skipData};
            //console.log(skipData);
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
						else{
							self.getProductData(test , data);
						}
                       
                    }
                });
            }
        },
		
		pagingCategoryView: function(data){
			var self = this;
			var  availableProductCount = 0;
			
           // data.categoryWrapper.category.currTime = timeVer;
           // console.log(JSON.stringify(data));
           	$(".product-loader").hide();
			
			$("#productListing").append(self.templates.catelougelist(data));
			//$("#productListing").append(self.templates.categoryproductlist(data.categoryWrapper.category));
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

			availableProductCount = data.productListing.products.length;
			
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


            /*if (self.liveProducts.clear().set(data)) {
                self.liveProducts.fetch({
                    error: function(response) {
                        console.log(response);
                        $(".product-loader").hide();
                    },
                    success: function(model, response) {*/

                        //var data = model.toJSON(),
                          var  availableProductCount = 0;
                          

                        $(".product-loader").hide();
						
                        if (productListData.listingType.toLowerCase() === 'catalog') {
                           
                                //productListData.categoryWrapper.category.currTime =  timeVer;
                                 //console.log("product data");
                                //console.log(JSON.stringify(productListData));
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

                                availableProductCount = productListData.productListing.products.length;
								
                                if($('.product-outer').size() > 0){
                                    $('#notfound').css('display','none');
                                }
                                else{
                                    $('#notfound').css('display','block');
                                }
								
                                loadingMoreData = (availableProductCount < limit) ? false : true;
                            

                        }

                        if (productListData.listingType.toLowerCase() === 'event') {
                            if (productListData.event.status === 'EXPIRED') {

                                /*console.log("event status : "+data.event.status);*/
                                $("#backbone-portlet-event-detail").html(self.templates.eventinfo(productListData));
								
                                self.browseSimilarEvents.fetch({
                                    error: function(response) {
                                        /*console.log(response);*/
                                    },
                                    success: function(model, response) {
                                        /*console.log(response);*/
                                        if (response.eventWrapper.responseCode === "SUCCESS") {
                                            $("#backbone-portlet-product-list").html(self.templates.browsesimilarevents(response));

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
                                        } else {
                                            /*console.log("No similar events available : " + response.eventWrapper.responseCode);*/
                                        }

                                    }
                                });


                            } else {
								//productListData.golbalEvtName = goabalEventName;

                                //productListData.currTime = timeVer;

                                //console.log("event images log");
                               // console.log("list event product list " + JSON.stringify(productListData));

                                $("#productListing").html(self.templates.catelougelist(productListData));
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
                                
                                if(attrCriterias.length){
        							var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
        							//console.log("filterKey----> "+filterKey+" filterValue-------> "+filterValue);
        							
        							if(filterKey === "Size"){
        								var temp = '.product-sizing'+" ."+filterValue+".sold";
        								//console.log(temp);
        								var productList = $('.product');
        								//console.log(productList);
        								$.each(productList , function(index ,data){
        								     // console.log($(data).find(temp));
        								  var test = $(data).find(temp);
        								  //console.log("test "+test.length);
        								  if(test.length){
        								  $(data).remove();
        								  }
        								});
        							}
        						}

                                availableProductCount = productListData.event.noOfProducts;
                                if($('.product-outer').size() > 0){
                                    $('#notfound').css('display','none');
                                }
                                else{
                                    $('#notfound').css('display','block');
                                }
								//console.log("availbale product count -----"+availableProductCount+"--limit"+limit);	
                                loadingMoreData = (availableProductCount < limit) ? false : true;
								

                            }

                        }

                        loadingMoreData = (availableProductCount < limit) ? false : true;
						
						//console.log("Filter loadingMoreData----"+loadingMoreData);
						self.renderSoldoutEvents();

                        $(".prod-area-right").show();
                    //}
                //});
            //}
        },
        toggleRushHour: function(e) {

            e.preventDefault();
            $(e.currentTarget).find('span').toggleClass("active")
        },
        /* Event Products Related Methods End Here */
		render2: function (filtersData){
    	  var self = this;
    	
            var CustomefirstRecord = parseInt($('#FnyFirstRecord').attr('data-firstRecord'));
            var TodayDate = new Date(CustomefirstRecord);
            var time = TodayDate.getHours() + ":" + TodayDate.getMinutes();
            if(time == '9:00'){
             timeVer = CustomefirstRecord;
             //console.log("9:00 time" + timeVer);
              }
              else{
            timeVer = $.cookie('customerFirstRecord');
            //console.log("time ver" + timeVer );
            }

    	 var filteredProductList;
    	  
    	  if (this.model2.clear().set(filtersData)) {
    		  this.model2.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	
            	    var data = model.toJSON(),
            	    	availableProductCount = 0;
                	 
            	    if (data.listingType.toLowerCase() === 'catalog') {
                           
                                //productListData.categoryWrapper.category.currTime =  timeVer;
                                 //console.log("product data");
                                //console.log(JSON.stringify(productListData));
                                $("#productListing").html(self.templates.catelougelist(data));
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

                                //availableProductCount = data.productListing.products.length;
								
                                if($('.product-outer').size() > 0){
                                    $('#notfound').css('display','none');
                                }
                                else{
                                    $('#notfound').css('display','block');
                                }
								
                                loadingMoreData = (availableProductCount < limit) ? false : true;
                            

                        } 
            	    
					if(data.event) {
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
						
						if(attrCriterias.length){
							var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
							//console.log("filterKey----> "+filterKey+" filterValue-------> "+filterValue);
							
							if(filterKey === "Size"){
								var temp = '.product-sizing'+" ."+filterValue+".sold";
								//console.log(temp);
								var productList = $('.product');
								//console.log(productList);
								$.each(productList , function(index ,data){
								      //console.log($(data).find(temp));
								  var test = $(data).find(temp);
								  //console.log("test "+test.length);
								  if(test.length){
								  $(data).remove();
								  }
								});
							}
						}
						
						
						availableProductCount = data.event.noOfProducts;
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
					//console.log("Filter loadingMoreData----"+loadingMoreData);
					self.renderSoldoutEvents();
										
					
					
					
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

                	 
                     
            	    if(data.categoryWrapper) {
						$("#productListing").html(self.templates.categoryproductlist(data.categoryWrapper.category));
						setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn",
								 threshold : 400,
								failure_limit : 0
							});		
						},1000);
						$(window).scroll(function() {

							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {

								if (loadingMoreData) {

									$(".product-loader").show();
									loadingMoreData = false;

									self.infiniteScroll(data);
								}
							}
						});
						/*var filterKey = attrCriterias[0].key,filterValue = attrCriterias[0].values.toLowerCase();
						
						if(filterKey === "Size"){
							var temp = '.product-sizing'+" ."+filterValue+".sold";
							console.log(temp);
							var productList = $('.product');
							console.log(productList);
							$.each(productList , function(index ,data){
							      console.log($(data).find(temp));
							  var test = $(data).find(temp);
							  console.log("test "+test.length);
							  if(test.length){
							  $(data).remove();
							  }
							});
						}
						*/
						availableProductCount = data.categoryWrapper.category.noOfProducts;
						if($('.product-outer').size() > 0){
							$('#notfound').css('display','none');
						}
						else{
							$('#notfound').css('display','block');
						}
					}
            	    
					if(data.event) {
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
						$(window).scroll(function() {
						
							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {

								if (loadingMoreData) {

									$(".product-loader").show();
									loadingMoreData = false;

									self.infiniteScroll(data);
								}
							}
						});
						$(".product-loader").hide();
						
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
						
						availableProductCount = data.event.noOfProducts;
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
					//console.log("Filter loadingMoreData----"+loadingMoreData);
					self.renderSoldoutEvents();					
					
					
                  }
              });							
		  }
      }
    });
})();