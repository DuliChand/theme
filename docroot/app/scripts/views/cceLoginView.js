/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.CCELoginView = Backbone.View.extend({

      templates: {
            ccelogin: JST['app/scripts/templates/ccelogin.hbs']
        },
      el: '#backbone-portlet-cce-login',
      events: { 
          'click #registerUser' : 'submit'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.user = new Webshop.Models.CCELogin();
        
        Backbone.Validation.bind(this, {model: this.user});
      },
      render: function () {
          var self = this;
             // loginCookie = $.cookie( URL_PROPERTIES.getCookie('COOKIE_FNY_LOGIN_ID')),
              //redirectURL = "";
              
          $('#backbone-portlet-cce-login').html(self.templates.ccelogin());
          
          
      },
      submit: function(event){
          event.preventDefault();
          var self = this,
              userData = self.$('form').serializeObject();
          
          self.user.clear();
          
          if (self.user.set(userData)) {
                self.user.save({}, {                    
                    success : function(model, response) {
                        
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
      render2 : function(data){
            
            var userData = JSON.stringify({baseDTO: data.customerWrapper.customers}),
                redirectURL = "";
            
            $.cookie('COOKIE_FNY_LOGIN_ID', data.customerWrapper.customers.loginId, {path: '/'});
            $.cookie('COOKIE_FNY_CUSTOMER_ID', data.customerWrapper.customers.customerId, {path: '/'});
            $.cookie('_FUI', userData, {path: '/'});
            $.cookie('CARTID', $.cookie('CARTID'), {path: '/'});
            
            /*if(document.referrer != "") {
                redirectURL = document.referrer;
                window.location.replace(redirectURL);
            } else {
                redirectURL = window.location.origin + "/home";
                window.location.replace(redirectURL);
            }*/
            
            redirectURL = window.location.origin + "/profile";
            window.location.replace(redirectURL);
      }
    });

})();
