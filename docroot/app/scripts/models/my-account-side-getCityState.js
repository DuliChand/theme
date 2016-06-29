/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.MyAccountSideGetCityState = Backbone.Model.extend({
        sync : function(method, model, options) {

            var data = model.toJSON(),
                pinCode = data.shipping_pincode || data.billing_pincode, 
                urlBase = URL_PROPERTIES.get('CITYSTATE'),
                urlRoot = urlBase.replace("{pinCode}", pinCode),
            
                params = _.extend({
                    type : 'GET',
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : ""
                }, options);
        
            return $.ajax(params);
        }
    });

})();
