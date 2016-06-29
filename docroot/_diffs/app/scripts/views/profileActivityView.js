/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.ProfileActivityView = Backbone.View.extend({

        templates: {
            profileactivity: JST['app/scripts/templates/profileactivity.hbs']
        },
        el: '#backbone-portlet-profile-activity',
        events: {
            'click #add-brands':'addBrands',
            /*'click #styleGuideLink': 'styleGuidePopUp'*/
        },
        initialize: function () {
        	
            _.bindAll(this, 'render');
            this.customer = new Webshop.Models.Customer();
            this.container = $('#backbone-portlet-profile-activity');
        },
        render: function () {

            var self = this;

            self.customer.clear().fetch({
            	
                error: function (response) {
                    console.log("error : " + response);
                },
                success: function (model, response) {
                	
                	if(typeof(response.customerWrapper.customers.customerFavouriteBrand) === 'undefined') {
                		console.log("No brands available");
                		$(self.el).html(self.templates.profileactivity());
                	} else {
                		$(self.el).html(self.templates.profileactivity(model.toJSON()));
                	}
                   
                    if ($(window).width() > 760 ) {
                    	$('.brand-slides').bxSlider({
	                    	slideWidth:90,
	                        minSlides: 2,
	                        maxSlides: 5,
	                    	moveSlides: 1,
	                        slideMargin: 9,
	                    	pager: false
	                	});
                    	
	                	$('.history-slides, .browsed-slides, .network-slides, .today-slides').bxSlider({
	                    	slideWidth:90,
	                        minSlides: 2,
	                        maxSlides: 6,
	                    	moveSlides: 1,
	                        slideMargin: 10,
	                    	responsive: true,
	                    	pager: false
	                	});
	                	
                    } else {
                    	
                    	$('.brand-slides').bxSlider({
	                    	slideWidth:90,
	                        minSlides: 2,
	                        maxSlides: 6,
	                    	moveSlides: 1,
	                        slideMargin: 9,
	                    	pager: false
                    	});
	                    $('.history-slides, .browsed-slides, .network-slides, .today-slides').bxSlider({
	                    	slideWidth:90,
	                        minSlides: 2,
	                        maxSlides: 7,
	                    	moveSlides: 1,
	                        slideMargin: 10,
	                    	responsive: true,
	                    	pager: false
                    	});
                    }
                }
            });
        },
        styleGuidePopUp : function(e){
        	
        	e.preventDefault();
        	
        	this.availableStylesView = new Webshop.Views.AvailableStylesView();
			this.availableStylesView.renderAvailableStylesView();
        },
        addBrands : function(e) {
        	
        	e.preventDefault();
        	
        	this.availableBrandsView = new Webshop.Views.AvailableBrandsView();
			this.availableBrandsView.renderAvailableBrandsView();
        }
    });

})();