/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};


(function () {
    'use strict';

    Webshop.Models.StoredCreditSum = Backbone.Model.extend({

       sync : function(method, model, options) {
            
            var urlBase = URL_PROPERTIES.get('SERVICE_URL_GET_CREDIT_BALANCE'),
            
            fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
            customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID'),
            
            urlTemp = urlBase.replace("{customerId}", customerId),
            
            urlRoot = urlTemp.replace("{deviceId}", fnyToken),
            
            params = _.extend({
                type : 'GET',
                beforeSend : function(xhr) {
                    xhr.withCredentials = true;
                },
                contentType : "application/json; charset=utf-8",
                dataType : 'json',
                url : urlRoot,
                processData : false,
            }, options);
            return $.ajax(params);
    
        }
    });

})();
