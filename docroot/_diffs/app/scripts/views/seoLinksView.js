/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.SeoLinksView = Backbone.View.extend({

        templates: {
            footercategory: JST['app/scripts/templates/footercategory.hbs']
        },
        el: '#seoLinks',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.seoCategory = new Webshop.Models.Navigation();
        },
        render: function() {

          var self = this;
          
          var categoryData = sessionStorage.getItem("FNY_NAVIGATION");
          if (categoryData === undefined || categoryData === null || categoryData === ""){
              self.seoCategory.fetch({          
                    error: function(xhr, status, errorThrown){
                    }, 
                    success: function (model, response) {
                          
                          var data = response;
                          sessionStorage.setItem("FNY_NAVIGATION",  JSON.stringify(data));
                          $(self.el).html(self.templates.footercategory(data));
                          setTimeout(function(){
                          var loungeUrl = $('#seoLinks p:eq(5)').find('a:first-child').attr('href'),
                          shopsUrl = $('#seoLinks p:eq(6)').find('a:first-child').attr('href');
                          $('#seoLinks p:eq(5)').find('a').attr('href',loungeUrl)
                          $('#seoLinks p:eq(6)').find('a').attr('href',shopsUrl);
                        },500);
                    }
                  });
          }else{
              var categoryData = sessionStorage.getItem("FNY_NAVIGATION");
              if (categoryData) {
                  var data = JSON.parse(categoryData);
                  $(self.el).html(self.templates.footercategory(data));
                  
                  setTimeout(function(){
                          var loungeUrl = $('#seoLinks p:eq(5)').find('a:first-child').attr('href'),
                          shopsUrl = $('#seoLinks p:eq(6)').find('a:first-child').attr('href');
                          $('#seoLinks p:eq(5)').find('a').attr('href',loungeUrl)
                          $('#seoLinks p:eq(6)').find('a').attr('href',shopsUrl);
                        },500);

                  setTimeout(function(){
                      sessionStorage.setItem("FNY_NAVIGATION","");
                    }, 180000);
                }
          }
        }
    });

})();
