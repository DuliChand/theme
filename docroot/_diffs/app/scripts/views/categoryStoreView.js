/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    var attrCriterias = [],
        nonAttrCriterias = [],
        loadingMoreData = false,
        priceMinValue = 0,
        priceMaxValue = 0,
        currSKUQnty, selectedSKU, selectedInventoryId, skuPrefix, skuSuffix, prodImageRepo = [],
        imageServerBaseURL = "http://static.fashionandyou.com/",
        limit = 99,
        skip = 0,
        productlistevt;

    Webshop.Views.CategoryStoreView = Backbone.View.extend({
        
        templates: {
        	storefilter: JST['app/scripts/templates/storefilter.hbs'],
        	storeeventproductlist: JST['app/scripts/templates/storeeventproductlist.hbs'],
            product: JST['app/scripts/templates/product.hbs']
        },

        el: '#backbone-portlet-category-store',

        events: {
            /* Event Filters Related Events Start Here */
			"change #sortSelect" : "filterProductList",
			'change #sortOrderSelect' : 'sortProducts',
            /* Event Filters Related Events End Here */

            /* Event Products Related Events Start Here */
            'click #quickViewProduct': 'productQuickView',
            'click .social-share-link': 'productSocialShareHandler',
            'click .rush-hour': 'toggleRushHour'
            /* Event Products Related Events End Here */
        },

        initialize: function() {

            _.bindAll(this, 'render');
            this.liveProducts = new Webshop.Models.CategoryStore();
			this.livecategorystore = new Webshop.Models.liveCategoryStore();
        },

        render: function(data) {
			var catData = data;
            var self = this,json_data = "";
			
            var currentUrldata = window.location.href,
			previousUrldata = $.cookie('categoryvisted');
			
			self.renderFilters(catData);
			//filter restration -----
			if(currentUrldata == previousUrldata){
				if(sessionStorage.getItem("FILTER_DATA") != null ){
					//console.log("inside if block filters----");
					var data = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					 $.each(data.criterias,function(index ,critdata){
						if(critdata.key == 'categoryLevel1'){
							 $.each(catData.tagWrapper.filters,function(index,data){
								//console.log(data.key+"---"+critdata.values);
								if(data.filterLabel == 'Sub Category' && data.filterName == critdata.values){
									$('.subcategory').css('display','block');
									$('.subcategory .select-sort').html('<select id="sortSelect" class="select choose-option" data-filter-name="categoryLevel2" data-filter-type="'+data.filterType+'"></select>');	
									
									if(data.filterOptions.optionId){
										$('.subcategory select').append('<option id="'+data.filterOptions.optionId+'" value="'+data.filterOptions.optionId+'">'+data.filterOptions.optionLabel+'</option>');
									  
									  }
									  else{
									  $.each(data.filterOptions,function(index,data){
										
										$('.subcategory select').append('<option id="'+data.optionId+'" value="'+data.optionId+'">'+data.optionLabel+'</option>');
										
									  });
									  } 		
									

								}
							 });
						}	 
					});	 
					if(data.criterias.length){
					  $.each(data.criterias,function(index ,data){
						if(data.key == 'categoryLevel1'){
						  $('.select.choose-option.Category').val(data.values)
						}
						else if(data.key == 'categoryLevel2'){
						  $('.subcategory select').css('display','block')
						  $('.subcategory select').val(data.values)
						}
						else if(data.key == 'Brand'){
						  $('.select.choose-option.Brand').val(data.values)
						}
					  });

					}
					var sessionfilterData = jQuery.parseJSON(sessionStorage.getItem("FILTER_DATA"));
					self.sessionFilter(sessionfilterData)
				}
				
				else {
				 self.renderProducts(catData.tagWrapper);
				 
				}
			}
			else{
				
			
				self.renderProducts(catData.tagWrapper);
				sessionStorage.removeItem("FILTER_DATA");
				$.cookie('categoryvisted', "", {
							expires: 1,
							path: '/'
				});
			
			}
							
			
			
			

                       
        },

        renderFilters: function(data) {
            var self = this;
            	$("#filters").html(self.templates.storefilter(data.tagWrapper));
				var selectList = $('.filterOption .filterDatalist');
					selectList.sort(function(a,b){
						a = a.id;
						b = b.id;
					 
						return a-b;
					});
				$('.filterOption').html(selectList);
				
				setTimeout(function(){
					$("img.lazy").lazyload({
						effect : "fadeIn"
					});
				},1000);
				$('.Category').on('change',function(){
					$(this).attr('data-filter-name', "categoryLevel1");
				  $('.subcategory').css('display','block');
				  
				  $('.select-sort.subcategory select').removeAttr('data-filter-name');
				  $('.select-sort.subcategory select').removeAttr('data-filter-type');
				  $('.subcategory select').empty();
				   var deafultcheck = $('select.Category option:selected').attr('class');
					  if(deafultcheck == 'defaultCat'){
						$('.subcategory').css('display','none');
						$('.select-sort.subcategory').css('display','none');
					  }
				  var categoryname = $('select.Category option:selected').attr('id');
				 
				  $.each(data.tagWrapper.filters,function(index,data){

					if(data.filterLabel == 'Sub Category' && data.filterName == categoryname){
						 $('.subcategory .select-sort').html('<select id="sortSelect" class="select choose-option" data-filter-name="categoryLevel2" data-filter-type="'+data.filterType+'"></select>');						 
						 /*$('.select-sort.subcategory select').attr('data-filter-name', ""+data.filterName+"");
						 $('.select-sort.subcategory select').attr('data-filter-type', ""+data.filterType+"");*/
					  if(data.filterOptions.optionId){
						$('.subcategory select').append('<option id="'+data.filterOptions.optionId+'" value="'+data.filterOptions.optionId+'">'+data.filterOptions.optionLabel+'</option>');
					  
					  }
					  else{
					  $.each(data.filterOptions,function(index,data){
						
						$('.subcategory select').append('<option id="'+data.optionId+'" value="'+data.optionId+'">'+data.optionLabel+'</option>');
						
					  });
					  } 
					  
					
					}
					  
				  

				  });
				});  
				
        },

        filterProductList: function() {

            var self = this;
            skip = 0;
            var filterList = $('.choose-option'),
        	filtersData = {},
            groupCategory = $("#backbone-portlet-category-store").data("groupcategory"),
            tag = $("#backbone-portlet-category-store").data("tag"),
        	categoryIdDatatest = $('#catchangeval').val();
        	attrCriterias = [];
    		nonAttrCriterias = [];
        	        	
        	$.each(filterList, function( i, elem ) {
        		
        		var currFilter = $(elem),
        			currFilterName = currFilter.data("filter-name"),
        			currFilterType = currFilter.data("filter-type"),
        			currFilterOptionList = currFilter.val();
					//console.log('filter name--'+currFilterName);
					if(currFilterName == 'Category'){
					//	console.log('inside if filter--'+currFilterName);
						currFilterName == 'categoryLevel1';
					}
        		
        		if((currFilterName != undefined) && (currFilterOptionList != 'select')) {
        			if(currFilterName === "Price") {
            			nonAttrCriterias.push({"key": currFilterName, "values" : [priceMinValue.toString(), priceMaxValue.toString()]});
            		} else {
            			if(currFilterType === "Attribute") {
                	    	attrCriterias.push({"key": currFilterName, "values" : currFilterOptionList});
                	    } else {
                	    	nonAttrCriterias.push({"key": currFilterName, "values" : currFilterOptionList});
                	    }
            		}
        		}
        	});
        	
        	
        	$('#sortSelect.Category .defaultCat').attr('id',tag);
        	
   			$(".product-loader").show();
        	
        	setTimeout(function(){ 
				filtersData = {
						  "limit": limit,
				          "skip": skip,
						  "attributesCriterias" : attrCriterias,	
						  "criterias" : nonAttrCriterias
	    		};
    		//console.log("filtersdata-------------->"+JSON.stringify(filtersData));
        	
        	var catdataid = $('#sortSelect.Category option:selected').attr('id');
			sessionStorage.setItem("FILTER_DATA",  JSON.stringify(filtersData));
			self.render2(filtersData);
        	 },1000);

        },
      
        renderProducts: function(productData) {

            var self = this,
                data = {
                    "limit": limit,
                    "skip": skip,
                    "attributeList": attributeList,
                    "priceFilters": priceFilters
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
			
			setTimeout(function(){
				$("img.lazy").lazyload({
					effect : "fadeIn"
				});
			},1000);
			
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
                    "eventId":$('#backbone-portlet-product-listing').data('id'),
                    "limit": limit,
                    "skip": skip,
                    "attributeList": (attributeList != undefined) ? attributeList : [],
                    "attributeList": (attributeList != undefined) ? attributeList : []

                };
           // console.log('from view'+JSON.stringify(data))    
            self.pagining(data);    

            //self.getProductData(data , productListData);
        },

        pagining: function(data) {

            var self = this;
            var skip = {"skipdata" : skipData};
            //console.log(skipData);
            if (self.livecategorystore.clear().set(data)) {
                self.livecategorystore.fetch({
                    error: function(response) {
                      //  console.log("error");
                    },
                    success: function(model, response) {

                        var data = response;  
                        var test; 
                        self.getProductData(test , data.tagWrapper);
                       
                    }
                });
            }
        },

        getProductData: function(data , productListData) {

            var self = this;
            var  availableProductCount;
            //console.log(productListData);

            $(".product-loader").hide();
                        
            $("#productListing").append(self.templates.storeeventproductlist(productListData));
				setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn"
							});
				},1000);
               // console.log("no products-----"+productListData.vendorProductLiveWrapper.length) ;       
                availableProductCount = productListData.vendorProductLiveWrapper.length ;
				
                if($('.product-outer').size() > 0){
                    $('#notfound').css('display','none');
                 }
                else{
                    $('#notfound').css('display','block');
                }

                loadingMoreData = (availableProductCount < limit) ? false : true;

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

                $('#sortOrderSelect').trigger('change');

                $(".prod-area-right").show();
                
        },
        toggleRushHour: function(e) {

            e.preventDefault();
            $(e.currentTarget).find('span').toggleClass("active")
        },
        /* Event Products Related Methods End Here */
		render2: function (filtersData){
    	  var self = this;
          //console.log("filtersData------------->"+JSON.stringify(filtersData));
    	  
    	  if (this.liveProducts.clear().set(filtersData)) {
    		  this.liveProducts.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	 $(".product-loader").hide();
                       // console.log("filter data response------"+self.templates.storeeventproductlist(response.tagWrapper));
                        $("#productListing").html(self.templates.storeeventproductlist(response.tagWrapper));
                        setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn"
							});
						},1000);
                        var availableProductCount = response.tagWrapper.vendorProductLiveWrapper.length;
						
                        if($('.product-outer').size() > 0){
                            $('#notfound').css('display','none');
                        }
                        else{
                            $('#notfound').css('display','block');
                        }

                        loadingMoreData = (availableProductCount < limit) ? false : true;

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

                        $('#sortOrderSelect').trigger('change');

                        $(".prod-area-right").show();
					
                  }
              });							
		  }
      },
	  
	  sessionFilter: function (filtersData){
    	  var self = this;
          //console.log("filtersData------------->"+JSON.stringify(filtersData));
    	  
    	  if (this.liveProducts.clear().set(filtersData)) {
    		  this.liveProducts.fetch({
      			error: function (response) {
                      /*console.log(response);*/
                  },
                  success: function (model, response) {
                  	 $(".product-loader").hide();
                       // console.log("filter data response------"+self.templates.storeeventproductlist(response.tagWrapper));
                        $("#productListing").html(self.templates.storeeventproductlist(response.tagWrapper));
                        setTimeout(function(){
							$("img.lazy").lazyload({
								effect : "fadeIn"
							});
						},1000);
                        var availableProductCount = response.tagWrapper.vendorProductLiveWrapper.length;
						$(window).scroll(function() {

							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {

								if (loadingMoreData) {

									$(".product-loader").show();
									loadingMoreData = false;

									self.infiniteScroll(productListData);
								}
							}
						});
						
                        if($('.product-outer').size() > 0){
                            $('#notfound').css('display','none');
                        }
                        else{
                            $('#notfound').css('display','block');
                        }

                        loadingMoreData = (availableProductCount < limit) ? false : true;

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

                        $('#sortOrderSelect').trigger('change');

                        $(".prod-area-right").show();
					
                  }
              });							
		  }
      }
    });
})();