/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.BillingView = Backbone.View.extend({
	
		templates: {
            billing_form: JST['app/scripts/templates/billing_form.hbs'],
            billing_form_blank: JST['app/scripts/templates/billing_form_blank.hbs']
        },
		el : '#backbone-portlet-billing-form',
		events : {
			'click #proceedToCheckout' : 'saveAddress',
			'keyup #billing_pincode' : 'generateCityState',
			'keyup #shipping_pincode' : 'generateCityState'
		},
		initialize : function() {
			_.bindAll(this, 'render');
			this.address = new Webshop.Models.GetLastOrderAddress();
			this.checkout = new Webshop.Models.Checkout();
			this.getCityState = new Webshop.Models.GetCityState();
			
			Backbone.Validation.bind(this, {model: this.checkout});
			Backbone.Validation.bind(this, {model: this.getCityState});
		},
		render : function(lastOrderAddress ,billingCityData ,shippingCityData) {
			
			var self = this;
		
					
					var data = lastOrderAddress,
						billingName, billingNameArr, billingFirstName, billingLastName,
						shippingName, shippingNameArr, shippingFirstName, shippingLastName;
					
					if(data.orderAddressWrapper.responseCode==="ADDRESS_NOT_AVAILABLE"){
						
						$("#billingContent").prepend(self.templates.billing_form_blank());
						$('.product-loader').css('display','none');
						if($.cookie('COOKIE_PINCODE_DELIVERABLE')===undefined){
							//console.log("undefined pincode");
						}else{
							$("#billing_pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
							$("#shipping_pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
						}
						
						
					} else if(data.orderAddressWrapper.orderAddresses.length){
						
						for(var i=0;i<data.orderAddressWrapper.orderAddresses.length;i++){
							if(data.orderAddressWrapper.orderAddresses[i].addressType==='BILLING'){
					
								billingName = data.orderAddressWrapper.orderAddresses[0].fullName,
								billingNameArr = billingName.split(" "),
								billingFirstName = billingNameArr[0],
								billingLastName = billingNameArr[billingNameArr.length - 1]
							}
							if(data.orderAddressWrapper.orderAddresses[i].addressType==='SHIPPING'){
								
								shippingName =  data.orderAddressWrapper.orderAddresses[0].fullName,
								shippingNameArr = shippingName.split(" "),
								shippingFirstName = shippingNameArr[0], 
								shippingLastName = shippingNameArr[shippingFirstName.length - 1];
							}
							
						}
						
						$("#billingContent").prepend(self.templates.billing_form(data.orderAddressWrapper));
						$('.product-loader').css('display','none');
						/*if($.cookie('COOKIE_PINCODE_DELIVERABLE')===undefined){
							console.log("undefined pincode");
						}else{
							$("#billing_pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
							$("#shipping_pincode").val($.cookie('COOKIE_PINCODE_DELIVERABLE'));
						}*/
						
					} else {
						
						billingName = data.orderAddressWrapper.orderAddresses.fullName,
						billingNameArr = billingName.split(" "),
						billingFirstName = billingNameArr[0],
						billingLastName = billingNameArr[billingNameArr.length - 1];
						
						$("#billingContent").prepend(self.templates.billing_form(data.orderAddressWrapper));
						$('.product-loader').css('display','none');
					}
					
					//$("#billing_pincode").trigger("keyup");
					//$("#shipping_pincode").trigger("keyup");

					self.generateCityStateOnLoad(billingCityData , 'billing');
					self.generateCityStateOnLoad(shippingCityData ,'shipping');

					
					
					$("#billing_firstname").val(billingFirstName);
					$("#billing_lastname").val(billingLastName);
					
					$("#shipping_firstname").val(shippingFirstName);
					$("#shipping_lastname").val(shippingLastName);
					
					
					$("#shippingAddressForm").hide();
					$("#addressSameAsAbove").on("change", function() {
						
						if ($(this).prop("checked")) {
							$("#shippingAddressForm").slideUp();
						} else {
							$("#shippingAddressForm").slideDown();
						}
					});
		
		},
		saveAddress : function(event) {
			
			event.preventDefault();
			


			$('#proceedToCheckout').prop('disabled', true);
			
			var billing_firstname = $("#billing_firstname").val(),
				billing_lastname = $("#billing_lastname").val(),
				billing_address = $("#billing_address").val(),
				billing_pincode = $("#billing_pincode").val(),
				billing_locationDetail = $("#billing_location").find(':selected').text(),
				billing_locationId = $("#billing_location").find(':selected').attr('value'),
				billing_city = $("#billing_city").val(),
				billing_state = $("#billing_state").val(),
				billing_landmark = $("#billing_landmark").val(),
				billing_country = $("#billing_country").val(),
				billing_mobile = $("#billing_mobile").val(),
				billing_altno = $("#billing_altno").val(),
			
				shipping_firstname = $("#shipping_firstname").val(),
				shipping_lastname = $("#shipping_lastname").val(),
				shipping_address = $("#shipping_address").val(),
				shipping_pincode = $("#shipping_pincode").val(),
				shipping_locationDetail = $("#shipping_location").find(':selected').text(),
				shipping_locationId = $("#shipping_location").find(':selected').attr('value'),
				shipping_city = $("#shipping_city").val(),
				shipping_state = $("#shipping_state").val(),
				shipping_landmark = $("#shipping_landmark").val(),
				shipping_country = $("#shipping_country").val(),
				shipping_mobile = $("#shipping_mobile").val(),
				shipping_altno = $("#shipping_altno").val(),
			
				orderAddressData = {};
			
			if($("#addressSameAsAbove").prop("checked")) {
				
				orderAddressData = {
						
						billing_firstname	:	billing_firstname,
						billing_lastname	:	billing_lastname,
						billing_address		:	billing_address,
						billing_pincode		:	billing_pincode,
						billing_locationDetail: billing_locationDetail,
						billing_locationId  :   billing_locationId,
						billing_city		:	billing_city,
						billing_state		:	billing_state,
						billing_landmark	:	billing_landmark,
						billing_country		:	billing_country,
						billing_mobile		:	billing_mobile,
						billing_altno		:	billing_altno,
						
						shipping_firstname	:	billing_firstname,
						shipping_lastname	:	billing_lastname,
						shipping_address	:	billing_address,
						shipping_pincode	:	billing_pincode,
						shipping_locationDetail:billing_locationDetail,
						shipping_locationId  :  billing_locationId,
						shipping_city		:	billing_city,
						shipping_state		:	billing_state,
						shipping_landmark	:	billing_landmark,
						shipping_country	:	billing_country,
						shipping_mobile		:	billing_mobile,
						shipping_altno		:	billing_altno
				};
				
			} else {
				
				orderAddressData = {
						billing_firstname	:	billing_firstname,
						billing_lastname	:	billing_lastname,
						billing_address		:	billing_address,
						billing_pincode		:	billing_pincode,
						billing_locationDetail: billing_locationDetail,
						billing_locationId  :   billing_locationId,
						billing_city		:	billing_city,
						billing_state		:	billing_state,
						billing_landmark	:	billing_landmark,
						billing_country		:	billing_country,
						billing_mobile		:	billing_mobile,
						billing_altno		:	billing_altno,
						
						shipping_firstname	:	shipping_firstname,
						shipping_lastname	:	shipping_lastname,
						shipping_address	:	shipping_address,
						shipping_pincode	:	shipping_pincode,
						shipping_locationDetail:shipping_locationDetail,
						shipping_locationId  :  shipping_locationId,
						shipping_city		:	shipping_city,
						shipping_state		:	shipping_state,
						shipping_landmark	:	shipping_landmark,
						shipping_country	:	shipping_country,
						shipping_mobile		:	shipping_mobile,
						shipping_altno		:	shipping_altno
				};
				
			}

			this.checkout.bind('validated', function(isValid, model, errors) {
				  // do something
					var errorsArr = errors[Object.keys(errors)[0]];
					$('.errormsg1').css("display", "block");
					$('#proceedToCheckout').prop('disabled', false);
					$("#errorMessage").text(errorsArr);
					
					$(".form-address input.input-field-option").css('border','1px solid #ccc');
					$(".form-address textarea").css('border','1px solid #ccc');
					$("#" + Object.keys(errors)[0] + "").css('border','1px solid red').focus();
					
					if(isValid){
						$('.errormsg1').css("display", "none");						
						$('#proceedToCheckout').prop('disabled', true);
						$(".form-address input.input-field-option").css('border','1px solid #ccc');
						$(".form-address textarea").css('border','1px solid #ccc');
					}
				});
				
			     if(this.checkout.set(orderAddressData)) {
					this.checkout.save({}, {
						error: function() {
							$('#proceedToCheckout').prop('disabled', false);
						},
						success : function(model, response) {
							var redirectURL = window.location.origin + "/payment";
							window.location.replace(redirectURL);
						}
						});
					} else {
						this.$('.alert-error').fadeIn();
					}

				//proceed calls-----
				
				/*	var billingCheckOuturl = $('#billingCheckoutUrl').attr('action');
				    $.ajax({
				          url :billingCheckOuturl,            
				          data: "",
				          type: "POST",
				          dataType: "json",
				          beforeSend: function(){
				        	  
				          },
				          error: function() {

								$('#proceedToCheckout').prop('disabled', false);
						  },
				          success: function(data) {
				        	var redirectURL = window.location.origin + "/payment";
							window.location.replace(redirectURL);

				          }
				    });
				});*/




				//proceed ends here---
					/*error: function() {
						$('#proceedToCheckout').prop('disabled', false);
					},
					success : function(model, response) {
						var redirectURL = window.location.origin + "/payment";
						window.location.replace(redirectURL);
					}*/
				
			
		},
		generateCityState : function(event) {
			event.preventDefault();
			
			var self = this,
				addressType = $(event.currentTarget).attr("id").split("_")[0],
				pinCode = $("#" + addressType + "_pincode").val(),
				data = {};
			
			if(pinCode.length === 6) {
				if(addressType === "billing") {
					data = {
						pincode : pinCode
					};
				} else {
					data = {
						pincode : pinCode
					};
				}
				
				
				/*this.getCityState.bind('validated', function(isValid, model, errors) {
					  // do something
						var errorsArr = errors[Object.keys(errors)[0]];
						$('.errormsg1').css("display", "block");
						$('#proceedToCheckout').prop('disabled', false);
						$("#errorMessage").text(errorsArr);
						
						$(".form-address input.input-field-option").css('border','1px solid #ccc');
						$("#" + Object.keys(errors)[0] + "").css('border','1px solid red').focus();
						
						if(isValid){
							$('.errormsg1').css("display", "none");						
							$('#proceedToCheckout').prop('disabled', true);
							$(".form-address input.input-field-option").css('border','1px solid #ccc');
						}
					});*/
				
				self.getCityState.clear();
				if(self.getCityState.set(data)) {
					self.getCityState.save({}, {
						success : function(model, response) {

							if(response.pinCodeWrapper.responseCode === "FAILURE"){
								/*console.log(response.pinCodeWrapper.errorMessage);*/
							} else {
								
								$.cookie('COOKIE_PINCODE_DELIVERABLE',response.pinCodeWrapper.pinCodes.pinCode, {path: '/'});
								
								var locationList = "<option value='0'>Select Your Location</option>",
									locationArr = [], cityName = "", stateName = "", countryName = "";
								
								if(response.pinCodeWrapper.pinCodes.locationMaster) 
									locationArr = response.pinCodeWrapper.pinCodes.locationMaster;
								
								/*console.log("............."+locationArr.locationDetails);*/
								if(response.pinCodeWrapper.pinCodes.cityMaster != undefined && 
								   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
								   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
									cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
									stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
									countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
								}									
								
								if(locationArr.length){
									for(var i=0;i<locationArr.length;i++){
										locationList += "<option value='"+ locationArr[i].locationId + "'>" + locationArr[i].locationDetails + "</option>";
									}
								}else{
									locationList += "<option value='"+ locationArr.locationId + "'>" + locationArr.locationDetails + "</option>";
								}
								
								
								$("#" + addressType + "_city").val(cityName);
								$("#" + addressType + "_state").val(stateName);
								$("#" + addressType + "_country").val(countryName);
								$("#" + addressType + "_location").html(locationList);
							}
						}
					});
				} else {
					this.$('.alert-error').fadeIn();
				}
			}
		},

		generateCityStateOnLoad : function(pincodeData , pinID) {
			
			
			var self = this,
				addressType = pinID;
	
			
				
				
				
				/*this.getCityState.bind('validated', function(isValid, model, errors) {
					  // do something
						var errorsArr = errors[Object.keys(errors)[0]];
						$('.errormsg1').css("display", "block");
						$('#proceedToCheckout').prop('disabled', false);
						$("#errorMessage").text(errorsArr);
						
						$(".form-address input.input-field-option").css('border','1px solid #ccc');
						$("#" + Object.keys(errors)[0] + "").css('border','1px solid red').focus();
						
						if(isValid){
							$('.errormsg1').css("display", "none");						
							$('#proceedToCheckout').prop('disabled', true);
							$(".form-address input.input-field-option").css('border','1px solid #ccc');
						}
					});*/
				
							
							var response = pincodeData;

		

							if(response.pinCodeWrapper.responseCode === "FAILURE"){
								/*console.log(response.pinCodeWrapper.errorMessage);*/
							} else {
								
								$.cookie('COOKIE_PINCODE_DELIVERABLE',response.pinCodeWrapper.pinCodes.pinCode, {path: '/'});
								
								var locationList = "<option value='0'>Select Your Location</option>",
									locationArr = [], cityName = "", stateName = "", countryName = "";
								
								if(response.pinCodeWrapper.pinCodes.locationMaster) 
									locationArr = response.pinCodeWrapper.pinCodes.locationMaster;
								
								/*console.log("............."+locationArr.locationDetails);*/
								if(response.pinCodeWrapper.pinCodes.cityMaster != undefined && 
								   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
								   response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
									cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
									stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
									countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
								}									
								
								if(locationArr.length){
									for(var i=0;i<locationArr.length;i++){
										locationList += "<option value='"+ locationArr[i].locationId + "'>" + locationArr[i].locationDetails + "</option>";
									}
								}else{
									locationList += "<option value='"+ locationArr.locationId + "'>" + locationArr.locationDetails + "</option>";
								}
								
								
								$("#" + addressType + "_city").val(cityName);
								$("#" + addressType + "_state").val(stateName);
								$("#" + addressType + "_country").val(countryName);
								$("#" + addressType + "_location").html(locationList);
							}
						
							
		}
	});
	
})();