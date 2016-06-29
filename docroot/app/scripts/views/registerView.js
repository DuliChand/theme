/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.RegisterView = Backbone.View.extend({

    	templates: {
            register: JST['app/scripts/templates/register.hbs']
        },
        el: '#backbone-portlet-user-registeration',
        initialize: function() {
            _.bindAll(this, 'render');
            this.registerUser = new Webshop.Models.RegisterUser();
            this.loginUser = new Webshop.Models.LoginUser();
            this.getCityState = new Webshop.Models.GetCityState();

            Backbone.Validation.bind(this, {
                model: this.registerUser
            });
            Backbone.Validation.bind(this, {
                model: this.getCityState
            });
        },
        events: {
            'click .social-icons-register .text': 'registrationForm',
            'click #registerUser': 'registerNow',
            'click #facebook_login_button': 'facebookRegister',
            'click #gmail_login_button': 'googleRegister',
            'keyup #pinCode': 'generateCityState'
        },
        render: function() {
            var self = this,
                loginCookie, redirectURL;

            $(self.el).html(self.templates.register());
            /*Backbone.Validation.bind(this);*/

            fbLoad(document);
            googleLoad();

            /*if (location.href.indexOf("#") != -1) {
							window.opener.location.href = 'http://'+window.location.host+'/web/fashionandyou/login?'
									+ location.hash.substring(1);
							window.close();
						} else if (location.href.indexOf("?") != -1) {
							location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
						}*/

            function getURLParameter(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            }

            if (loginCookie != undefined || loginCookie != null) {

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

            /*$("#backbone-portlet-user-section-header").html(self.templates.accountdropdown(JSON.parse(userData)));*/

            var referrerPage = $.cookie('pageUrlData').split('/').pop(-1);
               
            if(referrerPage == 'cart'){
				redirectURL = window.location.origin + "/billing";
				window.location.replace(redirectURL);
			}else{
                redirectURL = document.referrer;
                window.location.replace(redirectURL);
            }


            //redirectURL = window.location.origin + "/home";
            //window.location.replace(redirectURL);

        },
        registrationForm: function(e) {
            e.preventDefault();
            $(".social-icons-register").slideUp();
            $(".reg-form").slideDown();

        },
        registerNow: function(event) {

            event.preventDefault();

            var self = this,

                currForm = $("#sign_up_form");
            self.registerUser.bind('validated', function(isValid, model, errors) {
                // do something
                var errorsArr = errors[Object.keys(errors)[0]];
                $("#registerarea .error_Container").text(errorsArr).css("display", "block");
                /*$('#registerUser').removeAttr('disabled');*/
            });
            var userData = {
                firstName: currForm.find("#firstName").val(),
                lastName: currForm.find("#lastName").val(),
                emailId: currForm.find("#emailId").val(),
                password: currForm.find("#password").val(),
                confirmPassword: currForm.find("#confirmPassword").val(),
               /* pinCode: currForm.find("#pinCode").val(),
                locationDetail: $("#location").find(':selected').text(),
                locationId: $("#location").find(':selected').attr('value'),
                country: currForm.find("#country").val(),
                state: currForm.find("#state").val(),
                usr_contact: currForm.find("#usr_contact").val(),
                address1: currForm.find("#address1").val(),
                city: currForm.find("#city").val(),*/
                gender: currForm.find('input:radio[name=gender]:checked').val()
            };

            if (self.registerUser.set(userData)) {
                $('#registerarea .error_Container').text("").css("display", "none");
                self.registerUser.save({}, {
                    success: function(model, response) {

                        var jsonObject = response;

                        if (jsonObject.domainResponse.errorCode) {

                            $('#registerarea .error_Container').text(jsonObject.domainResponse.errorMessage).css("display", "block");
                            $.fancybox.close();    
                        } else {
                            $('#registerarea .error_Container').text(jsonObject.domainResponse.errorMessage).css("display", "none");
                            self.loginNow(userData);
                        }
                    }
                });
            } else {
                this.$('.alert-error').fadeIn();
            }
        },
        facebookRegister: function(event) {

            event.preventDefault();

            self = this;

            fbAuthCheck(function(data) {
                var response = data;
                var registerUser = new Webshop.Models.RegisterUser({
                    firstName: response.first_name,
                    lastName: response.last_name,
                    email: response.email,
                    sourceCode: CONSTANTS_PROPERTIES.get('fb_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });
                registerUser.save({}, {
                    error: function(response) {
                       // console.log("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                         //   console.log(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        },
        googleRegister: function(event) {
            event.preventDefault();

            var self = this;

            googleAuthCheck(function(data) {
                var response = data;
                var registerUser = new Webshop.Models.RegisterUser({
                    firstName: response.name.familyName,
                    lastName: response.name.givenName,
                    email: response.emails[0].value,
                    sourceCode: CONSTANTS_PROPERTIES.get('google_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });
                registerUser.save({}, {
                    error: function(response) {
                       // console.log("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                          //  console.log(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        },
        generateCityState: function(event) {
            event.preventDefault();

            var self = this,
                addressType = $(event.currentTarget).attr("id").split("_")[0],
                pinCode = $("#pinCode").val(),
                data = {};

            if (pinCode.length === 6) {
                data = {
                    pincode: pinCode
                };

                if (self.getCityState.set(data)) {
                    self.getCityState.save({}, {
                        success: function(model, response) {

                            if (response.pinCodeWrapper.responseCode === "FAILURE") {
                              //  console.log(response.pinCodeWrapper.errorMessage);
                            } else {
                                /*console.log(response);*/

                                var locationList = "<option value='0'>Select Your Location</option>",
                                    locationArr = [],
                                    cityName = "",
                                    stateName = "",
                                    countryName = "";

                                if (response.pinCodeWrapper.pinCodes.locationMaster)
                                    locationArr = response.pinCodeWrapper.pinCodes.locationMaster;

                                if (response.pinCodeWrapper.pinCodes.cityMaster != undefined &&
                                    response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
                                    response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
                                    cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
                                    stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
                                    countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
                                }

                                if (locationArr.length) {
                                    for (var i = 0; i < locationArr.length; i++) {
                                        locationList += "<option value='" + locationArr[i].locationId + "'>" + locationArr[i].locationDetails + "</option>";
                                    }
                                } else {
                                    locationList += "<option value='" + locationArr.locationId + "'>" + locationArr.locationDetails + "</option>";
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
        loginNow: function(userData) {

            var self = this,
                data = {
                    loginId: userData.emailId,
                    password: userData.password
                };

            if (self.loginUser.set(data)) {
                self.loginUser.save({}, {

                    success: function(model, response) {
                        /*$('#loginUser').prop('disabled', false);*/
                        if (response.customerWrapper.responseCode === "FAILURE") {
                          //  console.log(response.customerWrapper.errorMessage);
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