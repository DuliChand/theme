/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.RewardView = Backbone.View.extend({

        template: JST['app/scripts/templates/reward.hbs'],

    el : '#backbone-portlet-reward',

        events : {},

        initialize : function() {
            _.bindAll(this, 'render');
            this.model = new Reward();
        },

        render : function() {
            var self = this;

            self.model.fetch({
                success : function(model, response) {
                    var json={rewards:response};
                    console.log(json);
                    $(self.el).html(Handlebars.templates.reward(json));
                }
                
            });

        }
    });

})();
