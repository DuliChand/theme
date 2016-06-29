/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.FeaturedCategoryView = Backbone.View.extend({

        template: JST['app/scripts/templates/featuredcategory.hbs'],

        el: '#backbone-portlet-featured-categories',
      events: { 

      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new FeaturedCategory();
      },
      render: function () {
        var self = this;
        self.model.fetch({
        error: function(response){
        console.log(response);
        },
          success: function (model, response) {
            
          $(self.el).html(Handlebars.templates.featuredcategory(model.toJSON()));
          
          
          $('.category-slider').bxSlider({
            slideWidth:149,
              minSlides: 2,
              maxSlides: 6,
              slideMargin: 9,
            pager: false
            });
            
          }
        });
      }
    });

})();
