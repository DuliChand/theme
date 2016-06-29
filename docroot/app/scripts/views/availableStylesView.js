/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    
    Webshop.Views.AvailableStylesView = Backbone.View.extend({

        templates: {
            styles: JST['app/scripts/templates/styles.hbs']
        },
        el: '#style-popup',
        events: {
            'click #addStyles': 'addToCustomerStyles'
        },

        initialize: function() {
            _.bindAll(this, 'render');

            this.availableStyles = new Webshop.Models.AvailableStyles();
            this.addCustomerStyles = new Webshop.Models.AddCustomerStyles();

        },

        render: function() {

        },

        addToCustomerStyles: function(e) {

            e.preventDefault();

            var customerStyleGuides = [],
                selectedStylesList = $("input:radio[name=styles]:checked");

            $.each(selectedStylesList, function(i, element) {

                customerStyleGuides.push({
                    "styleGuide": {
                        "styleGuideId": $(element).attr("id")
                    }
                });

            });

            var customerStyleGuide = {
                "customerStyleGuideWrapper": {
                    "customerStyleGuides": customerStyleGuides
                }
            }

            if (this.addCustomerStyles.set(customerStyleGuide)) {
                this.addCustomerStyles.save({}, {
                    error: function(xhr, status, errorThrown) {
                        console.log(errorThrown + '\n' + status + '\n' + xhr.statusText);
                    },
                    success: function(model, response) {
                        var jsonObject = response;
                        if ((jsonObject.customerStyleGuideWrapper.responseCode) === "SUCCESS") {
                            console.log("added successfully");
                            $.fancybox.close();
                            //this.render();
                        } else {
                            console.log(jsonObject.customerStyleGuideWrapper.responseCode);
                        }
                    }
                });
            } else {
                this.$('.alert-error').fadeIn();
            }

        },

        renderAvailableStylesView: function() {
            var self = this;

            this.availableStyles.fetch({
                error: function(response) {
                    console.log("error:" + response);
                },

                success: function(model, response) {

                    if ($(self.el).html(self.templates.styles(response))) {
                        $.fancybox($(self.el));
                    }
                }
            });
        }
    });

})();