/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.FeaturedProductView = Backbone.View.extend({

        template: JST['app/scripts/templates/featuredroduct.hbs'],

       el: '#backbone-portlet-featured-products',
      events: { 

      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new FeaturedProduct();
      },
      render: function () {
        var self = this;
        self.model.fetch({
        error: function(response){
        console.log(response);
        },
          success: function (model, response) {

            $(self.el).html(Handlebars.templates.featuredproduct(model.toJSON()));
            

            if($('.featurepro').length > 0) {
              $('.featurepro').bxSlider({
            slideWidth : 149,
            minSlides : 2,
            maxSlides : 6,
            slideMargin : 9,
            pager : false
          });
            }
      
          }
        });
      }
    });

})();
