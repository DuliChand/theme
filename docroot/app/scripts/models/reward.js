/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Reward = Backbone.Model.extend({

     sync: function (method, model, options) {
        var data = model.toJSON(),
        loginId = $.cookie(URL_PROPERTIES.getCookie('COOKIE_FNY_LOGIN_ID')),
        urlBase = URL_PROPERTIES.get('SERVICE_URL_REWARD_POINTS'),
        urlRoot = urlBase.replace("{loginId}", loginId),

        params = _.extend({
            type: 'GET',
            dataType: 'json',
            url: urlRoot,
            processData: false,
            data: $.param(data)
          }, options);
        return $.ajax(params);
      }
    });

})();
