/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.SearchResults = Backbone.Model.extend({

                sync : function(method, model, options) {
                    var data = model.toJSON(),
                        keyword = $("#backbone-portlet-search-results").data("search-keyword"),
                        
                        urlBase = 'http://172.16.1.182:9200/fnyeventindex/_search?&q={keyword}*', 
                        urlRoot = urlBase.replace("{keyword}", keyword),

                        params = _.extend({
                            type : 'GET',
                            dataType : 'json',
                            url : urlRoot,
                            processData : false,
                            cache: false,
                            data : $.param(data)
                        }, options);
                    return $.ajax(params);
                }
    });

})();
