/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.NavigationView = Backbone.View.extend({

        templates: {
            navigation: JST['app/scripts/templates/navigation.hbs'],
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
         
         
            var originalUrl = pageURL.split('/').slice(0,3);
            var categoryUrlPreview = originalUrl.join('/') 
           
            if(pageURL.match(/preview$/) != null)
            {
              $(self.el).html(self.templates.previewnavigation(data));
             //alert("previewnavigation1");
            }
            else if(categoryUrlPreview == "/previewcategory/previewcategories")
            {
              $(self.el).html(self.templates.previewnavigation(data));
             //alert("previewnavigation");
            }
           
            else
            {
           $(self.el).html(self.templates.navigation(data));
		        
            $('.menu-dropdown.Fashion .shoplounge_holder').remove();
            
		   //making main nav active-----
				var queries = {};
				  $.each(document.location.search.substr(1).split('='),function(c,q){
					var i = q.split('=');
					 if(i == 'mainNav')
					 {
					  var pageUrl = window.location.pathname;
					  // alert(pageUrl);
					   switch(pageUrl)
					   {
						 case '/men/':
						 $('.navbar-brand.Men').parent().addClass('active');
						   break;
						  case '/women/':
						  $('.navbar-brand.Women').parent().addClass('active');
						   break;
						   case '/accessories/':
						  $('.navbar-brand.Accessories').parent().addClass('active');
						   break;
						   case '/kids/':
						  $('.navbar-brand.Kids').parent().addClass('active');
						   break;
						   case '/home_and_living/':
						  $('.navbar-brand.Living').parent().addClass('active');
						   break;
						   case '/lounge/':
						  $('.navbar-brand.Lounge').parent().addClass('active');
						   break;
						   case '/shops/':
						  $('.navbar-brand.Shops').parent().addClass('active');
						   break;
						   
						   case '/clearance/':
						  $('.navbar-brand.Clearance').parent().addClass('active');
						   break;
               case '/fashion_garage/':
              //$('.navbar-brand.Fashion').parent().addClass('active');
              $('.navbar-brand.Fashion > span' ).addClass('activeFG');
               break;
						   
						 default:
						//   console.log("active nav url pattern not matched--navigation-view");
						   
					   }
					 }
					//    queries[i[0].toString()] = i[1].toString();
				  });
				  
				  
				var storeDisplay = $('#categorystoredisplay').data('value');
				if(!storeDisplay){
					$('.navbar-brand.Stores').parent().remove();
				}
				$('.menu-dropdown .menucell ul li a ,.footer-category-names p a , .footer-brand-names a').each(function(){
				 var i = $(this).html().toLowerCase();
				  $(this).html(i);
				  $(this).css('text-transform','capitalize');
				});
           // alert("navigation");
            }


            /*var  pageURL = window.location.pathname.toLowerCase();
         
           var originalUrl = pageURL.split('/').slice(0,3);
            var categoryUrlPreview = originalUrl.join('/') 
           // alert(categoryUrlPreview)
            
            if(categoryUrlPreview == "/previewcategory/previewcategories")
            {
              $(self.el).html(self.templates.previewnavigation(data));
             console.log("previewnavigation");
            }
            else
            {
            $(self.el).html(self.templates.navigation(data));
            console.log("navigation");
            }*/

            /*if((pageURL.match(/preview$/) != null)) {
             $(self.el).html(self.templates.previewnavigation(data));
             console.log("previewnavigation");
           }
           else
           {
            $(self.el).html(self.templates.navigation(data));
            console.log("navigation");
           }*/

           //$(self.el).html(self.templates.navigation(data));
           

           $("#seoLinks").html(self.templates.footercategory(data));
           var locationClearance = window.location.origin;
           $('#seoLinks #Clearance a').each(function(){
              var i = $(this).html().toLowerCase();
              
                if(i == "women's wardrobe"){
                  $(this).html('Women');
                }
                 else if(i == "men's closet"){
                  $(this).html('Men');
                }

                else if(i == "excessorize"){
                  $(this).html('Accessories');
                }

                else if(i == "heavenly abode"){
                  $(this).html('Home & Living');
                }
              });

           setTimeout(function(){
                          var loungeUrl = $('#seoLinks p:eq(5)').find('a:first-child').attr('href'),
                          shopsUrl = $('#seoLinks p:eq(6)').find('a:first-child').attr('href');
                          $('#seoLinks p:eq(5)').find('a').attr('href',loungeUrl);
                          $('#seoLinks p:eq(6)').find('a').attr('href',shopsUrl);
                        },500);
      
              $('.menu-dropdown.move-right.Shops .menucell, .menu-dropdown.move-right.Fashion .menucell').each(function(){
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

               $('.menu-dropdown.move-right.Clearance .menucell').each(function(){
                  var menuHeading = $(this).find('.menu-heading ').text();
                  if(menuHeading === "Women's Wardrobe"){
                      $(this).find('.menu-heading h3').html("Women");
                  }
                  else if(menuHeading === "Men's Closet"){
                      $(this).find('.menu-heading h3').html("Men");
                  }
                  else if(menuHeading === "Excessorize"){
                      $(this).find('.menu-heading h3').html("Accessories");
                  }
                  else if(menuHeading === "Heavenly Abode"){
                      $(this).find('.menu-heading h3').html("Home & Living");
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