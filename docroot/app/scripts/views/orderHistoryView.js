/*global Webshop, Backbone, JST*/
var orderId = "";
var orderNumber = "";

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.OrderHistoryView = Backbone.View.extend({

			templates: {
			pastorders: JST['app/scripts/templates/pastorders.hbs'],
			noorders: JST['app/scripts/templates/noorders.hbs'],
            orderline: JST['app/scripts/templates/orderline.hbs'],
            orderhistory: JST['app/scripts/templates/orderhistory.hbs']
        },

		el : '#backbone-portlet-order-history',
		events : {
			'click #porders':'showPastOrders',
			'click #rorders':'showRecentOrders',
			/*'click .moredetail':'orderDetails',*/
			/*'click .expendable':'orderDetails',*/
			'click #trackMyOrder' : 'renderTrackMyItemsFancyBox',
			'click #trackorderDetail' : 'getDetails',
			'click .expendable' : 'getDetails',
			'click .paging .order-content' : 'optionClick'
		},
		initialize : function() {
			_.bindAll(this, 'render');
			
			this.recentOrders = new Webshop.Models.RecentOrders();
			this.pastOrders = new Webshop.Models.PastOrders();
			this.orderLine = new Webshop.Models.OrderLine();
			
			this.container = $('#backbone-portlet-order-history');
		},
		render : function(data) {
			var self = this;
			$('.product-loader').hide();
			var str = data.orderHeaderWrapper;
			orderNumber = data.orderHeaderWrapper.orders.orderNumber;
			if((data.orderHeaderWrapper.responseCode === "SUCCESS") && (data.orderHeaderWrapper.orders)){
				$('#backbone-portlet-order-history').html(self.templates.orderhistory(str));
				
				

			}else{
				$('#backbone-portlet-order-history').html(self.templates.noOrders(str));
			}
			$(".paging").quickPager();
		},
		optionClick: function(e){

		
  				$('.paging .order-content').each(function(){
    		          $(this).removeClass('table-expanded');
  			     });
  
  			 $(e.currentTarget).addClass('table-expanded');

			

		},
		orderDetails: function(e){
			e.preventDefault();
			orderId = $(e.currentTarget).attr("name");
			var self = this;
				self.orderLine.clear().fetch({
					error : function(response) {},
					success : function(model, response) {
						$("#"+orderId).html(self.templates.orderline(model.toJSON()));
						 var pe = $(e.currentTarget).parents(".order-content");
					        $(".order-content").not(pe).removeClass("table-expanded");
					        $(".order-content").not(pe).find(".moredetail").html("More Info");
					            if (!pe.hasClass("table-expanded")) {
					                pe.find(".moredetail").html("Less Info");
					                pe.addClass("table-expanded");
					            } else {
					                pe.find(".moredetail").html("More Info");
					                pe.removeClass("table-expanded");
					            }
						}
	        	});          
	    },
		getDetails : function(e){
			e.preventDefault();
			$('.paging .simplePagerPage1').on('click',function(){
			  $('.paging .simplePagerPage1').each(function(){
			    $(this).removeClass('table-expanded');
			  });
			  
			  $(this).addClass('table-expanded')

			});
			var orderNumberVal = $(e.currentTarget).attr("name"),
			fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
			
			//$('#FormorderTrackNo').html(orderNumberVal);
			
			 var urlBase = URL_PROPERTIES.get('AGGR_ORDER');
			 var urlRoot = urlBase.replace("{deviceId}", fnyToken).replace("{orderNumber}", orderNumberVal);
			 
			 $.ajax({
			  url :urlRoot,            
	          data: "",
	          type: "GET",
	          dataType: "json",
	          beforeSend: function(){
	        	$('#orderresult').css('display','none');
	        	$('.product-loader').css('display','block');
	        	
	          },
	          
	          success: function(data) {
				if(data.domainResponse.responseCode === 'SUCCESS'){
					$('.orderTrackDetail table').each(function(index){
						  if(index !=0){
							$(this).remove()
						  }
						});
						
					$('.orderTrackDetail table tr').each(function(index){
					  if(index !=0){
						$(this).remove()
					  }
					});
					var dataOrderno = data.domainResponse.entitiesResponse[0].baseDTO.orderNumber;
					if(data.domainResponse.entitiesResponse[0].baseDTO.orderLines.actualAmountPaid){
						
						
						var htmlData =  '<tr><td>1</td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.productName+
							'</td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.erpSku+
							'</td><td><img src="'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.thumbnailUrl+
							'"/></td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.status+
							'<br><a data-orderno="'+dataOrderno+'"  data-awb-no="" data-orderline-id="'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.orderLineId+'" id="trackMyOrder" class="fancybox '+data.domainResponse.entitiesResponse[0].baseDTO.status+'" href="#ordernum1">Track Item</a></td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.inboundOrderLines.orderLineValue+
							'</td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.quantity+
							'</td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.orderLineValue+
							'</td><td>0</td><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines.orderLineValue+'</td></tr>';
							
							$('.orddetail-table tr:first-child').after(htmlData);
					}
						
					else if(data.domainResponse.entitiesResponse[0].baseDTO.orderLines.length > 0) { 
							$.each(data.domainResponse.entitiesResponse[0].baseDTO.orderLines ,function(index ,obj){
									var htmlData =  '<tr><td>'+(index +1)+'</td><td>'+obj.productName+
													'</td><td>'+obj.erpSku+
													'</td><td><img src="'+obj.thumbnailUrl+
													'"/></td><td>'+obj.status+
													'<br><a data-awb-no="" data-orderno="'+dataOrderno+'" data-orderline-id="'+obj.orderLineId+'" id="trackMyOrder" class="fancybox '+data.domainResponse.entitiesResponse[0].baseDTO.status+'" href="#ordernum1" >Track Item</a></td><td>'+obj.orderLineValue+
													'</td><td>'+obj.quantity+
													'</td><td>'+obj.orderLineValue+
													'</td><td>0</td><td>'+obj.orderLineValue+'</td></tr>';
													
										$('.orddetail-table tr:last-child').after(htmlData);
							});
							
								
						 
					}

						 var customerInfoData = '<tr><td style="width:33% !important"><table class="customerBillingInfo"><tr><td class="custHeading">CUSTOMER INFORMATION : </td></tr><tr><td><strong>'+data.domainResponse.entitiesResponse[0].baseDTO.customer.firstName+ ' ' +data.domainResponse.entitiesResponse[0].baseDTO.customer.lastName+
														'</strong></td></tr><tr><td><strong> Email : </strong> '+data.domainResponse.entitiesResponse[0].baseDTO.customer.loginId+'</td></tr><tr><td><strong> Mobile No. </strong> '+data.domainResponse.entitiesResponse[0].baseDTO.billingAddress.mobileNo+
														'</td></tr></table></td><td style="width:33% !important" ><table class="customerBillingInfo" ><tr><td class="custHeading"> SHIPPING INFORMATION :</td></tr><tr><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines[0].shippingAddress.fullName+'</td></tr><tr><td>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines[0].shippingAddress.address1+'</br>'+data.domainResponse.entitiesResponse[0].baseDTO.orderLines[0].shippingAddress.address2+
														'</td></tr></table></td><td style="width:33% !important"><table><tr><td><strong>Total Amount</strong>'+data.domainResponse.entitiesResponse[0].baseDTO.grandOrderValue+
														'</td></tr><tr><td><strong>Offer Discount</strong>'+parseInt(data.domainResponse.entitiesResponse[0].baseDTO.totalBasePrice - data.domainResponse.entitiesResponse[0].baseDTO.grandOrderValue)+
														'</td></tr><tr><td><strong>Delivery Charges</strong>'+data.domainResponse.entitiesResponse[0].baseDTO.totalShippingCharge+
														'</td></tr><tr><td><strong>Store Credits </strong>'+data.domainResponse.entitiesResponse[0].baseDTO.totalStoredCredit+
														'</td></tr><tr><td><strong>Reward Points </strong>'+data.domainResponse.entitiesResponse[0].baseDTO.totalRewardAmount+
														'</td></tr></table></td></tr>'
														
								
								$('.orddetail-table').after('<table class="userInfoTable">'+customerInfoData+'</table>');	
								
								
							
						/*self.orderLine.clear().fetch({
							error : function(response) {},
							success : function(model, response) {
								var orderlineData = model.toJSON();
								 if(orderlineData.domainResponse.responseCode == 'SUCCESS'){
										$('#orderTrackDetails').data('orderline-id',orderlineData.domainResponse.entitiesResponse.orderLines.orderLineId);
									}
								else{
									console.log('No data from Orderline.. Service');
								}	
							}
						}); */	
							
					}
			  }
			});  
			
		
		},
		showPastOrders : function(e){
			e.preventDefault();
			var self = this;
			$("#rorders").removeClass("active");
			$("#porders").addClass("active");
			
			self.pastOrders.clear().fetch({
				error : function(response) {},
				success : function(model, response) {
					var jsonObject = model.toJSON(),str = jsonObject.orderHeaderWrapper;
					if((jsonObject.orderHeaderWrapper.responseCode === "SUCCESS") && (jsonObject.orderHeaderWrapper.orders)){
						$('.porder-table').html(self.templates.pastOrders(str));
						$('.porder-table').show();
						$('.rorder-table').hide();
					}else{
						$('.porder-table').html('<div class="order-header"><div class="order-no"><span>Order No.</span></div><div class="order-no"><span>Order Date/Time</span></div><div class="order-items"><span>Items</span></div><div class="order-value"><span>Order Value</span></div></div><div id="last-order" class="content-row"><span>'+str.message+'</span></div>');
						$('.porder-table').show();
						$('.rorder-table').hide();
					}
				}
			});
		},
		renderTrackMyItemsFancyBox : function(e){
			e.preventDefault();
			var self = this,
			awbNumber = $(e.currentTarget).data("awb-no"),
			orderNo = $(e.currentTarget).data("orderno"),
			orderLineId = $(e.currentTarget).data("orderline-id"),
			data = {"awbNumber":awbNumber,
					"orderno":orderNo,
					"orderLineId":orderLineId};
			
			this.orderLineView = new Webshop.Views.OrderLineView();
			this.orderLineView.renderShippingDetailsView(data);
			console.log("orderno is --"+orderNo);
			$('#orderId').text(orderNo);
		},
		shipmentToggle : function(e){
			e.preventDefault();
			//console.log("shipment toggle");
			$('.tracktable').toggle();
			$.fancybox.reposition();
		},
		showRecentOrders : function(e){
			e.preventDefault();
			$("#rorders").addClass("active");
			$("#porders").removeClass("active");
			$('.porder-table').hide();
			$('.rorder-table').show();
		}
	});
	
})();