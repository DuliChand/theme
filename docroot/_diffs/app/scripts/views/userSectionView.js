/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.UserSectionView = Backbone.View.extend({
        templates: {
            userpopups: JST['app/scripts/templates/userpopups.hbs'],
            accountdropdown: JST['app/scripts/templates/accountdropdown.hbs']
        },
        el: '#backbone-portlet-user-section-header',
        events: {
            'click .login' : 'showLoginPopUp',
            'mouseover .login' : 'showLoginPopUp',
            'mouseover .custom-overlay' : 'toggleOverlay',
                        
            'click #showRegisterPopup' : 'showRegisterPopUp',
            'click #showLoginPopup' : 'showLoginPopUp',
                        'click #forgotPassword' : 'showForgotPopUp',
                        /*'click #userLogout' : 'logoutNow',*/
                        
                        'click .logout' : 'logoutNow',
                        'click .custom-overlay' : 'toggleOverlay',
                        'click .header-top' : 'toggleOverlay',
                        'click .profile-icon' : 'showProfilePopUp',
                        'mouseover .nav > li a.profile-text' : 'showProfilePopUp',
                        "click .cartddwn-cross" : "profileToggleClsoe", 
                        
                        'mouseover .profile-text' : 'showProfilePopUp',
                        'mouseout .profile-text': 'profileToggleClsoe', 
                        'mouseover .profile' : 'showProfilePopUp',
                        'mouseout .profile': 'profileToggleClsoe'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.logoutUser = new Webshop.Models.LogoutPopUpUser();
            this.storeCredits = new Webshop.Models.GetCredits();
            this.getRewards = new Webshop.Models.GetRewards();
        },
        render: function() {
           var self = this;
           if($.cookie('COOKIE_FNY_LOGIN_ID') === undefined || $.cookie('COOKIE_FNY_LOGIN_ID') === null){
                            this.render2();
                        } else {
                            $.cookie($('#FnyCustomToken').data('tokenid'),$.cookie('DEVICE_ID'), {expires: 365, path: '/'});
                            var data = JSON.parse($.cookie('_FUI' ));
                            $("#backbone-portlet-user-section-header").html(self.templates.accountdropdown(data));
                            $('#backbone-portlet-user-section-header ul.loginholder').append($('#topHeaderData ul').html());
                            //this.getStoredCreditSum();
                            //this.getRewardPoints();
                            $('#uname').hide();
                        }
        },
        render2: function() {
            var self = this;
            $("#backbone-portlet-user-section-header").html(self.templates.userpopups());

            $('#backbone-portlet-user-section-header ul.loginholder').append($('#topHeaderData ul').html());
                        
                 /*if (location.href.indexOf("#") != -1) {
                    window.opener.location.href = window.location.protocol + window.location.host + '/web/fashionandyou/login?' + location.hash.substring(1);
                    window.close();
                   } else if (location.href.indexOf("?") != -1) {
                        location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
                }*/
    
                function getURLParameter(name) {
                  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
               }
                        
                 this.loginView = new Webshop.Views.LoginPopUpView();
                 this.loginView.render();

                this.registerView = new Webshop.Views.RegisterPopUpView();
                this.registerView.render();

                this.forgotView = new Webshop.Views.ForgotPopUpView();
                this.forgotView.render();
        },
        showLoginPopUp: function(e) {

            e.preventDefault();
                        /*e.stopPropagation();*/
                        fbLoad(document);
                        googleLoad();
                        
                        var currLink = $(e.currentTarget);
                        
                        $(".popup").hide();
                        $("#loginPopup.popup").show();
                        $('.error_Container').css("display", "none");
                        
                        if(currLink.hasClass("active")) {
                            if(currLink.hasClass("login")) {
                                currLink.removeClass("active");
                            }
                            $(".login-popup").hide();
                            $(".custom-overlay").show();
                            
                        } else {
                            if(currLink.hasClass("login")) {
                                currLink.addClass("active");
                            }
                            $(".login-popup.signin").show().siblings(".login-popup").hide();
                            $(".custom-overlay").show();
                        }
        },
        showRegisterPopUp: function(e) {

            e.preventDefault();
            /*e.stopPropagation();*/

            $('.error_Container').css("display", "none");
            $(".login-popup.signup").show().siblings(".login-popup").hide();
            $(".custom-overlay").show();
        },
        showForgotPopUp: function(e) {

            e.preventDefault();
            /*e.stopPropagation();*/

            $('.error_Container').css("display", "none");
            $(".login-popup.forgot").show().siblings(".login-popup").hide();
            $(".custom-overlay").show();
        },
        showProfilePopUp : function(e){
                        e.preventDefault();
                        $(" ul.profile").show().siblings(".cart-dropdown").hide();;
                        $(".custom-overlay").show();
                    },
                    profileToggleClsoe : function(e) {
                        e.preventDefault();
                        $(".nav > li .login").removeClass("active");
                        $("ul.profile").hide();
                        $(".cart-overlay").hide();  
                    },
        toggleOverlay: function(e) {
            e.preventDefault();
            $(".nav > li .login").removeClass("active");
            $(".custom-overlay").hide();
            $(".login-popup").hide();
        },
        logoutNow: function(e) {
            e.preventDefault();

            var self = this;
                $.removeCookie('COOKIE_FNY_CUSTOMER_ID', {
					path: '/'
				});
				$.removeCookie('COOKIE_FNY_LOGIN_ID', {
					path: '/'
				});
				$.removeCookie('_FUI', {
					path: '/'
				});

				$.removeCookie('_SC', {
					path: '/'
				});
				$.removeCookie('FNY_CART', {
					path: '/'
				});
				
            if (self.logoutUser.set("")) {

                self.logoutUser.save({}, {

                    error: function(response) {
                        /*console.log(response);
                                    console.log("unable to logout user.");*/
                    },
                    success: function(model, response) {

                        if (response.domainResponse.responseCode === "FAILURE") {

                            /*console.log(response.domainResponse.responseCode);*/

                        } else {

                            /*$.removeCookie('COOKIE_FNY_CUSTOMER_ID', {
                                path: '/'
                            });
                            $.removeCookie('COOKIE_FNY_LOGIN_ID', {
                                path: '/'
                            });
                            $.removeCookie('_FUI', {
                                path: '/'
                            });

                            $.removeCookie('_SC', {
                                path: '/'
                            });*/

                            var redirectURL = window.location.origin + "/";
                            window.location.replace(redirectURL);
                        }


                    }
                });
            }
        },
        getRewardPoints : function(){
                var self = this;
                var rewardsData = sessionStorage.getItem("REWARDS");
                if (rewardsData === undefined || rewardsData === null || rewardsData === ""){
                self.getRewards.clear().fetch({
                    
                    error: function(response){
                        
                    }, 
                    success: function (model, response) {
                        
                        sessionStorage.setItem("REWARDS",  response);
                        if(response != "") {
                            var rewardPoints = response;
                            
                            $('#rewards').text(rewardPoints);
                            
                            setTimeout(function(){
                                  sessionStorage.setItem("REWARDS","");
                            }, 3600000);
                        }
                    }
                });
              }else{
                var rewardsData = sessionStorage.getItem("REWARDS");
                $('#rewards').text(rewardsData);
              }
            },
        getStoredCreditSum: function() {
            var self = this;
                var creditsData = sessionStorage.getItem("CREDITS");
                if (creditsData === undefined || creditsData === null || creditsData === ""){
                self.storeCredits.clear().fetch({
                    
                    error: function(response){
                        
                    }, 
                    success: function (model, response) {
                        
                        if(response.domainResponse.responseCode === "SUCCESS") {
                            
                            var creditBalance = response.domainResponse.message;
                            sessionStorage.setItem("CREDITS",  creditBalance);
                            $('#credits').text(creditBalance);
                            
                            setTimeout(function(){
                                  sessionStorage.setItem("CREDITS","");
                                }, 3600000);
                        }
                    }
                });
              }else{
                var creditsData = sessionStorage.getItem("CREDITS");
                
                $('#credits').text(creditsData);
                
              }
        }
    });

})();