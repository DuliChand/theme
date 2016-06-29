/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.orderCancelView = Backbone.View.extend({
      
               templates: {
               noorderTrack: JST['app/scripts/templates/noorderTrack.hbs'],
               ordercancel: JST['app/scripts/templates/orderCancel.hbs']
                },

                el: '.order-history-popup',
                events: {
                   'click .tracktoggle' :  'shipmentToggle',
                   'click #submitCancelOrder' : 'submitCancelItemsFancyBox' ,
                },
                initialize: function () {
                    _.bindAll(this, 'render');
                    this.OrderCancelRequest = new Webshop.Models.OrderCancelRequest();
                    this.GetCancelRequest = new Webshop.Models.GetCancelRequest();
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
                renderCancelDetailsView : function (data) {
                	console.log("orderLineId---" + JSON.stringify(data.orderLineId));

                    var self = this;
					var productOrderno = data.orderno,
                    orderLineId = data.orderLineId;

                    $.fancybox.showLoading();
                    if (self.OrderCancelRequest.clear().set(data)){
                        self.OrderCancelRequest.fetch({
                            error : function(response) {
                                $.fancybox.hideLoading();
                                 console.log("cancel response -- "+ JSON.stringify(response));
                                if($("#ordernum1").html(self.templates.noorderTrack())) {
                                    $.fancybox($("#ordernum1"));
                                }
                                 console.log("cancel response -- "+ JSON.stringify(response));
                            },
                            success : function(model, response) {
                                $.fancybox.hideLoading();
                                if(response.orderId){
                                    if($("#ordernum1").html(self.templates.ordercancel(response))) {
                                        $('#orderId').text(productOrderno);
                                         $('.trackorder-tab').attr('data-orderno', productOrderno);
                                         $('.trackorder-tab').attr('data-orderlineid', orderLineId);
                                        $.fancybox($("#ordernum1"));
										/*$('.tracktoggle').on('click',function(e){
											e.preventDefault();
											e.stopPropagation();
											$('.tracktable').toggle();
										});*/
										
                                    }
                                }else{
                                    if($("#ordernum1").html(self.templates.noorderTrack())) {
                                        $.fancybox($("#ordernum1"));
                                    }
                                }
                                    
                            }
                        });
                    }         
           },
           submitCancelItemsFancyBox : function(e){
                e.preventDefault();
                e.stopPropagation();

                var self = this,
                orderNo =$('#ordernum1 .trackorder-tab').attr("data-orderno"),
                orderLineId =$('#ordernum1 .trackorder-tab').attr("data-orderlineid"),
                cancelReason = $('.span3').val(),
                comment = $('#order_cancel_form .textarea').val(),
                modeOfReturn = $('.optionsRadios:checked').val();

                if(cancelReason == '' || cancelReason == undefined || cancelReason == 'selectreson'){
                    $('#order_cancel_form .cancelerror').show();
                    return false;
                }


                /*if(modeOfReturn == undefined){
                    $('.returnOfmode li.refunderror').show();
                    return false;
                }*/
                
                var data = {
                    "orderno" : orderNo,
                    "orderLineId" : orderLineId,
                    "cancelReason" :cancelReason,
                    "comment":comment,
                    "modeOfReturn":modeOfReturn
                };
               
               $('#submitCancelOrder').attr('disabled','disabled');

                 if (self.GetCancelRequest.clear().set(data)){
                        self.GetCancelRequest.fetch({
                            error : function(response) {
                                 console.log("get error cancel response -- "+ JSON.stringify(response));
                            },
                            success : function(model, response) {
                                
                                 if(response.responseCode == "SUCCESS"){                                  
                                    $.fancybox.close();
                                    $('#cancelOrder').hide();
                                    location.reload();
                                    // console.log("get success response -- "+ JSON.stringify(response));
                                 }
                                /* if(response.responseCode == "FAILURE"){
                                    $("#invalid-popup h2").text(response.responseCode);
                                        $.fancybox($("#invalid-popup"));
                                         $(".fancybox").fancybox({
                                           afterClose : function(){
                                              $.fancybox($("#ordernum1"));
                                           }
                                        });
                                }
                            }*/
						}
                        })
                    }

                }    
             

        });
     
})();