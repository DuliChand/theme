/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};
var availableSkuList = [];
var sellerSKU_Id, wareHousePin,tat;

(function() {
    'use strict';

    var skuList, oldPrice,newPrice, skuinventory, gurantee, attrName, attrDesc, description, description1, description2, description3;
    
    var currSKUQnty,
        currSKUMaxAllowedQnty,
        selectedSKU,
        selectedInventoryId,
        selectedErpSku,
        selectedSellerId,
        selectedEventId,
        selectedCategoryId,
        skuPrefix,
        skuSuffix,
        prodImageRepo = [],
        globalProductData,
        petStyleCode,
        vendorStyleCode,
        title,
        webShopId,
        prdtName,
         imageServerBaseURL = "http://cdn1.fashionandyou.com/fny-event/";

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
            //'click .select-choice .tiles': 'updateSelectedSKU',
            'click #addToCart': 'addProductToCart',
            'click a.add-favorites': 'makeProductFavourite',
            'click a.remove-favorites': 'removeFavouriteProduct',
            'click .social-share-link': 'socialShareHandler',
            'click .go': 'checkServicablePincode',
            'click .button-check': 'checkServicibility',
            'click .offertoggle': 'offertoggle',
            'click .select-choice .tiles': 'clickUpdate'
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
            var productId = $(".product-popup-info").data("product-id"),
                title = $(".product-detail-info .product-name").text(),
                newTitle =  title.split(" ").join("_").toLowerCase(),
                data = {
                    "productId": productId,
                    "title": newTitle,
                };

            this.renderProductQuickView(event, data);
            
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
                            skuArr = [],
                            variantCodeSku = [],
                            variantCodeObj = {};                           

                        globalProductData = data;

                 selectedCategoryId = globalProductData.product.cats[0].categoryLabel; 
                 petStyleCode = globalProductData.product.petStyleCode;
                 vendorStyleCode = globalProductData.product.vendorStyleCode;
                 title = globalProductData.product.title;
                 webShopId = globalProductData.product.webShopId;
                 prdtName = title;


                var endDate,eventFalse,startEventDate, salePrice, qtyAvailable ;            
                $.each(globalProductData.product.productVariants, function(index, value){
                        
                    if(value.variantCode)
                    {
                        variantCodeSku.push(value.variantCode);
                    }                   
                   // console.log(JSON.stringify(value));

                    if(value.selected == true) {
                        selectedErpSku = value.webShopVariantId;
                        selectedSKU = value.webShopVariantId;
                        
                            $.each(value.sellerSKUs, function(index, qnt){

                                if(qnt.selected == true){  
                                    selectedEventId = qnt.event.eventId;
                                  
                                    for(var i=0;i<qnt.length;i++){
                                        availableSkuList.push(qnt[i].sKUId);
                                    }
                                    
                                    selectedSellerId = qnt.sellerId; 
                                    sellerSKU_Id = qnt.sKUId;
                                    wareHousePin = qnt.wareHousePin;
                                    tat = qnt.tat;    

                                    currSKUQnty = qnt.inventory;
                                    qtyAvailable = qnt.inventory;
                                    
                                    currSKUMaxAllowedQnty = qnt.maxQuantity;
                                    
                                    salePrice = qnt.sp;  

                                    endDate = qnt.event.eventEndDateInMillis;
                                    eventFalse = qnt.event.active;
                                
                                    startEventDate = qnt.event.eventStartDateInMillis;

                                }

                            })
                        }
                        
                        tagErpsku = selectedErpSku; 
                       
                    });
            

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

                            if(attrValWithId){    
                            dividerIndexFromLast = attrValWithId.toString().lastIndexOf("-");
                            }

                            attributeId = attrWithId[1];
                            attributeName = attrWithId[0];
                             if(attrValWithId){  
                                attributeValueId = attrValWithId.substring((dividerIndexFromLast + 1), attrValWithId.length);
                                attributeValue = attrValWithId.substring(0, dividerIndexFromLast);
                                }
                            currentAttributes.push({
                                "attributeId": attributeId,
                                "attributeName": attributeName,
                                "attributeValueId": attributeValueId,
                                "attributeValue": attributeValue
                            });
                        }
                    }

                        $(self.el).html(self.templates.productpopup(data));

                        console.log("on load sellerSKU_Id" + sellerSKU_Id);
                        self.updateProductInfo(sellerSKU_Id);

                        if ($.cookie('COOKIE_PINCODE_DELIVERABLE') != undefined) {
                            $("#pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
                            self.getcookiePin();
                           // $('#checkservice .go').trigger('click');
                        }

                        $('#quickview1').fancybox({
                           
                            cache : false
                        });
                        
                        $.fancybox($(self.el));

                        
                            
                        self.updateProductGallery(data);

                        if(eventFalse == false){
                            $('#productEventTimer').hide();}
                        else {
                            $('#productEventTimer').show();}

                        /*for(i=0; i<data.product.productVariants.length;i++){
                          var str1=data.product.productVariants[i].selected;
                          console.log(str1);
                          if (str1===true) {
                           $("#variant-" + data.product.productVariants[i].variantCode).addClass("selected"); 
                            
                          }       
                        }*/

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

                        variantCodeObj['variantSkuList'] = variantCodeSku;
                        if(variantCodeObj.variantSkuList.length == 0)
                        {
                            $('.productdetail-left #variantCode').hide();
                        }

                        $(currentAttributes).each(function(index, obj) {
                            var selectAttr = $(".select-choice li[data-attribute-value-id$='" + obj.attributeValueId + "']");
                            $(".select-choice[data-attribute-id$='" + obj.attributeId + "']").find(selectAttr).addClass("selected");
                        });

                        self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);

                        if (currentAttributes.length === 1) {
                            $(".select-choice").eq(0).css("width", "100%");
                        } else {
                            $(".select-choice").eq(0).css("width", "100%");
                            $(".select-choice").eq(1).css("width", "100%");
                        }

                        setTimeout(function() {
                           
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

                           if ($('#ex1').length > 0) {
                                $('#ex1').zoom();
                            }

                            eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                                eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                            }).on('finish.countdown', function() {
                                eventTimeHolder.html("EXPIRED");
                            });

                        }, 500);
                        


                        if ($("#maintab").length > 0) {
                            $("#maintab li").first().addClass("selected");
                            $(".tab-infoarea[id='" + $("#maintab li.selected a").data("name") + "']").show();
                        }

                        self.updateFavouriteLink();

                       for(var indexed=0; indexed<data.product.productVariants.length;indexed++){
                          var variantText=data.product.productVariants[indexed].selected;
                          var variantNode = data.product.productVariants[indexed].variantCode.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
                          var variantNewNode = variantNode[0];
                          if (variantText===true) {
                           $("#variant-" + variantNewNode).addClass('selected');
                          }       
                        }
                    }
                });
            }
        },

        offertoggle: function(e) {
            e.preventDefault();
            $(".currentoffer").toggle();
        },

        updateProductInfo: function(sellerSKU_Id) {
            var self = this,
                //eventId = $("#backbone-portlet-product").data("event-id"),
                //erpskuId = $(e.currentTarget).attr("data-attribute-value-id "),
                data =  {
                        "skuId": sellerSKU_Id,
                         };
                       
            if (this.liveInventory.clear().set(data)) {
                this.liveInventory.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {                    
                        
                        var qtyAvailable = response.skus[0].qtyAvailable,
                        qtyBlocked =   response.skus[0].qtyBlocked;

                        currSKUQnty = qtyAvailable - qtyBlocked;
                        currSKUMaxAllowedQnty = response.skus[0].maxCap;
                        self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);

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
          updateSelectedSKU: function(event, currSKUQnty, currSKUMaxAllowedQnty) {
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

                newSKU = skuPrefix + "-" + tempSKUSuffix;

            } else {

                newSKU = skuPrefix;
            }
             if (selectedSKU != newSKU) {

                selectedSKU = newSKU;
                //this.updateProductInfo(event);
            }
           
            
           

        },

        clickUpdate : function (event, currSKUQnty, currSKUMaxAllowedQnty) {                      
                var self = this;                            
                var skuList, oldPrice,newPrice, skuinventory, currSKUQnty, currSKUMaxAllowedQnty, gurantee, attrName, attrDesc, description, description1, description2, description3;
                                                     
                skuList = $(event.currentTarget).text();
                  
                $.each(globalProductData.product.productVariants, function(index, value){
                   
                    var variantChk = value.variantCode;               
                    skuList = $.trim(skuList);
                  
                    if(skuList.toLowerCase() === variantChk.toLowerCase())
                        {
                         
                              description = value.description;
                                                      
                              description1 = value.description1;
                                                
                              description2 = value.description2;
                                                       
                              description3 = value.description3;                       
                              $('.description-area  #attrinfo  li').remove();
                               $.each(value.attribute, function(index, attrValue)
                                {                                                                      
                                    var attrName = attrValue.name;
                                    var attrDesc = attrValue.value; 
                                   $('.description-area #attrinfo').append('<li class="attrName"><span class="attr">'+attrName+'</span><span class="attrDesc">'+attrDesc+'</span></li>');                                  
                              
                                 });

                                 $.each(value.sellerSKUs, function(index, skuValue){
                                 sellerSKU_Id =skuValue.sKUId; 
                                 wareHousePin = skuValue.wareHousePin,
                                 tat = skuValue.tat,
                                 oldPrice = skuValue.mrp;
                                 newPrice = skuValue.sp;
                                 gurantee = skuValue.gurantee;
                                 currSKUQnty = skuValue.inventory;
                                 currSKUMaxAllowedQnty = skuValue.maxQuantity;

                              });

                                self.updateProductInfo(sellerSKU_Id);


                              $(".old-pricing").text("INR " + parseFloat(oldPrice));
                              $(".new-pricing").text("INR " + parseFloat(newPrice));

                        }
                })   
            
        },
        addProductToCart : function(event){

            event.preventDefault();
            console.log("add to ====" + sellerSKU_Id);
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

                variants = sizeSkuArr.join('*');
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
                        "pinCode" : $.cookie('COOKIE_PINCODE_DELIVERABLE'),
                        "customerId" : $.cookie('COOKIE_FNY_CUSTOMER_ID'),                       
                        "productRequest":
                            {
                                 "webshopId" : webShopId,
                                 "sellerSku": {
                                   "sKUId": sellerSKU_Id
                                   },
                         "quantity":selectedProductQnty,
                        
                        }   
                    };
                }else{
                    productData = {
                        "deviceId": $.cookie($('#FnyCustomToken').data('tokenid')),
                        "pinCode" : $.cookie('COOKIE_PINCODE_DELIVERABLE'),
                        "customerId" : $.cookie('COOKIE_FNY_CUSTOMER_ID'),                       
                        "productRequest":
                            {
                                 "webshopId" : webShopId,
                                 "sellerSku": {
                                   "sKUId": sellerSKU_Id
                                   },
                         "quantity":selectedProductQnty,
                            
                                        
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
                                    eventId: selectedEventId
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
            
            if($('#productEventTimer').html() != 'expired'){
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
        updateProductGallery: function(data) {
            var prodGalleryThumbList = "";    
            var thumbNode=0;
             prodGalleryThumbList += '<div id="product-gallery-thumbnails" class="gallery-thumbnails">';

             for(thumbNode=0;thumbNode < data.product.images.length;thumbNode++){
                prodGalleryThumbList += '<div class="slide"><a href="'+data.product.images[thumbNode].originalUrl+'" class="thumbnail-image" rel="zoom-id:ex1"  rev="'+data.product.images[thumbNode].detailUrl+'" data-image-detail=" ' ;
                prodGalleryThumbList += /*imageServerBaseURL +*/ data.product.images[thumbNode].detailUrl;
                prodGalleryThumbList += '"  data-image-original="';
                prodGalleryThumbList += /*imageServerBaseURL +*/ data.product.images[thumbNode].originalUrl;
                prodGalleryThumbList += '"><img src="';
                prodGalleryThumbList += /*imageServerBaseURL +*/ data.product.images[thumbNode].thumbUrl;
                prodGalleryThumbList += '" alt="" title="" /></a></div>';
                }
            
                prodGalleryThumbList += '</div>';

               $('#ex1').attr('href',data.product.images[0].originalUrl);
                $("#product-gallery-detail")
                .attr("src", (  data.product.images[0].detailUrl))
                .attr("data-zoom-image", (  data.product.images[0].originalUrl)); 

            if ($(".product-gallery .bx-wrapper").length > 0) {
                $(".product-gallery .bx-wrapper").remove();
            }

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
                    customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                    
                    productData = {
                        "product": {
                            "customerId" : customerId,
                            "productId" : webShopId  
                        }
                    };

                if (self.addProductToFavourites.clear().set(productData)) {
      
                    self.addProductToFavourites.save({}, {
                        error: function(model, response) {
                            $("#invalid-popup h2").text(response.responseMessage);
                                    $("#invalid-popup .row p").text("");
                                    $.fancybox($('#invalid-popup'),{
                                         helpers : { 
                                              overlay : {closeClick: false}
                                            },
                                         'afterShow'     : function () {
                                                    
                                                }
                                    });
                        },
                        success: function(model, response) {

                            if (response.responseCode === "SUCCESS") {
                                $(".add-favorites")
                                .addClass("remove-favorites")
                                .removeClass("add-favorites")
                                .attr("data-created-time", response.createdTime)
                                .text("Remove from Favourites");
                                     
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
                customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                createdTime = $(".remove-favorites").data("created-time"),
                productData = { 
                        "product": {
                            "customerId" : customerId,
                            "productId" : webShopId
                        }
                };

            if (self.removeProductFromFavourites.clear().set(productData)) {
                self.removeProductFromFavourites.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {

                        if (response.ifDataExists) {                            
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
        updateFavouriteLink: function() {

            var self = this,
                selectedVendorProductId = $(".product-detail-info").data("product-id"),
                 customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                productData = {
                    "customerId" : customerId,
                    "productId" : webShopId
                };

            if (self.productFavouriteStatus.clear().set(productData)) {
                self.productFavouriteStatus.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {

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
           

            if(pinCodeValue != cookiePin || pinCodeValue == cookiePin){        
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
                                            $('.productdetail-right .delivered-days').show();
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
                $(".delivered-days p").hide();
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
                                    $(".delivered-days p").hide();
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
                                        $(".delivered-days p").hide();
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
                    $(".delivered-days p").hide();
                }
            }

        },
        
        showDeliveryTime: function() {

            var self = this,
               data = { 
                                  
                        "wareHousePin": wareHousePin,
                        "tatDays": tat 
                                 
                };


            if (this.getDeliveryTime.clear().set(data)) {
                this.getDeliveryTime.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        var expectedDay1 = response.minimumDays,
                        expectedDay2 = response.maximumDays; 
                                        
                       if(expectedDay1 !== 0){


                                    $('.delivered-days p').text('Product expected to be delivered within ' + expectedDay1 + ' to ' + expectedDay2 + ' days.');
                                     $('.productdetail-right .delivered-days').show();
                        }
                    }
                });
            }
        },
    });
    
})();
