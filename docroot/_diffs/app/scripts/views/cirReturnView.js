/*global Webshop, Backbone, JST*/
var orderLineId,orderNumber;
var str;
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.CIRReturnView = Backbone.View.extend({

		templates: {
			orderhistorycir: JST['app/scripts/templates/orderhistorycir.hbs'],
			noorders: JST['app/scripts/templates/noorders.hbs'],
			orderline: JST['app/scripts/templates/orderline.hbs'],
			noreturnableorders: JST['app/scripts/templates/noreturnableorders.hbs'],
           	returnableorders: JST['app/scripts/templates/returnableorders.hbs'],
           	uploadreturnimage: JST['app/scripts/templates/uploadreturnimage.hbs']
        },

		el : '#backbone-portlet-cir',
		events : {
			'click #returnMyOrder' : 'initiateReturnPopup',
			'click .paging .order-content' : 'optionClick',
			'click #trackorderDetail' : 'getDetails',
			'click .expendable' : 'getDetails'
		},
		initialize : function() {
			_.bindAll(this, 'render');
			
			this.returnable = new Webshop.Models.CIRReturn();
			this.upload = new Webshop.Models.UploadImage();
			this.createReturnRequest = new Webshop.Models.CreateReturnRequest();
			//this.container = $('#backbone-portlet-cir');
		},
		render : function() {
			var self = this;
			self.returnable.clear().fetch({
            	error: function(response){},
	            success: function (model, response) {
	            	//console.log("response from returnable orders------>"+response);
	            	str = response.orderHeaderWrapper;
	            	if((response.orderHeaderWrapper.responseCode === "SUCCESS") && (response.orderHeaderWrapper.orders)){
						$('#backbone-portlet-cir').html(self.templates.orderhistorycir(response.orderHeaderWrapper));
						 $(".order-outer .paging").quickPager();
						}else{
						$('#backbone-portlet-cir').html(self.templates.noorders(response.orderHeaderWrapper));
					}
	             }
            });
		},
		optionClick: function(e){
  			$('.paging .order-content').each(function(){
    		    $(this).removeClass('table-expanded');
  			});
  			$(e.currentTarget).addClass('table-expanded');
		},
		initiateReturnPopup : function(event) {
			event.preventDefault();
            //var data = $('#cirOrderData').html();
            orderLineId = $(event.currentTarget).attr("name");
            var request = $(event.currentTarget).attr('value');
            console.log("request------------->"+request);
            console.log("str------------->"+str+" : orderNumber----------> "+orderNumber+" : orderLineId------> "+orderLineId);

            this.returnOrderView = new Webshop.Views.ReturnOrderView();
            this.returnOrderView.render(str,orderNumber,orderLineId,request);

		},
		getDetails : function(e){
			e.preventDefault();
			var self = this;
			$('.paging .simplePagerPage1').on('click',function(){
			  $('.paging .simplePagerPage1').each(function(){
			    $(this).removeClass('table-expanded');
			  });
			  
			  $(this).addClass('table-expanded')

			});
			var orderNumberVal = $(e.currentTarget).attr("name");
			var flag = 0; 
			//console.log("str.orders.length=========>"+str.orders.length);
			if(str.orders.length > 1) { 
				$.each(str.orders ,function(index ,obj){
					if(obj.orderNumber == orderNumberVal){
						flag = index;
						orderNumber = orderNumberVal;
						console.log(index)
					}
				});
			}else{

			}
			console.log("index of same order id =========>"+flag);

			//$('#lineDetail').html(self.templates.orderline(str.orders[flag]));
			//$('.orddetail-table tr:nth-child(2)').remove();
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
			$('.orddetail-table').append(self.templates.orderline(str.orders[flag]))
		}
			
	});
	
})();