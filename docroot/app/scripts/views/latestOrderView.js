/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.LatestOrderView = Backbone.View.extend({
        templates: {
            latestorder: JST['app/scripts/templates/latestorder.hbs']
        },

        el: '#backbone-portlet-latest-order',
        events: {},

        initialize: function() {
            _.bindAll(this, 'render');
            this.model = new Webshop.Models.LatestOrder();
            this.container = $('#backbone-portlet-latest-order');
        },
        render: function(lastOrderData) {
        	var self = this,str;
            if (lastOrderData.orderHeaderWrapper.responseCode === "SUCCESS") {
            str = lastOrderData.orderHeaderWrapper;
            $('#backbone-portlet-latest-order').html(self.templates.latestorder(str));

            if ($(".sidebar-floating").length > 0) {
            $(window).on("scroll scrollstart", function() {
                var outer = $('#left');
                var inner = $('#sidebar');
                var length = outer.height() - inner.height() + outer.offset().top;
                var scroll = $(this).scrollTop();
                var height = inner.height() + 'px';

                if (scroll < outer.offset().top) {
                    inner.css({
                        'position': 'absolute',
                        'top': '0',
                        'bottom': 'auto'
                    });
                } else if (scroll > length) {
                    inner.css({
                    'position': 'absolute',
                    'bottom': '0',
                    'top': 'auto'
                });
                } else {
                    inner.css({
                        'position': 'fixed',
                        'top': '35px',
                        'bottom': 'auto'
                    });
                }
            });
        }
        } else {
            alert(jsonObject.orderHeaderWrapper.errorCode);
        }
        }

    });

})();
