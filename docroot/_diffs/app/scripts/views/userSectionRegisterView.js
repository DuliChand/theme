/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.userSectionRegisterView = Backbone.View.extend({

el : '#registerPopup',
						events : {
							'click #registerUser' : 'registerNow',
							'click #facebook_signup_button' : 'facebookRegister',
							'click #gmail_signup_button' : 'googleRegister',
							'click .radio' : 'chooseGender'
						},
						initialize : function() {
							_.bindAll(this, 'render');
							this.registerUser = new RegisterUser();
							this.loginUser = new LoginUser();
							
							Backbone.Validation.bind(this, {model: this.registerUser});							
						},
						render : function() {
							$(this.el).html(Handlebars.templates.register());
						},
						render2 : function(data){
							
							var userData = JSON.stringify({baseDTO: data.customerWrapper.customers});
							
							$.cookie('COOKIE_FNY_LOGIN_ID', data.customerWrapper.customers.loginId, {path: '/'});
							$.cookie('COOKIE_FNY_CUSTOMER_ID', data.customerWrapper.customers.customerId, {path: '/'});
							$.cookie('_FUI', userData, {path: '/'});
							$.cookie('CARTID', $.cookie('CARTID'), {path: '/'});
							
							var redirectURL = window.location.origin + window.location.pathname;
							window.location.replace(redirectURL);
							
						},
						registerNow : function(event) {
							event.preventDefault();
							var self = this,
								currFormLight = $("#lighBoxSignUp");
								
								self.registerUser.bind('validated', function(isValid, model, errors) {
									  // do something
										var errorsArr = errors[Object.keys(errors)[0]];
										$('.error_Container').css("display", "block");
										$('#proceedToCheckout').prop('disabled', false);
										$(".error_Container").text(errorsArr);
										if(isValid){
											$('.error_Container').css("display", "none");
										}
									});
							
								var userData = {
									firstName : currFormLight.find("#firstName").val(),
									lastName : currFormLight.find("#lastName").val(),
									emailId : currFormLight.find("#emailId").val(),
									password : currFormLight.find("#password").val(),
									gender : currFormLight.find('input:radio[name=gender]:checked').val()
								};
							
							if (self.registerUser.set(userData)) {
								self.registerUser.save({}, {
									error: function(model, response) {
										console.log("Oops! something went wrong.");
									},
									success : function(model, response) {
										
										var jsonObject = response;
										
										if(jsonObject.domainResponse.errorCode){
											console.log(jsonObject.domainResponse.errorMessage);
											$('.error_Container').text(jsonObject.domainResponse.errorMessage);
											$('.error_Container').css("display", "block");
										} else {
											$('.error_Container').css("display", "none");
											console.log("Successfully Registered");
											self.loginNow(userData);
											
											/*var redirectURL = window.location.origin + "/home";
											window.location.replace(redirectURL);*/
										}
									}
								});
							} else {
								this.$('.alert-error').fadeIn();
							}
						},
						facebookRegister : function(event) {
							
							console.log("Clicked facebook button");
							event.preventDefault();
							
							var self = this;
							
							fbAuthCheck(function(data) {
								//console.log(data);
								var response = data;
								var new_user = new RegisterUser({
									firstName : response.first_name,
									lastName : response.last_name,
									email : response.email,
									sourceCode : CONSTANTS_PROPERTIES.get('fb_login'),
									gender : (response.gender == "male")?"M":"F"
								});
								new_user.save({}, {
									error : function(response) {
										alert("some error occured...");
									},
									success : function(model, response) {
										if(response.customerWrapper.responseCode === "FAILURE") {
											alert(response.customerWrapper.errorMessage);
										} else {
											self.render2(response);
										}
									}
								});
							});
						},
						googleRegister : function(event) {
							
							console.log("Clicked Google button");
							event.preventDefault();
							
							var self = this;
							
							googleAuthCheck(function(data) {
								console.log(data);
								var response = data;
								var new_user = new RegisterUser({
									firstName : response.name.familyName,
									lastName : response.name.givenName,
									email : response.emails[0].value,
									sourceCode : CONSTANTS_PROPERTIES.get('google_login'),
									gender : (response.gender == "male")?"M":"F"
								});
								new_user.save({}, {
									error : function(response) {
										alert("some error occured...");
									},
									success : function(model, response) {
										if(response.customerWrapper.responseCode === "FAILURE") {
											alert(response.customerWrapper.errorMessage);
										} else {
											self.render2(response);
										}
									}
								});
							});
						},
						loginNow : function(userData) {
							
							var self = this,
								data = {
									loginId : userData.emailId,
									password : userData.password
								};
							
							if (self.loginUser.set(data)) {
								self.loginUser.save({}, {
									
									success : function(model, response) {
										$('#loginUser').prop('disabled', false);
										if(response.customerWrapper.responseCode === "FAILURE") {
											alert(response.customerWrapper.errorMessage);
										} else {
											self.render2(response);
										}
									}
								});
							} else {
								this.$('.alert-error').fadeIn();
							}
						},
						chooseGender :  function(e) {
							$(e.currentTarget)
								.next("label").toggleClass("label-checked")
								.siblings("label").toggleClass("label-checked");
						}
    	    });

})();