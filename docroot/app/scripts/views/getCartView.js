/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

var FnyCustomToken = $('#FnyCustomToken').data('tokenid');

(function() {
    'use strict';

    Webshop.Views.GetCartView = Backbone.View.extend({

        template: JST['app/scripts/templates/getCart.hbs'],

        el: '#backbone-portlet-get-cart',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.createAuthToken = new Webshop.Models.CreateAuthToken();
            this.createCart = new Webshop.Models.GetCart();
        },
        render: function() {

            var self = this;

            if ($.cookie('COOKIE_FNY_LOGIN_ID') === undefined) {
                if ($.cookie(FnyCustomToken) === undefined) {
                    self.generateToken();
                }

                if (!($.cookie(FnyCustomToken) === undefined)) {
                    self.generateCart();
                }
            } else {
                self.generateCart();
            }

        },
        generateToken: function() {

            var self = this;
            self.createAuthToken.fetch({
                error: function(response) {
                   // console.log("error: >>>>........ " + response);
                },
                success: function(model, response) {
                    var data = model.toJSON();

                    $.cookie(FnyCustomToken, data.access_token, {
                        expires: 365,
                        path: '/'
                    });
                    self.generateCart();
                }
            });
        },
        generateCart: function() {

            var self = this;

            self.createCart.fetch({
                error: function(response) {
                 //   console.log(response);
                },
                success: function(model, response) {
                    var data = model.toJSON();
                    /*$.cookie('CARTID', data.cart.cartId, {path: '/'});*/
                }
            });
        }

    });

})();