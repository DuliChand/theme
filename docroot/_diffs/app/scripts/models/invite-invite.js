/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.InviteInvite = Backbone.Model.extend({

           sync: function (method, model, options) {
        var data = model.toJSON(),
        
            customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
            //urlBase = URL_PROPERTIES.get('SERVICE_URL_INVITE_FRIEND'),
            //urlRoot = urlBase.replace("{customerId}", customerId),
            
            urlRoot = 'http://172.18.123.49/business-web/account/business?operationType=sendInvite',
            
            params = _.extend({
                type : 'POST',
                beforeSend : function(xhr) {
                    xhr.withCredentials = true;
                },
                contentType : "application/json; charset=utf-8",
                dataType : 'json',
                url : urlRoot,
                processData : false,
                data : data
            }, options);
    
        return $.ajax(params);
      }
    });

})();
