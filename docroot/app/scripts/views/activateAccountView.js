/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.ActivateAccountView = Backbone.View.extend({

        templates: {
            activationfailure: JST['app/scripts/templates/activationfailure.hbs'],
            activationsuccess: JST['app/scripts/templates/activationsuccess.hbs']
        },
        el: '#backbone-portlet-activate-account',
      events:{
        'click #loginUser' : 'loginNow'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.activateUser = new ActivateAccount();
        this.user = new User();
        
        Backbone.Validation.bind(this, {model: this.user});
      },
      render: function () {
        
        var self = this;
        
        if(self.activateUser.set("")) {
        self.activateUser.save({}, {
          error : function(model, response) {
          //  console.log(response);
          },
          success : function(model, response) {
            
            if(response.domainResponse.responseCode === "FAILURE"){
              $(self.el).html(Handlebars.templates.activationfailure());
            } else {
              $(self.el).html(Handlebars.templates.activationsuccess());
            }
          }
        });
      } else {
        this.$('.alert-error').fadeIn();
      }
      },
      render2 : function(data){
      
      var userData = JSON.stringify({baseDTO: data.customerWrapper.customers});
      
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
      }
      redirectURL = window.location.origin + "";*/
      
      window.location.assign('/home');
    },      
      loginNow : function(e) {
        
        e.preventDefault();
        
        var self = this,
            userData = self.$('form').serializeObject();
        
        self.user.bind('validated', function(isValid, model, errors) {
            
            // do something
        var errorsArr = errors[Object.keys(errors)[0]];
        $('.errormsg1').css("display", "block");
        $("#errorMessage").text(errorsArr);
        
        if(isValid) {
          $('.errormsg1').css("display", "none");
        }
      });
        
        self.user.clear();
        if (self.user.set(userData)) {
        self.user.save({}, {          
          success : function(model, response) {
            
            if(response.customerWrapper.responseCode === "FAILURE") {
              
              $("#errorMessage").text(response.customerWrapper.errorMessage);
              $('.errormsg1').css("display", "block");
              
            } else {
              
              $('.errormsg1').css("display", "none");             
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