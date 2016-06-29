/*global Webshop, Backbone, JST*/
Webshop.Views = Webshop.Views || {};
window.globalCartRawData = "";
var reviewTimer ;

(function() {
    'use strict';

    var currSKUQnty,
    cartempData;
    Webshop.Views.CartView = Backbone.View.extend({
    	templates: {
            cartcontent: JST['app/scripts/templates/cartcontent.hbs'],
            ordersummary: JST['app/scripts/templates/ordersummary.hbs']
        },
        el: '#backbone-portlet-cart-content',
        events: {

        	/* Cart Content Related Events Start Here */
            "click .cart-details .cart-remove": "removeProduct",
            "click .update-cart": "updateCart",
            "change .save": "updateProductInCart",
            "change #size" : "updateSizeSelection"
            /* Cart Content Related Events End Here */
        },
        initialize: function() {

            _.bindAll(this, 'render');
            this.getCart = new Webshop.Models.GetCart();
            this.liveInventory = new Webshop.Models.LiveInventory();
            this.deleteProduct = new Webshop.Models.DeleteProduct();
            this.updateProduct = new Webshop.Models.UpdateProduct();
            this.cartSizeUpdate = new Webshop.Models.CartSizeUpdate();
        },
        render: function(data) {
            var self = this;
            cartempData = data;
			//globalCartRawData = self.cartProducts(data);
			
			
				var products = [],
				totalProductsInCart,
				cartProductList, productSelectBoxList, productTimerList = [],
				cartTimerLeft = "",
				productTimerArr = [];
                    var  pageURL = window.location.pathname.toLowerCase();
                if((pageURL.match(/cart$/) != null)) {
       
   
                    if (data.cart) {
                      //  console.log('inside if of cart');
					  if (data.cart.products){
                        if (data.cart.products.length) {
                            products = data.cart.products;
                        } else {
                            products.push(data.cart.products);
                        }
                        totalProductsInCart = parseInt(data.cart.products.length);
					  }
                    }
					else{
						
					}
                }
					
					$("#cartContent").html(self.templates.cartcontent(data));					
					/*$('.cart-details.cart-main').each(function(index){
						if(index == 0){
							reviewTimer = $(this).attr('data-timer');
						}
					});*/
					
					
                    if((pageURL.match(/cart$/) != null)) {
						
                    	var cartProductsList = $('.cart-details.cart-main'),Sku=[];
                    	$.each(cartProductsList , function(index ,data){
                   	          Sku.push($(data).data('sku-id'));
                    	});
                    	
                    	var selectedSize="";
			
						/*setTimeout(function(){
							if(data.cart.products.length){
						
								$.each(data.cart.products , function(index ,data){
									if(data.variants){
										$("#"+data.erpSku+" .size option").attr("selected", false);	
										 var erpSku =  data.erpSku;
										 selectedSize = erpSku.split(/-(.+)?/)[1];
										 //$(".size option[value='"+selectedSize+"']").attr("selected","selected");
										 $(".size option[value='"+selectedSize+"']").prop("selected","selected").parents("#"+data.erpSku).find('.size').removeClass('size');
									} 
								});
								
							}else{
								if(data.cart.products.variants != ""){
								var erpSku =  data.cart.products.erpSku;
								selectedSize = erpSku.split(/-(.+)?/)[1];
								$(".size option[value='"+selectedSize+"']").attr("selected","selected");
							}
						}	
                      },700);*/
                    }
                    
                    
                    
                if((pageURL.match(/cart$/) != null)) {

                    if (data.cart.products != "" || data.cart.products != undefined || data.cart.products != null) {
                     if(data.cart.products.length){
                            if(data.cart.products.length < 5){
                                $('.cart-action-area').find('.cont-shopping').hide();
                            }else{
                                $('.cart-action-area').find('.cont-shopping').show();
                            }
                        }else{
                            $('.cart-action-area').find('.cont-shopping').hide();
                        }
                    } 
                    
                    
                  }    
                    productSelectBoxList = $(".cart-details .select-wrapper.qty select.select");
                    cartProductList = $(".cart-details.cart-main");

                   /* setTimeout(function() {

                        $.each(cartProductList, function(i, element) {

                            productTimerArr.push(parseInt($(element).data("createdtime")));

                            $(element).find(".cart-item-timer").countdown(newCartTimeExpire($(element).data("createdtime") , $(element).data("timer"))).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' mins'));
                            }).on('finish.countdown', function() {
								
								var productData = {
						                	"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
						    				"productRequest":{
						    					"sellerSku":{
						    				"sKUId":$(element).data("sku-id")
						    					}
					    				}
					    			};
								self.timerRemoveProduct(productData)
								$(this).html('00:00:00 mins');
                                setTimeout(function() {
                                    self.render();
                                }, 30000);
                            });

                        });

                        cartTimerLeft = newCartTimeExpire(Array.min(productTimerArr) ,reviewTimer);
                       
                        if (productTimerArr.length > 0) {
                        	$('#cartTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' mins'));
                            }).on('finish.countdown', function() {
                                $(this).html('00:00:00 mins');
                                self.render();
                            });
                        }
                    }, 500);
*/
                if((pageURL.match(/cart$/) != null)) {

                    for (var i = 0; i < productSelectBoxList.length; i++) {

                        var currQnty = parseInt(products[i].quantity),
                            currSKUMaxAllowedQnty = parseInt(products[i].maxAllowedQuantity),
                            currSKUQnty = parseInt(products[i].maxAvailableQuantity),
                            totalAvailableQnty;
                        if (currSKUQnty === 0 && currSKUMaxAllowedQnty === 0) {
                            totalAvailableQnty = 0;
                        } else if (currSKUQnty < currSKUMaxAllowedQnty && currSKUQnty !== 0) {
                            totalAvailableQnty = currSKUQnty;
                        } else if (currSKUQnty < currSKUMaxAllowedQnty && currSKUQnty === 0) {
                            totalAvailableQnty = 1;
                        } else {
                            if (currSKUMaxAllowedQnty === 0 || currSKUQnty === 0) {
                                totalAvailableQnty = 1;
                            } else {
                                totalAvailableQnty = currSKUMaxAllowedQnty;
                            }
                        }
                        $(productSelectBoxList[i]).html(self.updateQntySelectBox(totalAvailableQnty, currQnty));
                    }
					
					//--Komli pixel cart func init----
					//	console.log('komli init--- ');
						
						var komliPrdtId = [],
							komliPrdtName = [],
							komliCartVal = data.cart.youPayValue;

						if(data.cart.products[0]){
						  
						  for(var i=0;i<data.cart.products.length;i++){
							komliPrdtId.push(data.cart.products[i].vendorProductId);
							komliPrdtName.push(data.cart.products[i].productName);
						  }
						}
						else{
						  komliPrdtId.push(data.cart.products.vendorProductId);
						  komliPrdtName.push(data.cart.products.productName);
						}
						self.renderKomliPixel(komliPrdtId , komliPrdtName , komliCartVal);
                 }
					
					
                    if ($("#orderSummary")) {
                        $("#orderSummary").html(self.templates.ordersummary(data));
                    }

                    if (products.length === 0) {
                        $(".order-sum-box #checkoutBtn").attr("href", "#").css("cursor", "default");
                    } else {
                        $(".order-sum-box #checkoutBtn").attr("href", "/billing").css("cursor", "pointer");
                    }
					


        },
		renderKomliPixel: function(prdtId , prdtName , cartValue) {
			var self = this,
			pixelData = {
				pageType : "s",
				prdtId: prdtId,
				prdtName: prdtName,
				salePrice: "",
				qtyAvailable: "",
				catId: "",
				catName:"",
				cartVal: cartValue
			},
			
			komliPixel = new  Webshop.Views.Pixlet();
			komliPixel.globalPixel(pixelData);
		},
		cartProducts: function(data){
			var obj = data.cart.products;
			var count = 0;
			var productsArry = [];
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop))
				  var productsObj = {
					"sku":obj[prop].sku,
					"webshopSku":obj[prop].webshopSku,
					"deliveryDay":obj[prop].deliveryDay,
					"maxQntyAllowed":obj[prop].maxQntyAllowed,
					"name":obj[prop].name,
					"quantity":obj[prop].quantity,
					"status":obj[prop].status,
					"expireDuration":obj[prop].expireTimeLimit,
					"timeToExpire":obj[prop].expireTimeLimit,
					"vendorProductId":obj[prop].vendorProductId,
					"costPrice":obj[prop].costPrice,
					"salePrice":obj[prop].salePrice,
					"mrp":obj[prop].mrp,
					"vat":obj[prop].vat,
					"warehouseLocation":obj[prop].warehouseLocation,
					"thumbnailUrl":obj[prop].thumbnailUrl,
					"currencyType":"INR"
						
				  };
				  productsArry.push(productsObj);
				   ++count;
			}
		  
			data.cart.products = productsArry;
			return data;	
		},
        renderLiveInventory: function() {

            var data = {
                "type": "getInventory",
                "currSKU": "ACCESSORIES|A FIX|209|209-shirts|730-color~866-red%731-size~868-XL"
            };

            if (this.LiveInventory.set(data)) {

                this.LiveInventory.fetch({
                    async: true,
                    error: function(response) {
                        /*console.log("error: " + response);*/
                    },
                    success: function(model, response) {

                        var currQnty = parseInt(response.liveinventory.selectQuanity),
                            currSKUMaxAllowedQnty = parseInt(response.liveinventory.maxAllowedQuantity),
                            currSKUQnty = parseInt(response.liveinventory.maxAvailableQuantity),
                            totalAvailableQnty;

                        if (currSKUQnty === 0 && currSKUMaxAllowedQnty === 0) {
                            totalAvailableQnty = 0;
                        } else if (currSKUQnty < currSKUMaxAllowedQnty && currSKUQnty !== 0) {
                            totalAvailableQnty = currSKUQnty;
                        } else if (currSKUQnty < currSKUMaxAllowedQnty && currSKUQnty === 0) {
                            totalAvailableQnty = 1;
                        } else {
                            if (currSKUMaxAllowedQnty === 0 || currSKUQnty === 0) {
                                totalAvailableQnty = 1;
                            } else {
                                totalAvailableQnty = currSKUMaxAllowedQnty;
                            }
                        }

                        self.updateQntySelectBox(totalAvailableQnty, currQnty);
                    }
                });
            }
        },
        removeProduct: function(event) {
            event.preventDefault();
			$("#invalid-popup").removeClass('invalid').addClass('cartload');
        	$("#invalid-popup h2").text("Please wait while your product is being removed from cart");
    		$("#invalid-popup .row p").text("");
    		$.fancybox($('#invalid-popup'),{
    			 helpers : { 
    				  overlay : {closeClick: false}
    				},
    			 'afterShow'     : function () {
			            $('.fancybox-close').hide();
			        }
    		});
            var self = this,
                currProduct = $(event.currentTarget).closest(".cart-details.cart-main"),
                cartId = $.cookie("CARTID"),
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
              
                productData = {
	                	"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
	    				"productRequest":{
	    					"sellerSku":{
	    				"sKUId":currProduct.data("sku-id")
	    					}
    				}
    			};
				if(cartempData.cart.products.length == 1){		
				  $.removeCookie('FNY_CART');
				}
			
            if (self.deleteProduct.clear().set(productData)) {
                self.deleteProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        if (response.responseCode === "SUCCESS") {
                            /*self.render();*/
								location.reload();
								/*var existingCoupon = $('#globalVoucherRemovecoupn').attr('placeholder'),
								personalCoupn = $('#personalVoucherRemovecoupn').attr('placeholder');
								if(!(personalCoupn == "Coupon Code") || !(existingCoupon == "Coupon Code")){
									self.couponsReapply();
								}
								else {
									location.reload();
								}*/	
								
                            

                        } else {
                            /*console.log(response.domainResponse.errorMessage);*/
							location.reload();
                        }
                    }
                });
            }
        },
		timerRemoveProduct: function(productData) {
            
			$("#invalid-popup").removeClass('invalid').addClass('cartload');
        	$("#invalid-popup h2").text("Please wait while your product is being removed from cart");
    		$("#invalid-popup .row p").text("");
    		$.fancybox($('#invalid-popup'),{
    			 helpers : { 
    				  overlay : {closeClick: false}
    				},
    			 'afterShow'     : function () {
    			            $('.fancybox-close').hide();
    			        }
    		});
            var self = this;
                
			if(cartempData.cart.products.length == 1){		
				  $.removeCookie('FNY_CART');
			}
            if (self.deleteProduct.clear().set(productData)) {
                self.deleteProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        if (response.responseCode === "SUCCESS") { 
								location.reload();      

                        } else {
                            /*console.log(response.domainResponse.errorMessage);*/
							location.reload();
                        }
                    }
                });
            }
        },
        updateCart: function(event) {
            event.preventDefault();

            var self = this,
                cartProductList = $(".cart-area-inn .cart-details"),
                productArr = [],
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0;

            for (var i = 0; i < cartProductList.length; i++) {
                productArr.push({
                    "skuId": $(cartProductList[i]).data("sku-id"),
                    "quantity": parseInt($(cartProductList[i]).find("select.select").val()),
                    "eventId": $(cartProductList[i]).data("event-id"),
                    "categoryId": $(cartProductList[i]).data("category-id")
                });
            }

            var productData = {
                "cart": {
                    "products": productArr
                }
            };

            if (self.updateProduct.clear().set(productData)) {
                self.updateProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {

                        if (response.productCassandraWrapper.responseCode === "FAILURE") {
                            alert(response.productCassandraWrapper.errorMessage);
                        } else {
                            /*self.render();*/
                            location.reload();
                        }
                    }
                });
            }
        },
        updateProductInCart: function(event) {
            event.preventDefault();

            var self = this,
                /*cartProductList = $(".cart-area-inn .cart-details"),*/
                currProduct = $(event.currentTarget).closest(".cart-details"),
                productArr = [],
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0;

            for (var i = 0; i < currProduct.length; i++) {
                productArr.push({
                    "skuId": $(currProduct[i]).data("sku-id"),
                    "quantity": parseInt($(currProduct[i]).find(".select-wrapper.qty .select").val()),
                    "eventId": $(currProduct[i]).data("event-id"),
                    "categoryId": $(currProduct[i]).data("category-id")
                });
            }

            var productData = 
            
            {
                "deviceId": $.cookie($('#FnyCustomToken').data('tokenid')),
                "pinCode" : $.cookie('COOKIE_PINCODE_DELIVERABLE'),
                "customerId" : $.cookie('COOKIE_FNY_CUSTOMER_ID'),                       
                "productRequest":
                    {
                         "webshopId" : $(currProduct).data('vendorprd-id'),
                         "sellerSku": {
                           "sKUId": $(currProduct).data('sku-id')
                           },
                 "quantity":parseInt($(currProduct).find(".select-wrapper.qty .select").val())
                                      
                }   
            };         
            
           
            if (self.updateProduct.clear().set(productData)) {
                self.updateProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {

                        if (response.responseCode === "FAILURE") {
                           // alert(response.productCassandraWrapper.errorMessage);
                        } else {
                            /*self.render();*/
						    
                            location.reload();
							
                        }
                    }
                });
            }
        },
        updateQntySelectBox: function(totalAvailableQnty, selectedQnty) {

            var qntyList = "";
            for (var i = 1; i <= totalAvailableQnty; i++) {

                if (i === selectedQnty) {
                    qntyList += "<option value='";
                    qntyList += i;
                    qntyList += "' selected='selected'>";
                    qntyList += i;
                    qntyList += "</option>";

                } else {
                    qntyList += "<option value='";
                    qntyList += i;
                    qntyList += "'>";
                    qntyList += i;
                    qntyList += "</option>";
                }
            }
            return qntyList;
        },
        updateSizeSelection : function(e){
			e.preventDefault();
			$("#invalid-popup").removeClass('invalid').addClass('cartload');
        	$("#invalid-popup h2").text("Please wait while your cart is being updated");
    		$("#invalid-popup .row p").text("");
    		$.fancybox($('#invalid-popup'),{
    			 helpers : { 
    				  overlay : {closeClick: false}
    				},
    			 'afterShow'     : function () {
    			            $('.fancybox-close').hide();
    			            
    			        }
    		});
			
			var self = this, updateData,newSku,oldSku,currProduct = $(e.currentTarget).closest(".cart-details"),
			quantity;
			quantity = $(e.currentTarget).parent().parent().find('.save').val();
			newSku= $(e.currentTarget).find("option:selected").attr('id');
			
			oldSku = $(currProduct).data("sku-id"),
			updateData= {
						"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
						"productRequest":
						{
							"webshopId":$(currProduct).data('vendorprd-id'),
							"sellerSku":{
								"sKUId":newSku
							},
							"quantity":quantity,
							"oldVarientSkuId":oldSku
													
						}	
					};
			
			if (self.cartSizeUpdate.clear().set(updateData)) {
				self.cartSizeUpdate.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                    	
                        if (response.responseCode === "SUCCESS") {
							//console.log("updated successfully : "+response);
						    location.reload();
                           
                        } else {
                            $("#invalid-popup").addClass('invalid');
							$("#invalid-popup h2").text("Quantity for selected size is unavailable");
							$("#invalid-popup .row p").text("");
							$.fancybox($('#invalid-popup'),{
								 helpers : { 
									  overlay : {closeClick: false}
									}
							});
                        }
                    }
                });
            }
			
		},
		couponsReapply: function(){
			var self = this ,
			existingCoupon = $('#globalVoucherRemovecoupn').attr('placeholder'),
			personalCoupn = $('#personalVoucherRemovecoupn').attr('placeholder');
			
			var voucherObj = { 
				"globalVoucher":"",
				"personalVoucher" : "",
				};
			
			if(existingCoupon != "Coupon Code" ){
				
				console.log("into if block---");
				voucherObj.globalVoucher = existingCoupon;
				$.cookie('existingCoupon', JSON.stringify(voucherObj), {
					expires: 1,
					path: '/'
				});
				
				var cartaction = $('#cartorderDetails').val();
				var self = $('#globalOffersBox .remove-offer');
				
				var tempGlobalVoucher = JSON.parse($.cookie('existingCoupon'));
				
				var actionVal = document.getElementById('removeCouponId').value;
				var couponVal = $('.removecoupn').data('value');
				var couponIdurl = document.getElementById('couponIdurl').value;
				
				 $.ajax({
						url :couponIdurl,            
						  data: {"coupon":existingCoupon,"action":actionVal},
						  type: "POST",
						  dataType: "json",
						  beforeSend: function(){
							  
							  $('#globalOffersBox .loading-msg').css('visibility','visible');
							  $('#globalOffersBox #coupon-box').css('display','none');
							
						  },
						success: function(data) {
							$('#globalOffersBox .loading-msg').css('visibility','hidden');
							$('#globalOffersBox #coupon-box , .coupon').css('display','block');
							$(self).parent().parent().find('.loading-msg ').css('visibility','hidden','position','absolute');
							$(self).parent().find('form').css('display','block');
							if (data.domainResponse.responseCode === "SUCCESS") {
								$('#globalOffersBox #newremoveformapply1').css('display','none');
								$('#globalOffersBox #newformapply1').css('display','block');
								$(self).css('display','none');
								$('#globalOffersBox .apply-offer').css('display','block');
									$.ajax({
										url :$('#cartactionurl').val(),            
										  data:{"action":cartaction},
										  type: "GET",
										  dataType: "json",
										success: function(data) { 
											
											$('#globalOffersBox #newformapply1 input[type="text"]').val('').focus();
											
											
											 $('#rewardsAvailableBalance').html('('+data.RewardsData+' Points)');
											 $('#creditsAvailableBalance').html('(INR '+data.CreditsData+' )');
											 $('#total-prdt-val').html('INR '+data.CartData.cart.totalBasePrice);
											 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.CartData.cart.youSaveValue);
											 $('.total-area #youPayVal').html('INR '+data.CartData.cart.youPayValue);
											 $('.moresaving #moresaveVal').html('INR'+data.CartData.cart.youSaveValue);
										}
									});
									
									
								//Again adding coupons-----
									
											var self = $('#globalOffersBox #appyPromoCupnCode'),
											totalCartValue = $('.total-area #youPayVal').html().split(' ').pop(-1);
											var actionVal = document.getElementById('actionCouponId').value;
											var couponVal = document.getElementById('promoCouponId').value;
											var couponIdurl = document.getElementById('couponIdurl').value;
											$.ajax({
												url :couponIdurl,            
												  data: {"coupon":existingCoupon,"action":actionVal},
												  type: "POST",
												  dataType: "json",
												  beforeSend: function(){
													  $('#globalOffersBox .loading-msg').css('visibility','visible');
													  $('#globalOffersBox #coupon-box').css('display','none');
													
												  },
												success: function(data) {
													$('#globalOffersBox .loading-msg').css('visibility','hidden');
													$('#globalOffersBox #coupon-box , .coupon').css('display','block');
													$(self).parent().parent().parent().find('.loading-msg ').css('visibility','hidden','position','absolute');
													$(self).parent().find('form').css('display','block');
													if (data.domainResponse.responseCode === "SUCCESS") {
														$('#globalOffersBox #newformapply1').css('display','none');
														$('#globalOffersBox #newremoveformapply1').css('display','block');
														$(self).css('display','none');
														$('#globalOffersBox .remove-offer').css('display','block');
															$.ajax({
																 url :$('#cartactionurl').val(),            
																  data:{"action":cartaction},
																  type: "GET",
																  dataType: "json",
																  success: function(data) {   	
																	$.each(data.CartData.cart.promotions ,function(index , data){
																		if(index == 'voucherCode'){
																			$('#globalOffersBox .removecoupn').attr('placeholder',data);
																			$('#globalOffersBox .removecoupn').data('value',data);
																			
																		}
																	});
																	
																	 $('#rewardsAvailableBalance').html('('+data.RewardsData+' Points)');
																	 $('#creditsAvailableBalance').html('(INR '+data.CreditsData+' )');
																	 $('#total-prdt-val').html('INR '+data.CartData.cart.totalBasePrice);
																	 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.CartData.cart.youSaveValue);
																	 $('.total-area #youPayVal').html('INR '+data.CartData.cart.youPayValue);
																	 $('.moresaving #moresaveVal').html('INR '+data.CartData.cart.youSaveValue);
									
																		

																		
																		 if(data.CartData.cart.youSaveValue == "0.00"){
																			 
																				$("#invalid-popup h2").text("Promo code is Not Applicable for this product");
																				$("#invalid-popup .row p").text("");
																				$.fancybox($('#invalid-popup'),{
																					 helpers : { 
																						  overlay : {closeClick: false}
																						},
																					 'afterShow'     : function () {
																							   
																								
																							}
																				});
																				 
																		} 
																		 
																		// else if(!($.cookie('pageUrlData').split('/').pop(-1) === 'cart')){
																			/*if(data.CartData.cart.youSaveValue == $.cookie('cartTotalValue')){
																				$("#invalid-popup h2").text("Promo code is Not Applicable for this product");
																				$("#invalid-popup .row p").text("");
																				$.fancybox($('#invalid-popup'),{
																					 helpers : { 
																						  overlay : {closeClick: false}
																						},
																					 'afterShow'     : function () {
																							   
																								
																							}
																				});
																			}*/	 
																	   //	} 
																		else{
																		
																			 $.cookie('cartTotalValue', data.CartData.cart.youSaveValue, {
																				 expires: 1,
																				 path: '/'
																			 });
																		}
																	 }
															});
															
															
										
														
										
													} else {
														$("#invalid-popup h2").text('Invalid Voucher code or Insufficient cart balance');
														$("#invalid-popup .row p").text("");
														$.fancybox($('#invalid-popup'),{
															helpers : { 
																 overlay : {closeClick: false}
															   },
															'afterShow'     : function () {
																	   $('#globalOffersBox #newformapply1 input[type="text"]').val('').focus();
																	   
																   }
													   });
													
													   var tempCartUrl = URL_PROPERTIES.get('GET_CART').replace("{deviceId}",  $.cookie($('#FnyCustomToken').data('tokenid')));
													   
														$.ajax({
															method : "GET",
															url : tempCartUrl,
															dataType : 'json',
															async : false
														})
														.done(function(data) {
														
															 $('#total-prdt-val').html('INR '+data.cart.totalBasePrice);
															 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.cart.youSaveValue);
															 $('.total-area #youPayVal').html('INR '+data.cart.youPayValue);
															 $('.moresaving #moresaveVal').html('INR'+data.cart.youSaveValue);

														});
														
														 
														 
													}
													location.reload();  
												}
											});
								
								//End addition
							
							
								
									

							} else 
							{
								/*$("#invalid-popup h2").text('Invalid Voucher code or Insufficient cart balance');
								$("#invalid-popup .row p").text("");
								$.fancybox($("#invalid-popup"));*/
							 
								location.reload();
								
							}
							
						}
					});
				
				
			}
			
			if(personalCoupn != "Coupon Code"){
				
				
				voucherObj.personalVoucher = personalCoupn;
				
				$.cookie('existingCoupon', JSON.stringify(voucherObj), {
					expires: 1,
					path: '/'
				});
				
				 cartaction = $('#cartorderDetails').val();
				 var self = $('#personalOffersBox .remove-offer');
				
				  var actionVal = document.getElementById('removePersonalVoucher').value;
				  var couponVal = $('#personalOffersBox .removecoupn').data('value');
				  var couponIdurl = $('#personalOffersBox .couponIdurl').val();
					var tempPersonalVoucher = JSON.parse($.cookie('existingCoupon'));
					 $.ajax({
							url :$('#personalOffersBox #couponIdurl').val(),            
							  data: {"coupon":personalCoupn,"action":actionVal},
							  type: "POST",
							  dataType: "json",
							  beforeSend: function(){
								  
								  $('#personalOffersBox .loading-msg').css('visibility','visible');
								  $('#personalOffersBox #coupon-box').css('display','none');
								
							  },
						success: function(data) {
							$('#personalOffersBox .loading-msg').css('visibility','hidden');
							$('#personalOffersBox #coupon-box , .coupon').css('display','block');
							$(self).parent().parent().find('.loading-msg ').css('visibility','hidden','position','absolute');
							$(self).parent().find('form').css('display','block');
							if (data.domainResponse.responseCode === "SUCCESS") {
								$('#personal-voucher-box #newremoveformapply1').css('display','none');
								$('#personal-voucher-box #newformapply1').css('display','block');
								$(self).css('display','none');
								$('#personal-voucher-box .apply-offer').css('display','block');
									$.ajax({
										url :$('#Globalcartactionurl').val(),            
										  data:{"action":cartaction},
										  type: "GET",
										  dataType: "json",
										success: function(data) {   	
											$("#personal-voucher-box select option:selected").prop("selected", false);
											$('#rewardsAvailableBalance').html('('+data.RewardsData+' Points)');
											 $('#creditsAvailableBalance').html('(INR '+data.CreditsData+' )');
											 $('#total-prdt-val').html('INR '+data.CartData.cart.totalBasePrice);
											 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.CartData.cart.youSaveValue);
											 $('.total-area #youPayVal').html('INR '+data.CartData.cart.youPayValue);
											 $('.moresaving #moresaveVal').html('INR'+data.CartData.cart.youSaveValue);
											 
											 
										}
									});
									
									
								//Again adding coupons-----
									
											var self = $('#personalOffersBox #applyPersonalVoucher');
											var personalVouchData = $(self).parent().find('select option:selected').html();
											var actionVal = $('#actionVoucherId').val();
											var couponVal = document.getElementById('personnelVoucherId').value;
											var couponIdurl = document.getElementById('VoucherUrl').value;
											$.ajax({
												url :couponIdurl,            
												  data: {"coupon":personalCoupn,"action":actionVal},
												  type: "POST",
												  dataType: "json",
												  beforeSend: function(){
													  
													  $('#personal-voucher-box .loading-msg').css('visibility','visible');
													  $('#personal-voucher-box #coupon-box').css('display','none');
													
												  },
												success: function(data) {
													$('#personal-voucher-box .loading-msg').css('visibility','hidden');
													$('#personal-voucher-box #coupon-box , .coupon').css('display','block');
													$(self).parent().parent().parent().find('.loading-msg ').css('visibility','hidden','position','absolute');
													$(self).parent().find('form').css('display','block');
													if (data.domainResponse.responseCode === "SUCCESS") {
														$('#personal-voucher-box #newformapply1').css('display','none');
														$('#personal-voucher-box #newremoveformapply1').css('display','block');
														$(self).css('display','none');
														$('#personal-voucher-box .remove-offer').css('display','block');
															$.ajax({
																url :$('#Globalcartactionurl').val(),            
																  data:{"action":cartaction},
																  type: "GET",
																  dataType: "json",
																success: function(data) {  
																	
																	
																		$('#personal-voucher-box .removecoupn').attr('placeholder', data.CartData.cart.promotions.voucherCode);
																		$('#personal-voucher-box .removecoupn').attr('data-value', data.CartData.cart.promotions.voucherCode);
												
																		 $('#rewardsAvailableBalance').html('('+data.RewardsData+' Points)');
																		 $('#creditsAvailableBalance').html('(INR '+data.CreditsData+' )');
																		 $('#total-prdt-val').html('INR '+data.CartData.cart.totalBasePrice);
																		 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.CartData.cart.youSaveValue);
																		 $('.total-area #youPayVal').html('INR '+data.CartData.cart.youPayValue);
																		 $('.moresaving #moresaveVal').html('INR'+data.CartData.cart.youSaveValue);
																	
																	
																	 
																			
																	
																}
															});
															
															

														

													} else {

														/*$("#invalid-popup h2").text('Invalid Voucher code or Insufficient cart balance');
														$("#invalid-popup .row p").text("");
														$.fancybox($("#invalid-popup"));*/
														
														 $.ajax({
															method : "GET",
															url : tempCartUrl,
															dataType : 'json',
															async : false
														})
														.done(function(data) {
														
															 $('#total-prdt-val').html('INR '+data.cart.totalBasePrice);
															 $('.product-value-label #prdtSaveVal').html('(-) INR '+data.cart.youSaveValue);
															 $('.total-area #youPayVal').html('INR '+data.cart.youPayValue);
															 $('.moresaving #moresaveVal').html('INR'+data.cart.youSaveValue);

														});
														
														
													}
													  
												}

											});
								
								//End addition
								
								location.reload();
								
									

							} else 
							{
								/*$("#invalid-popup h2").text('Invalid Voucher code or Insufficient cart balance');
								$("#invalid-popup .row p").text("");
								$.fancybox($("#invalid-popup"));*/
								
								location.reload(); 

							}
							  
						}
					});
				
				
			
				
			}
		}
    });

})();