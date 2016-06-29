/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.AvailableBrandsView = Backbone.View.extend({

        templates: {
            brands: JST['app/scripts/templates/brands.hbs']
        },
        el: '#brandForm',
        events: {
            'click #addFavBrands': 'addToFavoriteBrands'
        },
        initialize: function() {

            _.bindAll(this, 'render');
            this.addFavoriteBrands = new Websop.Models.AddFavoriteBrands();
            this.favoriteBrands = new Websop.Models.FavoriteBrands();
        },
        render: function() {

        },
        addToFavoriteBrands: function(e) {

            e.preventDefault();
            $('#addFavBrands').prop('disabled', true);

            var customerFavouriteBrands = [],
                customerFavouriteBrand = {},
                selectedBrandsList = $("input:checkbox[name=bank]:checked"),
                id = $(e.parentTarget).attr("id");

            $.each(selectedBrandsList, function(i, element) {

                customerFavouriteBrands.push({
                    "favouriteBrand": {
                        "favouriteBrandId": $(element).attr("id")
                    }
                });
            });

            customerFavouriteBrand = {
                "customerFavouriteBrandWrapper": {
                    "customerFavouriteBrands": customerFavouriteBrands
                }
            };

            console.log("customerFavouriteBrand: =====> ");
            console.log(customerFavouriteBrand);

            if (this.addFavoriteBrands.set(customerFavouriteBrand)) {
                this.addFavoriteBrands.save({}, {
                    error: function(xhr, status, errorThrown) {
                        console.log(errorThrown + '\n' + status + '\n' + xhr.statusText);
                        $('#addFavBrands').prop('disabled', false);
                    },
                    success: function(model, response) {

                        if ((response.customerFavouriteBrandWrapper.responseCode) === "SUCCESS") {
                            console.log("added successfully");
                            $.fancybox.close();
                            $('#addFavBrands').prop('disabled', false);
                        } else {
                            console.log(response.customerFavouriteBrandWrapper.responseCode);
                            $('#addFavBrands').prop('disabled', false);
                        }
                    }
                });

            } else {
                this.$('.alert-error').fadeIn();
            }
        },
        renderAvailableBrandsView: function() {

            var self = this;

            this.favoriteBrands.fetch({
                error: function(response) {
                    console.log("error:" + response);
                },
                success: function(model, response) {

                    if ($(self.el).html(self.templates.brands(model.toJSON()))) {

                        $.fancybox($(self.el));

                        console.log(self.templates.brands(model.toJSON()));
                        console.log($(self.el));
                    }
                }
            });
        }
    });

})();
