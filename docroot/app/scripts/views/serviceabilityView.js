/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.ServiceabilityView = Backbone.View.extend({

        template: JST['app/scripts/templates/serviceability.hbs'],

            el: 'body',
                events : {
                    'click #proceedBtn' : 'submit'
                },
                initialize : function() {
                    _.bindAll(this, 'render');
                    this.model = new Serviceability();
                    this.container = $('#backbone-portlet-serviceability');
                    //this.render();
                },
                render : function() {
                    
                    var self = this;                    
                    $(self.container).html(Handlebars.templates.serviceability());
                    
                    Backbone.Validation.bind(this);
                    
                    $("#message").hide();
                    $("#message1").hide();                  
                },
                
                
                submit : function(event) {
                    event.preventDefault();
                                
                    var data = {
                            pincode: $("#pincode").val()
                    };
                    
                    if (this.model.set(data)) {
                        this.model.save({}, {
                            success : function(model, response) {
                                
                                if(response.pinCodeWrapper.responseCode === "FAILURE"){
                                    alert(response.pinCodeWrapper.errorMessage);
                                    /*$("#message1").show();
                                    $("#message").hide();*/
                                } else {
                                    if(response.pinCodeWrapper.pinCodes.deliveryAvailable) {
                                        $("#message1").hide();
                                        $("#message").show();
                                    } else {
                                        $("#message1").show();
                                        $("#message").hide();
                                    }
                                }
                            }
                        });
                    } else {
                        this.$('.alert-error').fadeIn();
                    }

                }

    });

})();
