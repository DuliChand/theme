/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.PreviewView = Backbone.View.extend({
        templates: {
            herobanner: JST['app/scripts/templates/herobanner.hbs'],
            featuredcategories: JST['app/scripts/templates/featuredcategories.hbs'],
            featuredproducts: JST['app/scripts/templates/featuredproducts.hbs'],
            tmpl15: JST['app/scripts/templates/tmpl15.hbs'],
            tmpl4: JST['app/scripts/templates/tmpl4.hbs'],
            tmpl5: JST['app/scripts/templates/tmpl5.hbs'],
            tmpl6: JST['app/scripts/templates/tmpl6.hbs'],
            tmpl4more: JST['app/scripts/templates/tmpl4more.hbs'],
            tmpl5more: JST['app/scripts/templates/tmpl5more.hbs'],
            tmpl6more: JST['app/scripts/templates/tmpl6more.hbs'],
            tmplAllEvents: JST['app/scripts/templates/tmplAllEvents.hbs'],
            tmplAllLong: JST['app/scripts/templates/tmplAllLong.hbs'],
            tmplAllMedium: JST['app/scripts/templates/tmplAllMedium.hbs'],
            tmplAllSmall: JST['app/scripts/templates/tmplAllSmall.hbs'],
            tmplAllLongPremium: JST['app/scripts/templates/tmplAllLongPremium.hbs'],
            tmpl18todaysales: JST['app/scripts/templates/tmpl18todaysales.hbs'],
            tmpl18werecommend: JST['app/scripts/templates/tmpl18werecommend.hbs'],
            tmplSpecialAllLong: JST['app/scripts/templates/tmplSpecialAllLong.hbs'],
        },
        el: '#backbone-portlet-preview',
        events: {
            'click .social-share-link': 'powertipSocialShareHandler',
            'mouseover .showtooltip': 'showToolTip'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.featuredCategories = new Webshop.Models.FeaturedCategories();
            this.featuredProducts = new Webshop.Models.FeaturedProducts();
        },
        render: function(data , featureShop) {

            var self = this;
               

            //console.log("home view rendered");

                        //console.log(data);
                        self.renderHeroBannerSection(data);
                        self.renderFreshArrivalSection(data);
                        self.renderWeRecommendSection(data);
                        self.renderEndingSoonSection(data);
                        self.renderFeaturedCategoriesSection(featureShop);
              
                
            
        },
        renderHeroBannerSection: function(data) {
            var self = this,
                heroBannersData = {};
            $(data.value.children).each(function(index, obj) {
                if (obj.data.categoryName === "heroGallery") {
                    heroBannersData = obj;
                }
            });

            if (heroBannersData.data != undefined) {

                $("#heroBanner").html(self.templates.herobanner(heroBannersData));

                if ($('.hero-slider .bxslider').length > 0) {
                    $('.hero-slider .bxslider').bxSlider({
                        auto: true,
                        controls: true,
                        pager: false,
                        touchEnabled: true,
                        mode: 'fade'
                    });
                }

            } else {

                //console.log("There is no data available for hero banner section...");
            }
        },
        renderSectionEvents: function(sectionName, eventsData, categoryName, data , promotionalContentOne) {

            var self = this;

            /*console.log("eventsData: ");
            console.log(eventsData);*/
            //Menu Active Starts
            $('.navbar-left .menu-h .navbar-brand').each(function(){
                  if(categoryName == "Home & Living"){}else{
                $(this).find(categoryName).addClass('active'); }
              });
            $(".homepage-holder").remove();
            //Menu active ends      
              
            if(categoryName.toLowerCase() === "all"  ){
                if (eventsData.data != undefined) {

                    if (eventsData.data.templateName === 'tmpl15') {
                        $("#" + sectionName + "").html(self.templates.tmpl15(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl6more') {
                        $("#" + sectionName + "").html(self.templates.tmpl6more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl5more') {
                        $("#" + sectionName + "").html(self.templates.tmpl5more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl4more') {
                        $("#" + sectionName + "").html(self.templates.tmpl4more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl6') {
                        $("#" + sectionName + "").html(self.templates.tmpl6(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl5') {
                        $("#" + sectionName + "").html(self.templates.tmpl5(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl4') {
                        $("#" + sectionName + "").html(self.templates.tmpl4(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllEvents') {
                        $("#" + sectionName + "").html(self.templates.tmplAllEvents(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllLong') {
                        $("#" + sectionName + "").html(self.templates.tmplAllLong(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllMedium') {
                        $("#" + sectionName + "").html(self.templates.tmplAllMedium(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllSmall') {
                        $("#" + sectionName + "").html(self.templates.tmplAllSmall(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl18todaysales') {
                        $("#" + sectionName + "").html(self.templates.tmpl18todaysales(eventsData));
                    }


                    if (eventsData.data.templateName === 'tmplSpecialAllLong') {
                        $("#" + sectionName + "").html(self.templates.tmplSpecialAllLong(eventsData));

                        $('#marketingPromo').html($('#promotionalContent1').html());
                        $('.marketingSlider').bxSlider({
                              auto: true,
                              autoControls: true
                            });

                        var events = $('.todaysalesCount .columerow').size();
                        var totalEvt = events%3;
                        if(totalEvt === 0){}
                        else if(totalEvt === 1){
                            $('.todaysalesCount').append('<div class="columerow">'+$('#promotionalContent2').html()+'</div><div class="columerow">'+$('#promotionalContent3').html()+'</div>');
                        }
                        else if(totalEvt === 2){
                            $('.todaysalesCount').append('<div class="columerow">'+$('#promotionalContent3').html()+'</div>');
                        }     
                    }

                    var eventList = $(".events .event-col");

                     if(eventList.length > 0) {
                      $.each( eventList, function( i, element ) {
                            
                            var currEvent = $(element),
                                eventTimeHolder = currEvent.find(".event-timer"),
                                eventExpireDateTime = eventTimeHolder.data("expire-datetime"),
                                currdate = new Date(),
                                flag = self.isValidDateDiff(currdate,eventExpireDateTime);
                                
                                if(flag){
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Days %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }else{
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Day %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }
                                
                        });
                  }
                } 

                  $(".moredetail p.text1").on("click", function(e) {
                        e.preventDefault();
                      $(this).closest(".moredetail").toggleClass("active");
                    });
            }
            else if((categoryName.toLowerCase() === "women")||(categoryName.toLowerCase() === "men")||(categoryName.toLowerCase() === "kids")
                    ||(categoryName.toLowerCase() === "accessories")||(categoryName.toLowerCase() === "home & living")){
                    
                    if(eventsData.data != undefined) {

                      if (eventsData.data.templateName === 'tmpl15') {
                        $("#" + sectionName + "").html(self.templates.tmpl15(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl6more') {
                        $("#" + sectionName + "").html(self.templates.tmpl6more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl5more') {
                        $("#" + sectionName + "").html(self.templates.tmpl5more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl4more') {
                        $("#" + sectionName + "").html(self.templates.tmpl4more(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl6') {
                        $("#" + sectionName + "").html(self.templates.tmpl6(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl5') {
                        $("#" + sectionName + "").html(self.templates.tmpl5(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl4') {
                        $("#" + sectionName + "").html(self.templates.tmpl4(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllEvents') {
                        $("#" + sectionName + "").html(self.templates.tmplAllEvents(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllLong') {
                        $("#" + sectionName + "").html(self.templates.tmplAllLong(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllMedium') {
                        $("#" + sectionName + "").html(self.templates.tmplAllMedium(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmplAllSmall') {
                        $("#" + sectionName + "").html(self.templates.tmplAllSmall(eventsData));
                    }

                    if (eventsData.data.templateName === 'tmpl18todaysales') {
                        $("#" + sectionName + "").html(self.templates.tmpl18todaysales(eventsData));
                    }


                    if (eventsData.data.templateName === 'tmplSpecialAllLong') {
                        $("#" + sectionName + "").html(self.templates.tmplSpecialAllLong(eventsData));
                        $('#marketingPromo').html($('#promotionalContent1').html());
                        $('.marketingSlider').bxSlider({
                              auto: true,
                              autoControls: true
                            });

                        var events = $('.todaysalesCount .columerow').size();
                        var totalEvt = events%3;
                        if(totalEvt === 0){}
                        else if(totalEvt === 1){
                            $('.todaysalesCount').append('<div class="columerow">'+$('#promotionalContent2').html()+'</div><div class="columerow">'+$('#promotionalContent3').html()+'</div>');
                        }
                        else if(totalEvt === 2){
                            $('.todaysalesCount').append('<div class="columerow">'+$('#promotionalContent3').html()+'</div>');
                        }     
                    }

                    /* $('.marketingPromo').html(marketingPromo);
                      $('.customerPromo').html(customerPromo);*/
                    var eventList = $(".events .event-col");
                     
                     //var eventList = $(".events .event-col");

                    if(eventList.length > 0) {
                      $.each( eventList, function( i, element ) {
                            
                            var currEvent = $(element),
                                eventTimeHolder = currEvent.find(".event-timer"),
                                eventExpireDateTime = eventTimeHolder.data("expire-datetime"),
                                currdate = new Date(),
                                flag = self.isValidDateDiff(currdate,eventExpireDateTime);
                                
                                if(flag){
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Days %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }else{
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Day %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }
                                
                        });
                    } 
                    }

                    $(".moredetail p.text1").on("click", function(e) {
                        e.preventDefault();
                      $(this).closest(".moredetail").toggleClass("active");
                    });

                
            }
            else if((categoryName.toLowerCase() === "lounge")||(categoryName.toLowerCase() === "shops")){
                  var specificCategoryData =  data;
                  if(specificCategoryData.value.data != undefined) {
                      $(self.el).html(self.templates.tmplAllLongPremium(specificCategoryData));
                      if(categoryName.toLowerCase() === "shops"){
                         $(".Wardrobe .columerow").each(function(index){
                          if(index == 1){
                            $(this).after('<div class="columerow"><div id="marketingPromo">test</div></div>')
                          }
                        });
                        $('#marketingPromo').html($('#promotionalContent1').html());
                        $('.marketingSlider').bxSlider({
                              auto: true,
                              autoControls: true
                            });

                        $('.row.events').each(function(){
                            var headStyle = $(this).find('.heading-style strong').text();
                            if(headStyle === "Women's Wardrobe"){
                                $(this).find('.heading-style strong').html("Women's Shops");
                            }
                            else if(headStyle === "Men's Closet"){
                                $(this).find('.heading-style strong').html("Men's Shops");
                            }
                            
                            else if(headStyle === "Excessorize"){
                                $(this).find('.heading-style strong').html("Accessories Shops");
                            }
                            
                            else if(headStyle === "Heavenly Abode"){
                                $(this).find('.heading-style strong').html("Home Shops");
                            }
                            
                        });

                      }
                    var eventList = $(".events .event-col");

                      /*$('.marketingPromo').html(marketingPromo);
                      $('.customerPromo').html(customerPromo);*/
                     //var eventList = $("#backbone-portlet-fresh-arrival .event-col");
                     
                                    
                  if(eventList.length > 0) {
                      $.each( eventList, function( i, element ) {
                            
                            var currEvent = $(element),
                                eventTimeHolder = currEvent.find(".event-timer"),
                                eventExpireDateTime = eventTimeHolder.data("expire-datetime"),
                                currdate = new Date(),
                                flag = self.isValidDateDiff(currdate,eventExpireDateTime);
                                
                                if(flag){
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Days %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }else{
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%D Day %H:%M:%S Left'));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }
                            
                        });
                  }

                  $(".moredetail p.text1").on("click", function(e) {
                        e.preventDefault();
                        $(this).closest(".moredetail").toggleClass("active");
                    });

            }else{
                //console.log("different data");
            }
            if ($(".showtooltip").length > 0) {
                var div = $(".showtooltip");
                var data = $(".eventpowertip");
                div.data('powertipjq', data);
                div.powerTip({
                    placement: 'e',
                    smartPlacement: true,
                    mouseOnToPopup: true
                });
            }
            
            $(".moredetail p.text1").on("click", function(e) {
                e.preventDefault();
                $(this).closest(".moredetail").toggleClass("active");
            });
            
            $(".social-share-link").on('click', function(e){
                
                e.preventDefault();
                
                /*console.log("clicked");*/
                /*console.log(e);*/
                
                var classesList = $(e.currentTarget).attr("class").split(' '),
                    curEventId = $(e.currentTarget).closest(".eventpowertip").data('id'),
                    sharingData = {
                        url : window.location.origin + '/product/listing/event/' + curEventId,
                        title : $(e.currentTarget).closest(".eventpowertip").data('name'),
                        imageUrl : $(e.currentTarget).closest(".eventpowertip").data('image'),
                        description : "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                        handlerName : classesList[1]
                };
                
                socialShare(e, sharingData);
                
            });
            }
        },
        renderFreshArrivalSection: function(data , promotionalContentOne) {
            var self = this, categoryName = "",
                freshArrivalData = {};

            categoryName = data.value.data.categoryName;
            freshArrivalData.categoryId = data.value.data.categoryId;

            $(data.value.children).each(function(index, obj) {
                if (obj.data.categoryName === "Today's Sales") {
                    freshArrivalData.data = obj.data;
                }
            });
            self.renderSectionEvents("freshArrival", freshArrivalData, categoryName, data , promotionalContentOne);

        },
        showToolTip: function(event) {

           // console.log("show tool tip called");
            $(event.currentTarget).data('powertipjq', $(event.currentTarget).closest("div").find(".eventpowertip"));
            $(event.currentTarget).powerTip({
                placement: 'e',
                smartPlacement: true,
                mouseOnToPopup: true
            });
        },
        hideToolTip: function(event) {

            $("#powerTip").html("");
            $(event.currentTarget).powerTip('hide');
        },
        renderWeRecommendSection: function(data, promotionalMediumContent) {

            var self = this, categoryName,
                weRecommendData = {};

            categoryName = data.value.data.categoryName;
            weRecommendData.categoryId = data.value.data.categoryId;

            $(data.value.children).each(function(index, obj) {
                if (obj.data.categoryName === "Current Sales") {
                    weRecommendData.data = obj.data;
                }
            });

            self.renderSectionEvents("weRecommend", weRecommendData, categoryName, data, promotionalMediumContent);
          

            var events = $('.currentSalesCount .columerow').size();
                        var totalCurrEvt = events%3;
                        if(totalCurrEvt === 0){}
                        else if(totalCurrEvt === 1){
                            $('.currentSalesCount').append('<div class="columerow">'+$('#promotionalMediumContent1').html()+'</div><div class="columerow">'+$('#promotionalMediumContent2').html()+'</div>');
                        }
                        else if(totalCurrEvt === 2){
                            $('.currentSalesCount').append('<div class="columerow">'+$('#promotionalMediumContent1').html()+'</div>');
                        }  

        },
        renderEndingSoonSection: function(data) {

            var self = this,categoryName,
                endingSoonData = {};

            categoryName = data.value.data.categoryName;
            endingSoonData.categoryId = data.value.data.categoryId;

            $(data.value.children).each(function(index, obj) {
                if (obj.data.categoryName === "Ending Soon") {
                    endingSoonData.data = obj.data;
                }
            });

            self.renderSectionEvents("endingSoon", endingSoonData, categoryName, data);

        },
        renderFeaturedCategoriesSection: function(data, promotionalMediumContent) {

            var self = this;

                    $("#featuredCategories").html(self.templates.featuredcategories(data));

                    self.uniqueEvents();

                    var events = $('.featuredCount .columerow').size();
                        var totalFeatEvt = events%3;
                        if(totalFeatEvt === 0){}
                        else if(totalFeatEvt === 1){
                            $('.featuredCount').append('<div class="columerow">'+$('#promotionalMediumContent1').html()+'</div><div class="columerow">'+$('#promotionalMediumContent2').html()+'</div>');
                        }
                        else if(totalFeatEvt === 2){
                            $('.featuredCount').append('<div class="columerow">'+$('#promotionalMediumContent1').html()+'</div>');
                        }  
                          
                    var eventList = $(".events .event-col");

                      if (eventList.length > 0) {
                        $.each(eventList, function(i, element) {

                            var currEvent = $(element),
                                eventTimeHolder = currEvent.find(".event-timer"),
                                eventExpireDateTime = eventTimeHolder.data("expire-datetime"),
                                    currdate = new Date();
                                    var flag = self.isValidDateDiff(currdate,eventExpireDateTime);

                                    if(flag){
                                        setTimeout(function(){

                                            eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                                eventTimeHolder.html(e.strftime('%D Days %H:%M:%S Left'));
                                            }).on('finish.countdown', function() {
                                                eventTimeHolder.html("EXPIRED");
                                            });
                                            
                                        }, 500);
                                    }
                                    else{            
                                    setTimeout(function() {

                                eventTimeHolder.countdown(eventExpireDateTime).on('update.countdown', function(e) {
                                    eventTimeHolder.html(e.strftime('%D Day %H:%M:%S LEFT'));
                                }).on('finish.countdown', function() {
                                    eventTimeHolder.html("EXPIRED");
                                });

                            }, 500);
                        }

                        });
                    }  

                       $(".moredetail p.text1").on("click", function(e) {
                        e.preventDefault();
                      $(this).closest(".moredetail").toggleClass("active");
                    });


                    $('.category-slider').bxSlider({
                        slideWidth: 149,
                        minSlides: 2,
                        maxSlides: 6,
                        slideMargin: 9,
                        pager: false
                    });

        },
        uniqueEvents : function() { 
          var uniqueEvent = {};
          var list = $( '#featuredCategories .columerow').filter(function(){
          var category = $(this).find('.splitEventName').text();
          
          if(uniqueEvent[category]){
              return true; 
             
          } else {
              uniqueEvent[category] = true;
              return false;
              
          }
      }).remove();
      
      },
        powertipSocialShareHandler: function(e) {

            e.preventDefault();

            /*console.log("clicked");*/
            /*console.log(e);*/

            var classesList = $(e.currentTarget).attr("class").split(' '),
                curProductId = $(".product-popup-info").data('product-id'),
                curEventId = $(".product-popup-info").data('event-id'),
                sharingData = {
                    url : window.location.origin + '/product-detail/product/' + curEventId + '/' + curProductId,
                    title : $(".product-popup-info .product-name").text(),
                    imageUrl : $("#product-gallery-thumbnails div a").first().data("image-detail"),
                    description : "I'm totally in love with this collection and I bet you'll love it too. Check it out!",
                    handlerName : classesList[1]
            };

            socialShare(e, sharingData);
        },
        isValidDateDiff : function(startDate, enddate) {
              var endDate = new Date(enddate);
              var diff= endDate - startDate;
              //console.log(diff);
              return ((endDate - startDate) > 48 * 60 * 60 * 1000);
        }
    });
})();
