/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    var currSKUQnty;
    Webshop.Views.CartContentView = Backbone.View.extend({
    	templates: {
            herobanner: JST['app/scripts/templates/herobanner.hbs']
        },
        el: '#backbone-portlet-cart-content',
        events: {
            "click .cart-details .cart-remove": "removeProduct",
            "click .update-cart": "updateCart",
            "click .save-cart": "updateProductInCart",
            "change .size" : "updateSizeSelection"
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.getCart = new Webshop.Models.GetCart();
            this.LiveInventory = new Webshop.Models.LiveInventory();
            this.deleteProduct = new Webshop.Models.DeleteProduct();
            this.updateProduct = new Webshop.Models.AddProduct();
            this.cartSizeUpdate = new Webshop.Models.CartSizeUpdate();
        },
        render: function() {

            var self = this;

            self.cartContent.clear();
            self.cartContent.fetch({

                error: function(response) {
                    /*console.log("error: " + response);*/
                },
                success: function(model, response) {

                    var data = response,
                        products = [],
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

                    $(self.el).html(Handlebars.templates.cartcontent(data));
					
					//var selectedSize="";
					//alert('arun'+data.cart.products.length) ;
						if(data.cart.products.length){
				
							for(var i=0;i<data.cart.products.length;i++){
								$("#"+data.cart.products[i].productId+" .size option").attr("selected", false);
								 var erpSku =  data.cart.products[i].erpSku;
								 selectedSize = erpSku.split(/-(.+)?/)[1];
								 //$(".size option[value='"+selectedSize+"']").prop("selected","selected").parents;
								 $(".size option[value='"+selectedSize+"']").prop("selected","selected").parents("#"+data.cart.products[i].productId).find('.size').removeClass('size');
								 
							}
							
						}else{
							$(".size option").attr("selected", false);
							var erpSku =  data.cart.products.erpSku;
							selectedSize = erpSku.split(/-(.+)?/)[1];
							$(".size option[value='"+selectedSize+"']").prop("selected","selected");
						}

                    if(data.cart.products.length){
                            if(data.cart.products.length < 5){
                                $('.cart-action-area').find('.cont-shopping').hide();
                            }else{
                                $('.cart-action-area').find('.cont-shopping').show();
                            }
                        }else{
                            $('.cart-action-area').find('.cont-shopping').hide();
                        }

                    productSelectBoxList = $(".cart-details .select-wrapper.qty select.select");
                    cartProductList = $(".cart-details.cart-main");
                    
					
                   
                    

                    setTimeout(function() {

                        $.each(cartProductList, function(i, element) {

                            productTimerArr.push(parseInt($(element).data("timer")));

                            $(element).find(".cart-item-timer").countdown(getTimeToexpire($(element).data("timer"))).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' mins'));
                            }).on('finish.countdown', function() {

                                $(this).html('00:00:00 mins');
                                setTimeout(function() {
                                    self.render();
                                }, 30000);
                            });

                        });

                        cartTimerLeft = getTimeToexpire(Array.min(productTimerArr));

                        if (productTimerArr.length > 0) {
                            $('#cartTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' mins'));
                            }).on('finish.countdown', function() {
                                $(this).html('00:00:00 mins');
                                /*self.render();*/
                            });
                        }

                    }, 500);

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

                    if ($("#backbone-portlet-order-summary")) {
                        $("#backbone-portlet-order-summary").html(Handlebars.templates.ordersummary(data));
                    }

                    if (products.length === 0) {
                        $(".order-sum-box #checkoutBtn").attr("href", "#").css("cursor", "default");
                    } else {
                        $(".order-sum-box #checkoutBtn").attr("href", "/billing").css("cursor", "pointer");
                    }
                }
            });

        },
        updateSelectedSize: function(){
        	
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
            var self = this,
                currProduct = $(event.currentTarget).closest(".cart-details.cart-main"),
                cartId = $.cookie("CARTID"),
                customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
                productData = {
                    "cart": {
                        "cartId": cartId,
                        "products": [{
                            "productId": currProduct.data("product-id"),
                            "inventoryId": currProduct.data("inventory-id"),
                            "quantity": parseInt(currProduct.data("qnty"))
                        }],
                        "customer": {
                            "customerId": customerId
                        }
                    }
                };

            if (self.deleteProduct.clear().set(productData)) {
                self.deleteProduct.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        if (response.domainResponse.responseCode === "SUCCESS") {
                            /*self.render();*/
                            location.reload();

                        } else {
                            /*console.log(response.domainResponse.errorMessage);*/
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
			
			var self = this, updateData,newSku,oldSku,currProduct = $(event.currentTarget).closest(".cart-details"),
			quantity= $(event.currentTarget).closest(".save").val();
			newSku = $(e.currentTarget).val();
			oldSku = $(currProduct[i]).data("sku-id"),
			updateData= {"cart":
							{"params":
								[{"key":"oldSku","value": oldSku},
								  {"key":"newSku","value": newSku},
								  {"key":"quantity","value": quantity}
								]
							}
						};
			if (self.cartSizeUpdate.clear().set(updateData)) {
				self.cartSizeUpdate.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                    	self.render();
                        location.reload();
                        /*if (response.productCassandraWrapper.responseCode === "FAILURE") {
                            alert(response.productCassandraWrapper.errorMessage);
                        } else {
                            self.render();
                            location.reload();
                        }*/
                    }
                });
            }
			
		}
    });
    return CartContentView;
});
