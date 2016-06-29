/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.userSectionLoginView = Backbone.View.extend({

    	el : '#loginPopup',
					events : {
						'click #loginUser' : 'loginNow',
						'click #facebook_login_button' : 'facebookLogin',
						'click #gmail_login_button' : 'googleLogin'
					},
					initialize : function() {
						_.bindAll(this, 'render');
						this.loginUser = new Webshop.Models.LoginUser();
						
						Backbone.Validation.bind(this, {model: this.loginUser});							
					},
					render : function() {
						$(this.el).html(Handlebars.templates.login());		
					},
					render2 : function(data){
						
						var userData = JSON.stringify({baseDTO: data.customerWrapper.customers}),
							redirectURL = "";
						
						$.cookie('COOKIE_FNY_LOGIN_ID', data.customerWrapper.customers.loginId, {path: '/'});
						$.cookie('COOKIE_FNY_CUSTOMER_ID', data.customerWrapper.customers.customerId, {path: '/'});
						$.cookie('_FUI', userData, {path: '/'});
						$.cookie('CARTID', $.cookie('CARTID'), {path: '/'});
						
						$("#backbone-portlet-user-section-header").html(Handlebars.templates.accountdropdown(JSON.parse(userData)));
						
						
						/*if(document.referrer != "") {
							redirectURL = document.referrer;
							window.location.replace(redirectURL);
						} else {
							redirectURL = window.location.origin + "/home";
							window.location.replace(redirectURL);
						}*/
						
						redirectURL = window.location.origin + window.location.pathname;
						window.location.replace(redirectURL);
						
					},					
					loginNow : function(event) {
						event.preventDefault();
						var self = this,
							data = self.$('form#lighBoxSignIn').serializeObject();
							/*$('#loginUser').prop('disabled', true);*/
						
						    self.loginUser.bind('validated', function(isValid, model, errors) {
							  // do something
						    	
								var errorsArr = errors[Object.keys(errors)[0]];
								$('.error_Container').css("display", "block");
								$('#proceedToCheckout').prop('disabled', false);
								$(".error_Container").text(errorsArr);
								if(isValid){
									$('.error_Container').css("display", "none");
								}
							});
							
						if (self.loginUser.clear().set(data)) {
							
							self.loginUser.save({}, {
								
								success : function(model, response) {
									/*$('#loginUser').prop('disabled', false);*/
									
									if(response.customerWrapper.responseCode === "FAILURE") {
										
										$(".error_Container").text(response.customerWrapper.errorMessage).css("display", "block");
										
									} else {
										
										$('.error_Container').css("display", "none");
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
