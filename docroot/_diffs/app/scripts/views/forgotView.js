/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.ForgotView = Backbone.View.extend({

        templates: {
            forgotpassword: JST['app/scripts/templates/forgotpassword.hbs']
        },
        el: '#backbone-portlet-forgot-password',
        events: {
            'click #registerUser': 'submit'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.forgotPassword = new Webshop.Models.ForgotPassword();

            Backbone.Validation.bind(this, {
                model: this.forgotPassword
            });
        },
        render: function() {
            var self = this;
            $(self.el).html(self.templates.forgotpassword());
        },
        submit: function(event) {
            event.preventDefault();

            var email_id = this.$('form').serializeObject();
            if (this.forgotPassword.set(email_id)) {
                this.forgotPassword.save({}, {
                    success: function(model, response) {
                        var jsonObject = response;

                        if (jsonObject.domainResponse.responseCode === "FAILURE") {
                            alert(jsonObject.domainResponse.errorMessage);
                        } else {
                            alert("Password successfully reset");
                        }
                    }
                });
            } else {
                this.$('.alert-error').fadeIn();
            }
        }
    });

})();