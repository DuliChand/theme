/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.cartLightboxcartLightBoxView = Backbone.View.extend({

        template: JST['app/scripts/templates/cartLightBox.hbs'],

                    el : '#backbone-portlet-cart-lightbox',
            events : {
                "click .bag-out" : "showCartLightBox",
                "click .edit-product" : "editProduct",
                "click .update-product" : "updateProductInCart",
                "click .delete-product" : "removeProduct",
                /*'click .dropdown-backdrop' : 'toggleCart',*/
            },
            initialize : function() {
                _.bindAll(this, 'render');
                this.cartLightBox = new CartLightBox();
                this.deleteProduct = new DeleteProduct();
                this.updateProduct = new AddProduct();
            },
            render : function() {
                
                var self = this;
                self.cartLightBox.clear();              
                self.cartLightBox.fetch({
                    
                    error : function(response) {
                        console.log(response);
                    },
                    success : function(model, response) {
                        
                        var data = model.toJSON(),
                            products = [], 
                            totalProductsInCart,
                            cartProductList, productSelectBoxList, productTimerList = [], cartTimerLeft = "", productTimerArr = [];
                        
                        if(data.cart.products) {
                            if(data.cart.products.length) {
                                products = data.cart.products;
                            } else {
                                products.push(data.cart.products);
                            }
                            totalProductsInCart = parseInt(data.cart.products.length);
                        }
                        
                        $(self.el).html(Handlebars.templates.cartlightbox(data));
                        
                        productSelectBoxList = $(".cart-details .prod-qty.selectable");
                        cartProductList = $(".cart-details.cart-lightbox");
                    
                        $.each( cartProductList, function( i, element ) {
                            
                            productTimerArr.push( parseInt($(element).data("timer")) );
                            
                            $(element).find(".cartprod-timer").countdown( getTimeToexpire($(element).data("timer")) ).on('update.countdown', function(event) {
                                
                                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                                if(event.strftime('%M:%S') === '05:00') {
                                    
                                    $.fancybox.close(true);
                                    $.fancybox($("#cart-product-expire-popup"));
                                }
                                
                            }).on('finish.countdown', function() {
                                self.render();
                            });
                            
                        });
                        
                        cartTimerLeft = getTimeToexpire(Array.max(productTimerArr));
                        
                        if(productTimerArr.length > 0 ) {
                            $('#cartDDTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                            }).on('finish.countdown', function() {
                                self.render();
                            });
                            
                            $('#cartHeaderTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' Mins'));
                            }).on('finish.countdown', function() {
                                self.render();
                            });
                            
                            $('#cartTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' Mins'));
                            });
                        }
                        if($(".cartddwn-btm").length > 0) {
                            $(".cartddwn-btm").mCustomScrollbar();
                        }
                        
                        for(var i=0;i<productSelectBoxList.length;i++) {
                            var currQnty = parseInt(products[i].quantity),
                                totalAvailableQnty = parseInt(currQnty + products[i].maxAvailableQuantity);
                            
                            $(productSelectBoxList[i]).html(updateQntySelectBox(totalAvailableQnty, currQnty));
                        }
                        
                    }
                });
    
            },
            
            /*toggleCart : function(e) {
                e.preventDefault();
                $(".dropdown.pull-right").removeClass("open")
                $(".dropdown-backdrop").hide();
                $(".cart-dropdown").hide();
            },*/
            
            render2 : function() {
                var self = this;
                self.cartLightBox.clear();              
                self.cartLightBox.fetch({
                    
                    error : function(response) {
                        console.log(response);
                    },
                    success : function(model, response) {
                        
                        var data = model.toJSON(),
                            products = [],
                            cartProductList, productSelectBoxList, productTimerList = [], cartTimerLeft = "", productTimerArr = [];
                        
                        if(data.cart.products) {
                            if(data.cart.products.length) {
                                products = data.cart.products;
                            } else {
                                products.push(data.cart.products);
                            }
                            /*totalProductsInCart = parseInt(data.cart.products.length);*/
                        }
                        
                        $(self.el).html(Handlebars.templates.cartlightbox(data));
                        
                        productSelectBoxList = $(".cart-details .prod-qty.selectable");
                        cartProductList = $(".cart-details");
                        
                        
                        if(data.productTimer != undefined) {
                            
                            productTimerList = data.productTimer;                           
                            
                            $.each( cartProductList, function( i, element ) {
                                
                                productTimerArr.push( parseInt(productTimerList[i].timeToExpire) );
                                
                                for (var j=0;j<productTimerList.length;j++) {
                                    
                                    if(productTimerList[j].skuId === $(element).data("sku-id")) {

                                        $(element).find(".cart-item-timer").countdown( getTimeToexpire(productTimerList[j].timeToExpire) ).on('update.countdown', function(event) {
                                            $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                                        }).on('finish.countdown', function() {
                                            self.render();
                                        });
                                        
                                    }
                                }
                            });
                            
                            cartTimerLeft = getTimeToexpire(Array.max(productTimerArr)); 
                            
                            $('#cartDDTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
                            }).on('finish.countdown', function() {
                                self.render();
                            });
                            
                            $('#cartHeaderTimer').countdown(cartTimerLeft).on('update.countdown', function(event) {
                                $(this).html(event.strftime('%H:%M:%S' + ' mins'));
                            }).on('finish.countdown', function() {
                                self.render();
                            });
                            
                        }
                        
                        if($(".cartddwn-btm").length > 0) {
                            $(".cartddwn-btm").mCustomScrollbar();
                        }
                        
                        for(var i=0;i<productSelectBoxList.length;i++) {
                            var currQnty = parseInt(products[i].quantity),
                                totalAvailableQnty = parseInt(currQnty + products[i].maxAvailableQuantity);
                            
                            $(productSelectBoxList[i]).html(updateQntySelectBox(totalAvailableQnty, currQnty));
                        }
                        
                        self.showCartLightBox();
                    }
                });
            },
            renderLiveInventory : function() {
    
                var data = {
                    "type" : "getInventory",
                    "currSKU" : "ACCESSORIES|A FIX|209|209-shirts|730-color~866-red%731-size~868-XL"
                };
    
                if (this.LiveInventory.set(data)) {
    
                    this.LiveInventory.fetch({
    
                        error : function(response) {
                            console.log(response);
                        },
                        success : function(model, response) {
    
                            currSKUQnty = response.liveinventory.selectQuanity;
                            
                            updateQntySelectBox(currSKUQnty);
                        }
                    });
                }
            },
            removeProduct : function(event) {
                
                event.preventDefault();
                event.stopPropagation();
                
                var self = this,
                    currProduct = $(event.currentTarget).closest(".cart-details.cart-lightbox"),
                    cartId = $.cookie("CARTID"),
                    customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0,
                    productData = {
                        "cart" : {
                            "cartId": cartId,
                            "products" : [{
                                "productId" : currProduct.data("product-id"),
                                "inventoryId" : currProduct.data("inventory-id"),
                                "quantity" : parseInt(currProduct.data("qnty"))
                            }],
                            "customer": {
                                "customerId" : customerId
                            }
                        }
                    };
                
                if (self.deleteProduct.clear().set(productData)) {
                    self.deleteProduct.fetch({
                        error: function (response) {
                            console.log(response);
                        },
                        success: function (model, response) {
                            if(response.domainResponse.responseCode === "SUCCESS"){                             
                                /*self.render2();*/
                                location.reload();
                                
                            } else {
                                alert(response.domainResponse.errorMessage);
                            }
                        }
                    });                         
                }
                
            },
            showCartLightBox : function(e) {
                
                e.preventDefault();
                
                /*$(".popup").hide();*/
                $(".cart-dropdown").toggle();
                
                setTimeout(function() {
                    $(".cartddwn-btm").mCustomScrollbar("update");
                }, 100);
            },
            editProduct : function(event) {
                
                event.preventDefault();
                event.stopPropagation();
                
                $(event.currentTarget).hide().siblings(".action-link").show();
                
                $(event.currentTarget).closest(".cart-details").find(".prod-qty").hide();
                $(event.currentTarget).closest(".cart-details").find(".prod-qty.selectable").show();
                
            },
            updateProductInCart : function(event) {
                
                event.preventDefault();
                event.stopPropagation();
                
                var self = this,
                    currProduct = $(event.currentTarget).closest(".cart-details"),
                    productArr = [],
                    customerId = ($.cookie('COOKIE_FNY_CUSTOMER_ID')) ? $.cookie('COOKIE_FNY_CUSTOMER_ID') : 0;
                
                for(var i=0;i<currProduct.length;i++) {
                    productArr.push({
                        "skuId": $(currProduct[i]).data("sku-id"),
                        "quantity": parseInt($(currProduct[i]).find(".prod-qty.selectable").val()),
                        "eventId" : $(currProduct[i]).data("event-id"),
                        "categoryId" : $(currProduct[i]).data("category-id")
                    });
                }
                
                var productData = {
                    "cart" : {
                        "customer" : {
                            "customerId" : customerId
                        },
                        "products" : productArr
                    }
                };  
                    
                if (self.updateProduct.clear().set(productData)) {
                    self.updateProduct.fetch({
                        error: function (response) {
                            console.log(response);
                        },
                        success: function (model, response) {
                             
                            if(response.productCassandraWrapper.responseCode === "FAILURE") {
                                alert(response.productCassandraWrapper.errorMessage);
                            } else {                                
                                location.reload();
                            }
                            
                        }
                    }); 
                    
                }
            }
    });

})();
