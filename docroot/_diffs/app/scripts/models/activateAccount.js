/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.ActivateAccount = Backbone.Model.extend({

        sync: function (method, model, options) {
            var data = model.toJSON(),
                activationCode = $("#backbone-portlet-activate-account").data("activation-code"),
                activationCode = activationCode.trim(),
                customerId = $("#backbone-portlet-activate-account").data("activation-id"),
                urlBase = URL_PROPERTIES.get('SERVICE_URL_ACTIVATE_ACCOUNT'),
                urlBase = urlBase.replace("{loginId}", customerId),
                urlRoot = urlBase.replace("{activationCode}", activationCode),

                params = _.extend({
                    type : 'POST',
                    beforeSend : function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType : "application/json; charset=utf-8",
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : ""
                }, options);
            
            return $.ajax(params);
      }
    });

})();