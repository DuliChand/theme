/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.SearchFilterView = Backbone.View.extend({

        template: JST['app/scripts/templates/searchfilters.hbs'],
        /*
     JST['app/scripts/templates/top-keywords.hbs']
        */

         el: '#backbone-portlet-search-filter',
      events:{
          "click .style-head" : "filterExpandCollapse",
          "click #popularKeywords" : "getPopularKeywords",
          "click #selectedKeyword" : "getDataForSelectedKeyword"
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new Webshop.Models.SearchFilter();
        this.model2 = new Webshop.Models.FilteredSearchResults();
        this.topKeywords = new Webshop.Models.TopKeywords();
        this.searchResult = new Webshop.Models.SearchResult();
        this.searchEventResult = new Webshop.Models.SearchEventResult();
      },
      render2: function () {
          var filtersData = {
              "query": {
                "bool": {
                  "must": [
                    {
                      "query_string": {
                        "query": $("#backbone-portlet-search-results").data("id")
                      }
                    },
                    {
                      "range": {
                        "spWithVAT": {
                          "from": priceMinValue,
                          "to": priceMaxValue
                        }
                      }
                    }
                  ]
                }
              }
            };

          
          if (this.model2.clear().set(filtersData)) {
              this.model2.fetch({
                error: function (response) {
                      console.log(response);
                  },
                  success: function (model, response) {
                    console.log("response from filter products: --- ");
                    console.log(response);

                    var data = response;
                    console.log(data.hits);
                    
                    $("#backbone-portlet-search-results").html(Handlebars.templates.searchresults(data.hits));
                    
                    var searchKeyword =  $("#backbone-portlet-search-results").data("id");
                    $('#keyword').text(searchKeyword);
                    
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
                  }
              });                           
          }
         
      },
      render: function () {
          var self = this;
          self.model.fetch({
            error: function(response){
                console.log("error: >>>>........ " + response);
            }, 
            success: function (model, response) {
              var data = response;
              console.log(data);
              $(self.el).html(Handlebars.templates.searchfilters(data));
              
              self.initializePriceSlider();
              
            }
          });
        },
        getPopularKeywords: function(e){
            e.preventDefault();
             var self = this;
             self.topKeywords.fetch({
                error: function(response){
                    console.log("error: >>>>........ " + response);
                }, 
                success: function (model, response) {
                 var data = response;
                 $('#showTopKeywords').html(Handlebars.templates.topkeywords(data));
                 $('#showTopKeywords').toggle();
                 $('#showTopKeywords').css("display", "block");
               }
             });
        },
        initializePriceSlider: function() {
            
            var self = this;
            
            $("#priceSlider").slider({
              from: $("#priceSlider").data("price-min"),
              to: $("#priceSlider").data("price-max"),
              heterogeneity: [
                              '0/'+$("#priceSlider").data("price-min")
                              ],
              step: 1,
              dimension: '&nbsp;INR',
              skin: 'plastic',
              callback: function( value ){
                  
                  var currPriceRange = value.split(";");
                  
                  priceMinValue = currPriceRange[0], 
                  priceMaxValue = currPriceRange[1];
                  
                  self.filterProductList();
                  
                }
            });
        },
     
     
        filterExpandCollapse : function(event){
            event.preventDefault();
            
            if ($(event.currentTarget).hasClass("expanded-state")) {
                $(event.currentTarget).removeClass("expanded-state");
                $(event.currentTarget).siblings(".styles").slideUp();
            } else {
                $(event.currentTarget).addClass("expanded-state");
                $(event.currentTarget).siblings(".styles").slideDown();
            }
        },
        
        filterProductList : function(event) {
            
            brandNames = $.map( $(".brands input.brand-name:checked"), function( elem, i ) {
                return (elem.value);
            });
            isBrand = (brandNames.length > 0)? 1 : 0;
            
            isPriceRange = (priceMinValue != 0 && priceMaxValue != 0)? 1 : 0;
            
            this.render2();
        },
        getDataForSelectedKeyword : function(e){
            e.preventDefault();
            keyword = $(e.currentTarget).attr('href');
            console.log(keyword);
            var self = this;

            self.searchResult.clear().fetch({
                success : function(model, response) {
                    var data = model.toJSON();
                    console.log(data.hits);
                    $("#backbone-portlet-search-results").html(Handlebars.templates.searchresults(data.hits));
                    
                    $('#keyword').text(keyword);
                    
                    if($('.rolover-layer').length > 0) {
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
                    self.fetchSearchedEvents();
                }
            });
        },
        fetchSearchedEvents : function(){
            var self = this;
            self.searchEventResult.clear().fetch({
                success : function(model, response) {
                    var data = model.toJSON();
                    console.log(data.hits);
                    $("#eventArea").html(Handlebars.templates.searcheventresults(data.hits));
                }
            });
        }
    });

})();
