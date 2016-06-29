/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.UserLoginView = Backbone.View.extend({

        template: JST['app/scripts/templates/login_form.hbs'],

 el: '#backbone-portlet-user-login',
      events: { 
          'click .social-icons-register .text':'registrationForm',
          'click #registerUser' : 'submit',
          'click #facebook_login_button' : 'facebookLogin',
          'click #gmail_login_button' : 'googleLogin'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.user = new Webshop.Models.UserLogin();
        
        Backbone.Validation.bind(this, {model: this.user});
      },
      render: function () {
          var self = this,
              loginCookie = $.cookie( URL_PROPERTIES.getCookie('COOKIE_FNY_LOGIN_ID')),
              redirectURL = "";
              
          $(self.el).html(Handlebars.templates.login_form());
          
          fbLoad(document);
          googleLoad();
            
            if (location.href.indexOf("#") != -1) {
                window.opener.location.href = 'http://'+window.location.host+'/home?'
                        + location.hash.substring(1);
                window.close();
            } else if (location.href.indexOf("?") != -1) {
                location.href= "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + getURLParameter('access_token');
            }
    
            function getURLParameter(name) {
              return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
            }
            
            if(loginCookie != undefined || loginCookie != null) {

                /*if(document.referrer != "") {
                    redirectURL = document.referrer;
                    window.location.replace(redirectURL);
                } else {
                    redirectURL = window.location.origin + "/home";
                    window.location.replace(redirectURL);
                }*/
                
                redirectURL = window.location.origin + "/cart";
                window.location.replace(redirectURL);
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
            
            redirectURL = window.location.origin + "/cart";
            window.location.replace(redirectURL);
      },
      registrationForm: function(e){
          
          e.preventDefault();
          $(".social-icons-register").slideUp();
          $(".reg-form").slideDown();
         
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
      facebookLogin : function(event) {
            console.log("Clicked facebook button");
            event.preventDefault();
            
            var self = this;
            
            fbAuthCheck(function(data) {
                //console.log(data);
                var response = data;
                var new_user = new Webshop.Models.UserLogin({
                    firstName : (response.first_name === undefined) ? "" : response.first_name,
                    lastName : (response.last_name === undefined) ? "" : response.last_name,
                    email : (response.email === undefined) ? "" : response.email,
                    sourceCode : CONSTANTS_PROPERTIES.get('fb_login'),
                    gender : (response.gender == "male")?"M":"F"
                });
                
                new_user.save({}, {
                    error : function(response) {
                        alert("some error occured...");
                    },
                    success : function(model, response) {
                        if(response.customerWrapper.responseCode === "FAILURE") {
                            alert(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        },
        googleLogin : function(event) {
            
            console.log("Clicked Google button");
            event.preventDefault();
            
            var self = this;
            
            googleAuthCheck(function(data) {
                console.log(data);
                var response = data;
                
                var new_user = new Webshop.Models.UserLogin({
                    firstName : (response.name.familyName === undefined) ? "" : response.name.familyName,
                    lastName : (response.name.givenName === undefined) ? "" : response.name.givenName,
                    email : (response.emails === undefined) ? "" : response.emails[0].value,
                    sourceCode : CONSTANTS_PROPERTIES.get('google_login'),
                    gender : (response.gender == "male")?"M":"F"
                });
                
                new_user.save({}, {
                    error : function(response) {
                        alert("some error occured...");
                    },
                    success : function(model, response) {
                        if(response.customerWrapper.responseCode === "FAILURE") {
                            alert(response.customerWrapper.errorMessage);
                        } else {
                            self.render2(response);
                        }
                    }
                });
            });
        }
    });

})();
