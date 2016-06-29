/*global Webshop, Backbone, JST*/
var timeVer;
var availableSkuList = [];
var tagErpsku = {};
var sellerSKU_Id, wareHousePin,tat;

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
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
        defaultAttr,
        title,
        webShopId,        
        prdtName,
        imageServerBaseURL = "http://cdn1.fashionandyou.com/fny-event/";

        Webshop.Views.ProductView = Backbone.View.extend({
        templates: {
            singaleproduct: JST['app/scripts/templates/newproduct.hbs']
         
        },
        el: '#productDetail',
        events: {
            'click .select-choice.color .tiles': 'selectColor',
            'mouseover .select-choice.type-one .tiles': 'selectOption',
            'mouseout .select-choice.type-one .tiles': 'selectOption',
            'click .select-choice.type-one .tiles': 'selectOption',
            'click #maintab li': 'updateTabContent',
            'click .sizeChart': 'sizechartScroll',
            'click .size-chart': 'showSizeChart',
            //'click .select-choice .tiles': 'updateSelectedSKU',
            'click #addToCart': 'addProductToCart',
            'click .add-favorites': 'makeProductFavourite',
            'click .remove-favorites': 'removeFavouriteProduct',
            'click .social-share-link': 'socialShareHandler',
            'click .go': 'checkServicablePincode',
            'click .pincheck': 'getcookiePin',
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
            //this.addProductBrowsingHistory = new Webshop.Models.AddProductBrowsingHistory();
            this.productFavouriteStatus = new Webshop.Models.ProductFavouriteStatus();
            this.serviceability = new Webshop.Models.Serviceability();
            this.getDeliveryTime = new Webshop.Models.GetDeliveryTime();
            this.getSizeChart = new Webshop.Models.GetSizeChart();
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

                var allAttrWithValArr = [],
                    currentAttributes = [],
                    skuArr = [],
                    variantCodeSku = [],
                    variantCodeObj = {};
                 console.log("product data render" +  data);
                 selectedCategoryId = data.product.cats[0].categoryLabel;   
                 petStyleCode = data.product.petStyleCode;
                 vendorStyleCode = data.product.vendorStyleCode;
                 title = data.product.title;
                 webShopId = data.product.webShopId;
                 prdtName = data.product.title;
            
                 $('title').html(title);

                 var endDate,eventFalse,startEventDate, salePrice, qtyAvailable ;            
                $.each(data.product.productVariants, function(index, value){
                        
                    if(value.variantCode)
                    {
                        variantCodeSku.push(value.variantCode);
                    }                   
                   // console.log(JSON.stringify(value));

                    if(value.selected == true) {
                        selectedErpSku = value.webShopVariantId;
                        selectedSKU = value.webShopVariantId;
                        defaultAttr = value.variantCode;
                        
                            $.each(value.sellerSKUs, function(index, qnt){

                                if(qnt.selected == true){  
                                    selectedEventId = qnt.event.eventId;
                                    //console.log("selectedEventId ===" + selectedEventId);
                                  
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
            
            
            if(defaultAttr != undefined){    
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
        }
            
            $("#productDetail").html(self.templates.singaleproduct(data));
            
            console.log("on load sellerSKU Id" + sellerSKU_Id); 
             setTimeout(function(){
                 var script = document.createElement('script');
                   script.src = window.location.origin+'/app-theme/app/scripts/vendor/magiczoomplus.js';
                   script.type = 'text/javascript';
                   var head = document.getElementsByTagName("head")[0];
                   head.appendChild(script);

                    $('.slide .thumbnail-image').on('click',function(){
                     $('.slide .thumbnail-image').each(function(){
                        $(this).removeClass('thumbnail-image-selected')
                      });
                        $(this).addClass('thumbnail-image-selected');
                    });

            },1000);
                  
           // self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);

            variantCodeObj['variantSkuList'] = variantCodeSku;
            if(variantCodeObj.variantSkuList.length == 0)
            {
                $('.productdetail-left #variantCode').hide();
            }
            /***********Product discount promo************/ 
                    
            $('#productPromoData').insertAfter(".product-detail-area #product-area");

                
           /* for(var indexed=0; indexed<data.product.productVariants.length;indexed++){
              var variantText=data.product.productVariants[indexed].selected;
              if (variantText===true) {
               $("#variant-" + data.product.productVariants[indexed].variantCode).addClass('selected');
              }       
            }*/
            /*expired event changes starts*/
            
           /* var endDate,eventFalse ;

             $.each(data.product.productVariants, function(index, value){
              
                       if(value.selected)
                        {                               
                        $.each(value.sellerSKUs, function(index, sellersku){
                                if(sellersku.selected)
                                {
                                    endDate = sellersku.event.eventEndDateInMillis;
                                    eventFalse = sellersku.event.active;
                                }

                            });

                                                                  
                        }              
                });*/
            
            /*expired event changes starts*/
                
        var currDate = new Date(),
            diff = endDate-currDate;
          
            //console.log(endDate+" : "+currDate+" diff: "+diff);
            /*if(!diff){
                 $(".select-quantity.quantity label").hide();
                 $(".select-quantity.quantity select").hide();
                 $(".productdetail-left #addToCart").remove();
                 $(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Sold Out</p>");
            }*/
        
            if(eventFalse == false){
                $('#productEventTimer').hide();}
            else {
                $('#productEventTimer').show();}
        /*expired event chages ends*/
        
                             

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

        //self.updateQntySelectBox(currSKUQnty, currSKUMaxAllowedQnty);
        self.updateProductInfo(sellerSKU_Id);


        if (currentAttributes.length === 1) {
            $(".select-choice").eq(0).css("width", "100%");
        } else {
            $(".select-choice").eq(0).css("width", "100%");
            $(".select-choice").eq(1).css("width", "100%");
        }

        if ($("#maintab").length > 0) {
            $("#maintab li").first().addClass("selected");
            $(".tab-infoarea[id='" + $("#maintab li.selected a").data("name") + "']").show();
        }
         
            setTimeout(function() {

            self.updateProductGallery(data);

            if ($('#ex1').length > 0) {
                //$('#ex1').zoom();
               
            }

          
            eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
            }).on('finish.countdown', function() {
                eventTimeHolder.html("EXPIRED");
            });

            //self.addToProductBrowsingHistory();
            
            self.updatePageMetaTags();

          }, 500);

            /* for(var indexed=0; indexed<data.product.productVariants.length;indexed++){
              var variantText=data.product.productVariants[indexed].selected;
              if (variantText===true) {
               $("#variant-" + data.product.productVariants[indexed].variantCode).addClass('selected');
              }       
            }*/

            for(var indexed=0; indexed<data.product.productVariants.length;indexed++){
              var variantText=data.product.productVariants[indexed].selected;
              var variantNode = data.product.productVariants[indexed].variantCode.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
              var variantNewNode = variantNode[0];
              if (variantText===true) {
               $("#variant-" + variantNewNode).addClass('selected');
              }       
            }
   
            var currEventDate = $('#FnyFirstRecord').data('firstrecord');

        

            var catId, catName;
            $.each(data.product, function(index, cats){
                 catId = cats.categoryId,
                 catName = cats.categoryLabel ;
            });
             
            var prdtId = selectedErpSku;
           
           // self.renderKomliPixel(prdtId , prdtName , salePrice , qtyAvailable , catId ,catName);                            
            self.updateFavouriteLink();
             self.getShowSizeChart();

          $(document)
            .bind(
                "contextmenu",
            function(e) {
                if (e.target.nodeName == 'IMG') {
                    return false;
                }
            }); 
            
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
            
            komliPixel = new  Webshop.Views.Pixlet();
            komliPixel.globalPixel(pixelData);
        },
        getShowSizeChart: function() {
         var currentWebshopId = globalProductData.product.webShopId;;
            var self = this,
                data = { 
                        webShopId : currentWebshopId,
                       };

            if (this.getSizeChart.clear().set(data)) {
                    this.getSizeChart.fetch({
                        error: function(response) {
                            //console.log("response --error" + JSON.stringify(response));
                        },
                        success: function(model, response) {
                           
                            console.log("response show chart -" + JSON.stringify(response.responseCode));
                           
                            if(response.responseCode == 'SUCCESS'){
                                $("#sizeChart").html("<h5 class='specify'>Size Chart</h5>" + response.Dimension);
                            }else{
                                $('.productdetail-left .sizeChart').hide();
                                $("#sizeChart").hide();
                            }
                        }
                    })
            }
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
                                                
                                                $('.check-avalible .statusmsg').after('<span class="statusmsg codcheck red"><span class="icon"></span><span class="text">COD not available</span></span>');
                                            }
                                            $.cookie('COOKIE_PINCODE_DELIVERABLE', pincode, {
                                                path: '/'
                                            });

                                            self.showDeliveryTime();
                                            $(".delivered-days p").show();

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
                                        $(".delivered-days p").show();

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
                        /*var day = response.days,
                        expectedDay1 = day - 1,
                        expectedDay2 = day + 1;*/
                        var expectedDay1 = response.minimumDays,
                        expectedDay2 = response.maximumDays; 
                                        
                       if(expectedDay1 !== 0){

                            $('.delivered-days p').text('Product expected to be delivered within ' + expectedDay1 + ' to ' + expectedDay2 + ' days.');
                            $('.delivered-days').show();
                        }
                    }
                });
            }
        },
        updateProductInfo: function(sellerSKU_Id) {
            var self = this,
                
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

                          $('.description-area  li#attrinfo  ').remove();
                           $.each(value.attribute, function(index, attrValue)
                            {                                                                      
                            var attrName = attrValue.name;
                            var attrDesc = attrValue.value; 
                            $('.description-area #newRowAdd').append('<li class="attrName" id="attrinfo"><span class="attr">'+attrName+'</span><span class="attrDesc">'+attrDesc+'</span></li>');                                  
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

                             // $(".select-quantity.quantity select").html(qntyList);
                              if(description == undefined)
                              {
                                $('.description').hide();
                              }
                              else{
                                $('.description').show();   
                                $('.description p').text(description);                          
                                }

                              if(description1 == undefined)
                              {
                                $('.description1').hide();
                              }
                              else
                              {
                                $('.description1').show();
                              $('.description1 p').text(description1);
                              }

                              if(description2 == undefined)
                              {
                                $('.description2').hide();
                              }
                              else
                              {
                                $('.description2').show();
                              $('.description2 p').text(description2);
                              }

                              if(description3 == undefined)
                              {
                                $('.description3').hide();
                              }
                              else{
                                $('.description3').show();
                                $('.description3 p').text(description3);
                              }
                                                            
                              $('.gurantee .guranteeValue').text(gurantee); 

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
                         "quantity":selectedProductQnty
                        
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
                         "quantity":selectedProductQnty             
                        }   
                    };
                };
            
            if(selectedProductQnty <= 0) {
                $(".productdetail-left #addToCart").remove();
                $(".productdetail-left").append("<p id='soldOutLabel' class='button-big'>Sold Out</p>");

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
                            /*console.log(response);*/
                        },
                        success: function(model, response) {

                            if (response.responseCode === "SUCCESS") {
                               //self.render(globalProductData);
                                                        
                                $(".add-favorites")
                                .addClass("remove-favorites")
                                .removeClass("add-favorites")
                                .attr("data-created-time", response.createdTime)
                                .text("Remove from Favourites");
                                     

                              } else {

                                if (response.responseCode != undefined) {
                                   $("#invalid-popup h2").text(response.responseMessage);
                                    $("#invalid-popup .row p").text("");
                                    $.fancybox($('#invalid-popup'),{
                                         helpers : { 
                                              overlay : {closeClick: false}
                                            },
                                         'afterShow'     : function () {
                                                    
                                                    
                                                }
                                    });
                                 
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

        offertoggle: function(e) {
            e.preventDefault();
            $(".currentoffer").toggle();
            //$(".bestoffer").toggle();
        },
        sizechartScroll:function(e){
            e.preventDefault();
            $('html, body').animate({scrollTop:$(document).height() - 1200}, 'slow');
            return false;
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
                        "webShopId" : webShopId,    
                        "eventId": selectedEventId,
                        "dummy" : ''
                    }]
                };

            if (this.addProductBrowsingHistory.clear().set(productData)) {
                this.addProductBrowsingHistory.fetch({
                    error: function(response) {
                        /*console.log("product has not been added to browsing history... :(");*/
                    },
                    success: function(model, response) {

                        if (response.responseCode === "FAILURE") {
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

            var classesList = $(e.currentTarget).attr("class").split(' '),
                sharingData = {
                    url: window.location.href,
                    title: $(".product-detail-info .product-name").text(),
                    imageUrl: $("#product-gallery-thumbnails div a").first().data("image-detail"),
                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                    handlerName: classesList[1]
                };

            socialShare(e, sharingData);
        }
    });
})();
