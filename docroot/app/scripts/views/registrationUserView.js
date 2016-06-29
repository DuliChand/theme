/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.RegistrationUserView = Backbone.View.extend({

el : '#backbone-portlet-user-registeration',
				initialize : function() {
					_.bindAll(this, 'render');
					this.registerUser = new RegisterUser();
					this.loginUser = new LoginUser();
					this.getCityState = new GetCityState();
					
					Backbone.Validation.bind(this, {model: this.registerUser});
					Backbone.Validation.bind(this, {model: this.getCityState});
				},
				events : {
					'click .social-icons-register .text' : 'registrationForm',
					'click #registerUser' : 'registerNow',
					'click #facebook_login_button' : 'facebookRegister',
					'click #gmail_login_button' : 'googleRegister',
					'keyup #pinCode' : 'generateCityState'
				},
				render : function() {
					var self = this, loginCookie, redirectURL;
					
					$(self.el).html(Handlebars.templates.signup_form());
					/*Backbone.Validation.bind(this);*/
					
					fbLoad(document);
					  googleLoad();
						
						if (location.href.indexOf("#") != -1) {
							window.opener.location.href = 'http://'+window.location.host+'/web/fashionandyou/login?'
									+ location.hash.substring(1);
							window.close();
						} else if (location.href.indexOf("?") != -1) {
							location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
						}
				
						function getURLParameter(name) {
						  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
						}
						
						if(loginCookie != undefined || loginCookie != null) {

							/*if(document.referrer != "") {
								redirectURL = document.referrer;
								window.location.replace(redirectURL);
							} else {
								redirectURL = window.location.origin + "/home";
								window.location.replace(redirectURL);
							}*/
							
							redirectURL = window.location.origin + "/home";
							window.location.replace(redirectURL);
						}
				},
				render2 : function(data){
					
					var userData = JSON.stringify({baseDTO: data.customerWrapper.customers}),
						redirectURL = "";
					
					$.cookie('COOKIE_FNY_LOGIN_ID', data.customerWrapper.customers.loginId, {path: '/'});
					$.cookie('COOKIE_FNY_CUSTOMER_ID', data.customerWrapper.customers.customerId, {path: '/'});
					$.cookie('_FUI', userData, {path: '/'});
					$.cookie('CARTID', $.cookie('CARTID'), {path: '/'});
					
					/*$("#backbone-portlet-user-section-header").html(Handlebars.templates.accountdropdown(JSON.parse(userData)));*/
					
					
					/*if(document.referrer != "") {
						redirectURL = document.referrer;
						window.location.replace(redirectURL);
					} else {
						redirectURL = window.location.origin + "/home";
						window.location.replace(redirectURL);
					}*/
					
					redirectURL = window.location.origin + "/home";
					window.location.replace(redirectURL);
					
				},
				registrationForm : function(e) {
					e.preventDefault();
					$(".social-icons-register").slideUp();
					$(".reg-form").slideDown();

				},
				registerNow : function(event) {
					
					event.preventDefault();
					
					var self = this,
						currForm = $("#sign_up_form"),
						userData = {
							firstName 		: currForm.find("#firstName").val(),
							lastName 		: currForm.find("#lastName").val(),
							emailId 		: currForm.find("#emailId").val(),
							password 		: currForm.find("#password").val(),
							confirmPassword : currForm.find("#confirmPassword").val(),
							/*pinCode 		: currForm.find("#pinCode").val(),
							location 		: currForm.find("#location").val(),
							country 		: currForm.find("#country").val(),
							state 			: currForm.find("#state").val(),
							usr_contact 	: currForm.find("#usr_contact").val(),
							address1 		: currForm.find("#address1").val(),
							city 			: currForm.find("#city").val(),*/
							gender 			: currForm.find('input:radio[name=gender]:checked').val()
						};

					if(self.registerUser.set(userData)) {
						self.registerUser.save({}, {
							success : function(model, response) {
						
								var jsonObject = response;
								/*$("#registerarea").hide();*/
								
								if(jsonObject.domainResponse.errorCode) {
									
									//console.log(jsonObject.domainResponse.errorMessage);
									/*$(".reg-message").html(jsonObject.domainResponse.errorMessage).addClass("failure").show();*/
									
								} else {
									
									/*$(".reg-message").html("Successfully Registered").addClass("success").show();*/
									self.loginNow(userData);
								}
							}
						});
					} else {
						this.$('.alert-error').fadeIn();
					}
				},
				facebookRegister : function(event) {
					
					//console.log("Clicked facebook button");
					event.preventDefault();
					
					self = this;
					
					fbAuthCheck(function(data) {
						//console.log(data);
						var response = data;
						var new_user = new User({
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
					//console.log("Clicked Google button");
					event.preventDefault();
					
					var self = this;
					
					googleAuthCheck(function(data) {
						//console.log(data);
						var response = data;
						var new_user = new User({
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
				generateCityState : function(event) {
					event.preventDefault();	
					
					var self = this,
						addressType = $(event.currentTarget).attr("id").split("_")[0],
						pinCode = $("#pinCode").val(),
						data = {};
					
					if(pinCode.length === 6) {
						data = {
							pinCode : pinCode
						};
						
						if(self.getCityState.set(data)) {
							self.getCityState.save({}, {
								success : function(model, response) {

									if(response.pinCodeWrapper.responseCode === "FAILURE"){
										alert(response.pinCodeWrapper.errorMessage);
									} else {
										//console.log(response);
										
										var locationList = "<option value='0'>Select Your Location</option>",
											locationArr = [], cityName = "", stateName = "", countryName = "";
										
										if(response.pinCodeWrapper.pinCodes.location) 
											locationArr = response.pinCodeWrapper.pinCodes.location;
										
										if(response.pinCodeWrapper.pinCodes.cityMaster != undefined && 
										   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
										   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
											cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
											stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
											countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
										}									
										
										/*if(locationArr != undefined) {
											
										}*/
										
										for(var i=0;i<locationArr.length;i++){
											locationList += "<option value='"+ locationArr[i].locationId + "'>" + locationArr[i].locationDetails + "</option>";
										}
										
										$("#city").val(cityName);
										$("#state").val(stateName);
										$("#country").val(countryName);
										$("#location").html(locationList);
									}
								}
							});
						} else {
							this.$('.alert-error').fadeIn();
						}
					}
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
				}
});

})();
