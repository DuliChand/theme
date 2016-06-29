/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.AfterSalesView = Backbone.View.extend({

        template: JST['app/scripts/templates/orderconfirmation.hbs'],

        el: '#backbone-portlet-after-sales',
      events: { 
          'click .social-share-link' : 'socialShareHandler',
          'click #submitFeedback' : 'submitOrderFeedback'
      },
      initialize: function () {

        _.bindAll(this, 'render');
        this.getOrderSummary = new OrderSummary();
        this.updatePaymentStatus = new UpdatePaymentStatus();
        this.cartLightBox = new CartLightBox();
        this.feedback = new Feedback();
        
        Backbone.Validation.bind(this, {model: this.feedback});
        
      },
      render: function () {
      
        this.updateOrderStatus();
      },
      renderOrderSummary: function() {
        
        var self = this;
        
        self.renderCartLightBox();
        
        self.getOrderSummary.fetch({
          error: function(response){
           // console.log(response);
          },
            success: function (model, response) {
              
            if(response.domainResponse.responseCode === "FAILURE") {
              //console.log(response.domainResponse.errorMessage);
            } else {
              $(self.el).html(Handlebars.templates.orderconfirmation(response));
            }
            
            }
        });
        
      },
      renderCartLightBox : function () {
        
        var self = this;
      self.cartLightBox.clear();        
      self.cartLightBox.fetch({
        
        error : function(response) {
         // console.log(response);
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
          
          $("#backbone-portlet-cart-lightbox").html(Handlebars.templates.cartlightbox(data));
          
          productSelectBoxList = $(".cart-details .prod-qty.selectable");
          cartProductList = $(".cart-details.cart-lightbox");
        
          $.each( cartProductList, function( i, element ) {
            
            productTimerArr.push( parseInt($(element).data("timer")) );
            
            $(element).find(".cartprod-timer").countdown( getTimeToexpire($(element).data("timer")) ).on('update.countdown', function(event) {
                $(this).html(event.strftime('%H:%M:%S' + ' minutes left'));
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
        }
      });
      },
      updateOrderStatus: function(paymentType) {
        
        var self = this,
            data = {
          orderId   : $("#backbone-portlet-after-sales").data("id"),
            paymentCode : (paymentType === undefined) ? "COD" : paymentType,
            paymentStatus : "SUCCESS"
            };
        
        if (this.updatePaymentStatus.clear().set(data)) {
        
            this.updatePaymentStatus.fetch({
          error: function (response) {
           // console.log(response);
          },
          success: function (model, response) {
                      if(response.orderPaymentWrapper.responseCode === "SUCCESS"){

                        self.renderOrderSummary();
                        self.renderCartLightBox();
                      } else {
                        alert(response.orderPaymentWrapper.message);
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
          imageUrl : $("#product-gallery-thumbnails li a").first().data("image-detail"),
          description : "I have bought an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
          handlerName : classesList[1]
      };
      
      socialShare(e, sharingData);
    },
    submitOrderFeedback : function(e) {
      
      e.preventDefault();
      
      var self = this,
        currForm = $("#orderFeedbackForm"),
        userData = JSON.parse($.cookie('_FUI')),
        feedbackData = {
          name : userData.baseDTO.firstName + " " + userData.baseDTO.lastName,
          email : userData.baseDTO.loginId,
          phone : "",
              feedbackType : "",
              orderFeedbackMessage : currForm.find("#orderFeedbackMessage").val()
        };

      if(self.feedback.clear().set(feedbackData)) {
        self.feedback.save({}, {
          error : function(response) {
            alert("some error occured...");
          },
          success : function(model, response) {
        
//console.log(response);
            
            if(response.feedbackWrapper.responseCode === "SUCCESS") {
              $("#orderFeedbackForm").hide();
              $(".success-message").show();
            } else {
              $("#orderFeedbackForm").hide();
              $(".error-message").show();
            }
            
          }
        });
      }
    }

    });

})();
