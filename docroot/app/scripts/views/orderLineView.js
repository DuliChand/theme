/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.OrderLineView = Backbone.View.extend({
      
               templates: {
               noorderTrack: JST['app/scripts/templates/noorderTrack.hbs'],
               ordertracking: JST['app/scripts/templates/ordertracking.hbs']
                },

                el: '.order-history-popup',
                events: {
                   'click .tracktoggle' :  'shipmentToggle'
                },
                initialize: function () {
                    _.bindAll(this, 'render');
                    this.shipmentTrack = new Webshop.Models.ShipmentTrack();
                },
                render: function () {
                	
                },
                shipmentToggle : function(e){
                    e.preventDefault();
                    console.log("shipment toggle");
                    $('.tracktable').toggle();
					console.log("upper track init---");
                    $.fancybox.reposition();
                },
                renderShippingDetailsView : function (data) {
                	/*console.log(orderId);*/
                    var self = this;
					var productOrderno = data.orderno ;
                    $.fancybox.showLoading();
                    if (self.shipmentTrack.clear().set(data)){
                        self.shipmentTrack.fetch({
                            error : function(response) {
                                $.fancybox.hideLoading();
                                if($("#ordernum1").html(self.templates.noorderTrack())) {
                                    $.fancybox($("#ordernum1"));
                                }
                            },
                            success : function(model, response) {
                                $.fancybox.hideLoading();
                                if(response.orderWrapper.orderHeaders.orderLines){
                                    if($("#ordernum1").html(self.templates.ordertracking(response))) {
										console.log("order no is --"+productOrderno);
                                        $('#orderId').text(productOrderno);
										
                                        $.fancybox($("#ordernum1"));
										$('.tracktoggle').on('click',function(e){
											e.preventDefault();
											e.stopPropagation();
											$('.tracktable').toggle();
											console.log("lower track init---");
										});
										
                                    }
                                }else{
                                    if($("#ordernum1").html(self.templates.noorderTrack())) {
                                        $.fancybox($("#ordernum1"));
                                    }
                                }
                                    
                            }
                        });
                    }         
           }
        });
     
})();