/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.InviteInviteView = Backbone.View.extend({

        template: JST['app/scripts/templates/invite-invite.hbs'],

 el: '#backbone-portlet-invite',
      
      events: {                              
          
      },
      
      initialize: function () {
          
        console.log("invite view initialized"); 
        _.bindAll(this, 'render');
        
        this.invite = new Webshop.Models.InviteInvite();
        
      },
      
      render: function () {
        
      }

    });

})();
