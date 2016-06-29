/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.ForgotPasswordView = Backbone.View.extend({

        template: JST['app/scripts/templates/forgotpassword.hbs'],

         el: '#backbone-portlet-forgot-password',
      events: { 
        'click #registerUser' : 'submit'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new ForgotPassword();
      },
      render: function () {
        var self = this;
        $(self.el).html(Handlebars.templates.forgotpassword());
        
        Backbone.Validation.bind(this);

      },
      submit: function(event){
        event.preventDefault();
        
        var email_id = this.$('form').serializeObject();
          if (this.model.set(email_id)) {
            this.model.save({}, {
              success: function (model, response) {
                  var jsonObject = response;
                  
            if(jsonObject.domainResponse.responseCode === "FAILURE"){
              alert(jsonObject.domainResponse.errorMessage);
            }
            else{
              alert("Password successfully  reset");
            }
              }
            });
          } else {
            this.$('.alert-error').fadeIn();
          }
      }
    });

})();
