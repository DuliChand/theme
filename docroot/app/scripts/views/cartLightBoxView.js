/*global Webshop, Backbone, JST*/
var cartlightboxData ; 
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    var currSKUQnty;
    Webshop.Views.CartLightBoxView = Backbone.View.extend({
        templates: {
            cartlightbox: JST['app/scripts/templates/cartlightbox.hbs']
        },
        el: '#cartLightBox',
        events: {
            
                "mouseover .bag-out" : "showCartLightBox",
                "mouseover .cart-overlay" : "cartToggle",
                "click .cart-overlay" : "cartToggle",
                "click .edit-product" : "editProduct",
                "click .update-product" : "updateProductInCart",
                "click .delete-product" : "removeProduct",
                "click .search-icon-sticky" : "togglemobileSearch",
                "click .cartddwn-cross" : "cartToggle",

            /*'click .dropdown-backdrop' : 'toggleCart',*/
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.getCart = new Webshop.Models.GetCart();
            this.liveInventory = new Webshop.Models.LiveInventory();
            this.deleteProduct = new Webshop.Models.DeleteProduct();
            this.updateProduct = new Webshop.Models.UpdateProduct();
        },
        render: function(data) {

            /*console.log("cart lightbox data rendering:----- ");*/   
            var self = this,
                cartExpirePopupTime = "05:00";         
                    /*console.log("response:--- ");
						console.log(response);
						
						console.log("response data:---> " + JSON.stringify(response));
						console.log("response.cart.cartId: " + response.cart.cartId);
						console.log("response.cart.grandOrderValue: " + response.cart.grandOrderValue);*/

      
                     var   products = [],
                        totalProductsInCart,
                        cartProductList, productSelectBoxList, productTimerList = [],
                        cartTimerLeft = "",
                        productTimerArr = [];

                    if (data.cart.products) {
                        if (data.cart.products.length) {
                            products = data.cart.products;
                        } else {
                            products.push(data.cart.products);
                        }
                        totalProductsInCart = parseInt(data.cart.products.length);
                    }
					
					console.log(JSON.stringify(data));
                    $("#cartLightBox").html(self.templates.cartlightbox(data));
                    /*var cartLength = $('.mCSB_container .cart-details').length;
                    console.log("cart length" + cartLength);
                       if(cartLength > 1){

                           $('.mCSB_container .cart-details:first-child').remove();
                           $('.cart-btm-sep').remove(); 
                         
                          
                            console.log("cart length remove one" );
                       }
                       else if(cartLength == 1){
                        $("#cartLightBox").html(self.templates.cartlightbox({}));
                         console.log("cart length = " + cartLength + "less then" );
                        }*/

                    productSelectBoxList = $(".cart-details .prod-qty.selectable");
                    cartProductList = $(".cart-details.cart-lightbox");

                    setTimeout(function() {

                        $.each(cartProductList, function(i, element) {

                            productTimerArr.push(parseInt($(element).data("createdtime")));

                            $(element).find(".cartprod-timer").countdown(newCartTimeExpire($(element).data("createdtime"),$(element).data("timer"))).on('update.countdown', function(event) {

                                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                                if (event.strftime('%M:%S') === cartExpirePopupTime) {

                                    $.fancybox.close(true);
                                    $.fancybox($("#cart-product-expire-popup"));
                                }

                            }).on('finish.countdown', function() {
                                
                                var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
                                urlBase = URL_PROPERTIES.get('GET_CART'),
                                urlRoot = urlBase.replace("{deviceId}", fnyToken);
                                var cartBodyObj = {"deviceId":fnyToken,"pullInventory":false};
                                $.ajax({
                                    url : urlRoot,
                                    type : 'POST',
                                    contentType : 'application/json; charset=utf-8',
									data: JSON.stringify(cartBodyObj),
                                    dataType : 'json',
                                    async : true,
                                    success: function(response){
                                        
                                        if(response){
                                            
                                            var cartLightBoxReload = new Webshop.Views.CartLightBoxView();
                                            cartLightBoxReload.render(response);
                                            //console.log("cartLightBox reload");
                                        }
                                    }
                                });
            
                                  //$(this).html('00:00:00 minutes left');

                                setTimeout(function() {
                                    self.render();
                                }, 30000);

                            });

                        });

                        cartTimerLeft = newCartTimeExpire(Array.min(productTimerArr),2700);

                        if (productTimerArr.length > 0) {
                            $('#cartDDTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                            }).on('finish.countdown', function() {
                                                               
                                $(this).html('00:00:00 minutes left');
                                /*self.render();*/
                            });

                            $('#cartHeaderTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' Mins'));
                            }).on('finish.countdown', function() {
                                
                                $(this).html('00:00:00 Mins');
                                /*self.render();*/
                            });

                            $('#cartTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' Mins'));
                            }).on('finish.countdown', function() {
                                 
                                $(this).html('00:00:00 Mins');
                                /*self.render();*/
                            });;


                               
                        }

                        if ($(".cartddwn-btm").length > 0) {
                            $(".cartddwn-btm").mCustomScrollbar();
                        }

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

                    }, 500);


        },
		cartProductslightBox: function(data){
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
				  productsArry.push(productsObj)
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

                    error: function(response) {
                        /*console.log(response);*/
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

                        self.updateQntySelectBox(totalAvailableQnty, currQnty)
                    }
                });
            }
        },
        removeProduct: function(event) {

            event.preventDefault();
            event.stopPropagation();
			
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
                currProduct = $(event.currentTarget).closest(".cart-details.cart-lightbox"),
                cartId = $.cookie("CARTID"),
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
                 productData = {
					"cartId":currProduct.data("cart-id"),
					"productRequestWrapper":{
						"skuId":currProduct.data("sku-id")
					}
				};

            if (self.deleteProduct.clear().set(productData)) {
                self.deleteProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        if (response.responseCode === "SUCCESS") {
                            /*self.render2();*/
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
                            alert(response.domainResponse.errorMessage);
                        }
                    }
                });
            }

        },
        /*showCartLightBox: function(e) {

            e.preventDefault();
            e.stopPropagation();

            $(".cart-dropdown").toggle();
            $(".cart-overlay").show();

            setTimeout(function() {
                $(".cartddwn-btm").mCustomScrollbar("update");
            }, 100);
        },*/

        /*cartToggle: function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(".cart-dropdown").hide();
            $(".cart-overlay").hide();
        },*/

        editProduct: function(event) {

            event.preventDefault();
            event.stopPropagation();

            $(event.currentTarget).hide();
            $(event.currentTarget).closest('.cart-details.cart-lightbox').find(".action-link.delete-product").show();
            $(event.currentTarget).closest('.cart-details.cart-lightbox').find(".action-link.update-product").show();

            $(event.currentTarget).closest(".cart-details.cart-lightbox").find(".prod-qty").hide();
            $(event.currentTarget).closest(".cart-details.cart-lightbox").find(".prod-qty.selectable").show();

        },
        togglemobileSearch: function(e) {
            e.preventDefault();
            $(".mobile-search").toggle();
        },
        updateProductInCart: function(event) {

            event.preventDefault();
            event.stopPropagation();

            var self = this,
                currProduct = $(event.currentTarget).closest(".cart-details"),
                productArr = [],
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0;

            for (var i = 0; i < currProduct.length; i++) {
                productArr.push({
                    "skuId": $(currProduct[i]).data("sku-id"),
                    "quantity": parseInt($(currProduct[i]).find(".prod-qty.selectable").val()),
                    "eventId": $(currProduct[i]).data("event-id"),
                    "categoryId": $(currProduct[i]).data("category-id")
                });
            }

            var productData = {
                "cart": {
                    "customer": {
                        "customerId": customerId
                    },
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
                            /*console.log(response.productCassandraWrapper.errorMessage);*/
                        } else {
                            window.location.href = "/cart";
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
				
				
				console.log("personal cupon  if block---");
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
