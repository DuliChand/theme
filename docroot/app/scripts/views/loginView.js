/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.LoginView = Backbone.View.extend({

        templates: {
            login: JST['app/scripts/templates/login.hbs']
        },
        el: '#backbone-portlet-user-login',
        events: {
            'click .social-icons-register .text': 'registrationForm',
            'click #registerUser': 'submit',
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
            $.cookie('pageUrlData', document.refferrer, {
                path: '/'
            });
            var self = this,
                loginCookie = $.cookie('COOKIE_FNY_LOGIN_ID'),
                redirectURL = "";

            $(self.el).html(self.templates.login());
            /************login invit*****************/
            var url = document.referrer;
               // url.split('/').pop(-1)

                if(url.split('/').pop(-1) == 'invite')
                {
                 $('#backbone-portlet-user-login #loginarea h2').html("Login to invite");
                }
                else{
                  $('#backbone-portlet-user-login #loginarea h2').html("Login");
                }
            /*****************************/
            fbLoad(document);
            googleLoad();

            /*if (location.href.indexOf("#") != -1) {
				window.opener.location.href = 'http://'+window.location.host+'/home?'
						+ location.hash.substring(1);
				window.close();
			} else if (location.href.indexOf("?") != -1) {
				location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
			}*/

            function getURLParameter(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            }

           if(loginCookie != undefined || loginCookie != null) {

                var url = document.referrer;
                var currPageUrl = window.location.origin + window.location.pathname;
                if(url.substr(url.lastIndexOf('/') + 1) === "invite"){
                    redirectURL = window.location.origin + "/invite";
                    window.location.replace(redirectURL);
                }else if(url.substr(url.lastIndexOf('/') + 1) === "cart"){
                    redirectURL = window.location.origin + "/billing";
                    window.location.replace(redirectURL);
                }else if((currPageUrl.substr(url.lastIndexOf('/') + 1) === "register")||((currPageUrl.substr(url.lastIndexOf('/') + 1) === "login"))){
                    redirectURL = window.location.origin + "/";
                    window.location.replace(redirectURL);
                }else{
                    window.location.replace(document.referrer);
                }
            }
        },
        render2: function(data) {

            var userData = JSON.stringify({
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

            var url = document.referrer;
            if(url.substr(url.lastIndexOf('/') + 1) === "invite"){
                redirectURL = window.location.origin + "/invite";
                window.location.replace(redirectURL);
            }else if(url.substr(url.lastIndexOf('/') + 1) === "cart"){
                redirectURL = window.location.origin + "/billing";
                window.location.replace(redirectURL);
            }else{
                redirectURL = window.location.origin + window.location.pathname;
                window.location.replace(redirectURL);
            }
        },
        registrationForm: function(e) {

            e.preventDefault();
            $(".social-icons-register").slideUp();
            $(".reg-form").slideDown();

        },
        submit: function(event) {
            event.preventDefault();
            
            var self = this,
                userData = self.$('form').serializeObject();

            if (self.loginUser.set(userData)) {

                $('#loginarea .error_Container').text("").css("display", "none");
                
                self.loginUser.save({}, {
                    success: function(model, response) {

                        if (response.customerWrapper.responseCode === "FAILURE") {

                            $("#loginarea .error_Container").text(response.customerWrapper.errorMessage).css("display", "block");
                            $.fancybox.close($('#invalid-popup'));
                        } else {
                            $('#loginarea .error_Container').text("").css("display", "none");
                            $.fancybox.close($('#invalid-popup'));
                            self.render2(response);
                        }
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