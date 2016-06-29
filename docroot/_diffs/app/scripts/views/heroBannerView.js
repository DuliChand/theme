/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.HeroBannerView = Backbone.View.extend({

        template: JST['app/scripts/templates/herobanner.hbs'],

        el: '#backbone-portlet-hero-banner',
      events: { 
        
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new HeroBanner();
      },
      render: function () {
        var self = this;
        self.model.fetch({
          error: function(response){
       //   console.log("error");
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
                  
                //  console.log("There is no data available for hero banner section...");
                }
                
                /*loadjscssfile("/hero-banner-portlet/js/utilities-hero-banner-home.js","js");*/
              }
        });
      }

    });

})();
