/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.userForgotView = Backbone.View.extend({

    	el : '#forgotPopup',
						events : {
							'click #forgotPassword' : 'resetPassword'							
						},
						initialize : function() {
							_.bindAll(this, 'render');
							this.forgotPassword = new ForgotPassword();
							
							Backbone.Validation.bind(this, {model: this.forgotPassword});							
						},
						render : function() {
							$(this.el).html(Handlebars.templates.forgotpassword());
						},
						resetPassword : function(event) {
							event.preventDefault();
							var self = this,
								data = self.$('form#lighBoxForgotPass').serializeObject();
							 
							self.forgotPassword.bind('validated', function(isValid, model, errors) {
								  // do something
									var errorsArr = errors[Object.keys(errors)[0]];
									$('.error_Container').css("display", "block");
									$('#proceedToCheckout').prop('disabled', false);
									$(".error_Container").text(errorsArr);
									if(isValid){
										$('.error_Container').css("display", "none");
									}
								});
							
							if (self.forgotPassword.set(data)) {								
								self.forgotPassword.save({}, {
									success : function(model, response) {
										var jsonObject = response;
					            	  	
										if(jsonObject.domainResponse.responseCode === "FAILURE"){
											$('.error_Container').text(jsonObject.domainResponse.errorMessage);
											$('.error_Container').css("display", "block");
						  				}
						  				else{
						  					$('.error_Container').css("display", "none");
						  					alert("Password successfully  reset");
						  				}
									}
								});
							} else {
								self.$('.alert-error').fadeIn();
							}
						}

    	});

})();
