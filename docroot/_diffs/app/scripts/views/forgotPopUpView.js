/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.ForgotPopUpView = Backbone.View.extend({

        templates: {
            forgotpasswordpopup: JST['app/scripts/templates/forgotpasswordpopup.hbs']
        },
        el: '#forgotPopup',
        events: {
            'click #forgotPassword': 'resetPassword'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.forgotPassword = new Webshop.Models.ForgotPasswordPopUp();

            Backbone.Validation.bind(this, {
                model: this.forgotPassword
            });
        },
        render: function() {

        	var self = this;

            $(this.el).html(self.templates.forgotpasswordpopup());
        },
        resetPassword: function(event) {
            event.preventDefault();
            var self = this,
                data = self.$('form#lighBoxForgotPass').serializeObject();

            self.forgotPassword.bind('validated', function(isValid, model, errors) {
                // do something
                var errorsArr = errors[Object.keys(errors)[0]];
                $('#forgotPopup .error_Container').html(errorsArr);
                $('#forgotPopup .error_Container').css("display", "block")
                $('#proceedToCheckout').prop('disabled', false);
                if (isValid) {
                    $('#forgotPopup .error').css("display", "none");
                }
            });

            if (self.forgotPassword.set(data)) {
                self.forgotPassword.save({}, {
                    success: function(model, response) {
                        var jsonObject = response;

                        if (jsonObject.domainResponse.responseCode === "FAILURE") {
                            $('#forgotPopup .error_Container').html(jsonObject.domainResponse.errorMessage);
                            $('#forgotPopup .error_Container').css("display", "block")
                        } else {
                            $('#forgotPopup .error_Container').css("display", "none");
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