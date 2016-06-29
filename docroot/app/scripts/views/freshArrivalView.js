/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';

    Webshop.Views.FreshArrivalView = Backbone.View.extend({

        templates: {
            tmpl15: JST['app/scripts/templates/tmpl15.hbs'],
            tmpl4: JST['app/scripts/templates/tmpl4.hbs'],
            tmpl5: JST['app/scripts/templates/tmpl5.hbs'],
            tmpl6: JST['app/scripts/templates/tmpl6.hbs'],
            tmpl4more: JST['app/scripts/templates/tmpl4more.hbs'],
            tmpl5more: JST['app/scripts/templates/tmpl5more.hbs'],
            tmpl6more: JST['app/scripts/templates/tmpl6more.hbs'],
        },
        el: '#backbone-portlet-fresh-arrival',
      events: { 
          'mouseover .showtooltip' : 'showToolTip'/*,
          'mouseout .showtooltip' : 'hideToolTip'*/
      },
      initialize: function () {
        _.bindAll(this, 'render');
        this.model = new FreshArrival();
      },
      render: function () {
          var self = this;
          self.model.fetch({
          error: function(response){
            console.log(response);
          },
          success: function (model, response) {
            var data = model.toJSON(), freshArrivalData = {};
            
            freshArrivalData.categoryId = data.value.data.categoryId;
            
            $(data.value.children).each(function(index,obj){
                if(obj.data.categoryName === "Today's Sales"){
                    freshArrivalData.data = obj.data;
                }
            });
            
            if(freshArrivalData.data != undefined) {
                
                if(freshArrivalData.data.templateName ==='tmpl15'){
                      $(self.el).html(Handlebars.templates.tmpl15(freshArrivalData));
                  }
                  
                  if(freshArrivalData.data.templateName ==='tmpl6more'){
                      $(self.el).html(Handlebars.templates.tmpl6more(freshArrivalData));
                  }
                 
                  if(freshArrivalData.data.templateName ==='tmpl5more'){
                      $(self.el).html(Handlebars.templates.tmpl5more(freshArrivalData));
                  }
                  
                  if(freshArrivalData.data.templateName ==='tmpl4more'){
                      $(self.el).html(Handlebars.templates.tmpl4more(freshArrivalData));
                  }
                  
                  if(freshArrivalData.data.templateName ==='tmpl6'){
                      $(self.el).html(Handlebars.templates.tmpl6(freshArrivalData));
                  }
                  
                  if(freshArrivalData.data.templateName ==='tmpl5'){
                      $(self.el).html(Handlebars.templates.tmpl5(freshArrivalData));
                  }
                  
                  if(freshArrivalData.data.templateName ==='tmpl4'){
                      $(self.el).html(Handlebars.templates.tmpl4(freshArrivalData));
                  }
                  
                  var eventList = $("#backbone-portlet-fresh-arrival .event-col");
                  
                  if(eventList.length > 0) {
                      $.each( eventList, function( i, element ) {
                            
                            var currEvent = $(element),
                                eventTimeHolder = currEvent.find(".event-timer"),
                                eventExpireDateTime = eventTimeHolder.data("expire-datetime"); 
                            
                            eventTimeHolder.countdown( eventExpireDateTime ).on('update.countdown', function(e) {
                                eventTimeHolder.html(e.strftime('%D DAYS %H:%M:%S LEFT'));
                            }).on('finish.countdown', function() {
                                eventTimeHolder.html("EXPIRED");
                            });
                            
                        });
                  }
                
            } else {
                console.log("There is no data available for fresh arrival section...");
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
            
            $(".moredetail").on("click", function() {
                $(this).toggleClass("active");
            });
            
          }
        });
      },
      showToolTip : function(event) {
          
         $(event.currentTarget).data('powertipjq', $(event.currentTarget).closest("div").find(".eventpowertip"));
           $(event.currentTarget).powerTip({
                placement: 'e',
                smartPlacement: true,
                mouseOnToPopup: true
            });
        },
        hideToolTip : function(event) {
          
          $("#powerTip").html("");
          $(event.currentTarget).powerTip('hide');
        }

    });

})();