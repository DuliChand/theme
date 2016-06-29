/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.UserLoginSectionView = Backbone.View.extend({
		el : '#backbone-portlet-user-section-header',
					events : {
						'click .login' : 'showLoginPopUp',
						'click #showRegisterPopup' : 'showRegisterPopUp',
						'click #showLoginPopup' : 'showLoginPopUp',
						'click #forgotPassword' : 'showForgotPopUp',
						'click #userLogout' : 'logoutNow',
						'click .custom-overlay' : 'toggleOverlay'
					},
					initialize : function() {
						_.bindAll(this, 'render');
						this.logoutUser = new LogoutUser();
					},
					render : function() {
						
						if($.cookie('COOKIE_FNY_LOGIN_ID') === undefined || $.cookie('COOKIE_FNY_LOGIN_ID') === null){
							this.render2();
						} else {
							var data = JSON.parse($.cookie('_FUI' ));
							$("#backbone-portlet-user-section-header").html(Handlebars.templates.accountdropdown(data));
						}
					},
					render2: function() {
						
						$(this.el).html(Handlebars.templates.userpopups());
						
						if (location.href.indexOf("#") != -1) {
							window.opener.location.href = window.location.protocol + window.location.host + '/web/fashionandyou/login?' + location.hash.substring(1);
							window.close();
						} else if (location.href.indexOf("?") != -1) {
							location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
						}
	
						function getURLParameter(name) {
						  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
						}
						
						this.loginView = new LoginView();
						this.loginView.render();
						
						this.registerView = new RegisterView();
						this.registerView.render();
						
						this.forgotView = new ForgotView();
						this.forgotView.render();
					},
					showLoginPopUp : function(e) {
						
						e.preventDefault();
						/*e.stopPropagation();*/
						
						fbLoad(document);
						googleLoad();
						
						var currLink = $(e.currentTarget);
						
						$(".popup").hide();
						
						if(currLink.hasClass("active")) {
							if(currLink.hasClass("login")) {
								currLink.removeClass("active");
							}
							$(".login-popup").hide();
						} else {
							if(currLink.hasClass("login")) {
								currLink.addClass("active");
							}
							$(".login-popup.signin").show().siblings(".login-popup").hide();
							$(".custom-overlay").show();
						}
					},
					showRegisterPopUp : function(e) {
						
						e.preventDefault();
						/*e.stopPropagation();*/
						
						$(".login-popup.signup").show().siblings(".login-popup").hide();
						$(".custom-overlay").show();
					},
					showForgotPopUp : function(e) {
						
						e.preventDefault();
						/*e.stopPropagation();*/
						
						$(".login-popup.forgot").show().siblings(".login-popup").hide();
						$(".custom-overlay").show();
					},
					
					toggleOverlay : function(e) {
						e.preventDefault();
						$(".login").removeClass("active")
						$(".custom-overlay").hide();
						$(".login-popup").hide();
					},
					logoutNow : function(e) {
						e.preventDefault();						
						
						var self = this;
						
						if(self.logoutUser.set("")){
							
							self.logoutUser.save({}, {
	                			
								error: function (response) {
									console.log(response);
	                				console.log("unable to logout user.");
	                            },
	                            success: function (model, response) {
	                            	
	                            	if(response.domainResponse.responseCode === "FAILURE") {
										
	                            		alert(response.domainResponse.responseCode);
										
									} else {
										
										$.removeCookie('COOKIE_FNY_CUSTOMER_ID', { path: '/'});
		        						$.removeCookie('COOKIE_FNY_LOGIN_ID', { path: '/'});
		        						$.removeCookie('_FUI', { path: '/'});
										
										var redirectURL = window.location.origin + "/home";
										window.location.replace(redirectURL);
									}

	                            	
	                            }
	                        });
						}
					}

    	});

})();
