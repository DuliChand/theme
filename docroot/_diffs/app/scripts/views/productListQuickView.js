/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.ProductListQuickView = Backbone.View.extend({
    	el: '#quickview1'/*'#backbone-portlet-product-list'*/,
                events: {
                    'click .select-choice.color .tiles': 'selectColor',
                    'mouseover .select-choice.type-one .tiles': 'selectOption',
                    'mouseout .select-choice.type-one .tiles': 'selectOption',
                    'click .select-choice.type-one .tiles': 'selectOption',
                    'click #maintab li': 'updateTabContent',
                    'click .thumbnail-image': 'changeImage',
                    'click .size-chart': 'showSizeChart',
                    'click .select-choice .tiles': 'updateSelectedSKU',
                    'click #addToCart' : 'addProductToCart',
                    'click .add-favorites' : 'makeProductFavourite',
                    'click .remove-favorites' : 'removeFavouriteProduct',
                    'click .social-share-link' : 'socialShareHandler',
                    'click .go' : 'checkServicablePincode',
                    'click .button-check' : 'checkServicibility'
                },
                initialize: function () {
                    _.bindAll(this, 'render');
                    this.product = new Product();
                    this.productLiveInventory = new LiveInventory();
                    this.addProduct = new AddProduct();
                    this.productFavouriteStatus = new ProductFavouriteStatus(); 
                    this.addProductToFavourites = new AddProductToFavourites();
                    this.removeProductFromFavourites = new RemoveProductFromFavourites();
                    this.serviceability = new Serviceability();
                },
                render: function () {
                	var vendorProductId = $(".product-popup-info").data("product-id"),
                		eventId = $(".product-popup-info").data("event-id"),
						data = {
							"vendorProductId" : vendorProductId,
							"eventId" : eventId,
						};
                	
                	this.renderProductQuickView(data);
                },
                renderProductQuickView : function (data) {
                	var self = this;
					if (self.product.clear().set(data)) {
						self.product.fetch({
							error : function(response) {
								//console.log("error");
							},
							success : function(model, response) {
	
								var data = model.toJSON(),
	                            	allAttrWithValArr = [],
	                            	currentAttributes = [],
	                            	skuArr = [];
	
	                            currSKUQnty = parseInt(data.vendorProductWrapper.liveinventory.quantity);
	                            currSKUMaxAllowedQnty = parseInt(data.vendorProductWrapper.liveinventory.maxAllowedQty);
	                            selectedSKU = data.vendorProductWrapper.liveinventory.skuId;
	                            selectedInventoryId = data.vendorProductWrapper.liveinventory.eventInventoryId;
	                            selectedErpSku =  data.vendorProductWrapper.liveinventory.erpSku;
                                selectedEventId = data.vendorProductWrapper.liveinventory.eventId;
                                selectedCategoryId = data.vendorProductWrapper.vendorProduct.category.categoryId;
	                            
	                            skuArr = selectedSKU.split("|");
	                            
	                            skuPrefix = skuArr[0] + "|" + skuArr[1] + "|" + skuArr[2] + "|" + skuArr[3];
	                        
	                            if(skuArr.length > 4) {
	                            	
	                            	skuSuffix = skuArr[4];
	                            	allAttrWithValArr = skuSuffix.split("%");
	                            	                                	
	                            	for (var i = 0; i < allAttrWithValArr.length; i++) {
	                                    
	                            		var attrWithValArr = [], attrWithId = [], attrValWithId = [],
	                            			attributeId = "", attributeName = "", attributeValueId = "", attributeValue = "",
	                            			dividerIndexFromLast = null; 
	                                    
	                                    attrWithValArr = allAttrWithValArr[i].split("~"),
	                                    attrWithId = attrWithValArr[0].split("-"),
	                                    attrValWithId = attrWithValArr[1];
	                                    
	                                    dividerIndexFromLast = attrValWithId.lastIndexOf("-");
	                                    
	                                    attributeId = attrWithId[1];
	                                    attributeName = attrWithId[0];
	                                    attributeValueId = attrValWithId.substring((dividerIndexFromLast+1), attrValWithId.length);
	                                    attributeValue = attrValWithId.substring(0, dividerIndexFromLast);
	                                    
	                                    currentAttributes.push({
	                                		"attributeId"		: attributeId,
	                                        "attributeName"		: attributeName,
	                                        "attributeValueId"	: attributeValueId,
	                                        "attributeValue"	: attributeValue 
	                                    });                                        
	                                }
	                            }
	
								prodImageRepo = [];
								
								for ( var j = 0; j < data.vendorProductWrapper.vendorProduct.vendorProductInventories.length; j++) {
	
									prodImageRepo.push({
										"skuId" : data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].skuId,
										"imageList" : []
									});
	
									for ( var k = 0; k < data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].imageView.length; k++) {
										prodImageRepo[j].imageList.push(data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].imageView[k]);
									}
								}
	
								$(self.el).html(Handlebars.templates.productdetail(data));
								
								var eventTimeHolder = $("#productEventTimer"),
	        						eventExpireDateTime = eventTimeHolder.data("expire-datetime");
	        					
	        					eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
	        					    eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
	        					}).on('finish.countdown', function() {
	        						eventTimeHolder.html("EXPIRED");
	        					});
								
								self.updateFavouriteLink();
								
								$.fancybox($(self.el));
	
								updateProductGallery(imageServerBaseURL,prodImageRepo, selectedSKU);
	
								var attrTypeOne = [ "size", "memory", "noofphotos" ];
								var attrTypeTwo = [ "pattern", "material" ];
	
								$(attrTypeOne).each(function(index, value) {
									$("div.select-choice[class$='" + value.toLowerCase() + "']").addClass("type-one");
								});
	
								$(attrTypeTwo).each(function(index, value) {
									$("div.select-choice[class$='" + value.toLowerCase() + "']").addClass("type-two");
								});
	
								if ($(".select-choice.color").length > 0) {
									var colorList = $(".select-choice.color .tiles");
	
									colorList.each(function(index) {
										$(this).css("background-color", $(this).data("attribute-value").toLowerCase());
									});
								}
	
								if ($(".select-choice.type-two").length > 0) {
									$(".select-choice.type-two").each(function(index, value) {
										$(this).find("ul").hide();
										var qntyList = $(this).find(".tiles"), 
											selectBox = "<div class='select-wrapper'><select class='select'>";
	
										qntyList.each(function(index) {
											selectBox += "<option value='" + $(this).data("attribute-value") + "'>"  + $(this).data("attribute-value") + "</option>";
										});
	
										selectBox += "</select></div>";
	
										$(this).append(selectBox);
									});
								}
	
								$(currentAttributes).each(function(index, obj) {
									var selectAttr = $(".select-choice li[data-attribute-value-id$='" + obj.attributeValueId + "']");
									$(".select-choice[data-attribute-id$='" + obj.attributeId + "']").find(selectAttr).addClass("selected");
								});
	
								updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);
	
								if(currentAttributes.length === 1) {
                                	$(".select-choice").eq(0).css("width", "100%");
                                } else {
                                	$(".select-choice").eq(0).css("width", "45%");
                                    $(".select-choice").eq(1).css("width", "45%");
                                }
	
								if ($('#ex1').length > 0) {
									$('#ex1').zoom();
								}
	
								if ($("#product-gallery-thumbnails").length > 10) {
									$('#product-gallery-thumbnails').carouFredSel({
										auto : false,
										prev : '#prev3',
										next : '#next3',
										mousewheel : true,
										direction : "up",
										items : 4,
										scroll : 1,
										swipe : {
											onMouse : true,
											onTouch : true
										}
									});
								}
	
								if ($("#maintab").length > 0) {
									$("#maintab li").first().addClass("selected");
									$(".tab-infoarea[id='" + $("#maintab li.selected a").data("name")  + "']").show();
								}
	
								$(".sharing").data('powertipjq', $(".social-share-powertip"));
								$(".sharing").powerTip({
									placement : 'e',
									smartPlacement : true,
									mouseOnToPopup : true
								});
							}
						});
					}
                },
                updateProductInfo: function () {
                	var eventId = $(".product-popup-info").data("event-id"),
	            		data = {
	            			"skuinventory" : {
	            				"skuId" : selectedSKU,
	                			"eventId" : eventId
	            			}
	            		}; 
                	
                	if (this.productLiveInventory.clear().set(data)) {
                		this.productLiveInventory.fetch({
                			error: function (response) {
                              //  console.log(response);
                            },
                            success: function (model, response) {
                            	var oldPrice = response.liveinventory.currencyCode + " " + response.liveinventory.mrp,
                            		newPrice = response.liveinventory.currencyCode + " " + response.liveinventory.salePriceWithVAT;
                            	
                            	currSKUQnty = response.liveinventory.quantity;
                            	currSKUMaxAllowedQnty = response.liveinventory.maxAllowedQty;                            	
                            	selectedInventoryId = response.liveinventory.eventInventoryId;
                            	selectedErpSku = response.liveinventory.erpSku;
                            	selectedEventId = response.liveinventory.eventId;
                            	
                            	$(".old-pricing").text(oldPrice);
                            	$(".new-pricing").text(newPrice);
                            	
                            	updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);
                            	
                            	updateProductGallery(imageServerBaseURL, prodImageRepo, selectedSKU);
                                                            	
                            }
                        });							
					}
                },
                updateTabContent: function(event){
                	event.preventDefault();
                	$(event.currentTarget).addClass("selected").siblings().removeClass("selected");
                	$(".tab-infoarea[id='" + $(event.currentTarget).find("a").data("name") + "']").show().siblings().hide();
                },
                selectColor: function (e) {
                    e.preventDefault();

                    if ($(".select-choice.color .tiles").length > 0) {
                        $(e.currentTarget).addClass("selected")
                            .siblings().removeClass("selected");
                    }
                },
                selectOption: function (e) {
                    e.preventDefault();

                    if ($(".select-choice.type-one .tiles").length > 0) {
                        if (e.type === "mouseover") {
                            $(".image-rolover").show();
                        } else if (e.type === "mouseout") {
                            $(".image-rolover").hide();
                        } else if (e.type === "click") {
                            $(e.currentTarget).addClass("selected")
                                .siblings().removeClass("selected");
                        }
                    }
                },
                changeImage: function (event) {
                	event.preventDefault();
                    
                    $(".thumbnail-image")
                    	.not($(event.currentTarget))
                        .removeClass("thumbnail-image-selected");
                    
                    $(event.currentTarget).addClass("thumbnail-image-selected");
                    
                    var detailImage = $(event.currentTarget).data("image-detail"),
                        zoomImage = $(event.currentTarget).data("image-original");
                    
                    $(".large-image img#product-gallery-detail").attr("src", detailImage);
                    $(".large-image img.zoomImg").attr("src", zoomImage);
                },
                showSizeChart: function (e) {
                    e.preventDefault();
                },
                updateSelectedSKU: function (event) {
                    event.preventDefault();
                    var attributeList = $(".select-choice"),
                        newSKU = "",
                        tempSKUSuffix = "";
                    $(attributeList).each(function (index, attribute) {

                    	tempSKUSuffix += $(attribute).data("attribute-name");
                    	tempSKUSuffix += "-";
                        tempSKUSuffix += $(attribute).data('attribute-id');                        
                        tempSKUSuffix += "~";
                        tempSKUSuffix += $(attribute).find(".selected").data("attribute-value");
                        tempSKUSuffix += "-";
                        tempSKUSuffix += $(attribute).find(".selected").data("attribute-value-id");
                        
                        if (index != (attributeList.length - 1)) {
                            tempSKUSuffix += "%";
                        }
                    });
                    newSKU = skuPrefix + "|" + tempSKUSuffix;
                    
                    if(selectedSKU != newSKU) {
                    	selectedSKU = newSKU;
                    	
                    	this.updateProductInfo();
                    }
                },
                addProductToCart : function(event){
                	
                	event.preventDefault();
                	
                	var salePrice = $("#newPrice").text(),
                		selectedProductSalePrice = parseFloat(salePrice[1]),
                		MRP = $(".old-pricing").text().split(" "),
                		selectedProductMRP = parseFloat(MRP[1]),
                		selectedProductThumb = encodeURI($("#product-gallery-thumbnails div a img").first().attr("src")),
                		selectedProductQnty = parseInt($(".select-quantity.quantity select").val()),
                		productName = $(".product-detail-info .product-name").text(),
                		/*selectedCurrency =  salePrice[0],*/
                		selectedVendorProductId = $(".product-detail-info").data("product-id"),
                		cartId = $.cookie("CARTID"),
                		customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0;
                	
                	var sizeList = $('.selection-area .size li a'),sizeListArr=[],variants="",productData,sizeSkuArr=[];
        		if(sizeList === undefined || sizeList === ""){
        			//console.log("no sizes available");
        		}else{
        			$.each(sizeList, function( i, elem ){
                		var data = elem.text;
                	    sizeListArr.push(data.toUpperCase());
                	    //console.log(data);
                	});
        		}
        		
        		for(var i= 0;i<sizeListArr.length;i++){
        		       for(var j=0;j<availableSkuList.length;j++){
        		    	   var temp = "~"+sizeListArr[i]+"-";
        		           if(availableSkuList[j].match(temp)){
        		        			var temp = sizeListArr[i]+":"+availableSkuList[j];
        		        			sizeSkuArr.push(temp);
        		        		}
        		       }
        		}

        		variants = sizeSkuArr.join('*');
        		if(variants === undefined || variants === ""){
        			productData = {
	                		"cart" : {
	                			"products" : [{
	            				    "skuId" : selectedSKU,
	            				    "thumbnailUrl" : selectedProductThumb,
	            				    "productName" : productName,
	            				    "quantity" : selectedProductQnty,
	            				    "variants" : "",
	            				    "eventId" : selectedEventId,
	            				    "categoryId" : selectedCategoryId
	                			}]
	                		}	
	    				};
        		}else{
        			productData = {
	                		"cart" : {
	                			"products" : [{
	            				    "skuId" : selectedSKU,
	            				    "thumbnailUrl" : selectedProductThumb,
	            				    "productName" : productName,
	            				    "quantity" : selectedProductQnty,
	            				    "variants" : variants,
	            				    "eventId" : selectedEventId,
	            				    "categoryId" : selectedCategoryId
	                			}]
	                		}	
	    				};
        		};  
                    	
                	if (this.addProduct.clear().set(productData)) {
                		this.addProduct.fetch({
                			error: function (response) {
                				//console.log("product has not been added to cart... :(");
                            },
                            success: function (model, response) {
                            	
                            	if(response.productCassandraWrapper.responseCode === "FAILURE") {									
									
                            		$(".selection-area .error-message").text(response.productCassandraWrapper.errorMessage);
									
								} else {
									
									window.location.assign("/cart");
								}
                            }
                        });							
					}
                },
                makeProductFavourite : function(e) {
                	e.preventDefault();
                	e.stopPropagation();
					var self = this,
						currDateTime = new Date(),
						createDate = currDateTime.toJSON(),
						salePrice = $("#newPrice").text(),
	            		selectedProductSalePrice = parseFloat(salePrice[1]),
	            		selectedProductThumb = $("#product-gallery-detail").attr("src"),
	            		productName = $(".product-popup-info .product-name").text(),
	            		selectedVendorProductId = $(".product-popup-info").data("product-id"),
	            		
        				productData = {
							"product": [
					            {
					              "productName": productName,
					              "salePrice": selectedProductSalePrice,
					              "thumbnailUrl": selectedProductThumb,
					              "vendorProductId": selectedVendorProductId,
					              "createDate": createDate,
					              "eventId": selectedEventId
					            }
					          ]
						}; 

					if (self.addProductToFavourites.clear().set(productData)) {
						
						self.addProductToFavourites.save({}, {
							error : function(model, response) {
								//console.log(response);
							},
							success : function(model, response) {

								if(response.productCassandraWrapper.responseCode === "SUCCESS") {
									self.render();
								} else {
									if(response.productCassandraWrapper.errorMessage != undefined) {
										alert(response.productCassandraWrapper.errorMessage);
									} else {
										alert("Add to Favourite Product Service Failure.");
									}
								}
							}
						});
						
					} else {
						
						this.$('.alert-error').fadeIn();
					}
				},
				removeFavouriteProduct : function(e) {
					
					e.preventDefault();
					
					var self = this,
						createdTime = $(".remove-favorites").data("created-time"),
						productData = { "createdTime" : createdTime };
                    
					if (self.removeProductFromFavourites.clear().set(productData)) {
						self.removeProductFromFavourites.fetch({
	                        error: function (response) {
	                          //  console.log(response);
	                        },
	                        success: function (model, response) {
	                        	//console.log(response);
	                        	self.render();
	                    	}
	                    });
					}
				},
				updateFavouriteLink : function() {
					
					var self = this,
						selectedVendorProductId = $(".product-popup-info").data("product-id"),
						productData = { "vendorProductId" : selectedVendorProductId };
                    
					if (self.productFavouriteStatus.clear().set(productData)) {
						self.productFavouriteStatus.fetch({
	                        error: function (response) {
	                          //  console.log(response);
	                        },
	                        success: function (model, response) {
	                        //	console.log(response);
	                        	
	                        	if(response.isFavourite) {
	                        		$(".add-favorites")
	                        			.addClass("remove-favorites")
	                        			.removeClass("add-favorites")
	                        			.attr("data-created-time", response.createdTime)
	                        			.text("Remove from Favourites");
	                        	} else {
	                        		$(".remove-favorites")
                        			.addClass("add-favorites")
                        			.removeClass("remove-favorites")
                        			.removeAttr("data-created-time")
                        			.text("Add from Favourites");
	                        	}
	                    	}
	                    });
					}
				},
				socialShareHandler : function(e) {
					
					e.preventDefault();
					
					var classesList = $(e.currentTarget).attr("class").split(' '),
						sharingData = {
							url : window.location.href,
							title : $(".product-detail-info .product-name").text(),
							imageUrl : $("#product-gallery-thumbnails div a").first().data("image-detail"),
							description : "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
							handlerName : classesList[1]
					};
					
					socialShare(e, sharingData);
				},
				checkServicibility : function(e){
                	e.preventDefault();
                	$('.checkservice').toggle();
                },
                checkServicablePincode : function(e){
                	
                	e.preventDefault();
                	var pincode = $("#pincode").val(), regNum = /^\d+$/;
                	
            		$(".checkservice .statusmsg").removeClass("red").removeClass("green");
            		$(".checkservice .statusmsg .text").text("");
                	
                	if(pincode === "" || pincode.length > 6 || pincode.length < 6){
                		
                		$(".checkservice .statusmsg").addClass("red");
                		$(".checkservice .statusmsg .text").text("Invalid pincode");
                		
                	} else {
                		
                		if(regNum.test(pincode)){
                			
                    		var data = {
                					pincode: pincode
                			};
                			
                			if(this.serviceability.clear().set(data)) {
                				this.serviceability.save({}, {
                					success : function(model, response) {
                						
                						if(response.pinCodeWrapper.responseCode === "FAILURE"){
                	                		$(".checkservice .statusmsg").addClass("red");
                	                		$(".checkservice .statusmsg .text").text("Invalid pincode");
                	                		
                						} else {
                							if(response.pinCodeWrapper.pinCodes.deliveryAvailable) {
                		                		$(".checkservice .statusmsg").addClass("green");
                		                		$(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
                		                		
                							} else {
                		                		$(".checkservice .statusmsg").addClass("red");
                		                		$(".checkservice .statusmsg .text").text("Sorry, your area is not serviceable");
                							}
                						}
                					}
                				});
                			} else {
                				this.$('.alert-error').fadeIn();
                			}
                    		
                		} else {
                			
                			$(".checkservice .statusmsg").addClass("red");
                    		$(".checkservice .statusmsg .text").text("Invalid pincode");
                			
                		}                		
                	}
                }

    });
})();