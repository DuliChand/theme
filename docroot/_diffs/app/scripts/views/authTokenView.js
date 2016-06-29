/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};



(function() {
    'use strict';
    
var FnyCustomToken = $('#FnyCustomToken').data('tokenid');

    Webshop.Views.AuthTokenView = Backbone.View.extend({

        templates: {

        },
        el: '#backbone-portlet-get-cart',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.createAuthToken = new Webshop.Models.CreateAuthToken();
            this.getCart = new Webshop.Models.GetCart();
        },
        render: function() {

            var self = this;

            if($.cookie(FnyCustomToken) === undefined || $.cookie(FnyCustomToken) === "" || $.cookie(FnyCustomToken) === ""){
                self.generateToken();
            } else {
                /*self.generateCart();*/
            }
        },
        generateToken: function() {

            var self = this;

            self.createAuthToken.fetch({
                error: function(response) {
                  //  console.log(response);
                },
                success: function(model, response) {

                    var data = response;

                    //console.log("token is "+FnyCustomToken);

                    $.cookie(""+FnyCustomToken+"", data.access_token, {
                        expires: 365,
                        path: '/'
                    });

                    /*self.generateCart();*/

                }
            });
        },
        generateCart: function() {

            var self = this;

            self.getCart.fetch({
                error: function(response) {
                    /*console.log("error response:---- ");
                    console.log(response);*/
                },
                success: function(model, response) {
                    /*console.log("success response:---- ");
                    console.log(response);*/
                }
            });
        }

    });

})();
