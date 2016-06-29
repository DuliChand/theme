/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.RegisterPopUpView = Backbone.View.extend({

        templates: {
            registerpopup: JST['app/scripts/templates/registerpopup.hbs']
        },
        el: '#registerPopup',
        events: {
            'click #registerUser': 'registerNow',
            'click #facebook_signup_button': 'facebookRegister',
            'click #gmail_signup_button': 'googleRegister',
            'click .radio': 'chooseGender'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.registerUser = new Webshop.Models.RegisterUserPopUp();
            this.loginUser = new Webshop.Models.LoginUserPopUp();

            Backbone.Validation.bind(this, {
                model: this.registerUser
            });
        },
        render: function() {

        	var self = this;

            $(this.el).html(self.templates.registerpopup());

        },
        render2: function(data) {

            var userData = JSON.stringify({
                baseDTO: data.customerWrapper.customers
            });

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

            var redirectURL = window.location.origin + window.location.pathname;
            window.location.replace(redirectURL);

        },
        registerNow: function(event) {

            event.preventDefault();
            /*$('#registerUser').attr('disabled','disabled');*/

            var self = this,
                currFormLight = $("#lighBoxSignUp");

            self.registerUser.bind('validated', function(isValid, model, errors) {
                // do something
                var errorsArr = errors[Object.keys(errors)[0]];
                $("#registerPopup .error_Container").text(errorsArr).css("display", "block");
                /*$('#registerUser').removeAttr('disabled');*/
            });

            var userData = {
                firstName: currFormLight.find("#firstName").val(),
                lastName: currFormLight.find("#lastName").val(),
                emailId: currFormLight.find("#emailId").val(),
                password: currFormLight.find("#password").val(),
                gender: currFormLight.find('input:radio[name=gender]:checked').val()
            };

            if (self.registerUser.clear().set(userData)) {

                $('#registerPopup .error_Container').text("").css("display", "none")
                /*$('#registerUser').attr('disabled','disabled');*/

                self.registerUser.save({}, {
                    error: function(model, response) {
                        /*console.log("Oops! something went wrong.");*/
                        /*$('#registerUser').removeAttr('disabled');*/
                    },
                    success: function(model, response) {

                        var jsonObject = response;

                        if (jsonObject.domainResponse.errorCode) {

                            $('#registerPopup .error_Container').text(jsonObject.domainResponse.errorMessage).css("display", "block");

                        } else {

                            $('#registerPopup .error_Container').text("").css("display", "none");
                            self.loginNow(userData);
                            /*console.log("Successfully Registered");*/

                            /*var redirectURL = window.location.origin + "/home";
											window.location.replace(redirectURL);*/
                        }

                        /*$('#registerUser').removeAttr('disabled');*/
                    }
                });
            } else {
                this.$('.alert-error').fadeIn();
            }
        },
        facebookRegister: function(event) {

            /*console.log("Clicked facebook button");*/
            event.preventDefault();

            var self = this;

            fbAuthCheck(function(data) {
                /*console.log(data);*/
                var response = data;
                var new_user = new RegisterUser({
                    firstName: response.first_name,
                    lastName: response.last_name,
                    email: response.email,
                    sourceCode: CONSTANTS_PROPERTIES.get('fb_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });
                new_user.save({}, {
                    error: function(response) {
                        alert("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                            alert(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        },
        googleRegister: function(event) {

            /*console.log("Clicked Google button");*/
            event.preventDefault();

            var self = this;

            googleAuthCheck(function(data) {
                /*console.log(data);*/
                var response = data;
                var new_user = new RegisterUser({
                    firstName: response.name.familyName,
                    lastName: response.name.givenName,
                    email: response.emails[0].value,
                    sourceCode: CONSTANTS_PROPERTIES.get('google_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });
                new_user.save({}, {
                    error: function(response) {
                        alert("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {
                            alert(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
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
        chooseGender: function(e) {
            $(e.currentTarget)
                .next("label").toggleClass("label-checked")
                .siblings("label").toggleClass("label-checked");
        }
    });

})();
