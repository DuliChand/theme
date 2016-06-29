/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.BrowseSimilarEventsView = Backbone.View.extend({

        template: JST['app/scripts/templates/browsesimilarevents.hbs'],

       el: '#backbone-portlet-browse-similar-events',
      events: { 

      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new BrowseSimilarEvents();
      },
      render: function () {
        var self = this;
        self.model.fetch({
        error: function(response){
        console.log(response);
        },
          success: function (model, response) {

            $(self.el).html(Handlebars.templates.browsesimilarevents(model.toJSON()));
            
          }
        });
      }

    });

})();
