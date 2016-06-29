/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.PreviewNavigationView = Backbone.View.extend({

        templates: {
            previewnavigation: JST['app/scripts/templates/previewnavigation.hbs'],
            footercategory: JST['app/scripts/templates/footercategory.hbs']
        },
        el: '#backbone-portlet-main-navigation',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');
            this.navigation = new Webshop.Models.Navigation();
        },
        render: function (data) {
            var self = this;  

            sessionStorage.setItem("FNY_NAVIGATION",  JSON.stringify(data));

            var  pageURL = window.location.pathname.toLowerCase();
  if((pageURL.match(/cart$/) != null)) {
        $("#backbone-portlet-cart-content").show();
        $("#backbone-portlet-cart-nav").show();
    }
              
           $(self.el).html(self.templates.previewnavigation(data));

           $("#seoLinks").html(self.templates.footercategory(data));

           setTimeout(function(){
                          var loungeUrl = $('#seoLinks p:eq(5)').find('a:first-child').attr('href'),
                          shopsUrl = $('#seoLinks p:eq(6)').find('a:first-child').attr('href');
                          $('#seoLinks p:eq(5)').find('a').attr('href',loungeUrl)
                          $('#seoLinks p:eq(6)').find('a').attr('href',shopsUrl);
                        },500);
      
              $('.menu-dropdown.move-right.Shops .menucell').each(function(){
                  var menuHeading = $(this).find('.menu-heading ').text();
                  if(menuHeading === "Women's Wardrobe"){
                      $(this).find('.menu-heading h3').html("Women's Shops");
                  }
                  else if(menuHeading === "Men's Closet"){
                      $(this).find('.menu-heading h3').html("Men's Shops");
                  }
                  else if(menuHeading === "Excessorize"){
                      $(this).find('.menu-heading h3').html("Accessories Shops");
                  }
                  else if(menuHeading === "Heavenly Abode"){
                      $(this).find('.menu-heading h3').html("Home Shops");
                  }
              });
      
          $( ".navbar-brand" ).on({
              mouseover:function() {
                  $(this).next().find('.categories').find('ul li:first-child').next().css('background','#fff');  
                  $(this).next().find('.categories').next().removeClass('hidemenu').css('display','none');
              },mouseout:function() {   
                  $(this).next().find('.categories').find('ul li:first-child').next().css('background','#fff').hover(function(){
                  $(this).css('background','#d22573');},function(){$(this).css('background','#fff');});  
                  $(this).next().find('.categories').next().addClass('hidemenu').css('display','none');
              }
          });
      
          setTimeout(function(){
              sessionStorage.setItem("FNY_NAVIGATION", JSON.stringify(data));
           }, 180000);
      
          var pageURL = window.location.pathname.toLowerCase(),
          mainCategoryList = $(".navbar-left>.menu-h>.navbar-brand");
          $(mainCategoryList).each(function (index, elem) {
              if($(elem).attr("href") === pageURL){
                  $(elem).closest(".menu-h").addClass("active");
              }
          });
  
          $("#menulink").on("click", function(e){
              e.preventDefault();
              $(".menulisting").toggle(); 
          });
      
          $('.ref_link').hover(function(e) {
              e.preventDefault();
              var hidemenu = $(this).attr('rel');
              $('.hidemenu').hide();
              $('#' + hidemenu).show();
          }, function(e){
              e.preventDefault();
              var hidemenu = $(this).attr('rel');
          });
      
          $( ".navbar-brand" ).on({
              mouseover:function() {
                  $(this).next().find('.categories').next().removeClass('hidemenu').css('display','block');
              },mouseout:function() {
                  $(this).next().find('.categories');
                  $(this).next().find('.categories').next().addClass('hidemenu');
              }
          });
      
          
        }          
 
    });

})();