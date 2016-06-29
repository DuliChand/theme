/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};
var creditsData ;
(function() {
    'use strict';
  Webshop.Views.CreditsView = Backbone.View.extend({  

    templates: {
            creditStatement: JST['app/scripts/templates/creditStatement.hbs'],
            credits: JST['app/scripts/templates/credits.hbs'],
            vouchers: JST['app/scripts/templates/vouchers.hbs'],
            rewards: JST['app/scripts/templates/rewards.hbs'],
            globalvouchers: JST['app/scripts/templates/globalvouchers.hbs']
        },
      el: '#backbone-portlet-credits',
      events: { 
    	  'click #showstatment' : 'showCreditStatement',
        'click #showcredit': 'showStoredCredits',
        'click #vouchersList' : 'showVouchers',
        'click #creditsList': 'creditList',
        'change .select' : 'updateCreditStatement',
        'click .print-but' : 'printStatement',
        'click #rewardsList' : 'getRewardPoints'
      },
      
      initialize: function () {
    	  
        _.bindAll(this, 'render');
        
        this.storeCredits = new Webshop.Models.GetCredits();
        this.creditStatement = new Webshop.Models.CreditStatement();
        this.getPersonalizeVouchers = new Webshop.Models.GetPersonalizeVouchers();
        this.getGlobalVouchers = new Webshop.Models.GetGlobalVouchers();
        this.rewards = new Webshop.Models.GetRewards();
        
      },
      
      render: function (data) {
    	  var self = this;
        creditsData = data;
          $('.product-loader').hide();
            if(data.storedCreditWrapper.responseCode === "SUCCESS"){
              $(self.el).html(self.templates.credits(data));
              self.getStoredCreditSum();
            }
            else{
              $('.table1').html('<h3>Stored Credits Not Available</h3><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr> <td colspan="3" class="">Stored Credits Not Available</td> </tr></table>');
            }
      },
      getRewardPoints : function(e){
        
        e.preventDefault();
        
        $("#creditsList").removeClass('active');
        $("#vouchersList").removeClass('active');
        $("#rewardsList").addClass('active');
        
        var self = this;
        
        self.rewards.clear().fetch({
            error: function(response){
            },
              success: function (model, response) {
              var jsonObject = {"rewardPoints":response};
              if(response != "") {
                 $('#voucherright').html(self.templates.rewards(jsonObject));
              }else{
                $('#voucherright').html('<div id="credit-tabs"><ul><li><a href="#" id="rewardsList" class="active">Reward Points</a></li></ul></div><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr><tr><th>Total Available Points</th></tr> <tr><td colspan="3" class="">No Reward Points Available</td> </tr></table>');
              }
             }
            });
      },
      showCreditStatement : function(e){
    	  
    	  e.preventDefault();
    	  
    	  var selectedMonth, selectedYear, currDate, currMonth, currYear;
    	  
    	  $("#showcredit").removeClass('active');
 	      $("#showstatment").addClass('active');
 	      $(".credit-table").hide();
 	      $(".statment-table").show();
 	      
 	     currDate = new Date();
   	  
 	     currMonth = currDate.getMonth() + 1;
 	     currYear = currDate.getFullYear();
 	     
 	     $("#month option[value='" + currMonth + "']").attr("selected", "selected");
 	     $("#year option[value='" + currYear + "']").attr("selected", "selected");
	   	  
 	     selectedMonth = $('#month').val();
 	     selectedYear = $('#year').val();
 	      
	   	  if(selectedMonth === "---Month---" || selectedYear === "---Year---") {
	   	  } else {
	   		  
	   		  var self = this,
	   		  	  data = {month : selectedMonth, year: selectedYear};
	   		  
	   		  self.renderCreditStament(data);
	   	 }
 	      
      },
      updateCreditStatement : function(e){
    	  
    	  e.preventDefault();
    	  
    	  var selectedMonth, selectedYear;
    	  
    	  $("#showcredit").removeClass('active');
 	      $("#showstatment").addClass('active');
 	      $(".credit-table").hide();
 	      $(".statment-table").show();
 	      
 	      selectedMonth = $('#month').val();
 	      selectedYear = $('#year').val();
 	      
	   	  if(selectedMonth === "---Month---" || selectedYear === "---Year---") {
	   		  
	   	  } else {
	   		  
	   		  var self = this,
	   		  	  data = {month : selectedMonth, year: selectedYear};
	   		  self.renderCreditStament(data);
	   	 }
      },
      renderCreditStament: function(data) {
    	  
    	  var self = this;
    	  
    	  if(self.creditStatement.clear().set(data)) {
	  		  	self.creditStatement.fetch({
	  		  		error: function(response){
	  		  		},
	  		  		success: function (model, response) {
		      
			        	  var jsonObject = model.toJSON();
			        	
			        	  if(jsonObject.storedCreditWrapper.responseCode === "SUCCESS") {
			        		  $('#statement-tab').html(self.templates.creditStatement(jsonObject));
		        		  }
			         	
			        	  $(".statment-table").show();
	  		  		}
	  		  	});
	   		  }
      },
      showStoredCredits : function(e){
    	  
    	  e.preventDefault();
    	  
    	  $("#showstatment").removeClass('active');
 	      $("#showcredit").addClass('active');
 	      $(".credit-table").show();
 	      $(".statment-table").hide();
 	     
      },
      
      creditList : function(e){

        $("#creditsList").addClass('active');
        $("#vouchersList").removeClass('active');
        $("#rewardsList").removeClass('active');


        var self = this;
          $('.product-loader').hide();
            if(creditsData.storedCreditWrapper.responseCode === "SUCCESS"){
              $(self.el).html(self.templates.credits(creditsData));
              self.getStoredCreditSum();
            }
            else{
              $('.table1').html('<h3>Stored Credits Not Available</h3><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr> <td colspan="3" class="">Stored Credits Not Available</td> </tr></table>');
            }

    	  /*var self = this;
    	  self.credits.fetch({
	      error: function(response){
	    	  $('.product-loader').hide();
	      },
          success: function (model, response) {
        	$('.product-loader').hide();
        	var jsonObject = model.toJSON();
          	self.render(jsonObject);
          }
        });*/
      },
      
      printStatement : function(e){
    	  e.preventDefault();
    	  window.print();
      },
      showVouchers: function(e){
    	  e.preventDefault();
        
        $("#creditsList").removeClass('active');
        $("#vouchersList").addClass('active');
        $("#rewardsList").removeClass('active');
        
       
       
        var self = this;
        self.getPersonalizeVouchers.clear().fetch({
            error: function(response){
            },
              success: function (model, response) {
              var jsonObject = model.toJSON();
              
              if(jsonObject.domainResponse.responseCode==='SUCCESS'){
                  $('#voucherright').html(self.templates.vouchers(jsonObject));
                 
                  
              }else if(jsonObject.domainResponse.responseCode==='FAILURE'){
                 $('#voucherright').html('<div id="credit-tabs"><ul><li><a href="#" id="vouchersList" class="active">Personal Vouchers</a></li></ul></div><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr><th>Coupon</th><th>Description</th><th>Exp Date</th></tr><tr> <td colspan="3" class="">No Personal Vouchers Available</td></tr> </tr></table><div id="globalVoucher"></div>');
              }else{
                 $('#voucherright').html('<div id="credit-tabs"><ul><li><a href="#" id="vouchersList" class="active">Personal Vouchers</a></li></ul></div><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr><th>Coupon</th><th>Description</th><th>Exp Date</th></tr><tr> <td colspan="3" class="">No Personal Vouchers Available</td></tr> </tr></table><div id="globalVoucher"></div>');
              }
              //self.getVouchers ();
              }
            });
      },
      getVouchers: function(){
	    	  var self = this;
	    	  self.getGlobalVouchers.clear().fetch({
	    	      error: function(response){
	    	      },
	              success: function (model, response) {
	            	var jsonObject = model.toJSON();
	            	if(jsonObject.domainResponse.responseCode==='SUCCESS'){
	            		 $("#globalVoucher").html(self.templates.globalvouchers(jsonObject));
	            	}
	            	else{
	            		 $("#globalVoucher").html('<h3>Global Vouchers</h3><table width="100%" border="0" cellspacing="0" cellpadding="0" class="table1"><tr><td colspan="3" class=""> No Global Vouchers Available </td></tr></table>');
	            	}
	              }
	            });
	      	},
	      	getStoredCreditSum: function() {
	            var self = this;
	                self.storeCredits.clear().fetch({
	                    
	                    error: function(response){
	                        
	                    }, 
	                    success: function (model, response) {
	                        
	                        if(response.domainResponse.responseCode === "SUCCESS") {
	                            
	                            var creditBalance = response.domainResponse.message;
	                            sessionStorage.setItem("CREDITS",  creditBalance);
	                            $('#credits').text(creditBalance);
	                        }
	                    }
	                });
	        }
	    });
  
})();