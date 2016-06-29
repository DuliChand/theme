/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.RecentlyBrowsedView = Backbone.View.extend({
        el: '#recentlyBrowsedProducts',
        templates: {
            recentlybrowsed: JST['app/scripts/templates/recentlybrowsed.hbs']
        },
        events: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.getProductBrowsingHistory = new Webshop.Models.GetProductBrowsingHistory();
        },
        render: function(data) {

            var self = this;





                    /*console.log(response);*/


                        $("#recentlyBrowsedProducts").html(self.templates.recentlybrowsed(data));

                        setTimeout(function() {

                            if ($(".ca-wrapper").length > 0) {
                                $('.ca-wrapper').bxSlider({
                                    slideWidth: 147,
                                    minSlides: 2,
                                    maxSlides: 6,
                                    slideMargin: 9,
                                    pager: false
                                });
                            }

                        }, 500);
            }            


    });

})();