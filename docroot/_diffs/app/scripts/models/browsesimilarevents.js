/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.BrowseSimilarEvents = Backbone.Model.extend({

        sync: function(method, model, options) {

            var urlBase = URL_PROPERTIES.get('SIMILAR_EVENTS'),

                eventId = $("#backbone-portlet-product-listing").data("id"),
                urlRoot = urlBase.replace('{eventId}', eventId),

                params = _.extend({
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: urlRoot,
                    processData: false,
                }, options);
            return $.ajax(params);
        }
    });

})();
