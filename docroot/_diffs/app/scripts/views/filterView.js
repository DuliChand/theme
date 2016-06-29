/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.FilterView = Backbone.View.extend({

        template: JST['app/scripts/templates/filters.hbs'],

          el: '#backbone-portlet-filter',
      events:{
        "click .choose-option" : "chooseFilterOption",
        "click .filter-bar-box h4" : "filterExpandCollapse",
        "click .reset-link" : "clearSingleFilter",
        "click #resetAll" : "clearAllFilters",
        'click .title-filter-left' : 'toggleFilterPannel'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new Filter();
        this.model2 = new FilteredProducts();
      },
      render2: function (filtersData) {
        
        var filteredProductList;
        
        if (this.model2.clear().set(filtersData)) {
          this.model2.fetch({
            error: function (response) {
                     // console.log(response);
                  },
                  success: function (model, response) {
                    
                  var data = model.toJSON(),
                    availableProductCount = 0;
                    
                  if(data.categoryWrapper) {
            $("#productList").html(Handlebars.templates.categoryproductlist(data.categoryWrapper.category));
            availableProductCount = data.categoryWrapper.category.noOfProducts;
          }
                  
          if(data.event) {
            $("#productList").html(Handlebars.templates.eventproductlist(data.event));
            availableProductCount = data.event.noOfProducts;
          }
          
          loadingMoreData = (availableProductCount < limit) ? false : true;
          
          if ($('.rolover-layer').length > 0) {
                        $('.prod-img').contenthover({
                            effect: 'slide',
                            data_selector: '.rolover-layer',
                            width: 0,
                            height: 76,
                            overlay_width: 0,
                            overlay_height: 76,
                            overlay_x_position: 'center',
                            overlay_y_position: 'bottom',
                            overlay_background: '',
                            overlay_opacity: 1,
                            slide_speed: 400,
                            slide_direction: 'bottom',
                            zindex: 2,
                            wrapper_class: 'ch_wrapper',
                            normal_class: 'ch_normal',
                            hover_class: 'ch_hover'
                        });
                    }
          
          $('#sortOrderSelect').trigger('change');
          
                  }
              });             
      }
       
      },
      render: function () {
          var self = this;
          
          self.model.clear().fetch({
          error: function(response){
           // console.log(response);
          }, 
            success: function (model, response) {
              
            var data = model.toJSON(), filtersData = {};
      
        if(data.categoryWrapper) {
          filtersData.filters = data.categoryWrapper.category.productFilters.filters;
        }
      
        if(data.event) {
          filtersData.filters = data.event.productFilters.filters;
        }
        
        $(self.el).html(Handlebars.templates.filters(filtersData));

        var sliderRange = $("#slider-range");
        
        priceMinValue = sliderRange.data("min"); 
              priceMaxValue = sliderRange.data("max");
              
        self.initializeDiscountSlider();
              self.initializePriceSlider();
              
            }
          });
        },
        initializeDiscountSlider: function() {
          
        },
        initializePriceSlider: function() {
          
          var self = this,
            sliderRange = $("#slider-range"),
            initMin = parseInt(sliderRange.data("min")),
            initMax = parseInt(sliderRange.data("max")),
            currRange = $("#amount");
          
            sliderRange.slider({
                range: true,
                min: initMin,
                max: initMax,
                values: [ initMin, initMax ],
                change: function( event, ui ) {
                  currRange.val( "INR " + ui.values[0] + " - INR " + ui.values[1] );
                  
                  priceMinValue = ui.values[0];
                  priceMaxValue = ui.values[1];
                  
                self.filterProductList();
                }
            });
            currRange.val( "INR " + $("#slider-range").slider("values", 0) + " - INR " + $("#slider-range").slider("values", 1) );
        },
        resetPriceSlider: function() {
          /*var sliderRange = $("#slider-range"),
            initMin = parseInt(sliderRange.data("min")),
            initMax = parseInt(sliderRange.data("max")); 
                    
          sliderRange.slider({ min: initMin, max: initMax });
        
      priceMinValue = initMin, 
      priceMaxValue = initMax;*/
          
          this.initializePriceSlider();
      //self.filterProductList();
          
        },
        filterExpandCollapse : function(e){
          e.preventDefault();
          
          $('.filter-bar-box h4').removeClass('active');
        if ($(e.currentTarget).next("div").is(":visible")) {
            $(e.currentTarget).removeClass('active').next("div").slideUp("slow");
        } else {
            $(".filter-bar-box .toggle-box").slideUp("slow");
            $(e.currentTarget).addClass('active').next("div").slideToggle("slow");
        }
        },
        chooseFilterOption: function(e) {
          $(e.currentTarget).next("label").toggleClass("choose");
          
          this.filterProductList();
        },
        filterProductList: function() {
          
          var filterList = $(".toggle-box"),
            filtersData = {},
            listingId = $("#backbone-portlet-filter").data("id"),
        listingType = $("#backbone-portlet-filter").data("type");
          
          attrCriterias = [];
        nonAttrCriterias = [];
          
          listingType = listingType.toLowerCase();
                    
          $.each(filterList, function( i, elem ) {
            
            var currFilter = $(elem),
              currFilterName = currFilter.data("filter-name"),
              currFilterType = currFilter.data("filter-type"),
              currFilterOptionList = currFilter.find("input:checked");
            
            if(currFilterName != undefined) {
              if(currFilterName === "Price") {
                  
                  nonAttrCriterias.push({"key": currFilterName, "values" : [priceMinValue.toString(), priceMaxValue.toString()]});
                  
                } else {
                  
                  if(currFilterType === "Attribute") {
                        
                        var currFilterOptionSelectedList = $.map(currFilterOptionList, function( elem, i ) {
                            return (elem.value);
                          });
                        
                        attrCriterias.push({"key": currFilterName, "values" : currFilterOptionSelectedList});
                        
                      } else {
                        
                        var currFilterOptionSelectedList = $.map(currFilterOptionList, function( elem, i ) {
                            return (elem.value);
                          });
                        nonAttrCriterias.push({"key": currFilterName, "values" : currFilterOptionSelectedList});
                      }
                  
                }
            }
          });
          
          if(listingType === "event") {
        
        filtersData = {
            "productfilters" : {
              "eventId" : listingId,
              "limit": limit,
                  "skip": skip,
              "attributesCriterias" : attrCriterias,  
              "criterias" : nonAttrCriterias
            }
          };
      }
      
      if(listingType === "category") {
        
        filtersData = {
            "productfilters" : {
              "categoryId" : listingId,
              "limit": limit,
                  "skip": skip,
              "attributesCriterias" : attrCriterias,  
              "criterias" : nonAttrCriterias
            }
          };
      }
          
          this.render2(filtersData);
        },
        clearSingleFilter : function(event) {
          event.preventDefault();
          event.stopPropagation();
          
          var filterList = $(event.currentTarget).closest("h4").next(".toggle-box");
          
          if(filterList.hasClass("price") || filterList.hasClass("discount")) {
            
            if(filterList.hasClass("price")) {
                    this.resetPriceSlider();
            }
            
          } else {
            
            var filterOptions = filterList.children().find("input:checked");
            
            for(var i=0;i<filterOptions.length;i++) {
              $(filterOptions[i]).removeAttr('checked');
              $(filterOptions[i]).next("label").removeClass('choose');
            }
          }
          this.filterProductList();
        },
        
        toggleFilterPannel : function(e) {
      e.preventDefault();
      $("#product-filter-wrapper").toggle();
      $(".title-filter-left").toggleClass('active');
    },
        
        clearAllFilters : function (event) {
          
          event.preventDefault();
          /*event.stopPropagation();*/
          
        var filterList = $(event.currentTarget).closest("#filter-wrapper").find(".toggle-box");
        
        for(var j=0; j<filterList.length; j++) {
          if($(filterList[j]).hasClass("price") || $(filterList[j]).hasClass("discount")) {
                
                if($(filterList[j]).hasClass("price")) {
                        this.resetPriceSlider();
                }
                
              } else {
                
                var filterOptions = $(filterList[j]).children().find("input:checked");
                
                for(var i=0;i<filterOptions.length;i++) {
                  $(filterOptions[i]).removeAttr('checked');
                  $(filterOptions[i]).next("label").removeClass('choose');
                }
              }
        }

          this.filterProductList();
        }
    });

})();
