/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    
    Webshop.Views.BreadCrumbView = Backbone.View.extend({

        templates: {
            breadcrumtemplate: JST['app/scripts/templates/breadcrumbdetails.hbs']
           
        },
        el: '',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');

        },
        render: function(data) {
             var self = this;
            var ProdctlistingType = $('#backbone-portlet-product-listing').data('type');
            var ProdctdetailType = $('#backbone-portlet-product').data('page-value');
            
            if(ProdctdetailType === "productDetailPage"){ 
                    $('.breadcrumb-container').html(self.templates.breadcrumtemplate(data));
                }

            if(data.listingType.toLowerCase() === "catalog") {
                 var currentCatUrl = window.location.pathname.split('/');
                 var globalCat = currentCatUrl[1];
                 var subCatUrlName = currentCatUrl[2];

                 data.globalCat = globalCat.replace('and','&');
                 data.subCatUrlName = subCatUrlName.replace('and','&');
                 //console.log(JSON.stringify(data));
                $('.breadcrumb-container').html(self.templates.breadcrumtemplate(data));
            }
             if(data.listingType.toLowerCase() === "event") {
               $('.breadcrumb-container').html(self.templates.breadcrumtemplate(data));   
              $('.breadcrumb-container .breadcrumb #catelisting').remove();

             }  
         }

    });

})();