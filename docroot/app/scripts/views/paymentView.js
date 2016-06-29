/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.PaymentView = Backbone.View.extend({

        template: JST['app/scripts/templates/payment.hbs'],
        /*
        JST['app/scripts/templates/payment_new.hbs']
        */
      el: '#backbone-portlet-payment',
      events:{
        /*'click .payment-channel' : 'selectPaymentOption',
        'click #payNowBtn' : 'makePayment'*/
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new Payment();
        this.createOrder = new CreateOrder();
        this.validateCartOnPayment = new ValidateCartOnPayment();
        this.getOrderSummary = new OrderSummary();
      },
      render: function () {
          var self = this;
          
          /*self.getOrderSummary.fetch({
          error: function(response){
            console.log(response);
          },
            success: function (model, response) {
              
            if(response.domainResponse.responseCode === "FAILURE") {
              console.log(response.domainResponse.errorMessage);
            } else {
              $('.row sharing-area').html(Handlebars.templates.orderconfirmation(response));
            }
            
            }
        });*/
      },
      selectPaymentOption : function(e) {
        
        var currOption = $(e.currentTarget),
            pgBank = currOption.data("haspg"),
            currPaymentChannel = currOption.val();
        
        $(".select-bank").hide();
        
        if(pgBank.length > 0) {
          $("#select" + pgBank).show();
        }
        
        console.log(currPaymentChannel);
        
        this.validateCartOnPaymentSelection(currPaymentChannel);
      },
      validateCartOnPaymentSelection : function(currPaymentChannel) {
        
        var self = this,
            data = { paymentChannel : currPaymentChannel };
      
      if (self.validateCartOnPayment.clear().set(data)) {
      self.validateCartOnPayment.fetch({
        error: function (response) {
                  console.log(response);
        },
        success: function (model, response) {
                console.log(response); 
                if(response.domainResponse.responseCode === "SUCCESS") {
                    self.updateOrderSummary();
                } else {
                    console.log(response.domainResponse.errorMessage);
                    $.fancybox($("#invalid-popup"));
                }
              }
          });             
    }
        
      },
      updateOrderSummary : function() {
        
        var self = this;
          
          self.orderSummary.clear().fetch({
          error: function(response){
            console.log("error: >>>>........ " + response);
          }, 
            success: function (model, response) {
              
              var data = model.toJSON(),
                pageURL = window.location.pathname.toLowerCase();
              
              if($("#backbone-portlet-order-summary")) {
          $("#backbone-portlet-order-summary").html(Handlebars.templates.ordersummary(data));
              }
              
              if(self.isUserLoggedIn()) {
                
                /*self.showRewards();
                self.showCredits();
                self.showPersonalizeVouchers();*/
                
              } else {
                
                $(".offers-link.personal").remove();
                $("#personalOffersBox").remove();
                
              }
              if((pageURL.match(/billing$/) != null) || (pageURL.match(/payment$/) != null)) {
                  $(".check-avalible").remove();
            $("#checkoutBtn").remove();
            $(".redeem-area").remove();
            $(".offers-link").remove();
            $(".remove-offer").remove();
        }
              
              if ($(".sidebar-floating").length > 0) {

          $(window).on("scroll scrollstart", function() {
            
                  var outer=$('#left');
                  var inner=$('#sidebar');
                  var length = outer.height() - inner.height() + outer.offset().top;
                  var scroll = $(this).scrollTop();
                  var height = inner.height() + 'px';

                  if (scroll < outer.offset().top) {

                      inner.css({
                          'position': 'absolute',
                          'top': '0',
                'bottom': 'auto'          
                      });

                  } else if (scroll > length) {

                      inner.css({
                          'position': 'absolute',
                          'bottom': '0',
                          'top': 'auto'
                      });

                  } else {

                      inner.css({
                          'position': 'fixed',
                          'top': '0px',
                'bottom': 'auto'
                      });
                  }
              });
          }
              
              $("#payNowBtn").show();
            }
          });
      },
      makePayment: function(e) {

        e.preventDefault();       
        $('#payNowBtn').prop('disabled', true);
        
        var selectPaymentOption = $(".payment-channel:checked").val(), self = this,
        
          data = {
                paymentCode : selectPaymentOption,
                paymentStatus : "SUCCESS"
          };
        
        if(selectPaymentOption === "COD") {
          if(self.createOrder.set(data)) {
            self.createOrder.save({},{
            error: function (response) {
              console.log(response);
              $('#payNowBtn').prop('disabled', false);
            },
            success: function (model, response) {
                        
              if(response.domainResponse.responseCode === "SUCCESS"){
                            var orderIdKeyValue = response.domainResponse.message,
                              orderIdArr = orderIdKeyValue.split(":"),
                              orderId = orderIdArr[0],
                              orderIdValue = orderIdArr[orderIdArr.length - 1],
                              redirectURL = window.location.origin + "/confirmation/order/success/" + orderIdValue;

                            window.location.replace(redirectURL);
                  
                        } else {

                          $('#payNowBtn').prop('disabled', false);
                          $("#invalid-popup h2").text(response.domainResponse.errorMessage);
                        $("#invalid-popup .row p").text("");
                        $.fancybox($("#invalid-popup"));
                          
                        }
            }
          });   
          }
        } else {
          console.log("Currently, this payment is not available.");
          $('#payNowBtn').prop('disabled', false);
        }
      },
      isUserLoggedIn : function() {
        if($.cookie('COOKIE_FNY_LOGIN_ID') === undefined || $.cookie('COOKIE_FNY_LOGIN_ID') === "") {
          return false;
        } else {
          return true;
        }
      }

    });

})();
