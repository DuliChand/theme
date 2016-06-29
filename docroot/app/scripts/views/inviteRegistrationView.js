/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.InviteRegistrationView = Backbone.View.extend({

        templates: {
            inviteregistration: JST['app/scripts/templates/inviteregistration.hbs']
        },

        el: '#backbone-portlet-invite-registration',

        events: {
            'click .go': 'registerCustomer'
        },

        initialize: function() {

            /*console.log("invite view initialized");*/
            _.bindAll(this, 'render');

            this.inviteUser = new Webshop.Models.InviteUser();

            Backbone.Validation.bind(this, {
                model: this.inviteUser
            });
        },
        getUrlParameters: function() {
            var sURL = window.document.URL.toString(),
                arrParams, arrURLParams, arrParamNames, arrParamValues;
                
            if (sURL.indexOf("?") > 0) {
                arrParams = sURL.split("?");
                arrURLParams = arrParams[1].split("&");
                arrParamNames = new Array(arrURLParams.length);
                arrParamValues = new Array(arrURLParams.length);
                var i = 0;
                for (i = 0; i < arrURLParams.length; i++) {
                    var sParam = arrURLParams[i].split("=");
                    arrParamNames[i] = sParam[0];
                    if (sParam[1] != "")
                        arrParamValues[i] = unescape(sParam[1]);
                    else
                        arrParamValues[i] = "No Value";
                }
            }
            return arrParamValues;
        },
        render: function() {
            var self = this,
                paramValues = self.getUrlParameters(),
                invitee = {
                    "user": paramValues[0]
                };

            $(self.el).html(self.templates.inviteregistration(invitee));
        },

        registerCustomer: function(e) {
            e.preventDefault();
            var self = this,
                paramValues = this.getUrlParameters(),
                userData = {
                    customerId: paramValues[1],
                    invitedEmailId: paramValues[2],
                    firstName: $("#userFirstName").val(),
                    emailId: $("#userEmailId").val(),
                    password: $("#userPassword").val(),
                    gender: $('input:radio[name=gender]:checked').val()
                };
            if (self.inviteUser.set(userData)) {
                self.inviteUser.save({}, {
                    error: function(model, response) {
                        /*console.log("Oops! something went wrong.");*/
                    },
                    success: function(model, response) {
                        var jsonObject = response;
                        if (jsonObject.domainResponse.responseCode === "FAILURE") {
                            alert(jsonObject.domainResponse.errorMessage);
                        } else if (jsonObject.domainResponse.responseCode === "SUCCESS") {
                            /*console.log("Successfully Registered");*/
                            var redirectURL = window.location.origin + "/home";
                            window.location.replace(redirectURL);
                        } else {
                            /*console.log("Oops! something went wrong.");*/
                        }
                    }
                });
            } else {
                this.$('.alert-error').fadeIn();
            }
        }
    });

})();