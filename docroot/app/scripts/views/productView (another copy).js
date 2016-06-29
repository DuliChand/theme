/*global Webshop, Backbone, JST*/
var timeVer;
var availableSkuList = [];
var tagErpsku = {};

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
	
    var currSKUQnty,
        currSKUMaxAllowedQnty,
        selectedSKU,
        selectedInventoryId,
        selectedErpSku,
        selectedEventId,
        selectedCategoryId,
        skuPrefix,
        skuSuffix,
        prodImageRepo = [],
		globalProductData,
        imageServerBaseURL = "http://static.fashionandyou.com/";

    Webshop.Views.ProductView = Backbone.View.extend({
        templates: {
            product: JST['app/scripts/templates/product.hbs'],
            singaleproduct: JST['app/scripts/templates/newproduct.hbs']
        },
        el: '#productDetail',
        events: {
            'click .select-choice.color .tiles': 'selectColor',
            'mouseover .select-choice.type-one .tiles': 'selectOption',
            'mouseout .select-choice.type-one .tiles': 'selectOption',
            'click .select-choice.type-one .tiles': 'selectOption',
            'click #maintab li': 'updateTabContent',
            'click .size-chart': 'showSizeChart',
            'click .select-choice .tiles': 'updateSelectedSKU',
            'click #addToCart': 'addProductToCart',
            'click .add-favorites': 'makeProductFavourite',
            'click .remove-favorites': 'removeFavouriteProduct',
            'click .social-share-link': 'socialShareHandler',
            'click .go': 'checkServicablePincode',
            'click .pincheck': 'getcookiePin',
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
        render: function(data) {
            var self = this;
                var categoryvstdata  = document.referrer.match(/category/);
                var storevisted  = document.referrer.match(/store/);
                globalProductData = data;
                
                if(categoryvstdata == "category")
                {       
                    $.cookie('categoryvisted', document.referrer.split('/').pop(-1), {
                        expires: 1,
                        path: '/'
                    }); 
                    //$.cookie('categoryvisted').attr('data-value',document.referrer.split('/').pop(-1));
                }
                else if(storevisted == "store"){
                    $.cookie('categoryvisted', document.referrer, {
                        expires: 1,
                        path: '/'
                    });
                }
                else{
                    $.cookie('categoryvisted', "", {
                        expires: 1,
                        path: '/'
                    });
                }



                var
                    allAttrWithValArr = [],
                    currentAttributes = [],
                    skuArr = [];

                 selectedCategoryId = data.product.cats[0].categoryId;   

                $.each(data.product.productVariants, function(index, value){
                   // console.log(JSON.stringify(value));

                        if(value.selected == true)
                            {
                            if(value.sellerSKUs.selected){  
                                selectedEventId = value.sellerSKUs.event.eventId;
                             }
                            selectedErpSku = value.webShopVariantId;
                            selectedSKU = value.webShopVariantId;
                                $.each(value.sellerSKUs, function(index, qnt){

                                    for(var i=0;i<qnt.length;i++){
                                        availableSkuList.push(qnt[i].skuId);
                                    }

                                    if(qnt.selected == true){
                                    currSKUQnty = qnt.inventory;
                                    currSKUMaxAllowedQnty = qnt.maxQuantity;
                                      
                                    }
                                })
                            }

                   
                    });
      
                
                tagErpsku = data.product.productVariants.webShopVariantId;

                skuArr = selectedSKU.split("-");

                skuPrefix = skuArr[0] + "-" + skuArr[1] + "-" + skuArr[2] ;

                if (skuArr.length > 3) {

                    skuSuffix = skuArr[3];
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

                for (var j = 0; j < data.product.images.length; j++) {

                    prodImageRepo.push({
                       // "skuId": data.vendorProductWrapper.vendorProduct.vendorProductInventories[j].skuId,
                        "imageList": []
                    });

                    for (var k = 0; k < data.product.images.length; k++) {
                        prodImageRepo[j].imageList.push(data.product.images[k]);  
                        console.log("list with prodimages" + prodImageRepo[j]);                        
                    }
                }

                $("#productDetail").html(self.templates.singaleproduct(data));

                /***********Product discount promo************/ 
                    
                 $('#productPromoData').insertAfter(".product-detail-area #product-area");

                   setTimeout(function(){

                   var script = document.createElement('script');
                   script.src = window.location.origin+'/app-theme/dist/scripts/utils.js';
                   script.type = 'text/javascript';
                   var head = document.getElementsByTagName("head")[0];
                   head.appendChild(script);

                    $('.slide .thumbnail-image').on('click',function(){
                     $('.slide .thumbnail-image').each(function(){
                        $(this).removeClass('thumbnail-image-selected')
                      });
                        $(this).addClass('thumbnail-image-selected');
                    });
                       // console.log("promo code");
                }, 1000);
                
                /*expired event changes starts*/
                var endDate ;
                 $.each(data.product.productVariants, function(index, value){
                    //console.log("event Data " + JSON.stringify(value));
                           if(value.selected)
                            {                               
                            $.each(value.sellerSKUs, function(index, sellersku){
                                    if(sellersku.selected)
                                    {
                                        endDate = sellersku.event.eventEndDateInMillis;
                                    }
                                });
                                            
                            }              
                    });

            

                var currDate = new Date(),
                    diff = endDate-currDate;
                    //console.log(endDate+" : "+currDate+" diff: "+diff);
                    if(!diff){
                         $(".select-quantity.quantity label").hide();
                         $(".select-quantity.quantity select").hide();
                         $(".productdetail-left #addToCart").remove();
                         $(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Sold Out</p>");
                    }
                /*expired event chages ends*/
                
                /*Tab name changes*/
                
                $("#maintab li a").each(function(){
                  var tabName = $(this).attr('data-name');
                  if(tabName.toLowerCase() == 'dimension'){
                    $(this).html('Size/Dimensions');   
                  }
                  else if(tabName.toLowerCase() == 'other-info'){
                    $(this).html('Delivery Timelines'); 
                  }
                });
                
                /* Tag ends here*/
                        

                if ($.cookie('COOKIE_PINCODE_DELIVERABLE') != undefined) {
                    $("#pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));

                    self.getcookiePin();
                    //$('.pincheck').trigger('click');
                }

                /*$(".fancybox").fancybox();*/

                var eventTimeHolder = $("#productEventTimer"),
                    eventExpireDateTime = eventTimeHolder.data("expire-datetime");

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

                if ($("#maintab").length > 0) {
                    $("#maintab li").first().addClass("selected");
                    $(".tab-infoarea[id='" + $("#maintab li.selected a").data("name") + "']").show();
                }

                setTimeout(function() {

                    self.updateProductGallery(prodImageRepo);

                    if ($('#ex1').length > 0) {
                        //$('#ex1').zoom();
                       
                    }

                    eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                        eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                    }).on('finish.countdown', function() {
                        eventTimeHolder.html("EXPIRED");
                        $(".select-quantity.quantity label").hide();
                        $(".select-quantity.quantity select").hide();
                        $(".productdetail-left #addToCart").remove();
                        $(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Sold Out</p>"); 
                    });

                    //self.addToProductBrowsingHistory();
                    
                    self.updatePageMetaTags();

                }, 500);
                
                //Product buy disabled for events not published---
                 var startEventDate ;
                 $.each(data.product.productVariants, function(index, value){
                    //console.log("event Data " + JSON.stringify(value));
                        if(value.selected)
                            {
                               
                            $.each(value.sellerSKUs, function(index, sellersku){
                                    if(sellersku.selected)
                                    {
                                        startEventDate = sellersku.event.eventStartDateInMillis;
                                    }
                                });
                                            
                            }
                    });

                var currEventDate = $('#FnyFirstRecord').data('firstrecord');

                if(startEventDate > currEventDate){
                
                    eventTimeHolder.html("Not Started");
                    $(".select-quantity.quantity label").hide();
                    $(".select-quantity.quantity select").hide();
                    $(".productdetail-left #addToCart").remove();
                    $(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Buy Now</p>");
                }   
                        
                //Product buy disabled for future events ends here---
                var prdtId = data.product.productVariants.webShopVariantId,
                     prdtName = data.title;

                var salePrice, qtyAvailable, catId, catName;

                $.each(data.product.productVariants, function(index, value){
                    //console.log("event Data " + JSON.stringify(value));
                        if(value.selected == true)
                            {
                                $.each(value.sellerSKUs, function(index, qnt){

                                  if(qnt.selected == true){
                                    salePrice = qnt.sp;
                                    qtyAvailable = qnt.inventory;
                                      
                                    }
                                })

                            }
                    });

            
                $.each(data.product, function(index, cats){
                     catId = cats.categoryId,
                     catName = cats.categoryLabel ;
                });
                               
                               
                self.renderKomliPixel(prdtId , prdtName , salePrice , qtyAvailable , catId ,catName);
                            
                self.updateFavouriteLink();
            
        },
		renderKomliPixel: function(prdtId , prdtName , salePrice , qtyAvailable , catId ,catName) {
			var self = this,
			pixelData = {
				pageType : "c",
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
        checkServicibility: function(e) {
            e.preventDefault();
            $('.checkservice').toggle();
        },
        checkServicablePincode: function(e) {

            e.preventDefault();
            var cookiePin = $.cookie('COOKIE_PINCODE_DELIVERABLE'),
            pinCodeValue = $('.checkservice').find("#pincode").val();
           

            if(pinCodeValue != cookiePin ){

           

                    var pincode = $('.checkservice').find("#pincode").val(),
                        regNum = /^\d+$/;


                    $(".checkservice .statusmsg").removeClass("red").removeClass("green");
                    $(".checkservice .statusmsg .text").text("");

                    if (pincode === "" || pincode.length > 6 || pincode.length < 6) {

                        $(".checkservice .statusmsg").addClass("red");
                        $(".checkservice .statusmsg .text").text("Invalid pincode");

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

                                        } else {
                                            if (response.pinCodeWrapper.pinCodes.deliveryAvailable) {
												$('.codcheck').remove();
                                                $(".checkservice .statusmsg").addClass("green");
                                                $(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
												if(response.pinCodeWrapper.pinCodes.serviceability == 1){
													
													$('.check-avalible .statusmsg').after('<span class="statusmsg codcheck red"><span class="icon"></span><span class="text">COD not available</span></span>');
												}
                                                $.cookie('COOKIE_PINCODE_DELIVERABLE', pincode, {
                                                    path: '/'
                                                });

                                                self.showDeliveryTime();

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
        },
        getcookiePin : function(){ 

                    var pincode = $('.checkservice').find("#pincode").val(),
                        regNum = /^\d+$/;


                    $(".checkservice .statusmsg").removeClass("red").removeClass("green");
                    $(".checkservice .statusmsg .text").text("");

                    if (pincode === "" || pincode.length > 6 || pincode.length < 6) {

                        $(".checkservice .statusmsg").addClass("red");
                        $(".checkservice .statusmsg .text").text("Invalid pincode");

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

                                        } else {
                                            if (response.pinCodeWrapper.pinCodes.deliveryAvailable) {
												$('.codcheck').remove();
                                                $(".checkservice .statusmsg").addClass("green");
                                                $(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
												if(response.pinCodeWrapper.pinCodes.serviceability == 1){
													
													$('.check-avalible .statusmsg').after('<span class="statusmsg red codcheck"><span class="icon"></span><span class="text">COD not available</span></span>');
												}
                                                $.cookie('COOKIE_PINCODE_DELIVERABLE', pincode, {
                                                    path: '/'
                                                });

                                                self.showDeliveryTime();

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

        showDeliveryTime: function() {

            var self = this,
                data = {
                    "skuinventory": {
                        "skuId": selectedSKU,
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
                                    $('.delivered-days').show();
                        }
                    }
                });
            }
        },
        updateProductInfo: function(e) {
            var self = this,
                eventId = $("#backbone-portlet-product").data("event-id"),
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
                        self.updateProductGallery(prodImageRepo);

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
        
        showSizeChart: function(e) {
            e.preventDefault();
        },
        updateSelectedSKU: function(event) {
            event.preventDefault();
            /*console.log("update Selected SKU function triggerd!");*/
            var attributeList = $(".select-choice"),
                newSKU = "",
                tempSKUSuffix = "";

            if (attributeList.length > 0) {
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

            } else {

                newSKU = skuPrefix;
            }

            /*console.log(newSKU);*/

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
        		productName = $(".product-detail-info .product-name").text(),
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
                        	
                        	if(response.responseCode === "SUCCESS") {
								/*console.log(response.productCassandraWrapper.message);*/
								
								/* var redirectURL = window.location.origin + "/cart";
								window.location.replace(redirectURL); */
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
							
							
								
								
							} else if(response.responseCode  === "FAILURE"){
								
								//console.log(response.productCassandraWrapper.errorMessage);
                        		("#invalid-popup").removeClass('cartload').addClass('invalid');
								$("#invalid-popup h2").text("Add product Failed");
			            		$("#invalid-popup .row p").text("");
			            		$.fancybox($("#invalid-popup"));
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
			
			if($('#productEventTimer').html().toLowerCase() != 'expired'){
				if (productQnty > 0) {
					$(".select-quantity.quantity label").show();
					$(".select-quantity.quantity select").show();
					if ($("#addToCart").length === 0) {
						$("p#soldOutLabel").remove();
						$(".productdetail-left").append('<a id="addToCart" class="button-big" href="#"><i class="icon-basket"></i>buy now</a>');
					}
				} else {

					if ($(".productdetail-left p#soldOutLabel").length === 0) {
						$(".select-quantity.quantity label").hide();
						$(".select-quantity.quantity select").hide();
						$(".productdetail-left #addToCart").remove();
						$(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Sold Out</p>");
					}

                
				}
			}	

        },
        updateProductGallery: function(prodImageRepo) {

             
            var prodGalleryThumbList = "";
            $(prodImageRepo).each(function(index, obj) {
               
                $(data.product.images).each(function(index, obj) {
                
                    prodGalleryThumbList += '<div id="product-gallery-thumbnails" class="gallery-thumbnails">';
                                
                        prodGalleryThumbList += '<div class="slide"><a href="'+obj.originalUrl+'" class="thumbnail-image" rel="zoom-id:ex1"  rev="'+obj.detailsURL+'" data-image-detail=" ' ;
                        prodGalleryThumbList += /*imageServerBaseURL +*/ obj.detailUrl;
                        prodGalleryThumbList += '"  data-image-original="';
                        prodGalleryThumbList += /*imageServerBaseURL +*/ obj.originalUrl;
                        prodGalleryThumbList += '"><img src="';
                        prodGalleryThumbList += /*imageServerBaseURL +*/ obj.thumbUrl;
                        prodGalleryThumbList += '" alt="" title="" /></a></div>';
                
                    }); 
                        prodGalleryThumbList += '</div>';

                        $('#ex1').attr('href',obj.originalUrl);
                        $("#product-gallery-detail")
                        .attr("src", (  obj.detailUrl))
                        .attr("data-zoom-image", (  obj.originalUrl));       
                                    
                  
                 
                });

            if ($(".product-gallery .bx-wrapper").length > 0) {
                $(".product-gallery .bx-wrapper").remove();
            }
            console.log("productthumlist" + prodGalleryThumbList);

            $(".product-gallery").prepend(prodGalleryThumbList);
            $(".thumbnail-image").first().addClass("thumbnail-image-selected");

            if ($("#product-gallery-thumbnails").length > 0) {

                $('#product-gallery-thumbnails').bxSlider({
                    mode: 'vertical',
                    minSlides: 3,
                    maxSlides: 4,
                    pager: false,
                    slideMargin: 5,
                    infiniteLoop: false,
                    hideControlOnEnd: true,

                });
            }

        },
        makeProductFavourite: function(e) {
			if($.cookie('COOKIE_FNY_CUSTOMER_ID')){
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
								self.render(globalProductData);
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
			}
			else{
				
				$("#invalid-popup h2").text("please login to add product to favourite list");
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
						var vendorProductId = $("#backbone-portlet-product").data("product-id"),
						eventId = $("#backbone-portlet-product").data("event-id"),
						data = {
							"vendorProductId": vendorProductId,
							"eventId": eventId,
						};
						if (self.product.clear().set(data)) {
							self.product.fetch({
								error: function(response) {
									/*console.log(response);*/
								},
								success: function(model, response) {
								
									 var data = model.toJSON();
									self.render(data);
								}
							});
						}	
                        
                    }
                });
            }
        },

        offertoggle: function(e) {
            e.preventDefault();
            $(".currentoffer").toggle();
			//$(".bestoffer").toggle();
        },

        updateFavouriteLink: function() {

            var self = this,
                selectedVendorProductId = $(".product-detail-info").data("product-id"),
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
		
        updateOnloadFavouriteLink: function(isFavProduct) {

			var self = this,
			selectedVendorProductId = $(".product-detail-info").data("product-id"),
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
        addToProductBrowsingHistory: function() {

            var salePrice = $("#newPrice").text(),
                selectedProductSalePrice = parseFloat(salePrice),
                selectedProductThumb = $("#product-gallery-detail").attr("src"),
                productName = $(".product-detail-info .product-name").text(),
                selectedVendorProductId = $(".product-detail-info").data("product-id"),

                productData = {
                    "product": [{
                        "productName": productName,
                        "salePrice": selectedProductSalePrice,
                        "thumbnailUrl": selectedProductThumb,
                        "vendorProductId": selectedVendorProductId,
                        "eventId": selectedEventId
                    }]
                };

            if (this.addProductBrowsingHistory.clear().set(productData)) {
                this.addProductBrowsingHistory.fetch({
                    error: function(response) {
                        /*console.log("product has not been added to browsing history... :(");*/
                    },
                    success: function(model, response) {

                        if (response.productCassandraWrapper.responseCode === "FAILURE") {
                            /*console.log(response.productCassandraWrapper.errorMessage);*/
                        } else {
                            /*console.log(response.productCassandraWrapper.message);*/
                        }
                    }
                });
            }
        },
        updatePageMetaTags: function() {

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

            /*console.log(sharingData);*/

            socialShare(e, sharingData);
        }
    });
})();
