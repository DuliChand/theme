/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.CartNavView = Backbone.View.extend({

        templates: {
            cartnav: JST['app/scripts/templates/cartnav.hbs']
        },
        el: '#backbone-portlet-cart-nav',
        events: {
            '.checkout-step': 'updateStepStatus'
        },
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render: function() {
            var self = this, billinUrl , paymentUrl ,
                pageURL = window.location.pathname.toLowerCase();
			if($.cookie('_FUI')){
				billinUrl = "billing";
				paymentUrl = "payment"
			}
			else{
				billinUrl = "login";
				paymentUrl = "login"
			}			
				
			var cartNavObj = { 
				"billing" : billinUrl ,
				"payment" : paymentUrl
			}
            $(self.el).html(self.templates.cartnav(cartNavObj));

            if (pageURL.match(/billing$/) != null) {
                $(".checkout-step.selected").removeClass('selected');
                $(".checkout-step.billing").addClass('selected');
            }

            if (pageURL.match(/payment$/) != null) {
                $(".checkout-step.selected").removeClass('selected');
                $(".checkout-step.payment").addClass('selected');
            }

            if (pageURL.match(/cart$/) != null) {
                $(".checkout-step.selected").removeClass('selected');
                $(".checkout-step.cart").addClass('selected');
            }
        },
        updateStepStatus: function(event) {
            event.preventDefault();
        }

    });
})();
