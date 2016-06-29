/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.CategoryView = Backbone.View.extend({

        template: {
            category: JST['app/scripts/templates/category.hbs']
        },
        el: '#backbone-portlet-main-navigation',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.navigation = new Webshop.Models.Category();
        },
        render: function() {

            var self = this;

            self.navigation.fetch({

                error: function(xhr, status, errorThrown) {
                   // console.log(errorThrown + '\n' + status + '\n' + xhr.statusText);
                },
                success: function(model, response) {
                    var data = model.toJSON();

                    $(self.el).html(self.template.category(data));

                    $(".menuicon").on("click", function(e) {
                        e.preventDefault();
                        $(".menulisting").toggle();
                    });

                    $('.ref_link').hover(function(e) {
                        e.preventDefault();
                        var hidemenu = $(this).attr('rel');
                        $('.hidemenu').hide();
                        $('#' + hidemenu).show();
                    }, function(e) {
                        e.preventDefault();
                        var hidemenu = $(this).attr('rel');
                    });
                }
            });
        }

    });

})();