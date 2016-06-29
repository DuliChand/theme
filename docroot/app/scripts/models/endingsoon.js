/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.Endingsoon = Backbone.Model.extend({

       sync: function (method, model, options) {
        var data = model.toJSON(),
          categoryName = $("#backbone-portlet-ending-soon").data("category-name"), urlRoot = "";
        
          var url = document.URL.toLowerCase();
          if(url.substring(url.lastIndexOf("/")+1)=== "preview"){
        
          var urlBase = URL_PROPERTIES.get('CATEGORY_EVENTS_PREVIEW');
                   
            
             if(categoryName === "" || categoryName === undefined || categoryName === null) {
                  urlRoot = urlBase.replace("{categoryName}", "0");
                } else {
                  urlRoot = urlBase.replace("{categoryName}", categoryName);
                }
             
          }else{
             var urlBase = URL_PROPERTIES.get('CATEGORY_EVENTS');
  
             if(categoryName === "" || categoryName === undefined || categoryName === null) {
                urlRoot = urlBase.replace("{categoryName}", "0");
               } else {
                urlRoot = urlBase.replace("{categoryName}", categoryName);
               }
          }


        
        var params = _.extend({
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
