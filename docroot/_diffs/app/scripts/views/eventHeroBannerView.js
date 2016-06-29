/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.EventHeroBannerView = Backbone.View.extend({

        template: JST['app/scripts/templates/eventherobanner.hbs'],

        el: '#backbone-portlet-elhb',
      events: { 
        
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new EventHeroBanner();
      },
      render: function () {
        var self = this;
        
        /*$(self.el).html(Handlebars.templates.eventherobanner());*/
        
        /*self.model.fetch({
          error: function(response){
          console.log("error");
          },
            success: function (model, response) {

                var data = model.toJSON(), heroBannersData = {};
                  
                $(data.value.children).each(function(index,obj){
                  if(obj.data.categoryName === "heroGallery"){
                    heroBannersData = obj;
                  }
                });
                
                
                loadjscssfile("/hero-banner-portlet/js/utilities-hero-banner-home.js","js");
              }
        });*/
      }

    });

})();
