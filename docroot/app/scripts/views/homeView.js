/*global Webshop, Backbone, JST*/


var timeVer,
heroGalleryHtmlData,
todaysHtmlData,
currentSalesHtmlData,
featuredcategoriesHtmldata,
endingSoonHtmlData,
featureShopData;

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    
    Webshop.Views.HomeView = Backbone.View.extend({
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
            tmplAllLongFashion: JST['app/scripts/templates/tmplAllLongFashion.hbs'],
            tmpl18todaysales: JST['app/scripts/templates/tmpl18todaysales.hbs'],
            tmpl18werecommend: JST['app/scripts/templates/tmpl18werecommend.hbs'],
            tmplSpecialAllLong: JST['app/scripts/templates/tmplSpecialAllLong.hbs'],
        },
        el: '#backbone-portlet-home',
        events: {
            'click .social-share-link': 'powertipSocialShareHandler',
            'mouseover .showtooltip': 'showToolTip',
			'.moredetail p.text1': ''
        },
        initialize: function() {
            _.bindAll(this, 'render');
            this.featuredCategories = new Webshop.Models.FeaturedCategories();
            this.featuredProducts = new Webshop.Models.FeaturedProducts();
        },
        render: function(data , featureShop) {

            var self = this;
			featureShopData = featureShop;

            /*var CustomefirstRecord = parseInt($('#FnyFirstRecord').attr('data-firstRecord'));
            var TodayDate = new Date(CustomefirstRecord);
            var time = TodayDate.getHours() + ":" + TodayDate.getMinutes();
            if(time == '9:00'){
             timeVer = CustomefirstRecord;*/
             //console.log("12:20 time" + timeVer);
             // }
             // else{
           // timeVer = $.cookie('customerFirstRecord');
            //console.log("time ver" + timeVer );
          //  }

            //console.log("home view rendered");
			//$(self.el).html(self.templates.tmplAllLongPremium(data));
						//self.renderEventTimer();
						self.renderHeroBannerSection(data);
                        self.renderFreshArrivalSection(data);
                        //self.renderWeRecommendSection(data);
                       // self.renderFeaturedCategoriesSection(featureShop);
                       // self.renderEndingSoonSection(data);
						//self.renderHomeContent();
						//self.renderLazyLoad();
						//self.renderKomliPixel();
						self.renderMoreDetail();
              
                
            
        },
		renderHomeContent : function(){
			var self = this ;
			$(self.el).html('<div id="heroBanner">'+heroGalleryHtmlData+'</div><div id="freshArrival">'+todaysHtmlData+'</div><div id="weRecommend">'+currentSalesHtmlData+'</div><div id="featuredCategories">'+featuredcategoriesHtmldata+'</div><div id="endingSoon">'+endingSoonHtmlData+'</div>');
			if ($('.hero-slider .bxslider').length > 0) {
				$('.hero-slider .bxslider').bxSlider({
					auto: true,
					controls: true,
					pager: false,
					touchEnabled: true,
					mode: 'fade'
				});
             }
			 
			  
			 
			 
		},
		renderMoreDetail: function(){
			 $(".moredetail p.text1").on("click", function(e) {
				e.preventDefault();
			  $(this).closest(".moredetail").toggleClass("active");
			});
		},
		renderEventTimer:function(){
			var self = this;
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
                                            eventTimeHolder.html(e.strftime('%D Days '));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }else{
                                    setTimeout(function(){
    
                                        eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                            eventTimeHolder.html(e.strftime('%H:%M:%S '));
                                        }).on('finish.countdown', function() {
                                            eventTimeHolder.html("EXPIRED");
                                        });
                                        
                                    }, 500);
                                }
                                
                        });
                  }
		},
		renderLazyLoad: function(){
			var self = this;
			$(".event-col img").lazyload({
				effect:"fadeIn",
				load : function()
				{
				
					$(this).addClass('imgloaded');
					var eventTimeHolder = $(this).parent().find('.event-timer'),
                    eventExpireDateTime = eventTimeHolder.data("expire-datetime"),
					currdate = new Date(),
					flag = self.isValidDateDiff(currdate,eventExpireDateTime);
					
					if(flag){
						setTimeout(function(){

							eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
								eventTimeHolder.html(e.strftime('%D Days '));
							}).on('finish.countdown', function() {
								eventTimeHolder.html("EXPIRED");
							});
							
						}, 500);
					}else{
						setTimeout(function(){

							eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
								eventTimeHolder.html(e.strftime('%H:%M:%S'));
							}).on('finish.countdown', function() {
								eventTimeHolder.html("EXPIRED");
							});
							
						}, 500);
					}
				}
			});

			//$('.columerow img').loadScroll(500);
			

		},
        renderHeroBannerSection: function(data) {
       
            var self = this,
                heroBannersData = {};
            $(data.value.children).each(function(index, obj) {
                if (obj.data.categoryName === "heroGallery") {
                    heroBannersData = obj;
                }
            });
            //heroBannersData.currTime = timeVer;
            //console.log(JSON.stringify(heroBannersData));
            if (heroBannersData.data != undefined) {
                $("#heroBanner").html(self.templates.herobanner(heroBannersData));
				heroGalleryHtmlData = self.templates.herobanner(heroBannersData);
				if ($('#staticHeroBannerContent').html() != "" || $('#staticHeroBannerContent').html() != null || $('#staticHeroBannerContent').html() != undefined){
				  $('#staticHeroBannerContent a img').each(function(){
					var imgPath = $(this).attr('src');
					var timeStamp = new Date().getTime(); 
					$(this).attr('src',imgPath+'?v='+timeStamp);
				  })
				  $('.bxslider').prepend($('#staticHeroBannerContent ul').html());

				}

                                    
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
		
		renderKomliPixel: function() {
			var self = this,
			pixelData = {
				pageType : "v",
				prdtId: "",
				prdtName: "",
				salePrice: "",
				qtyAvailable: "",
				catId: "",
				catName:"",
				cartVal:""
			},
			
			//Komli pixel view rendered-----
			komliPixel = new  Webshop.Views.Pixlet();
			komliPixel.globalPixel(pixelData);
			
		
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
						endingSoonHtmlData = self.templates.tmplAllLong(eventsData);
						
                    }

                    if (eventsData.data.templateName === 'tmplAllMedium') {
						eventsData.topCategoryName = categoryName;
                       $("#" + sectionName + "").html(self.templates.tmplAllMedium(eventsData));
						currentSalesHtmlData = self.templates.tmplAllMedium(eventsData);
                    }

                    if (eventsData.data.templateName === 'tmplAllSmall') {
						eventsData.topCategoryName = categoryName;
                        $("#" + sectionName + "").html(self.templates.tmplAllSmall(eventsData));
						endingSoonHtmlData = self.templates.tmplAllSmall(eventsData);
						
                    }

                    if (eventsData.data.templateName === 'tmpl18todaysales') {
                        $("#" + sectionName + "").html(self.templates.tmpl18todaysales(eventsData));
                    }


                    if (eventsData.data.templateName === 'tmplSpecialAllLong') {
						eventsData.topCategoryName = categoryName;
                        $("#" + sectionName + "").html(self.templates.tmplSpecialAllLong(eventsData));
						todaysHtmlData = self.templates.tmplSpecialAllLong(eventsData);
						
                        $('#marketingPromo').html($('#promotionalContent1').html());
                      setTimeout(function(){
                        $('.marketingSlider').bxSlider({
                              auto: true,
                              autoControls: true
                            });
                    }, 1000);

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

                    /* if(eventList.length > 0) {
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
                  }*/
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
							eventsData.topCategoryName = categoryName;
							$("#" + sectionName + "").html(self.templates.tmplAllMedium(eventsData));
							
						}

						if (eventsData.data.templateName === 'tmplAllSmall') {
							eventsData.topCategoryName = categoryName;
							$("#" + sectionName + "").html(self.templates.tmplAllSmall(eventsData));
						
						}

						if (eventsData.data.templateName === 'tmpl18todaysales') {
							$("#" + sectionName + "").html(self.templates.tmpl18todaysales(eventsData));
						}


						if (eventsData.data.templateName === 'tmplSpecialAllLong') {
							eventsData.topCategoryName = categoryName;
							$("#" + sectionName + "").html(self.templates.tmplSpecialAllLong(eventsData));
							
							
							$('#marketingPromo').html($('#promotionalContent1').html());
						   setTimeout(function(){
							$('.marketingSlider').bxSlider({
								  auto: true,
								  autoControls: true
								});
						}, 1000);

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
						//var eventList = $(".events .event-col");
						 
						 //var eventList = $(".events .event-col");

							/*if(eventList.length > 0) {
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
							}*/ 
                    }

                   

                
            }

            else if((categoryName.toLowerCase() === "lounge")||(categoryName.toLowerCase() === "shops") || (categoryName.toLowerCase() === "clearance") || (categoryName.toLowerCase() === "designers") || (categoryName.toLowerCase() === "stores")){
                  var specificCategoryData =  data;
				  specificCategoryData.topCategoryName = categoryName;
                 // specificCategoryData.currTime = timeVer;
				  //console.log(JSON.stringify(specificCategoryData));
                  if(specificCategoryData.value.data != undefined) { 
                    if(categoryName.toLowerCase() === "designers")
                    {
                         $('#freshArrival').html(self.templates.tmplAllLongFashion(specificCategoryData));
                         $('.events .event-bottom .logos-area').css('display','none');
                    }
                    else
                    {
                      $('#freshArrival').html(self.templates.tmplAllLongPremium(specificCategoryData));
					 } 
					  $("img.lazy").lazyload({
							effect : "fadeIn"
					  });
					  
                      if(categoryName.toLowerCase() === "designers") {
                        //$('.navbar-brand.Fashion > span' ).addClass('activeFG');
                        
                         $('.events > h1.heading-style strong').remove();
                         
                      //  $( '<h1 class="heading-style"><strong style="font-size:19px;">INAUGURAL DISCOUNT OF <span style="color:#d22573">EXTRA 20% OFF </span>| USE CODE FG20 | ONLY ON FASHION GARAGE SHOWCASE</strong></h1>' ).insertBefore( $( "#backbone-portlet-home .events:first-child .heading-style" ) ); 
                       
                      }

                      
					  if(categoryName.toLowerCase() === "clearance"){
					  
						$('.row.events').each(function(){
                            var headStyle = $(this).find('.heading-style strong').text();
                            if(headStyle === "Women's Wardrobe"){
                                $(this).find('.heading-style strong').html("Women");
                            }
                            else if(headStyle === "Men's Closet"){
                                $(this).find('.heading-style strong').html("Men");
                            }

                            else if(headStyle === "Excessorize"){
                                $(this).find('.heading-style strong').html("Accessories");
                            }

                            else if(headStyle === "Heavenly Abode"){
                                $(this).find('.heading-style strong').html("Home & Living");
                            }

                        });
					  }
					  if(categoryName.toLowerCase() === "shops" || categoryName.toLowerCase() === "designers") {
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
           // freshArrivalData.currTime = timeVer;
           // console.log("freshArrivalData log");
            //console.log(JSON.stringify(freshArrivalData));
              
            self.renderSectionEvents("freshArrival", freshArrivalData, categoryName, data , promotionalContentOne);
			self.renderLazyLoad();
			self.renderMoreDetail();
			$(window).on('scroll.todaysale',function() {
				if( navigator.userAgent.match(/Android/i)
					 || navigator.userAgent.match(/webOS/i)
					 || navigator.userAgent.match(/iPhone/i)
					 || navigator.userAgent.match(/iPad/i)
					 || navigator.userAgent.match(/iPod/i)
					 || navigator.userAgent.match(/BlackBerry/i)
					 || navigator.userAgent.match(/Windows Phone/i)
					 || navigator.userAgent.match(/bada/i)
					 || navigator.userAgent.match(/Bada/i)
					 ){	
					
					if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {
						self.renderWeRecommendSection(data);
						$(window).off('scroll.todaysale');

					}	
				  
				}
			
				if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 150) - $(window).height())) {
					self.renderWeRecommendSection(data);
					$(window).off('scroll.todaysale');

				}
			})

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
           
           // weRecommendData.currTime = timeVer;
            //console.log("weRecommend log");
           // console.log(JSON.stringify(weRecommendData));
            
           
            self.renderSectionEvents("weRecommend", weRecommendData, categoryName, data, promotionalMediumContent);
			self.renderLazyLoad();
			self.renderMoreDetail();
			$(window).on('scroll.weRecommend',function() {
				if( navigator.userAgent.match(/Android/i)
					 || navigator.userAgent.match(/webOS/i)
					 || navigator.userAgent.match(/iPhone/i)
					 || navigator.userAgent.match(/iPad/i)
					 || navigator.userAgent.match(/iPod/i)
					 || navigator.userAgent.match(/BlackBerry/i)
					 || navigator.userAgent.match(/Windows Phone/i)
					 || navigator.userAgent.match(/bada/i)
					 || navigator.userAgent.match(/Bada/i)
					 ){	
					
					if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {
						if((categoryName.toLowerCase() === "women")||(categoryName.toLowerCase() === "men")||(categoryName.toLowerCase() === "kids")
						||(categoryName.toLowerCase() === "accessories")||(categoryName.toLowerCase() === "home & living")){
							self.renderEndingSoonSection(data);
						}
						self.renderFeaturedCategoriesSection(featureShopData , promotionalMediumContent , data);
						$(window).off('scroll.todaysale');

					}	
				  
				}
				if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 100) - $(window).height())) {
					var categoryName = data.value.data.categoryName ;
					if((categoryName.toLowerCase() === "women")||(categoryName.toLowerCase() === "men")||(categoryName.toLowerCase() === "kids")
                    ||(categoryName.toLowerCase() === "accessories")||(categoryName.toLowerCase() === "home & living")){
						self.renderEndingSoonSection(data);
					}
					self.renderFeaturedCategoriesSection(featureShopData , promotionalMediumContent , data);
					$(window).off('scroll.weRecommend');

				}
			})
          
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
        
        renderFeaturedCategoriesSection: function(data, promotionalMediumContent , categoryData) {

            var self = this;

                   // data.currTime = timeVer;
                    //console.log("featuredcategories log");
                    //console.log(JSON.stringify(data));
					
					$("#featuredCategories").html(self.templates.featuredcategories(data));
					if(data.value.data.categoryName.toLowerCase() == 'clearance'){
                       $("#featuredCategories .heading-style strong").html('CLEARANCE');
                    }
					featuredcategoriesHtmldata = self.templates.featuredcategories(data);
					self.renderLazyLoad();
					self.renderMoreDetail();
					$(window).on('scroll.featuredCategories',function() {
						if( navigator.userAgent.match(/Android/i)
							 || navigator.userAgent.match(/webOS/i)
							 || navigator.userAgent.match(/iPhone/i)
							 || navigator.userAgent.match(/iPad/i)
							 || navigator.userAgent.match(/iPod/i)
							 || navigator.userAgent.match(/BlackBerry/i)
							 || navigator.userAgent.match(/Windows Phone/i)
							 || navigator.userAgent.match(/bada/i)
							 || navigator.userAgent.match(/Bada/i)
							 ){	
							
							if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 30) - $(window).height())) {
							 $('#marketingLinks').show();
								self.renderEndingSoonSection(data);
								$(window).off('scroll.todaysale');

							}	
						  
						}
				
						if ($(window).scrollTop() >= ((($(document).height() - $("footer").height()) + 50) - $(window).height())) {
						 $('#marketingLinks').show();
							self.renderEndingSoonSection(categoryData);
							$(window).off('scroll.featuredCategories');

						}
					});
					
					//$("img.lazy").loadScroll(500);
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
                          
                   /* var eventList = $(".events .event-col");

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
                    }  */

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

           // endingSoonData.currTime = timeVer;
           // console.log("endingSoonData; log");
           // console.log(JSON.stringify(endingSoonData));       
              
                self.renderSectionEvents("endingSoon", endingSoonData, categoryName, data);
				self.renderLazyLoad();
				self.renderMoreDetail();

                var events = $('.endingsoonSalesCount .columerow').size();
                        var totalEndingEvt = events%3;
                        if(totalEndingEvt === 0){}
                        else if(totalEndingEvt === 1){
                            
                          $('.endingsoonSalesCount').append('<div class="columerow">'+$('#promotionalSmallContent1').html()+'</div><div class="columerow">'+$('#promotionalSmallContent2').html()+'</div>');
                        }
                        else if(totalEndingEvt === 2){
                         
                         $('.endingsoonSalesCount').append('<div class="columerow">'+$('#promotionalSmallContent1').html()+'</div>');
                        }
                
                
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
