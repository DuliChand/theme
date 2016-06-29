/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Herobanner = Backbone.Model.extend({

            sync : function(method, model, options) {
                var data = model.toJSON(),
                    categoryName = $("#backbone-portlet-hero-banner").data("category-name");

                var urlBase = URL_PROPERTIES.get('SERVICE_URL_CATEGORY_EVENTS'), 
                    urlRoot = "";

                if (categoryName === "" || categoryName === undefined) {
                    urlRoot = urlBase.replace("{categoryName}", "0");
                } else {
                    urlRoot = urlBase.replace("{categoryName}", categoryName);
                }

                var params = _.extend({
                    type : 'GET',
                    dataType : 'json',
                    url : urlRoot,
                    processData : false,
                    data : $.param(data)
                }, options);
                return $.ajax(params);
            }
    });

})();
