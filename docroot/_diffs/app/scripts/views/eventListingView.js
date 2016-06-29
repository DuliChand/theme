/*global Webshop, Backbone, JST*/
var timeVer;
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.EventListingView = Backbone.View.extend({
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
            tmplSpecialAllLong: JST['app/scripts/templates/tmplSpecialAllLong.hbs']
        },
        el: '#backbone-portlet-event-list',
        events: {
                    'mouseover .showtooltip': 'showToolTip'
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.categoryEvents = new Webshop.Models.CategoryEvents();
        },
        render: function(data) {
            var self = this,
                sectionName = $("#backbone-portlet-event-list").data("section-type"),
                categoryName = $("#backbone-portlet-event-list").data("category-name");

            var CustomefirstRecord = parseInt($('#FnyFirstRecord').attr('data-firstRecord'));
            var TodayDate = new Date(CustomefirstRecord);
            var time = TodayDate.getHours() + ":" + TodayDate.getMinutes();
            if(time == '9:00'){
             timeVer = CustomefirstRecord;
             //console.log("12:20 time" + timeVer);
              }
              else{
            timeVer = $.cookie('customerFirstRecord');
            //console.log("time ver" + timeVer );
            }
                
            
                        //console.log(data);
                        var    eventListingData = {};

                        switch (sectionName.toLowerCase()) {
                            case 'ending-soon':

                                $(data.value.children).each(function(index, obj) {
                                    if (obj.data.categoryName === "Ending Soon") {
                                        eventListingData = obj;
                                    }
                                });

                                eventListingData.currTime = timeVer;
                               
                                break;

                            case 'we-recommend':

                                $(data.value.children).each(function(index, obj) {
                                    if (obj.data.categoryName === "We Recommend") {
                                        eventListingData = obj;
                                    }
                                });
                                eventListingData.currTime = timeVer;
                               // console.log("eventListingData werecommend log");
                               // console.log(JSON.stringify(eventListingData));
                                break;

                            case 'todays-sales':

                                $(data.value.children).each(function(index, obj) {
                                    if (obj.data.categoryName === "Today's Sales") {
                                        eventListingData = obj;
                                    }
                                });
                                eventListingData.currTime = timeVer;
                               
                                break;

                            case 'current-sales':

                                $(data.value.children).each(function(index, obj) {
                                    if (obj.data.categoryName === "Current Sales") {
                                        eventListingData = obj;
                                    }
                                });
                                eventListingData.currTime = timeVer;
                                //console.log("eventListingData current sales log");
                                //console.log(JSON.stringify(eventListingData));
                                break;    

                        }

                          $(".homepage-holder").remove();
                        if (eventListingData.data != undefined) {
							eventListingData.topCategoryName = data.value.data.categoryName;
                          //  console.log("event list view more" + JSON.stringify(eventListingData));
                            $(self.el).html(self.templates.tmplSpecialAllLong(eventListingData));
							$("img.lazy").lazyload({
								effect : "fadeIn",
								 threshold : 400,
								failure_limit : 0
							});
							$('#marketingPromo').html($('#promotionalContent1').html());

                            $('.marketingSlider').bxSlider({
                              auto: true,
                              autoControls: true
                            });


							var events = $('.columerow').size();
							var totalEvt = events%3;
							if(totalEvt === 0){}
							else if(totalEvt === 1){
								$('.fordesktop').append('<div class="columerow">'+$('#promotionalContent2').html()+'</div><div class="columerow">'+$('#promotionalContent3').html()+'</div>');
							}
							else if(totalEvt === 2){
								$('.fordesktop').append('<div class="columerow">'+$('#promotionalContent3').html()+'</div>');
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
                    $('.product-loader').hide();
                        } else {
                            /*console.log("There is no data available for ending soon section...");*/
                        }

                        /*if ($(".showtooltip").length > 0) {
	                  var div = $(".showtooltip");
	                  var data = $(".eventpowertip");
	                  div.data('powertipjq', data);
	                  div.powerTip({
	                      placement: 'e',
	                      smartPlacement: true,
	                      mouseOnToPopup: true
	                  });
	              }*/

                        $(".moredetail p.text1").on("click", function() {
                            $(this).closest(".moredetail").toggleClass("active");
                        });

                        $(".social-share-link").on('click', function(e) {

                            e.preventDefault();

                            /*console.log("clicked");*/
                            /*console.log(e);*/

                            var classesList = $(e.currentTarget).attr("class").split(' '),
                                curEventId = $(e.currentTarget).closest(".eventpowertip").data('id'),
                                sharingData = {
                                    url: window.location.origin + '/product/listing/event/' + curEventId,
                                    title: $(e.currentTarget).closest(".eventpowertip").data('name'),
                                    imageUrl: $(e.currentTarget).closest(".eventpowertip").data('image'),
                                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                                    handlerName: classesList[1]
                                };

                            socialShare(e, sharingData);

                        });
         
        },
        showToolTip: function(event) {

            $(event.currentTarget).data('powertipjq', $(event.currentTarget).closest("div").find(".eventpowertip"));
            $(event.currentTarget).powerTip({
                placement: 'e',
                smartPlacement: true,
                mouseOnToPopup: true
            });
        },
        isValidDateDiff : function(startDate, enddate) {
              var endDate = new Date(enddate);
              var diff= endDate - startDate;
              //console.log(diff);
              return ((endDate - startDate) > 48 * 60 * 60 * 1000);
        },
        hideToolTip: function(event) {

            $("#powerTip").html("");
            $(event.currentTarget).powerTip('hide');
        }
    });
    
})();