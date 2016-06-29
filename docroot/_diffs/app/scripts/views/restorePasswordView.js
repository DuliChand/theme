/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.RestorePasswordView = Backbone.View.extend({

        template: JST['app/scripts/templates/restorePasswordView.hbs'],
      el: '#backbone-portlet-restore-password',
      events: { 
        'click .btn-cartpop': 'submit'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new User();
      },
      render: function () {
        var self = this;
        $(self.el).html(Handlebars.templates.restorepassword());

      },
      submit: function(e){
        e.preventDefault();
        var data = this.$('form').serializeObject();
          if (this.model.set(data)) {
            this.model.save({}, {
              success: function (model, response) {
              }
            });
          } else {
            this.$('.alert-error').fadeIn();
          }
      }
    });

})();
