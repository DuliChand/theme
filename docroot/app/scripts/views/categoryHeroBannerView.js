/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.CategoryHeroBannerView = Backbone.View.extend({

        template: JST['app/scripts/templates/herobannercategory.hbs'],

              el: '#backbone-portlet-category-hero-banner',
      events: {         
      },
      initialize: function () {
      
      _.bindAll(this, 'render');
        this.categoryHeroBanner = new CategoryHeroBanner();
        
      },
      render: function () {
        
        var self = this;
        
        self.categoryHeroBanner.fetch({
          error: function(response){
       //   console.log(response);
          },
            success: function (model, response) {
                
              var data = model.toJSON(), heroBannersData = {};
                
                $(data.value.children).each(function(index,obj){
                  if(obj.data.categoryName === "heroGallery"){
                    heroBannersData = obj;
                  }
                });
                
                if(heroBannersData.data != undefined) {
                  
                  $(self.el).html(Handlebars.templates.herobanner(heroBannersData));
                  
                  if($('.hero-slider .bxslider').length > 0) { 
                    $('.hero-slider .bxslider').bxSlider({
                      auto: true,
                      controls: false,
                      mode: 'fade'
                    });
                  }
                  
              } else {
                
//console.log("There is no data available for hero banner section...");
              }
            }
        });
      }
    });

})();
