/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.InviteView = Backbone.View.extend({

        templates: {
            invite: JST['app/scripts/templates/invite.hbs'],
            acceptedInvitation: JST['app/scripts/templates/acceptedInvitation.hbs']
        },

	  el: '#backbone-portlet-invite',
      
      events: {                              
    	  'click #sendInvite' : 'inviteFriend',
    	  'click #invitetab2' : 'getAcceptedInvitations',
    	  'click #invitetab1' : 'getOpenInvitations'
      },
      
      initialize: function () {
        _.bindAll(this, 'render');
        
        this.sendInvite = new Webshop.Models.SendInvite();
        this.openInvitation = new Webshop.Models.OpenInvitation();
        this.acceptedInvitation = new Webshop.Models.AcceptedInvitation();
      },
      
      render: function () {
    	  var self = this;
          if(self.isUserLoggedIn()) {
              self.openInvitation.clear().fetch({
                  success: function(model,response){
                      $('.product-loader').hide();
                      if(response.domainResponse.responseCode === 'SUCCESS'){
                          $(self.el).html(self.templates.invite(model.toJSON()));
                         $("#invitearea").append($('#inviteFriendContent').html());
                          $('.errormsg1').hide();
                      }else{
                          $(self.el).html(self.templates.invite());
                          $('.errormsg1').hide();
                      }
                  },
                  error : function(response){
                      $('.product-loader').hide();
                  }
              });
          }else{
              var redirectURL = window.location.origin + "/login";
              window.location.replace(redirectURL);
          }
      },
      
      getOpenInvitations : function(e){
    	  e.preventDefault();
    	  var self = this;
    	  self.render();
      },
      
      getAcceptedInvitations : function(e){
    	  e.preventDefault();
    	  var self = this;
    	  self.acceptedInvitation.clear().fetch({
    		  success: function(model,response){
    			  if(response.domainResponse.responseCode === 'SUCCESS'){
    				  $("#acceptinvitation").html(self.templates.acceptedInvitation(model.toJSON()));
    				  $('#acceptinvitation').css("display", "block");
			          $('#openinvitation').css("display", "none");
			          $('#invitetab2').addClass('active');
			          $('#invitetab1').removeClass('active');
			          $('#invitetab3').removeClass('active');
    			  }
    			  else{}
    		  },
    		  error : function(response){}
    	  });
    	  
      },
      
      inviteFriend : function(e)
      {
    	  e.preventDefault();
          $('.errormsg1').find('#errorMessage').hide();
          var self = this,
          receipients = $('#recipeintList').val(),
          email = /\S+@\S+\.\S+/,
          recipeintList = receipients.split(',');
          
          if(receipients !== ""){
             
              if(!(email.test(receipients))){
                  $('.errormsg1').text("Please enter valid Email");
                  $('.errormsg1').show();
                  return false;
              };
              
              var customerInvitations = [];
                
              $.each( recipeintList, function( i, element ) {
                  customerInvitations.push({
                              "invitationText": $('#messageText').val(),
                              "invitedEmailId": recipeintList[i]
                        });
              });
        	  
            var customer = {
            "customer":{
               "customerId": $.cookie("COOKIE_FNY_CUSTOMER_ID"),
                  "customerInvitations": customerInvitations
              }
            }; 

        	  if (this.sendInvite.set(customer)) {
        		  this.sendInvite.save({}, {
    					success : function(model, response) {
    						if(response.domainResponse.responseCode === "SUCCESS"){
        						self.render();
    						}else if(response.domainResponse.responseCode === "PARTIAL_FAILURE" ){
                  
                   $('.errormsg1').text(response.domainResponse.message);
                   $('.errormsg1').show();
                   
                }else{
                  //console.log("service end failure");
                }
    					},
        		  		error : function(model, error){
        		  		}
    				});
        	  }
    	  }else{
    		  $('.errormsg1').show();
    	  }
      },
      isUserLoggedIn : function() {
        if($.cookie('COOKIE_FNY_LOGIN_ID') === undefined || $.cookie('COOKIE_FNY_LOGIN_ID') === "") {
            return false;
        } else {
            return true;
        }
      }
    });
  
})();