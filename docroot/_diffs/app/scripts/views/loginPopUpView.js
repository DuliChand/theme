/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.LoginPopUpView = Backbone.View.extend({

        templates: {
            loginpopup: JST['app/scripts/templates/loginpopup.hbs'],
            accountdropdown: JST['app/scripts/templates/accountdropdown.hbs']
        },
        el: '#loginPopup',
        events: {
            'click #loginUser': 'loginNow',
            'click #facebook_login_button': 'facebookLogin',
            'click #gmail_login_button': 'googleLogin'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.loginUser = new Webshop.Models.LoginUser();

            Backbone.Validation.bind(this, {
                model: this.loginUser
            });
        },
        render: function() {

        	var self = this;
			setTimeout(function(){
				fbLoad(document);
				
				googleLoad();
			},2000);	
			


            $(this.el).html(self.templates.loginpopup());
        },
        render2: function(data) {

            var self = this,
                userData = JSON.stringify({
                    baseDTO: data.customerWrapper.customers
                }),
                redirectURL = "";

            $.cookie('COOKIE_FNY_LOGIN_ID', data.customerWrapper.customers.loginId, {
                path: '/'
            });
            $.cookie('COOKIE_FNY_CUSTOMER_ID', data.customerWrapper.customers.customerId, {
                path: '/'
            });
            $.cookie('_FUI', userData, {
                path: '/'
            });
            $.cookie('CARTID', $.cookie('CARTID'), {
                path: '/'
            });

            $("#backbone-portlet-user-section-header").html(self.templates.accountdropdown(JSON.parse(userData)));

            var url = document.referrer;
            var currPageUrl = window.location.origin + window.location.pathname;
            if(url.substr(url.lastIndexOf('/') + 1) === "invite"){
                redirectURL = window.location.origin + "/invite";
                window.location.replace(redirectURL);
            }else if(url.substr(url.lastIndexOf('/') + 1) === "cart"){
                redirectURL = window.location.origin + "/billing";
                window.location.replace(redirectURL);
            }else if((currPageUrl.substr(url.lastIndexOf('/') + 1) === "register")||((currPageUrl.substr(url.lastIndexOf('/') + 1) === "login"))){
                redirectURL = window.location.origin + "/home";
                window.location.replace(redirectURL);
            }else{
                redirectURL = window.location.origin + window.location.pathname;
                window.location.replace(redirectURL);
            }

        },
        loginNow: function(event) {
            event.preventDefault();
            /*$('#loginUser').attr('disabled', 'disabled');*/

            var self = this,
                data = self.$('form#lighBoxSignIn').serializeObject();

            self.loginUser.bind('validated', function(isValid, model, errors) {
                var errorsArr = errors[Object.keys(errors)[0]];
                $('#loginPopup .error_Container').text(errorsArr).css("display", "block");
                /*$('#loginUser').removeAttr('disabled');*/
            });

            if (self.loginUser.clear().set(data)) {

                $('#loginPopup .error_Container').text("").css("display", "none");
                /*$('#loginUser').attr('disabled', 'disabled');*/

                self.loginUser.save({}, {
                    request: function(){
                        $('#registerPopup .error_Container').text("").css("display", "none");
                        $('#registerUser').attr('disabled','disabled');
                        $("#invalid-popup").removeClass('invalid');
                        $("span").removeClass('icon');
                        $("#invalid-popup h2").text("Sign ");
                        $("#invalid-popup .row p").html('<div class="product-loader"><span></span></div>');
                        $.fancybox($('#invalid-popup'),{
                                helpers : { 
                                overlay : {closeClick: false}
                            },
                           'afterShow'     : function () {
                                $('.fancybox-close').hide();                       
                            }
                        });
                    },
                    error: function(model, response) {
                        /*console.log("Oops! something went wrong.");*/
                        /*$('#loginUser').removeAttr('disabled');*/
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {

                            $("#loginPopup .error_Container").text(response.customerWrapper.errorMessage).css("display", "block");
                            $.fancybox.close($('#invalid-popup'));

                        } else {

                            $('#loginPopup .error_Container').text("").css("display", "none");
                            self.render2(response);
                            $.fancybox.close($('#invalid-popup'));
                        }

                        /*$('#loginUser').removeAttr('disabled');*/
                    }
                });

            } else {
                this.$('.alert-error').fadeIn();
            }
        },
        facebookLogin: function(event) {
            /*console.log("Clicked facebook button");*/
            event.preventDefault();

            var self = this;

            fbAuthCheck(function(data) {
                /*console.log(data);*/

                $("#invalid-popup").removeClass('invalid');
                $("span").removeClass('icon');
                $("#invalid-popup h2").text("Sign in");
                $("#invalid-popup .row p").html('<div class="product-loader"><span></span></div>');
                $.fancybox($('#invalid-popup'),{
                     helpers : { 
                          overlay : {closeClick: false}
                        },
                     'afterShow'     : function () {
                                $('.fancybox-close').hide();
                                
                            }
                });

                var response = data;
                //console.log(response);
                var loginUser = new Webshop.Models.LoginUser({
                    firstName: (response.first_name === undefined) ? "" : response.first_name,
                    lastName: (response.last_name === undefined) ? "" : response.last_name,
                    email: (response.email === undefined) ? "" : response.email,
                    sourceCode: CONSTANTS_PROPERTIES.get('fb_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });

                loginUser.save({}, {
                    error: function(response) {
                        /*console.log("some error occured...");*/
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                            /*console.log(response.customerWrapper.errorMessage);*/
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        },
        googleLogin: function(event) {

            /*console.log("Clicked Google button");*/
            event.preventDefault();

            var self = this;

            googleAuthCheck(function(data) {
                /*console.log(data);*/
                $("#invalid-popup").removeClass('invalid');
                $("span").removeClass('icon');
                $("#invalid-popup h2").text("Sign in");
                $("#invalid-popup .row p").html('<div class="product-loader"><span></span></div>');
                $.fancybox($('#invalid-popup'),{
                     helpers : { 
                          overlay : {closeClick: false}
                        },
                     'afterShow'     : function () {
                                $('.fancybox-close').hide();
                                
                            }
                });
                var response = data;

                var loginUser = new Webshop.Models.LoginUser({
                    firstName: (response.name.familyName === undefined) ? "" : response.name.familyName,
                    lastName: (response.name.givenName === undefined) ? "" : response.name.givenName,
                    email: (response.emails === undefined) ? "" : response.emails[0].value,
                    sourceCode: CONSTANTS_PROPERTIES.get('google_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });

                loginUser.save({}, {
                    error: function(response) {
                        /*console.log("some error occured...");*/
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                            /*console.log(response.customerWrapper.errorMessage);*/
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        }
    });

})();