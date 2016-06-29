/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.ProductDetailView = Backbone.Model.extend({
    	 el: '#backbone-portlet-product',
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
                    this.liveInventory = new LiveInventory();
                    this.addProduct = new AddProduct();
                    this.addProductToFavourites = new AddProductToFavourites();
                    this.removeProductFromFavourites = new RemoveProductFromFavourites();
                    this.productBrowsingHistory = new ProductBrowsingHistory();
                    this.productFavouriteStatus = new ProductFavouriteStatus();
                    this.serviceability = new Serviceability();                    
                },
                render: function () {
                    var self = this;
                    self.product.clear().fetch({
                            error: function (response) {
                              //  console.log("error");
                            },
                            success: function (model, response) {

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
                                
                                for (var j = 0; j < data.vendorProductWrapper.vendorProduct.vendorProductInventories.length; j++) {

                                    prodImageRepo.push({
                                        "skuId": data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].skuId,
                                        "imageList": []
                                    });

                                    for (var k = 0; k < data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].imageView.length; k++) {
                                        prodImageRepo[j].imageList.push(data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].imageView[k]);
                                    }
                                }
                                
                                $(self.el).html(Handlebars.templates.product(data));
                                
                                
                                $(".fancybox").fancybox();
                                
                                self.updateFavouriteLink();
                                self.updatePageMetaTags();
                                
                                var eventTimeHolder = $("#productEventTimer"),
	        						eventExpireDateTime = eventTimeHolder.data("expire-datetime");
	        					
	        					eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
	        					    eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
	        					}).on('finish.countdown', function() {
	        						eventTimeHolder.html("EXPIRED");
	        					});

                                updateProductGallery(imageServerBaseURL, prodImageRepo, selectedSKU);

                                var attrTypeOne = ["size", "memory", "noofphotos"];
                                var attrTypeTwo = ["pattern", "material"];

                                $(attrTypeOne).each(function (index, value) {
                                    $("div.select-choice[class$='" + value.toLowerCase() + "']").addClass("type-one");
                                });

                                $(attrTypeTwo).each(function (index, value) {
                                    $("div.select-choice[class$='" + value.toLowerCase() + "']").addClass("type-two");
                                });

                                if ($(".select-choice.color").length > 0) {
                                    var colorList = $(".select-choice.color .tiles");

                                    colorList.each(function (index) {
                                    	$(this).css("background-color", $(this).data("attribute-value").toLowerCase());
                                    });
                                }
                                
                                if ($('#ex1').length > 0) {
                                	
                                    $('#ex1').zoom();
                                }

                                if ($(".select-choice.type-two").length > 0) {
                                    $(".select-choice.type-two").each(function (index,value) {
                                                $(this).find("ul").hide();
                                                var qntyList = $(this).find(".tiles"),
                                                    selectBox = "<div class='select-wrapper'><select class='select'>";

                                                qntyList.each(function (index) {
                                                        selectBox += "<option value='" + $(this).data("attribute-value") + "'>" + $(this).data("attribute-value") + "</option>";
                                                });
                                                
                                                selectBox += "</select></div>";

                                                $(this).append(selectBox);
                                            });
                                }

                                $(currentAttributes).each(function (index, obj) {
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

                                if ($("#maintab").length > 0) {
                                    $("#maintab li").first().addClass("selected");
                                    $(".tab-infoarea[id='" + $("#maintab li.selected a").data("name") + "']").show();
                                }
                                
                                $(".sharing").data('powertipjq', $(".social-share-powertip"));
                                $(".sharing").powerTip({
                                     placement: 'e',
                                     smartPlacement: true,
                                     mouseOnToPopup: true
                                });
                                
                                self.addToProductBrowsingHistory();
                            }
                        });
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
                },
                updateProductInfo: function () {
                	var eventId = $("#backbone-portlet-product").data("event-id"),
                		data = {
                			"skuinventory" : {
                				"skuId" : selectedSKU,
                    			"eventId" : eventId
                			}
                		}; 
                	
                	if (this.liveInventory.clear().set(data)) {
                		this.liveInventory.fetch({
                			error: function (response) {
                               // console.log(response);
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
                  //  console.log("update Selected SKU function triggerd!");
                    var attributeList = $(".select-choice"),
                        newSKU = "",
                        tempSKUSuffix = "";
                    
                    if(attributeList.length > 0) {
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
                        
                    } else {
                    	
                    	newSKU = skuPrefix;
                    }
                    
                   // console.log(newSKU);
                    
                    if(selectedSKU != newSKU) {
                    	
                    	selectedSKU = newSKU;
                    	this.updateProductInfo();
                    }
                },
                addProductToCart : function(event){
                	event.preventDefault();
                	
                	$("#invalid-popup").removeClass('invalid').addClass('cartload');
                	$("#invalid-popup h2").text("Please wait while your product is being added to the cart");
            		$("#invalid-popup .row p").text("");
            		$.fancybox($('#invalid-popup'),{
            			 helpers : { 
            				  overlay : {closeClick: false}
            				},
            			 'afterShow'     : function () {
            			            $('.fancybox-close').hide();
            			            
            			        }
            		});
                	
                	var salePrice = $("#newPrice").text(),
                		selectedProductSalePrice = parseFloat(salePrice),
                		MRP = $(".old-pricing").text().split(" "),
                		selectedProductMRP = parseFloat(MRP[1]),
                		selectedProductThumb = encodeURI($("#product-gallery-thumbnails div:first-child a img").first().attr("src")),
                		selectedProductQnty = parseInt($(".select-quantity.quantity select").val()),
                		productName = $(".product-detail-info .product-name").text(),
                		selectedVendorProductId = $(".product-detail-info").data("product-id"),
                		cartId = $.cookie("CARTID"),
                		customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
                		
                		sizeList = $('.selection-area .size li a'),sizeListArr=[],variants="",productData;
                		if(sizeList === undefined || sizeList === ""){
                		//	console.log("no sizes available");
                		}else{
                			$.each(sizeList, function( i, elem ){
                        		var data = elem.text;
                        	    sizeListArr.push(data);
                        	//    console.log(data);
                        	});
                        	variants = sizeListArr.join('|');
                        //	console.log(variants);
                		}
                		
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
	                	
                	
                	if(selectedProductQnty <= 0) {
                		$("#invalid-popup").removeClass('cartload').addClass('invalid');
                		$("#invalid-popup h2").text("Please select a valid quantity.");
	            		$("#invalid-popup .row p").text("");
	            		$.fancybox($("#invalid-popup"));
                		
                	} else {
                		
	                	if (this.addProduct.clear().set(productData)) {
	                		this.addProduct.fetch({
	                			error: function (response) {
	                				/*console.log("product has not been added to cart... :(");*/
	                            },
	                            success: function (model, response) {
	                            	
	                            	if(response.productCassandraWrapper.responseCode === "FAILURE") {
										/*console.log(response.productCassandraWrapper.errorMessage);*/
	                            		$("#invalid-popup").removeClass('cartload').addClass('invalid');
										$("#invalid-popup h2").text(response.productCassandraWrapper.errorMessage);
					            		$("#invalid-popup .row p").text("");
					            		$.fancybox($("#invalid-popup"));
										
									} else {
										
										/*console.log(response.productCassandraWrapper.message);*/
										
										/* var redirectURL = window.location.origin + "/cart";
										window.location.replace(redirectURL); */
										$.fancybox.close($('#invalid-popup'));
										window.location.assign("/cart");
									}
	                            }
	                        });							
						}
                	}
                },
                
                makeProductFavourite : function(e) {
					
                	e.preventDefault();
					
					var self = this,
						currDateTime = new Date(),
						createDate = currDateTime.toJSON(),
						salePrice = $("#newPrice").text(),
	            		selectedProductSalePrice = parseFloat(salePrice),
	            		selectedProductThumb = $("#product-gallery-detail").attr("src"),
	            		productName = $(".product-detail-info .product-name").text(),
	            		selectedVendorProductId = $(".product-detail-info").data("product-id"),
	            		
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
	                           // console.log(response);
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
						selectedVendorProductId = $(".product-detail-info").data("product-id"),
						productData = { "vendorProductId" : selectedVendorProductId };
                    
					if (self.productFavouriteStatus.clear().set(productData)) {
						self.productFavouriteStatus.fetch({
	                        error: function (response) {
	                           // console.log(response);
	                        },
	                        success: function (model, response) {
	                        	//console.log(response);
	                        	
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
				addToProductBrowsingHistory : function() {
                	
                	var salePrice = $("#newPrice").text(),
                		selectedProductSalePrice = parseFloat(salePrice),
                		selectedProductThumb = $("#product-gallery-detail").attr("src"),
                		productName = $(".product-detail-info .product-name").text(),
                		selectedVendorProductId = $(".product-detail-info").data("product-id"),
                	
                		productData = {
	        			  "product": [
	        			              {
	        			                "productName": productName,
	        			                "salePrice": selectedProductSalePrice,
	        			                "thumbnailUrl": selectedProductThumb,
	        			                "vendorProductId": selectedVendorProductId,
	        			                "eventId" : selectedEventId
	        			              }
	        			            ]
                		};
                    	
                	if (this.productBrowsingHistory.clear().set(productData)) {
                		this.productBrowsingHistory.fetch({
                			error: function (response) {
                				//console.log("product has not been added to browsing history... :(");
                            },
                            success: function (model, response) {
                            	
                            	if(response.productCassandraWrapper.responseCode === "FAILURE") {
									alert(response.productCassandraWrapper.errorMessage);
								} else {
									//console.log(response.productCassandraWrapper.message);
								}
                            }
                        });							
					}
				},
				updatePageMetaTags : function() {
					
					/*var pageUrl = window.location.href,
						title = $(".product-detail-info .product-name").text(),
						imageUrl = $("#product-gallery-thumbnails div a").first().data("image-detail"),
						description = "sadasdasdas asdasdsad asdas",
						type = "fashionandyou:product",
						fbAppId = '772164726145216',
						siteName = 'FashionAndYou',
						
						fbMetaList = [
				            '<meta property="og:title" content="',
				            title,
				            '">',
				            '<meta property="og:type" content="',
				            type,
				            '">',
				            '<meta property="og:url" content="',
				            pageUrl,
				            '">',
				            '<meta property="og:image" content="',
				            imageUrl,
				            '">',
				            '<meta property="og:description" content="',
				            description,
				            '">',
				            '<meta property="og:site_name" content="',
				            siteName,
				            '">',
				            '<meta property="fb:app_id" content="',
				            fbAppId,
				            '">',
				            '<meta property="fb:admins" content="',
				            '',
				            '">'
			            ].join('');
					
					$('head').append(fbMetaList);*/					
				 				  
				},
 				socialShareHandler : function(e) {
					
					e.preventDefault();
					
					//console.log("clicked");
					//console.log(e);
					
					var classesList = $(e.currentTarget).attr("class").split(' '),
						sharingData = {
							url : window.location.href,
							title : $(".product-detail-info .product-name").text(),
							imageUrl : $("#product-gallery-thumbnails div a").first().data("image-detail"),
							description : "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
							handlerName : classesList[1]
					};
					
					//console.log(sharingData);
					
					socialShare(e, sharingData);
				}

    });
})();