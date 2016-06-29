/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    var ordersumdata;

    Webshop.Views.OrderSummaryView = Backbone.View.extend({
        templates: {
            cartcontent: JST['app/scripts/templates/cartcontent.hbs'],
            ordersummary: JST['app/scripts/templates/ordersummary.hbs']
        },
        el: '#orderSummary',
        events: {
            'click .apply-offer': 'applyOffer',
            'click .remove-offer': 'removeOffer',
            'click #applyPersonalVoucher' : 'applyPersonalVoucher',
            'click .edit-offer': 'editOffer',
            'click #checkoutBtn': 'checkoutNow',
            'click .button-check': 'checkServicibility',
           /* 'click .offers-link': "togglePersonalOffers",*/
            'click .offer-option': "toggleOfferOption",
            'change #PersonalVoucherBox': 'applyOffer',
            'click .checkavalable': 'checkServicablePincode'
        },
        initialize: function() {

            _.bindAll(this, 'render');
            this.getCart = new Webshop.Models.GetCart();
            this.applyCoupon = new Webshop.Models.ApplyPromotion();
            this.serviceability = new Webshop.Models.Serviceability();
            this.removeCoupon = new Webshop.Models.RemovePromotion();
            this.rewardPoints = new Webshop.Models.GetRewards();
            this.storeCredits = new Webshop.Models.GetCredits();
            this.personalizeVouchers = new Webshop.Models.GetPersonalizeVouchers();
            
        },
        render: function(data) {
            var self = this;
                ordersumdata = data;
                console.log("--sumary data--"+JSON.stringify(data));
                  var  pageURL = window.location.pathname.toLowerCase();
                
                $(self.el).html(self.templates.ordersummary(data));
                
                $(".cart-dropdown #youSaveValue").text(data.cart.youSaveValue);
                
                
                setTimeout(function(){
                    
                    if( $.cookie('COOKIE_PINCODE_DELIVERABLE') != undefined ) {
                       var  pageURL = window.location.pathname.toLowerCase();
                        if((pageURL.match(/billing$/) == null)) { 
                            $("#pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
                            $('#checkservice .go').trigger('click');
                        }
                    }
                    
                    if($("#globalOffersBox #formedit1").length > 0) {
                        $("#globalOffersBox #formapply1").remove();
                    }
                    
                    if($("#personalOffersBox #formedit4").length > 0) {
                        $("#personalOffersBox #formapply4").remove();
                    }
                    
                    if((pageURL.match(/billing$/) != null) || (pageURL.match(/cart$/) != null)) {
                        $("#shippingCharges").remove();
                    }
                    
                    if((pageURL.match(/billing$/) != null) || (pageURL.match(/payment$/) != null)) {
                          $(".check-avalible").remove();
                          $("#checkoutBtn").remove();
                          $(".redeem-area").remove();
                          $(".offers-link").remove();
                          $(".remove-offer").remove();
                    }
                    
                   if ($.cookie('COOKIE_FNY_LOGIN_ID') != undefined || $.cookie('COOKIE_FNY_LOGIN_ID') != "")  {
                        self.showRewards();
                        self.showCredits();
                        self.showPersonalizeVouchers();
                    } else {
                        $(".offers-link.personal").remove();
                        $("#personalOffersBox").remove();
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
                                    'top': '40px',
                                    'bottom': 'auto'
                                });
                            }
                        });
                    }
                    
                    /*$(".fancybox").fancybox();*/
                }, 200);
                

        },
        checkServicibility: function(e) {
            e.preventDefault();
            $('.checkservice').toggle();

        },
        checkServicablePincode: function(e) {

           e.preventDefault();
            
            var pincode = $('.checkservice').find("#pincode").val(), regNum = /^\d+$/;
            
            $(".checkservice .statusmsg").removeClass("red").removeClass("green");
            $(".checkservice .statusmsg .text").text("");
            
            if(pincode === "" || pincode.length > 6 || pincode.length < 6){
                
                $(".checkservice .statusmsg").removeClass("green").addClass("red");
                $(".checkservice .statusmsg .text").text("Invalid pincode");
                $(".checkservice .statusmsg").show();
                
            } else {
                
                if(regNum.test(pincode)){
                    
                    var data = {
                            pincode: pincode
                    };
                    
                    if(this.serviceability.clear().set(data)) {
                        this.serviceability.save({}, {
                            success : function(model, response) {
                                
                                if(response.pinCodeWrapper.responseCode === "FAILURE"){
                                  
                                    $(".checkservice .statusmsg .text").text("Invalid pincode");
                                      $(".checkservice .statusmsg").removeClass("green").addClass("red") ;
                                    
                                } else {
                                    if(response.pinCodeWrapper.pinCodes.deliveryAvailable) {
										$('.codcheck').remove();
                                        $(".checkservice .statusmsg .text").text("Yes, your area is serviceable");
										if(response.pinCodeWrapper.pinCodes.serviceability == 1){
													
													$('.check-avalible .statusmsg').after('<span class="statusmsg red"><span class="icon"></span><span class="text">COD not available</span></span>');
										}
                                         $(".checkservice .statusmsg").removeClass("red").addClass("green");
                                        $.cookie('COOKIE_PINCODE_DELIVERABLE',pincode, {path: '/'});
                                        
                                    } else {
                                     
                                        $(".checkservice .statusmsg .text").text("Sorry, your area is not serviceable");
                                           $(".checkservice .statusmsg").removeClass("green").addClass("red");
                                    }
                                }
                            }
                        });
                    } else {
                        this.$('.alert-error').fadeIn();
                    }
                    $(".checkservice .statusmsg").show();
                    
                } else {
                    
                    $(".checkservice .statusmsg").removeClass("green").addClass("red");
                    $(".checkservice .statusmsg .text").text("Invalid pincode");
                    
                }                       
            }
        },
        showRewards: function() {
            var rewardsData = sessionStorage.getItem("REWARDS");
            if (rewardsData === undefined || rewardsData === null || rewardsData === ""){
            if((pageURL.match(/credits$/) != null)) {
    
              this.rewardPoints.clear().fetch({
                error: function(response){
                    $("#RewardBox").removeAttr("disabled");
                    $("#rewards-box .apply-offer").removeAttr("disabled");
                }, 
                success: function (model, response) {
                    if(response != undefined) {
                        
                        var rewardPoints = response,
                            availableRewardPoints;
                        $("#rewardsAvailableBalance").html("(" + response + " Points)");
                        $("#rewardsAvailableBalance").data("value", response);
                        
                        //sessionStorage.setItem("REWARDS",  rewardPoints);
                        
                        availableRewardPoints = $("#rewardsAvailableBalance").data("value");
                        
                        if(availableRewardPoints > 0) {
                            $(".offer-option.rewards").show();
                        }
                        
                        /*setTimeout(function(){
                          sessionStorage.setItem("REWARDS","");
                        }, 3600000);
                        */
                    } else {
                        $(".offer-option.rewards").hide();
                    }
                }
             });
            }
            }else{
                var rewardsData = sessionStorage.getItem("REWARDS"),availableRewardPoints;
                $("#rewardsAvailableBalance").html("(" + rewardsData + " Points)");
                $("#rewardsAvailableBalance").data("value", rewardsData);
                
                availableRewardPoints = $("#rewardsAvailableBalance").data("value");
                
                if(availableRewardPoints > 0) {
                    $(".offer-option.rewards").show();
                }
            }
        },
        showCredits: function() {

            var creditsData = sessionStorage.getItem("CREDITS");
            if (creditsData === undefined || creditsData === null || creditsData === ""){
        if((pageURL.match(/credits$/) != null)) {
     
                this.storeCredits.clear().fetch({
                    
                    error: function(response){
                        /*console.log(response);*/
                        $("#StoredCreditBox").attr("disabled","disabled");
                        $("#credits-box .apply-offer").attr("disabled","disabled");
                    }, 
                    success: function (model, response) {
                        
                        if(response.domainResponse.responseCode === "SUCCESS") {
                            
                            var creditBalance = response.domainResponse.message,
                                availableCredits;
                            //sessionStorage.setItem("CREDITS",  creditBalance);
                            
                            $("#creditsAvailableBalance").html("(INR " + creditBalance + ")");
                            $("#creditsAvailableBalance").data("value", creditBalance);
                            
                            availableCredits = $("#creditsAvailableBalance").data("value"); 
                            
                            if(availableCredits > 0) {
                                $(".offer-option.credits").show();
                            }
                            
                        } else {
                            var creditsData = sessionStorage.getItem("CREDITS"),availableCredits;
                            
                            /*setTimeout(function(){
                              sessionStorage.setItem("CREDITS","");
                            }, 3600000);*/
                        
                        $("#creditsAvailableBalance").html("(INR " + creditsData + ")");
                        $("#creditsAvailableBalance").data("value", creditsData);
                        
                        availableCredits = $("#creditsAvailableBalance").data("value"); 
                        
                        if(availableCredits > 0) {
                            $(".offer-option.credits").show();
                        }
                        }
                    }
                });
            }
            }else{
                
            }
        },
        showPersonalizeVouchers: function() {

            var vouchersData = sessionStorage.getItem("VOUCHERS");
            if (vouchersData === undefined || vouchersData === null || vouchersData === ""){
            var  pageURL = window.location.pathname.toLowerCase();
            if((pageURL.match(/credits$/) != null)) {
       
                this.personalizeVouchers.clear().fetch({
                    
                    error: function(response){
                        /*console.log("error: >>>>........ " + response);*/
                    }, 
                    success: function (model, response) {
                        
                        if(response.domainResponse.responseCode === "SUCCESS") {
                            
                            var voucherListArr = response.domainResponse.entitiesResponse,
                                voucherList = "<option value=''>Select Voucher</option>";
                            //sessionStorage.setItem("VOUCHERS",  voucherListArr);
                            
                            if(voucherListArr) {
                                $.each(voucherListArr, function(i, voucher){
                                    voucherList += "<option value='";
                                    voucherList += voucher.baseDTO.voucherCode;
                                    voucherList += "'>";
                                    voucherList += voucher.baseDTO.description;
                                    voucherList += "</option>";
                                });
                            } else {
                                voucherList += "<option value='";
                                voucherList += voucher.baseDTO.voucherCode;
                                voucherList += "'>";
                                voucherList += voucher.baseDTO.description;
                                voucherList += "</option>";
                            }
                            
                            $("#PersonalVoucherBox").html(voucherList);
                            
                            //$("#personal-voucher-box").toggle();

                           // $(".offer-option.personal-voucher").toggle();
                            setTimeout(function(){
                                $("#personal-voucher-box , .personal-voucher").css('display','block');
                            },2000)

                        } else {
                            
                            /*$("#personal-voucher-box").remove();
                            $(".offer-option.personal-voucher").remove();*/
                        }
                    }
                });
            }

            }else{
                var voucherListArr = response.domainResponse.entitiesResponse,
                voucherList = "<option value=''>Select Voucher</option>";
            //sessionStorage.setItem("VOUCHERS",  voucherListArr);
            
           /* setTimeout(function(){
                  sessionStorage.setItem("VOUCHERS","");
                }, 3600000);*/
            
            if(voucherListArr.length > 0) {
                $.each(voucherListArr, function(i, voucher){
                    voucherList += "<option value='";
                    voucherList += voucher.baseDTO.voucherCode;
                    voucherList += "'>";
                    voucherList += voucher.baseDTO.voucherCode;
                    voucherList += "</option>";
                });
            } else {
                voucherList += "<option value='";
                voucherList += voucherListArr.baseDTO.voucherCode;
                voucherList += "'>";
                voucherList += voucherListArr.baseDTO.voucherCode;
                voucherList += "</option>";
            }
            
            $("#PersonalVoucherBox").html(voucherList);
            
            //$("#personal-voucher-box").toggle();
            //$(".offer-option.personal-voucher").toggle();
            }
        },
        isOfferValid: function(data) {

            /*console.log("promotionType:---> " + data.promotionType);*/

            switch (data.promotionType) {

                case "voucher":

                    /*console.log("current promotion is voucher.");*/

                    if (data.promotionValue === "") {

                        $("#invalid-popup h2").text("Invalid Coupon Code.");
                        $("#invalid-popup .row p").text("");
                        $.fancybox($("#invalid-popup"));

                        return false;
                    } else {
                        return true;
                    }

                    break;

                case "PersonalVoucher":

                    /*console.log("current promotion is personal voucher.");*/
                    if (data.promotionValue === "") {

                        $("#invalid-popup h2").text("Invalid Voucher Code.");
                        $("#invalid-popup .row p").text("");
                        $.fancybox($("#invalid-popup"));

                        return false;
                    } else {
                        return true;
                    }

                    break;

                case "Reward":

                    /*console.log("current promotion is Reward.");*/
                    var availableRewards = parseFloat($("#rewardsAvailableBalance").data("value")),
                        appliedRewards = (data.promotionValue === "") ? data.promotionValue : parseFloat(data.promotionValue);

                    if (isNaN(appliedRewards) || (appliedRewards === "") || (appliedRewards <= 0) || (appliedRewards > availableRewards)) {

                        $("#invalid-popup h2").text("Applied rewards points are incorrect.");
                        $("#invalid-popup .row p").text("");
                        $.fancybox($("#invalid-popup"));

                        return false;
                    } else {

                        if (availableRewards > 0) {
                            return true;
                        } else {
                            $("#invalid-popup h2").text("You need to have valid reward points to redeem.");
                            $("#invalid-popup .row p").text("");
                            $.fancybox($("#invalid-popup"));
                        }
                    }

                    break;

                case "StoredCredit":

                    /*console.log("current promotion is Store Credit.");*/

                    var availableCredit = parseFloat($("#creditsAvailableBalance").data("value")),
                        appliedCredit = (data.promotionValue === "") ? data.promotionValue : parseFloat(data.promotionValue);;

                    if (isNaN(appliedCredit) || (appliedCredit === "") || (appliedCredit <= 0) || (appliedCredit > availableCredit)) {

                        $("#invalid-popup h2").text("Applied store credit amount is incorrect.");
                        $("#invalid-popup .row p").text("");
                        $.fancybox($("#invalid-popup"));

                        return false;
                    } else {
                        return true;
                    }
                    break;

                default:

                    return false;
                    break;
            }

        },
        applyPersonalVoucher: function(e)
        {
             e.preventDefault();
            var PersonalVoucher = $('#PersonalVoucherBox').val();
            if(PersonalVoucher === ""){
                $("#invalid-popup h2").text("Please Select valid Voucher");
                $("#invalid-popup .row p").text("");
                $.fancybox($("#invalid-popup"));   
            }
        },

        applyOffer: function(e) {

                     
            var currElement = $(e.currentTarget),
                offerType = currElement.data("type"),
                offerValue = $("#" + offerType + "Box").val(),
                self = this,
                /*data = {
                    promotionValue: offerValue,
                    promotionType: offerType
                };*/
            data = {
            	"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
            	  "customerId" : $.cookie('COOKIE_FNY_CUSTOMER_ID'),
            	"voucherRequest":{
            		"code":offerValue,
            		"type":offerType
            	    }                   
                };

            if (self.isOfferValid(data)) {

                if (self.applyCoupon.clear().set(data)) {
                    self.applyCoupon.fetch({
                        error: function(response) {
                            /*console.log(response);*/
                        },
                        success: function(model, response) {
                            if (response.domainResponse.responseCode === "SUCCESS") {
                                
                                self.getCart.clear().fetch({
                                    error: function(response) {
                                             /*console.log("error: >>>>........ " + response);*/
                                     },
                                     success: function(model, response) {
                                        var data = model.toJSON();
                                        self.render(data);
                                    }
                       
                                });

                                

                            } else {
                                $("#invalid-popup h2").text(response.domainResponse.errorMessage);
                                $("#invalid-popup .row p").text("");
                                $.fancybox($("#invalid-popup"));
                            }
                        }
                    });
                }
            }
        },
        removeOffer: function(e) {
            e.preventDefault();
            var currElement = $(e.currentTarget),
                offerType = currElement.data("type"),
                offerValue = currElement.data("value"),
                self = this;

            /*var data = {
                promotionValue: offerValue,
                promotionType: offerType
            };
            */
            var data = {
                	"deviceId":$.cookie($('#FnyCustomToken').data('tokenid')),
                	  "customerId" : $.cookie('COOKIE_FNY_CUSTOMER_ID'),
                	"voucherRequest":{
                		"code":offerValue,
                		"type":offerType
                	    }                   
                    };

            $.fancybox($("#confirmation-popup"));


            $("#confirmation-popup input[type=button]").click(function() {

                if ($(this).val() === "Yes") {

                    /*console.log("Yes Button Clicked.");*/
                    $.fancybox.close(true);

                    if (self.removeCoupon.clear().set(data)) {
                        self.removeCoupon.fetch({
                            error: function(response) {
                                /*console.log(response);*/
                            },
                            success: function(model, response) {
                                if (response.domainResponse.responseCode === "SUCCESS") {
                                    //console.log("oder remove sum data " +ordersumdata);
                                    self.getCart.clear().fetch({
                                    error: function(response) {
                                             /*console.log("error: >>>>........ " + response);*/
                                     },
                                     success: function(model, response) {
                                        var data = model.toJSON();
                                        self.render(data);
                                    }
                       
                                });
                                    /*location.reload();*/

                                } else {

                                    $("#invalid-popup h2").text(response.domainResponse.errorMessage);
                                    $("#invalid-popup .row p").text("");
                                    $.fancybox($("#invalid-popup"));
                                }
                            }
                        });
                    }
                } else {
                    $.fancybox.close(true);
                }
            });

        },
        editOffer: function(e) {
            e.preventDefault();
            /*console.log(e.currentTarget);*/


            e.preventDefault();
            var currElement = $(e.currentTarget),
                offerType = currElement.data("type"),
                offerValue = currElement.data("value"),
                self = this;

            var data = {
                promotionValue: offerValue,
                promotionType: offerType
            };

            if (self.removeCoupon.clear().set(data)) {
                self.removeCoupon.fetch({
                    error: function(response) {
                        /*console.log(response);*/
                    },
                    success: function(model, response) {
                        if (response.domainResponse.responseCode === "SUCCESS") {

                            self.render();
                            $("#personalOffersBox").toggle();

                            /*location.reload();*/

                        } else {
                            /*alert(response.domainResponse.errorMessage);*/
                            $("#invalid-popup h2").text(response.domainResponse.errorMessage);
                            $("#invalid-popup .row p").text("");
                            $.fancybox($("#invalid-popup"));
                        }
                    }
                });
            }
        },
        checkoutNow: function(e) {
            e.preventDefault();

            var redirectURL = "",
                totalProductInCart = $("#backbone-portlet-cart-content .cart-details").length;

            if (totalProductInCart > 0) {
                if (this.isUserLoggedIn()) {
                    redirectURL = window.location.origin + "/billing";
                } else {
                    $(e.currentTarget).attr("href", "/login");
                    redirectURL = window.location.origin + "/login";
                }

                window.location.replace(redirectURL);
            } else {
                $("#invalid-popup h2").text("Your Cart is empty.");
                $("#invalid-popup .row p").text("");
                $.fancybox($("#invalid-popup"));
            }
        },
        /*togglePersonalOffers: function(e) {
            e.preventDefault();
            $("#personalOffersBox").toggle();
        },*/
        /*toggleOfferOption: function(e) {
            e.preventDefault();

            var elementClass = $(e.currentTarget).data("offer-type");
            $("#" + elementClass + "-box").toggle();
        },*/
        isUserLoggedIn: function() {
            if ($.cookie('COOKIE_FNY_LOGIN_ID') === undefined || $.cookie('COOKIE_FNY_LOGIN_ID') === "") {
                return false;
            } else {
                return true;
            }
        }
    });

})();