/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    

    Webshop.Views.BreadCrumbView = Backbone.View.extend({

        templates: {
            breadcrumtemplate: JST['app/scripts/templates/breadcrumb.hbs']
        },
        el: '',
        event: {},
        initialize: function() {
            _.bindAll(this, 'render');

        },
        render: function(data) {
            //alert(1);
            var self = this;
            var ProdctlistingType = $('#backbone-portlet-product-listing').data('type');
            if(ProdctlistingType != undefined){
                $('.breadcrumb-container').html(self.templates.breadcrumtemplate(data));
            }
            else{
                var categoryData = sessionStorage.getItem("FNY_NAVIGATION");
                var dataCat = JSON.parse(categoryData);
                var breadcrumdataarry = {
                     "CatGrupID" :  dataCat,
                     "CatGrupName": data
                   };
                var breadcrumbdata  = JSON.parse(JSON.stringify(breadcrumdataarry)); 

                $('.breadcrumb-container').html(self.templates.breadcrumtemplate(breadcrumbdata));
            }  

        }

    });

})();