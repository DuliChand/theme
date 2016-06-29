/*global Webshop, Backbone, JST*/
var fd;
var flagOrderId =0,flagOrderLineId=0;
Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.ReturnOrderView = Backbone.View.extend({

		templates: {
			noorders: JST['app/scripts/templates/noorders.hbs'],
           	uploadreturnimage: JST['app/scripts/templates/uploadreturnimage.hbs'],
           	reasons: JST['app/scripts/templates/reasons.hbs'],
           	replacement: JST['app/scripts/templates/replacement.hbs'],
           	success: JST['app/scripts/templates/success.hbs'],
           	returnstatus: JST['app/scripts/templates/returnstatus.hbs']
        },

		el : '#ordernum1',
		events : {
			'change .productBox' : 'isReasonValid',
			'click #upload' : 'uploadImageFile'
		},
		initialize : function() {
			_.bindAll(this, 'render');
			
			this.reasonforreturn = new Webshop.Models.ReasonForReturn();
			this.upload = new Webshop.Models.UploadImage();
			this.returnstatus = new Webshop.Models.CIRReturnStatus();
			this.createReturnRequest = new Webshop.Models.CreateReturnRequest();
			//this.container = $('#backbone-portlet-cir');
		},
		render : function(str,orderNumber,orderLineId,request) {
			var self = this,data;
			if(request != "status"){
				self.reasonforreturn.clear();
				self.reasonforreturn.fetch({
	            error: function(response){},
		        success: function (model, response) {
		        	data = model.toJSON();
		            //console.log("data from reasonforreturn ------>"+data);
		            if(response.reasonsForReturnWrapper.responseCode === "SUCCESS"){
		            	data = response;
		            	if(str.orders.length > 1) { 
							$.each(str.orders ,function(index ,obj){
								if(obj.orderNumber == orderNumber){
									flagOrderId = index;
									if(obj.orderLines.length){
										$.each(obj.orderLines ,function(index ,obj){
											if(obj.orderLineId == orderLineId){
												flagOrderLineId = index;
											}
										});
									}else{
										if(obj.orderLines.orderLineId == orderLineId){
											flagOrderLineId = -1;
										}
									}
								}
							});	
						}
						if(flagOrderLineId != -1){
							console.log("positive scenario");
							console.log("flagOrderId------->"+flagOrderId+" flagOrderLineId--------->"+flagOrderLineId);
							console.log("string-----------> "+JSON.stringify(str.orders[flagOrderId].orderLines));
							if($("#ordernum1").html(self.templates.uploadreturnimage(str.orders[flagOrderId].orderLines[flagOrderLineId]))) {
								$('.productBox').html(self.templates.reasons(data.reasonsForReturnWrapper));
								$('#orderId').text(orderLineId);
				                $.fancybox($("#ordernum1"));
				               
				        	}
						}else{
							console.log("negative scenario");
							console.log("flagOrderId------->"+flagOrderId+" flagOrderLineId--------->"+flagOrderLineId);
							console.log("string-----------> "+JSON.stringify(str.orders[flagOrderId].orderLines));
							if($("#ordernum1").html(self.templates.uploadreturnimage(str.orders[flagOrderId].orderLines))) {
								$('.productBox').html(self.templates.reasons(data.reasonsForReturnWrapper));
								$('#orderId').text(orderLineId);
				                $.fancybox($("#ordernum1"));
				               
				        	}
						}
						
		            }else{
		            	console.log("No Reasons");
		            	if(str.orders.length > 1) { 
							$.each(str.orders ,function(index ,obj){
								if(obj.orderNumber == orderNumber){
									flagOrderId = index;
									if(obj.orderLines.length > 1){
										$.each(obj.orderLines ,function(index ,obj){
											if(obj.orderLineId == orderLineId){
												flagOrderLineId = index;
											}
										});
									}
								}
							});
						}
						if($("#ordernum1").html(self.templates.uploadreturnimage(str.orders[flagOrderId].orderLines[flagOrderLineId]))) {
							$('#orderId').text(orderLineId);
				            $.fancybox($("#ordernum1"));
				            
				        }
		        	}
		        }
            });	
			}else{
				console.log("Return initiated");
				var data ={"orderLineId":orderLineId};
			        if (self.returnstatus.clear().set(data)) {
					    self.returnstatus.save({},{
					        error: function(response){},
						    success: function (model, response) {
						    var data = model.toJSON();
						    //console.log("response------>"+response);
						        if($("#ordernum1").html(self.templates.returnstatus(response))) {
				                $.fancybox($("#ordernum1"));
				                
				        		}  	
					        }
			            });
					}
				}	
		},
		isReasonValid : function(event){
			event.preventDefault();
			var self = this;
			var status = $(event.currentTarget).find(":selected").data("status");
			var reason = $('.productBox').find(":selected").text();
			//console.log("status------->"+status+" : "+" reason---------->"+reason);
			if(status.toLowerCase() === 'active'){
				$("#returnImage").prop('disabled', false);
				$("#upload").prop('disabled', false);
				$('#message').hide();
				if(flagOrderLineId != -1){
					$('.replacement').html(self.templates.replacement(str.orders[flagOrderId].orderLines[flagOrderLineId]));
				}else{
					$('.replacement').html(self.templates.replacement(str.orders[flagOrderId].orderLines));
				}
				
			}else{
				$("#returnImage").prop('disabled', true);
				$('#upload').prop('disabled', true);
				$('#message').html('<span>Our return policy donot provide return for the reason selected by you.</span>');
			}
		},
		uploadImageFile : function(event) {
			event.preventDefault();


			var self = this,imageFile = $('#returnImage'),
			image = $('#returnImage').val(), maxSize = imageFile.data('max-size');

			
        	if(imageFile.get(0).files.length){
	            var fileSize = imageFile.get(0).files[0].size; // in bytes
	           // console.log("image ---------------> "+image+" maxsize------------> "+maxSize+" fileSize------------> "+fileSize );
	            if(fileSize>maxSize){
	                alert('File is oversize, Please compress and try again!!!');
	                return false;
	            }else{
	            	fd = new FormData();
					fd.append("file", imageFile.get(0).files[0]);

	            	self.upload.clear();
	            	self.upload.fetch({
	            	error: function(response){},
		            success: function (model, response) {
		            	console.log("response from returnable orders------>"+response);
		            	$.cookie('_CIR', response, {path: '/'});
		            	var temp = $.cookie('_CIR');
		            	var cir = JSON.parse(temp);
		            	if(cir.domainResponse){
		            		var imagePath = cir.domainResponse.entitiesResponse.baseDTO.cirImageUrl,
		            		reasonForReturn = $('.productBox').find(":selected").text();
		            		if(reasonForReturn === "------select------"){
		            			$('#message').html('<span>Please select appropriate reason</span>');
		            			return false;
		            		};
							var comment = $('#comment').val(),
							address = $('#address').text(),
							city = $('#city').text(),
							fulladdress = address+","+city,
							state = $('#state').text(),
							country = $('#country').text(),
							pincode = $('#pincode').text(),
							contact = $('#phoneno').text(),
		            	    returndata = {
			            		"cirOrderLine": {
								    "orderLineId": orderLineId,
								    "orderId": orderId,
								    "cirImageUrl": imagePath,
								    "cirAddress": fulladdress,
								    "cirPincode": pincode,
								    "contact": contact,
								    "crmCaseNo": "",
								    "reasonForReturn": reasonForReturn,
								    "comments": comment
								  }
		            		};
		            		  
		            		self.createReturnRequest.clear();
			            	if (self.createReturnRequest.set(returndata)) {
					            self.createReturnRequest.fetch({
					            	error: function(response){},
						            success: function (model, response) {
						            	var data = model.toJSON();
						            	if(response.domainResponse.errorCode == "FAILURE"){
						            		$('#orderReturning').remove();
						            		$('#orderReturningView').show();	
						            		$('#orderReturningView').html('<div class="row"><div id="result-box" class="col-md-8 col-sm-8 col-xs-12"><h3>Unable to process return request</h3><p>Please try again after some time...</strong></p></div></div>');
						            	}else{

						            		console.log("Your return is initiated.Please save your Request Id "+response.domainResponse.message+" for further tracking.");
						            		$('#orderReturning').remove();
						            		$('#orderReturningView').show();
						            		$('#orderReturningView').html(self.templates.success());
						            		$('#requestId').text(response.domainResponse.message);
						            		$.fancybox($('#ordernum1'),{
						    			 helpers : { 
							    				  overlay : {closeClick: false}
							    				},
							    			 'afterShow'     : function () {
				    			           		 $('.fancybox-close').on('click',function(){
				    			           		 	location.reload();
					    			           		 });
					    			            
					    			        		}
					    						});
						            	}
					            	}
			            		});
				            }
		            	}
		            	
	            	 }
            		});
	            }
        	}else{
            alert('Please upload image of product');
            return false;
        	}
		}
	});
	
})();