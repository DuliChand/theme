/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};
var availableSkuList = [];

(function() {
    'use strict';

    var currSKUQnty,
        currSKUMaxAllowedQnty,
        selectedSKU,
        selectedInventoryId,
        selectedErpSku,
        sourcingLocation,
        warehouseLocation,
        selectedEventId,
        selectedCategoryId,
        skuPrefix,
        skuSuffix,
        prodImageRepo = [],
		globalProductData,
        imageServerBaseURL = "http://static.fashionandyou.com/";

    Webshop.Views.ProductQuickView = Backbone.View.extend({
        templates: {
            productpopup: JST['app/scripts/templates/productpopup.hbs']
        },
        el: '#quickview1',
        events: {
            'click .select-choice.color .tiles': 'selectColor',
            'mouseover .select-choice.type-one .tiles': 'selectOption',
            'mouseout .select-choice.type-one .tiles': 'selectOption',
            'click .select-choice.type-one .tiles': 'selectOption',
            'click #maintab li': 'updateTabContent',
            'click .thumbnail-image': 'changeImage',
            'click .size-chart': 'showSizeChart',
            'click .select-choice .tiles': 'updateSelectedSKU',
            'click #addToCart': 'addProductToCart',
            'click .add-favorites': 'makeProductFavourite',
            'click .remove-favorites': 'removeFavouriteProduct',
            'click .social-share-link': 'socialShareHandler',
            'click .go': 'checkServicablePincode',
            'click .button-check': 'checkServicibility',
            'click .offertoggle': 'offertoggle'
        },
        initialize: function() {
            
            _.bindAll(this, 'render');

            this.product = new Webshop.Models.Product();
            this.liveInventory = new Webshop.Models.LiveInventory();
            this.addProduct = new Webshop.Models.AddProduct();
            this.addProductToFavourites = new Webshop.Models.AddProductToFavourites();
            this.removeProductFromFavourites = new Webshop.Models.RemoveProductFromFavourites();
            this.addProductBrowsingHistory = new Webshop.Models.AddProductBrowsingHistory();
            this.productFavouriteStatus = new Webshop.Models.ProductFavouriteStatus();
            this.serviceability = new Webshop.Models.Serviceability();
            this.getDeliveryTime = new Webshop.Models.GetDeliveryTime();
        },
        render: function() {
            var vendorProductId = $(".product-popup-info").data("product-id"),
                eventId = $(".product-popup-info").data("event-id"),
                data = {
                    "vendorProductId": vendorProductId,
                    "eventId": eventId,
                };

            this.renderProductQuickView(data);
			
        },
        renderProductQuickView: function(data) {

            var self = this;

            if (self.product.clear().set(data)) {

                self.product.fetch({

                    error: function(response) {
                        /*console.log("error");*/
                    },
                    success: function(model, response) {

                        var data = model.toJSON(),
                            allAttrWithValArr = [],
                            currentAttributes = [],
                            skuArr = [];
						globalProductData = data;
                        currSKUQnty = parseInt(data.vendorProductWrapper.liveinventory.quantity);
                        currSKUMaxAllowedQnty = parseInt(data.vendorProductWrapper.liveinventory.maxAllowedQty);
                        selectedSKU = data.vendorProductWrapper.liveinventory.skuId;
                        sourcingLocation = data.vendorProductWrapper.liveinventory.sourcingLocation;
                        warehouseLocation = data.vendorProductWrapper.liveinventory.warehouseLocation;
                        selectedInventoryId = data.vendorProductWrapper.liveinventory.eventInventoryId;
                        selectedErpSku = data.vendorProductWrapper.liveinventory.erpSku;
                        selectedEventId = data.vendorProductWrapper.liveinventory.eventId;
                        selectedCategoryId = data.vendorProductWrapper.vendorProduct.category.categoryId;
						
						for(var i=0;i<data.vendorProductWrapper.vendorProduct.vendorProductInventories.length;i++){
                        	availableSkuList.push(data.vendorProductWrapper.vendorProduct.vendorProductInventories[i].skuId);
						}
						console.log("availableSkuList: "+availableSkuList);
						
                        skuArr = selectedSKU.split("|");

                        skuPrefix = skuArr[0] + "|" + skuArr[1] + "|" + skuArr[2] + "|" + skuArr[3];

                        if (skuArr.length > 4) {

                            skuSuffix = skuArr[4];
                            allAttrWithValArr = skuSuffix.split("%");

                            for (var i = 0; i < allAttrWithValArr.length; i++) {

                                var attrWithValArr = [],
                                    attrWithId = [],
                                    attrValWithId = [],
                                    attributeId = "",
                                    attributeName = "",
                                    attributeValueId = "",
                                    attributeValue = "",
                                    dividerIndexFromLast = null;

                                attrWithValArr = allAttrWithValArr[i].split("~"),
                                attrWithId = attrWithValArr[0].split("-"),
                                attrValWithId = attrWithValArr[1];

                                dividerIndexFromLast = attrValWithId.lastIndexOf("-");

                                attributeId = attrWithId[1];
                                attributeName = attrWithId[0];
                                attributeValueId = attrValWithId.substring((dividerIndexFromLast + 1), attrValWithId.length);
                                attributeValue = attrValWithId.substring(0, dividerIndexFromLast);

                                currentAttributes.push({
                                    "attributeId": attributeId,
                                    "attributeName": attributeName,
                                    "attributeValueId": attributeValueId,
                                    "attributeValue": attributeValue
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

                        $(self.el).html(self.templates.productpopup(data));

                        if ($.cookie('COOKIE_PINCODE_DELIVERABLE') != undefined) {
                            $("#pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
                            self.getcookiePin();
                           // $('#checkservice .go').trigger('click');
                        }

                        var eventTimeHolder = $("#productEventTimer"),
                            eventExpireDateTime = eventTimeHolder.data("expire-datetime");

                        $.fancybox($(self.el));

                        self.updateProductGallery(imageServerBaseURL, prodImageRepo, selectedSKU);

                        var attrTypeOne = ["size", "memory", "noofphotos"];
                        var attrTypeTwo = ["pattern", "material"];

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
                                    selectBox += "<option value='" + $(this).data("attribute-value") + "'>" + $(this).data("attribute-value") + "</option>";
                                });

                                selectBox += "</select></div>";

                                $(this).append(selectBox);
                            });
                        }

                        $(currentAttributes).each(function(index, obj) {
                            var selectAttr = $(".select-choice li[data-attribute-value-id$='" + obj.attributeValueId + "']");
                            $(".select-choice[data-attribute-id$='" + obj.attributeId + "']").find(selectAttr).addClass("selected");
                        });

                        self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);

                        if (currentAttributes.length === 1) {
                            $(".select-choice").eq(0).css("width", "100%");
                        } else {
                            $(".select-choice").eq(0).css("width", "45%");
                            $(".select-choice").eq(1).css("width", "45%");
                        }

                        setTimeout(function() {

                            eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                                eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                            }).on('finish.countdown', function() {
                                eventTimeHolder.html("EXPIRED");
                            });

                            if ($('#ex1').length > 0) {
                                $('#ex1').zoom();
                            }

                            if ($("#product-gallery-thumbnails").length > 10) {
                                $('#product-gallery-thumbnails').carouFredSel({
                                    auto: false,
                                    prev: '#prev3',
                                    next: '#next3',
                                    mousewheel: true,
                                    direction: "up",
                                    items: 4,
                                    scroll: 1,
                                    swipe: {
                                        onMouse: true,
                                        onTouch: true
                                    }
                                });
                            }

                        }, 500);

                        if ($("#maintab").length > 0) {
                            $("#maintab li").first().addClass("selected");
                            $(".tab-infoarea[id='" + $("#maintab li.selected a").data("name") + "']").show();
                        }

                        self.updateFavouriteLink();
                    }
                });
            }
        },

        offertoggle: function(e) {
            e.preventDefault();
            $(".currentoffer").toggle();
        },

        updateProductInfo: function(e) {
            var self = this,
                eventId = $(".product-popup-info").data("event-id"),
                erpskuId = $(e.currentTarget).attr("data-attribute-erpsku-id"),
                data = {
                    "skuinventory": {
                        "skuId": erpskuId,
                        "eventId": eventId
                    }
                };

            if (this.liveInventory.clear().set(data)) {
                this.liveInventory.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        var oldPrice = response.liveinventory.currencyCode + " " + response.liveinventory.mrp,
                            newPrice = response.liveinventory.currencyCode + " " + response.liveinventory.salePriceWithVAT;

                        currSKUQnty = response.liveinventory.quantity;
                        currSKUMaxAllowedQnty = response.liveinventory.maxAllowedQty;
                        selectedInventoryId = response.liveinventory.eventInventoryId;
                        selectedErpSku = response.liveinventory.erpSku;
                        selectedEventId = response.liveinventory.eventId;

                        $(".old-pricing").text(oldPrice);
                        $(".new-pricing").text(newPrice);

                        self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);
                        self.updateProductGallery(imageServerBaseURL, prodImageRepo, selectedSKU);

                    }
                });
            }
        },
        updateTabContent: function(event) {
            event.preventDefault();
            $(event.currentTarget).addClass("selected").siblings().removeClass("selected");
            $(".tab-infoarea[id='" + $(event.currentTarget).find("a").data("name") + "']").show().siblings().hide();
        },
        selectColor: function(e) {
            e.preventDefault();

            if ($(".select-choice.color .tiles").length > 0) {
                $(e.currentTarget).addClass("selected")
                    .siblings().removeClass("selected");
            }
        },
        selectOption: function(e) {
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
        changeImage: function(event) {
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
        showSizeChart: function(e) {
            e.preventDefault();
        },
        updateSelectedSKU: function(event) {
            event.preventDefault();
            /*console.log("update Selected SKU function triggerd!");*/
            var attributeList = $(".select-choice"),
                newSKU = "",
                tempSKUSuffix = "";
            /*console.log("attributeList:>>>> " + attributeList.length);*/
            $(attributeList).each(function(index, attribute) {

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

            if (selectedSKU != newSKU) {
                selectedSKU = newSKU;

                this.updateProductInfo(event);
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
        		productName = $(".product-name").text(),
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
                	   // console.log(data);
                	});
					
                	//variants = sizeListArr.join('|');
                	//console.log(variants);
        		}
        		
        		for(var i= 0;i<sizeListArr.length;i++){
        		       for(var j=0;j<availableSkuList.length;j++){
        		         //console.log(availableSkuList[j]);
        		    	   var temp = "~"+sizeListArr[i]+"-";
        		           if(availableSkuList[j].match(temp)){
        		        			var temp = sizeListArr[i]+":"+availableSkuList[j];
        		        			sizeSkuArr.push(temp);
        		        		}
        		       }
        		}

        		//console.log(sizeSkuArr);
        		
        		variants = sizeSkuArr.join('*');
            	//console.log(variants);
				var cartStatus = '';
				if($.cookie("FNY_CART")){
					cartStatus = 'existing';
				}
				else{
					cartStatus = 'NEW';
				}

        		if(variants === undefined || variants === ""){
        			productData = {
						"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
						"productRequestWrapper":
						{
							"skuId": selectedErpSku,
							
							"quantity":selectedProductQnty,
							"eventId" : selectedEventId,
							"productName": productName,
							"categoryId" : selectedCategoryId.toString(),
							"thumbUrl": selectedProductThumb
						
						}	
	    			};
        		}else{
        			productData = {
						"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
						"productRequestWrapper":
						{
							"skuId": selectedErpSku,
							"quantity":selectedProductQnty,
							"eventId" : selectedEventId,
							"productName": productName,
							"categoryId" : selectedCategoryId.toString(),
							"thumbUrl": selectedProductThumb
						
						}	
	    			};
        		
        		};
        		
        		/*var productData = {
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
    				};*/
            	
        	
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
                        	
                        	if(response.responseCode === "FAILURE") {
								/*console.log(response.productCassandraWrapper.errorMessage);*/
                        		$("#invalid-popup").removeClass('cartload').addClass('invalid');
								$("#invalid-popup h2").text('Add product failed');
			            		$("#invalid-popup .row p").text("");
			            		$.fancybox($("#invalid-popup"));
								
							} else {
								
								var totalCartProducts ;
								if(globalCartObject){
									if(globalCartObject.cart){
										totalCartProducts = globalCartObject.cart.products.length
									}
								}
								else{
									totalCartProducts = 1;
								}
								var cartData = {
									noOfProducts: totalCartProducts,
									eventId: globalProductData.vendorProductWrapper.vendorProduct.eventId 
								}
								var date = new Date();
								var recordminutes = 45;
								date.setTime(date.getTime() + (recordminutes * 60 * 1000));
								$.cookie('FNY_CART', JSON.stringify(cartData), {
									expires: date,
									path: '/'
								});
								$.fancybox.close($('#invalid-popup'));
								window.location.assign("/cart");
							}
                        }
                    });							
				}
        	}
        },
        updateQntySelectBox: function(currSKUQnty, currSKUMaxAllowedQnty) {

            var qntyList = "",
                productQnty;

            if (currSKUQnty === 0 && currSKUMaxAllowedQnty === 0) {
                productQnty = 0;
            } else if (currSKUQnty < currSKUMaxAllowedQnty) {
                productQnty = currSKUQnty;
            } else {
                if (currSKUMaxAllowedQnty === 0) {
                    productQnty = 1;
                } else {
                    productQnty = currSKUMaxAllowedQnty;
                }
            }

            for (var i = 1; i <= productQnty; i++) {
                qntyList += "<option value='";
                qntyList += i;
                qntyList += "'>";
                qntyList += i;
                qntyList += "</option>";
            }
            $(".select-quantity.quantity select").html(qntyList);

            if (productQnty > 0) {
                $(".select-quantity.quantity label").show();
                $(".select-quantity.quantity select").show();
                if ($("#addToCart").length === 0) {
                    $(".product-popup-info p#soldOutLabel").remove();
                    $(".product-popup-info .productdetail-left").append('<a id="addToCart" class="button-big" href="#"><i class="icon-basket"></i>buy now</a>');
                }
            } else {

                /*console.log($(".action-area p#soldOutLabel").length);*/

                if ($(".productdetail-left p#soldOutLabel").length === 0) {
                    $(".select-quantity.quantity label").hide();
                    $(".select-quantity.quantity select").hide();
                    $(".product-popup-info .productdetail-left #addToCart").remove();
                    $(".product-popup-info .productdetail-left").append("<p id='soldOutLabel' class='button-big'>SOLD OUT</p>");
                }
            }

        },
        updateProductGallery: function(imageServerBaseURL, prodImageRepo, selectedSKU) {

            var prodGalleryThumbList = "";
            $(prodImageRepo).each(function(index, obj) {

                if (obj.skuId === selectedSKU) {

                    prodGalleryThumbList += '<div id="product-gallery-thumbnails" class="gallery-thumbnails">';

                    $(obj.imageList).each(function(index, img) {

                        prodGalleryThumbList += '<div class="slide"><a href="#" class="thumbnail-image" data-image-detail="';
                        prodGalleryThumbList += /*imageServerBaseURL +*/ img.detailsURL;
                        prodGalleryThumbList += '"  data-image-original="';
                        prodGalleryThumbList += /*imageServerBaseURL +*/ img.originalURL;
                        prodGalleryThumbList += '"><img src="';
                        prodGalleryThumbList += /*imageServerBaseURL +*/ img.thumbURL;
                        prodGalleryThumbList += '" alt="" title="" /></a></div>';

                    });

                    prodGalleryThumbList += '</div>';

                    $("#product-gallery-detail")
                        .attr("src", ( /*imageServerBaseURL +*/ obj.imageList[0].detailsURL))
                        .attr("data-zoom-image", ( /*imageServerBaseURL + */ obj.imageList[0].originalURL));
                }
            });

            if ($(".product-gallery .bx-wrapper").length > 0) {
                $(".product-gallery .bx-wrapper").remove();
            }

            $(".product-gallery").prepend(prodGalleryThumbList);
            $(".thumbnail-image").first().addClass("thumbnail-image-selected");

            if ($("#product-gallery-thumbnails").length > 0) {

                $('#product-gallery-thumbnails').bxSlider({
                    mode: 'vertical',
                    minSlides: 4,
                    maxSlides: 4,
                    pager: false,
                    slideMargin: 5
                    /*infiniteLoop: false,
                        		 hideControlOnEnd: true,    		 
                        		 */
                });
            }
        },
        makeProductFavourite: function(e) {

            e.preventDefault();

            var self = this,
                currDateTime = new Date(),
                createDate = currDateTime.toJSON(),
                salePrice = $("#newPrice").text(),
                selectedProductSalePrice = parseFloat(salePrice[1]),
                selectedProductThumb = $("#product-gallery-detail").attr("src"),
                productName = $(".product-popup-info .product-name").text(),
                selectedVendorProductId = $(".product-popup-info").data("product-id"),

                productData = {
                    "product": [{
                        "productName": productName,
                        "salePrice": selectedProductSalePrice,
                        "thumbnailUrl": selectedProductThumb,
                        "vendorProductId": selectedVendorProductId,
                        "createDate": createDate,
                        "eventId": selectedEventId
                    }]
                };

            if (self.addProductToFavourites.clear().set(productData)) {

                self.addProductToFavourites.save({}, {
                    error: function(model, response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {

                        if (response.productCassandraWrapper.responseCode === "SUCCESS") {
                            self.render();
                        } else {
                            if (response.productCassandraWrapper.errorMessage != undefined) {
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
        removeFavouriteProduct: function(e) {

            e.preventDefault();

            var self = this,
                createdTime = $(".remove-favorites").data("created-time"),
                productData = {
                    "createdTime": createdTime
                };

            if (self.removeProductFromFavourites.clear().set(productData)) {
                self.removeProductFromFavourites.fetch({
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
        updateFavouriteLink: function() {

            var self = this,
                selectedVendorProductId = $(".product-popup-info").data("product-id"),
                productData = {
                    "vendorProductId": selectedVendorProductId
                };

            if (self.productFavouriteStatus.clear().set(productData)) {
                self.productFavouriteStatus.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        /*console.log(response);*/

                        if (response.isFavourite) {
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
        socialShareHandler: function(e) {

            e.preventDefault();

            /*console.log("clicked");*/
            /*console.log(e);*/

            var classesList = $(e.currentTarget).attr("class").split(' '),
                sharingData = {
                    url: window.location.href,
                    title: $(".product-detail-info .product-name").text(),
                    imageUrl: $("#product-gallery-thumbnails div a").first().data("image-detail"),
                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                    handlerName: classesList[1]
                };

            socialShare(e, sharingData);
        },
        checkServicibility: function(e) {
            e.preventDefault();
            $('.checkservice').toggle();
        },
        checkServicablePincode: function(e) {

            e.preventDefault();
             var cookiePin = $.cookie('COOKIE_PINCODE_DELIVERABLE'),
            pinCodeValue = $('.checkservice').find("#pincode").val();
           

            if(pinCodeValue != cookiePin ){        
                var self = this,
                    pincode = $('.checkservice').find("#pincode").val(),
                    regNum = /^\d+$/;

                $(".checkservice .statusmsg").removeClass("red").removeClass("green");
                $(".checkservice .statusmsg .text").text("");

                if (pincode === "" || pincode.length > 6 || pincode.length < 6) {

                    $(".checkservice .statusmsg").addClass("red");
                    $(".checkservice .statusmsg .text").text("Invalid pincode");
                     $('.productdetail-right .delivered-days').hide();
                    /*console.log("invalid");*/
                } else {

                    if (regNum.test(pincode)) {
                        /*console.log("valid");*/
                        var data = {
                            pincode: pincode
                        };

                        if (this.serviceability.clear().set(data)) {
                            this.serviceability.save({}, {
                                success: function(model, response) {

                                    if (response.pinCodeWrapper.responseCode === "FAILURE") {
                                        $(".checkservice .statusmsg").addClass("red");
                                        $(".checkservice .statusmsg .text").text("Invalid pincode");
                                         $('.productdetail-right .delivered-days').hide();

                                    } else {
                                        if (response.pinCodeWrapper.pinCodes.deliveryAvailable) {
                                            $(".checkservice .statusmsg").addClass("green");
                                            $(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
                                            $.cookie('COOKIE_PINCODE_DELIVERABLE', pincode, {
                                                path: '/'
                                            });

                                            self.showDeliveryTime();

                                        } else {
                                            $(".checkservice .statusmsg").addClass("red");
                                            $(".checkservice .statusmsg .text").text("Sorry, your area is not serviceable");
                                             $('.productdetail-right .delivered-days').hide();
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
                         $('.productdetail-right .delivered-days').hide();
                    }
                }
            }
        },

        getcookiePin : function(){ 

                    var pincode = $('.checkservice').find("#pincode").val(),
                        regNum = /^\d+$/;


                    $(".checkservice .statusmsg").removeClass("red").removeClass("green");
                    $(".checkservice .statusmsg .text").text("");

                    if (pincode === "" || pincode.length > 6 || pincode.length < 6) {

                        $(".checkservice .statusmsg").addClass("red");
                        $(".checkservice .statusmsg .text").text("Invalid pincode");
                         $('.productdetail-right .delivered-days').hide();
                    } else {

                        if (regNum.test(pincode)) {

                            var self = this,
                                data = {
                                    pincode: pincode
                                };

                            if (this.serviceability.clear().set(data)) {
                                this.serviceability.save({}, {
                                    success: function(model, response) {

                                        if (response.pinCodeWrapper.responseCode === "FAILURE") {
                                            $(".checkservice .statusmsg").addClass("red");
                                            $(".checkservice .statusmsg .text").text("Invalid pincode");
                                             $('.productdetail-right .delivered-days').hide();
                                        } else {
                                            if (response.pinCodeWrapper.pinCodes.deliveryAvailable) {
                                                $(".checkservice .statusmsg").addClass("green");
                                                $(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
                                                 $('.productdetail-right .delivered-days').show();
                                                $.cookie('COOKIE_PINCODE_DELIVERABLE', pincode, {
                                                    path: '/'
                                                });

                                                self.showDeliveryTime();

                                            } else {
                                                $(".checkservice .statusmsg").addClass("red");
                                                $(".checkservice .statusmsg .text").text("Sorry, your area is not serviceable");
                                                 $('.productdetail-right .delivered-days').hide();
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
                             $('.productdetail-right .delivered-days').hide();
                        }
                    }

        },
        
        showDeliveryTime: function() {

            var self = this,
                data = {
                    "skuinventory": {
                        "warehouseLocation": warehouseLocation,
                        "sourcingLocation" : sourcingLocation,
                        "eventId": selectedEventId
                    }
                };

            if (this.getDeliveryTime.clear().set(data)) {
                this.getDeliveryTime.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        /*console.log("response from getDeliveryTime service :--- ");
	                        	console.log(response);*/
                        var day = response.days,
                        expectedDay1 = day - 1,
                        expectedDay2 = day + 1;
                                        
                       if(day !== 0){

                                    $('.delivered-days p').text('Product expected to be delivered within ' + expectedDay1 + ' to ' + expectedDay2 + ' days.');
                                     $('.productdetail-right .delivered-days').show();
                        }
                    }
                });
            }
        },
    });
    
})();
