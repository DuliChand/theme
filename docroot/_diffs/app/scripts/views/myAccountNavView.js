/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.MyAccountNavView = Backbone.View.extend({

        templates: {
            profilenav: JST['app/scripts/templates/profilenav.hbs']
        },
        el: '#backbone-portlet-my-account-nav',
        events: {

        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.Rewards = new Webshop.Models.Rewards();
            this.storedCreditSum = new Webshop.Models.StoredCreditSum();
            this.container = $('#backbone-portlet-my-account-nav');
        },

        render: function() {

            var self = this,
                ddwntimer,
                pageURL = window.location.pathname.toLowerCase();

            $(self.container).html(self.templates.profilenav());

            if(pageURL.match(/profile$/) != null) {
                $(".profile").addClass('selected').siblings("li").removeClass("selected");
            }
          
            if(pageURL.match(/credits$/) != null) {
                  $(".credits").addClass('selected').siblings("li").removeClass("selected");
            }
          
            if(pageURL.match(/orders$/) != null) {
              $(".orders").addClass('selected').siblings("li").removeClass("selected");
            }

            if(pageURL.match(/invite$/) != null) {
              $(".invite").addClass('selected').siblings("li").removeClass("selected");
            }
          
            if(pageURL.match(/favourites$/) != null) {
              $(".notifications").addClass('selected').siblings("li").removeClass("selected");
            }

            $(".dropdown").hover(function() {
                window.clearTimeout(ddwntimer);
                var notClicked = $('.dropdown').not(this).removeClass("open");
                if (!$(this).hasClass("open")) {
                    $(this).addClass("open");
                }
            }, function() {
                var ddwn = $(this);
                window.clearTimeout(ddwntimer);
                ddwntimer = window.setTimeout(function() {
                    ddwn.removeClass("open");
                }, 1000);
            });

        }
    });
    
})();
