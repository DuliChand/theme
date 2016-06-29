/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.SearchResultsView = Backbone.View.extend({

        template: JST['app/scripts/templates/searchresults.hbs'],

        el: '#backbone-portlet-search-results',
            events: { 
            },
            initialize: function () {
              _.bindAll(this, 'render');
              this.model = new SearchResults();
            },
            renderFilteredProducts : function(data) {
              var self = this;
              
              /*$(self.el).html(Handlebars.templates.searchresults(data));*/
              $(self.el).html(Handlebars.templates.searchresults());
            },
            render: function () {
              var self = this;
              
              self.model.fetch({
              error: function(response){
              console.log("error");
              },
                success: function (model, response) {

                  $(self.el).html(Handlebars.templates.searchresults(model.toJSON()));
                  $(self.el).html(Handlebars.templates.searchresults());
                  
                  if ($('.rolover-layer').length > 0) {
                      $('.prod-img').contenthover({
                          effect: 'slide',
                          data_selector: '.rolover-layer',
                          width: 0,
                          height: 76,
                          overlay_width: 0,
                          overlay_height: 76,
                          overlay_x_position: 'center',
                          overlay_y_position: 'bottom',
                          overlay_background: '',
                          overlay_opacity: 1,
                          slide_speed: 400,
                          slide_direction: 'bottom',
                          zindex: 2,
                          wrapper_class: 'ch_wrapper',
                          normal_class: 'ch_normal',
                          hover_class: 'ch_hover'
                      });
                  }
                }
              });
            }
    });

})();
