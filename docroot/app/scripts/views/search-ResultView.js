/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.SearchResultView = Backbone.View.extend({

        template: JST['app/scripts/templates/search_results.hbs'],


        el : '#backbone-portlet-search-results',

        events : {},

        initialize : function() {
            _.bindAll(this, 'render');
            this.searchResult = new Webshop.Models.SearchResult();
            this.searchEventResult = new Webshop.Models.SearchEventResult();
        },

        render : function() {
            var self = this;

            self.searchResult.clear().fetch({
                success : function(model, response) {
                    var data = model.toJSON();
                    console.log(data.hits);
                    $(self.el).html(Handlebars.templates.searchresults(data.hits));
                    
                    var searchKeyword =  $("#backbone-portlet-search-results").data("id");
                    $('#keyword').text(searchKeyword);
                    
                    if($('.rolover-layer').length > 0) {
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
                    self.fetchSearchedEvents();
                }
            });
        },
        
        fetchSearchedEvents : function(){
            var self = this;
            self.searchEventResult.clear().fetch({
                success : function(model, response) {
                    var data = model.toJSON();
                    console.log(data.hits);
                    $("#eventArea").html(Handlebars.templates.search_results(data.hits));
                }
            });
        }

    });

})();
