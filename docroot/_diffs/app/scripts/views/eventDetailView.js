/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.EventDetailView = Backbone.View.extend({

        template: JST['app/scripts/templates/categoryinfo.hbs'],
        /*
        JST['app/scripts/templates/eventactive.hbs'],
JST['app/scripts/templates/eventexpired.hbs'],
JST['app/scripts/templates/eventinfo.hbs'],

        */

        el: '#backbone-portlet-event-detail',
      events:{
          'click .add-favorites' : 'addEventToFavourites',
          'click .remove-favorites' : 'removeEventFromFavourites',
          'click .social-share-link' : 'socialShareHandler',
          'click #eventName' : 'toggleEventInfoPannel',
          'click #eventInfoPanel .closebutton' : 'toggleEventInfoPannel'
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new EventDetail();
        this.addToFavourites = new AddToFavourites();
        this.removeFromFavourites = new RemoveFromFavourites();
        this.eventFavouriteStatus = new EventFavouriteStatus();
        
      },
      render: function () {
          var self = this;
          self.model.fetch({
            error: function(response){
              //  console.log(response);
            }, 
            success: function (model, response) {
                
                 var data = model.toJSON();                 
                 
                 if(data.categoryWrapper) {
                    $(self.el).html(Handlebars.templates.categoryinfo(data.categoryWrapper.category));
                 }
                
                 if(data.event) {
                    $(self.el).html(Handlebars.templates.eventinfo(data));
                    
                    self.updateFavouriteLink();
                    
                    var eventTimeHolder = $("#eventTimer"),
                        eventExpireDateTime = eventTimeHolder.data("expire-datetime");
                    
                    eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                        eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                    }).on('finish.countdown', function() {
                        eventTimeHolder.html("EXPIRED");
                    });
                    
                 }
                 
                 /*var eventEndDate = $("#eventTimer").data("event-enddate");
                 $("#eventTimer").countdown(eventEndDate);*/
            }
          });
        },
        addEventToFavourites : function(e) {
            
            e.preventDefault();
            
            var self = this,
                eventImage = $("#eventMainImage").data("favsrc"),
                eventName = $("#eventName").text(),
                eventId = $("#backbone-portlet-event-detail").data("id"),
                
                eventData = {
                    "eventCassandra": [
                        {
                          "eventName": eventName,
                          "eventId": eventId,
                          "thumbnailUrl": eventImage
                        }
                      ]
                }; 

            if (self.addToFavourites.clear().set(eventData)) {
                
                self.addToFavourites.save({}, {
                    error : function(model, response) {
                        //console.log(response);
                    },
                    success : function(model, response) {

                        if(response.eventCassandraWrapper.responseCode === "SUCCESS") {
                            self.render();
                        } else {
                            if(response.eventCassandraWrapper.errorMessage != undefined) {
                               // console.log(response.eventCassandraWrapper.errorMessage);
                            } else {
                               // console.log("Add to Favourite Event Service Failure.");
                            }
                            
                        }
                    }
                });
                
            } else {
                
                this.$('.alert-error').fadeIn();
            }
        },
        removeEventFromFavourites : function(e) {
            
            e.preventDefault();
            
            var self = this,
                createdTime = $(".remove-favorites").data("created-time"),
                eventData = { "createdTime" : createdTime };
            
            if (self.removeFromFavourites.clear().set(eventData)) {
                self.removeFromFavourites.fetch({
                    error: function (response) {
                        //console.log(response);
                    },
                    success: function (model, response) {
                       // console.log(response);
                        self.render();
                    }
                });
            }
        },
        updateFavouriteLink : function() {
            
            var self = this,
                eventId = $("#backbone-portlet-event-detail").data("id"),
                eventData = { "eventId" : eventId };
            
            if (self.eventFavouriteStatus.clear().set(eventData)) {
                self.eventFavouriteStatus.fetch({
                    error: function (response) {
                        //console.log(response);
                    },
                    success: function (model, response) {
                        //console.log(response);
                        
                        if(response.isFavourite) {
                            $(".favorite-icon")
                                .addClass("remove-favorites")
                                .removeClass("add-favorites")
                                .attr("data-created-time", response.createdTime);
                        } else {
                            $(".favorite-icon")
                            .addClass("add-favorites")
                            .removeClass("remove-favorites")
                            .removeAttr("data-created-time");
                        }
                    }
                });
            }
        },
        socialShareHandler : function(e) {
           
           e.preventDefault();

            var classesList = $(e.currentTarget).attr("class").split(' '),
                sharingData = {
                    url: window.location.origin + '/product/listing/event/' + curEventId,
                    title: $("#eventName").text(),
                    imageUrl: $('#eventMainImage').data("data-favsrc"),
                    description: "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
                    handlerName: classesList[1]
                };

            socialShare(e, sharingData); 
            
        },
        toggleEventInfoPannel : function(e) {
            e.preventDefault();
            $("#eventInfoPanel").toggle();
        }

    });

})();
