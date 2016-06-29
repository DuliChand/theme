/*global Webshop, Backbone, JST*/
var customerObj = "" , subscriptionHolder = {};

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.MyAccountSideView = Backbone.View.extend({

        templates: {
            myAccountSidePanel: JST['app/scripts/templates/myAccountSidePanel.hbs'],
            notifications: JST['app/scripts/templates/notifications.hbs']
        },
        el: '#backbone-portlet-my-account-side-panel',
        events: {
           'click .change-password' : "changePassword",
            'click #editProfile' : "editCustomerPop",
            /*'click #notifyMe' : "notifyMePop",*/
            /*'click #stylePreferences' : "stylePreferences",*/
            'click #stylePrefLink' : "addToCustomerStylePreferences",
            /*'click #showAddress' : "showAddressPrimaryPop",*/
            /*'click #showAccountsToLink' : 'linkOtherAccounts',*/
            'click #addNewAddress' : "addNewAddressPop",
            'click #editAddressSubmit' : "editNewAddressPop",
            'click #subscriptionBtn':'notificationSubmit',
            /*'click #sizeLink': 'sizeLinkBtn',
            'click #sizeBtn' : 'sizeBtn',*/
            'click #facebook_link' : 'linkFacebook',
            'click #gmail_link' : 'linkGmail',
            /*'click .toggle-box h3' : 'toggleSidePanelBox'*/
        },
        initialize: function() {

            _.bindAll(this, 'render', 'render1');
            //console.log("inside my account");
            this.myAccountSidePanel = new Webshop.Models.ProfileSidePanel();
            this.resetPassword = new Webshop.Models.ResetPassword();
            this.updateCustomer = new Webshop.Models.UpdateCustomer();
            this.subscription = new Webshop.Models.Subscription();
            /*this.stylePreference = new Webshop.Models.StylePreference();*/
            this.notifications = new Webshop.Models.Notifications();
            /*this.size = new Size();
            this.linkAccount = new LinkAccount();*/
            this.getCityState = new Webshop.Models.GetCityState();

            Backbone.Validation.bind(this, {
                model: this.updateCustomer
            });
        },
        render: function(data ,subscriptionData) {

            var self = this, str;
            subscriptionHolder = subscriptionData;
                        if(data.customerWrapper.responseCode === "SUCCESS"){
                            str = data.customerWrapper;
                                $('#backbone-portlet-my-account-side-panel').html(self.templates.myAccountSidePanel(str), this);
                                    customerObj = str;
                                    $('.errormsg1').hide();  
									self.notifyMePopOnLoad(subscriptionData);		
                            }
                        else{}
                                        
                        if(customerObj.customers.customerAddresses){
                            $("#addNewAddress").hide();
                        }else{
                            $("#editAddressSubmit").hide();
                        }
                    
        },
        render1: function() {

        },

        changePassword: function(e) {
           e.preventDefault();
                            var self= this;
                            if ($('.fancybox').length > 0) {
                                $('.fancybox').fancybox({
                                    afterShow  :   function() {
                                        $('#resetPassword').on('click', function(e){
                                            e.preventDefault();
                                            var newPassword = $("#newPassword").val(),
                                            confirmPassword = $("#confirmPassword").val(),
                                            oldPassword = $("#oldPassword").val(),
                                            reWhiteSpace = /^\S+$/;
                                            
                                            if(oldPassword === ""){
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text('Please enter existing password');
                                                return false;
                                            }
                                            if (newPassword === ""){
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text(LOGIN_PROPERTIES.get('login_pass_required'));
                                                return false;
                                            }
                                            if(oldPassword === newPassword){
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text("Please enter new password");
                                                return false;
                                            }
                                            if (!(reWhiteSpace.test(newPassword))){
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text('Please enter a valid password');
                                                return false;
                                            }
                                            if (confirmPassword === ""){
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text("Please retype password");
                                                return false;
                                            }
                                            if (!(confirmPassword === newPassword)) {
                                                $('.errormsg1').show();
                                                $('.errormsg1').find('#errorMessage').text(SIGN_UP_PROPERTIES.get('confirm_pass_mismatch'));
                                                return false;
                                            }
                                            var params = [ {
                                                "key" : "oldPassword",
                                                "value" : $("#oldPassword").val()
                                            }, {
                                                "key" : "newPassword",
                                                "value" : newPassword
                                            } ],

                                            customer2 = {
                                                params : params
                                            },

                                            customer = {
                                                customer : customer2
                                            };

                                            if (self.resetPassword.set(customer)) {
                                                self.resetPassword.save({}, {
                                                    error : function() {},
                                                    success : function(model,response) {

                                                        var jsonObject = response;
                                                        if (response.domainResponse.errorCode != null) {
                                                            $('.errormsg1').show();
                                                            $('.errormsg1').find('#errorMessage').text(response.domainResponse.errorMessage);
                                                        } else {
                                                            var str = jsonObject.domainResponse.message;
                                                            $('#backbone-portlet-my-account-side-panel').html(self.templates.myAccountSidePanel(str),this);
                                                            //alert(jsonObject.domainResponse.message);
                                                            $.fancybox.close();
                                                            //self.render();
															if (self.myAccountSidePanel.clear().set()) {
																self.myAccountSidePanel.save({}, {
																	error: function() {},
																	success: function(model, response) {
																		if (response.customerWrapper.responseCode === "SUCCESS") {
																		   var data = response;
																		   self.render(data , subscriptionHolder);
																		  }
																	}                                                                            
																});
															};
                                                        }
                                                        
                                                    }
                                                });
                                            }
                                     });
                                    },
                                    afterClose : function(){
                                        $("#newPassword").val('') ;
                                        $("#confirmPassword").val('');
                                        $("#oldPassword").val('');
                                    }
                                });
                            }
        },

        addNewAddressPop: function(e) {
            e.preventDefault();
                            var self= this;
                            
                            if ($('.fancybox').length > 0) {
                                $('.fancybox').fancybox({
                                    afterShow  :   function() {
                                        $('#addPinCode1').on('keyup', function(e){
                                            e.preventDefault();
                                            self.generateCityState();
                                        });
                                        $('#add-Address-submit').on('click', function(e){
                                            
                                            e.preventDefault();
                                            var numericfilter = /^[0-9]+$/;
                                            customerObj['customers']['customerAddresses'] = {};
                                            
                                            if($("#addAddress1").val() !== ""){
                                                $('.errormsg3').hide();
                                                customerObj['customers']['customerAddresses']['address1'] = $("#addAddress1").val();
                                            }else{
                                                $('.errormsg3').show();
                                                $('.errormsg3').find('#errorMessage').text( ADDRESS_PROPERTIES.get('address_required'));
                                                return false;
                                            }
                                            
                                            if($("#addPinCode1").val() === ""){
                                                $('.errormsg3').show();
                                                $('.errormsg3').find('#errorMessage').text(ADDRESS_PROPERTIES.get('zip_code_required'));
                                                return false;
                                            }else if(($("#addPinCode1").val().length < 6)||($("#addPinCode1").val().length > 6)){
                                                $('.errormsg3').show();
                                                $('.errormsg3').find('#errorMessage').text("Please enter valid pincode");
                                                return false;
                                            }else if(!(numericfilter.test($("#addPinCode1").val()))){
                                                $('.errormsg3').show();
                                                $('.errormsg3').find('#errorMessage').text("Please enter valid pincode");
                                                return false;
                                            }else{
                                                $('.errormsg3').hide();
                                            }
                                            
                                            if($('.errormsg3').find('#errorMessage').text() === "PinCode doesn't exist."){
                                                $('.errormsg3').show();
                                                return false;
                                            }else{
                                                $('.errormsg3').hide();
                                            }
                                            
                                            customerObj['customers']['customerAddresses']['address2'] = $("#addAddress2").val();
                                            customerObj['customers']['customerAddresses']['address3'] = $("#addAddress3").val();
                                            customerObj['customers']['customerAddresses']['landmark'] = $("#landmark").val();
                                            customerObj['customers']['customerAddresses']['pinCodeMaster'] = {};
                                            customerObj['customers']['customerAddresses']['pinCodeMaster']['pinCode'] = $("#addPinCode1").val();
                                            customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster'] = {};
                                            customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['stateMaster'] = {};
                                            customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['stateMaster']['stateName'] = $("#billing_state").val();
                                            customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['cityName']     = $("#billing_city").val();
                                            customerObj['customers']['customerAddresses']['addressType'] = 'BILLING';
                                            
                                            var customer = {
                                                customerWrapper : customerObj
                                            };

                                            if (self.updateCustomer.set(customer)) {
                                                self.updateCustomer.save({}, {
                                                    error : function() {},
                                                    success : function(model,response) {
                                                        var jsonObject = response;
                                                        if (jsonObject.customerWrapper.responseCode === "SUCCESS") {
                                                             $.fancybox.close();  
                                                             //self.render();
															 if (self.myAccountSidePanel.clear().set()) {
																self.myAccountSidePanel.save({}, {
																	error: function() {},
																	success: function(model, response) {
																		if (response.customerWrapper.responseCode === "SUCCESS") {
																		   var data = response;
																		   self.render(data , subscriptionHolder);
																		  }
																	}                                                                            
																});
															};
                                                        } else {
                                                            console.log(jsonObject.customerWrapper.errorMessage);
                                                            $('.errormsg2').show();
                                                            $('.errormsg2').find('#errorMessage').text(jsonObject.customerWrapper.errorMessage);
                                                        }
                                                    }
                                                });
                                            }
                                         });
                                        },
                                    onClosed: function(){
                                        $('.errormsg3').hide();
                                    }
                                });
                             }
        },

        editCustomerPop: function(e) {
            e.preventDefault();
                            var self= this;
                            
                            if ($('.fancybox').length > 0) {
                                $('.fancybox').fancybox({
                                    afterShow  :   function() {
                                        
                                        $('#editDob,#editAnniversaryDate').datepicker({
                                            format: "dd/mm/yyyy"
                                        });
                                        
                                        $('#updateCustomer').on('click', function(e){
                                            e.preventDefault();
                                            var filter = /^[a-zA-Z\s]+$/ ,numericfilter = /^[0-9]+$/;
                                            
                                            if(($("#userName").val() !== "") && (filter.test($("#userName").val()))){
                                               
                                                /*  if($("#userName").val().length > 70){
                                                    $('.errormsg2 #errorMessage').html('User name max length exceeded');
                                                    $('.errormsg2').css('display','block');
                                                    return false;
                                                  }
                                                  else{
                                                        $('.errormsg2').css('display','none');
                                                       
                                                      }*/
                                              $('.errormsg2').hide();
                                               customerObj['customers']['firstName'] = $("#userName").val();
                                            }
                                                                                   
                                            else{
                                                $('.errormsg2').show();
                                                $('.errormsg2').find('#errorMessage').text(ADDRESS_PROPERTIES.get('first_name_required'));
                                                return false;
                                            }
                                            
                                            if(($("#userLastName").val() !== "") && (filter.test($("#userLastName").val()))){

                                               $('.errormsg2').hide();
                                               /* if($("#userLastName").val().length >= 70){
                                                    $('.errormsg2 #errorMessage').html('Last Name max length exceeded');
                                                    $('.errormsg2').css('display','block');
                                                    return false;
                                                  }
                                                  else{
                                                        $('.errormsg2').css('display','none');
                                                      
                                                      }*/
                                                customerObj['customers']['lastName'] = $("#userLastName").val();
                                            }else{
                                                $('.errormsg2').show();
                                                $('.errormsg2').find('#errorMessage').text(ADDRESS_PROPERTIES.get('last_name_required'));
                                                return false;
                                            }
                                            
                                            
                                            customerObj['customers']['loginId'] = $("#loginId").val();
                                            if($("#maritalStatus").val() === "select"){
                                                
                                            }else{
                                                customerObj['customers']['maritalStatus'] = $("#maritalStatus").val();
                                            }
                                            
                                            
                                            if($("#phoneNumber").val() !== ""){
                                                if($("#phoneNumber").val().length === 10){
                                                    if(numericfilter.test($("#phoneNumber").val())){
                                                        $('.errormsg2').hide();
                                                        if(typeof(customerObj.customers.contact) === "undefined"){
                                                            customerObj['customers']['contact'] = [{}];
                                                            customerObj['customers']['contact']['value'] = $("#phoneNumber").val();
                                                            customerObj['customers']['contact']['contactType'] = "CELLPHONE";
                                                        }
                                                        if(customerObj.customers.contact.length){
                                                            customerObj['customers']['contact'][0]['contactId'] = customerObj.customers.contact[0].contactId;
                                                            customerObj['customers']['contact'][0]['value'] = $("#phoneNumber").val();
                                                            customerObj['customers']['contact'][0]['contactType'] = "CELLPHONE";
                                                        }else{
                                                            customerObj['customers']['contact']['contactId'] = customerObj.customers.contact.contactId;
                                                            customerObj['customers']['contact']['value'] = $("#phoneNumber").val();
                                                            customerObj['customers']['contact']['contactType'] = "CELLPHONE";
                                                        }
                                                    }else{
                                                        $('.errormsg2').show();
                                                        $('.errormsg2').find('#errorMessage').text(ADDRESS_PROPERTIES.get('phone_no_length'));
                                                        return false;
                                                    }
                                                    
                                                }else{
                                                    $('.errormsg2').show();
                                                    $('.errormsg2').find('#errorMessage').text(ADDRESS_PROPERTIES.get('phone_no_length'));
                                                    return false;
                                                }
                                                
                                            }else{
                                                $('.errormsg2').show();
                                                $('.errormsg2').find('#errorMessage').text(ADDRESS_PROPERTIES.get('phone_no_required'));
                                                return false;
                                            }
                                                    
                                            var currdate = new Date();
                                            currdate.setFullYear(currdate.getFullYear(),currdate.getMonth(), currdate.getDate());
                                            var currDate = currdate.toJSON();
                                            
                                            var date = $('#editDob').val(),
                                            arrayDob = date.split('/'),
                                            annDate = $('#editAnniversaryDate').val(),
                                            arrayAnn = annDate.split('/');
                                            
                                            var myDate = new Date();
                                            myDate.setFullYear(arrayDob[2], arrayDob[1] - 1, arrayDob[0]);
                                            var dateOfBirth = myDate.toJSON();
                                            
                                            if(dateOfBirth > currDate){
                                                $('.errormsg2').show();
                                                $('.errormsg2').find('#errorMessage').text(SIGN_UP_PROPERTIES.get('dob_invalid'));
                                                return false;
                                            }else{
                                                $('.errormsg2').hide();
                                                customerObj['customers']['dateOfBirth'] = dateOfBirth;
                                            }
                                            
                                            var ann_Date = new Date();
                                            ann_Date.setFullYear(arrayAnn[2], arrayAnn[1] - 1, arrayAnn[0]);
                                            
                                            var anniversaryDate = ann_Date.toJSON();
                                            if(anniversaryDate > currDate){
                                                $('.errormsg2').show();
                                                $('.errormsg2').find('#errorMessage').text(SIGN_UP_PROPERTIES.get('doa_invalid'));
                                                return false;
                                            }else{
                                                $('.errormsg2').hide();
                                                customerObj['customers']['anniverseryDate'] = anniversaryDate;
                                            }
                                        
                                            var customer = {
                                                    customerWrapper : customerObj
                                            };

                                            if (self.updateCustomer.set(customer)) {
                                                self.updateCustomer.save({}, {
                                                    error : function() {},
                                                    success : function(model,response) {
                                                        var jsonObject = response;
                                                        if (jsonObject.customerWrapper.responseCode === "SUCCESS") {
                                                            $.fancybox.close();  
                                                                var cust = JSON.parse($.cookie('_FUI' ));
                                                                $.cookie('_FUI', "", {path: '/'});
                                                                var userData = {
                                                                    "baseDTO" :{
                                                                        "createDate" : cust.baseDTO.createDate,
                                                                        "createdBy" : cust.baseDTO.createdBy,
                                                                        "customerId" : cust.baseDTO.customerId,
                                                                        "dateOfBirth" : cust.baseDTO.dateOfBirth,
                                                                        "firstName" : customerObj.customers.firstName,
                                                                        "gender" : cust.baseDTO.gender,
                                                                        "lastName" : cust.baseDTO.lastName,
                                                                        "loginId" : cust.baseDTO.loginId,
                                                                        "loginType" : cust.baseDTO.loginType,
                                                                        "maritalStatus" : cust.baseDTO.maritalStatus,
                                                                        "modifiedDate" : cust.baseDTO.modifiedDate,
                                                                        "password" : cust.baseDTO.password,
                                                                        "registrationDate" : cust.baseDTO.registrationDate,
                                                                        "registrationEmailSend" : cust.baseDTO.registrationEmailSend,
                                                                        "siteLink" : cust.baseDTO.siteLink,
                                                                        "state" : cust.baseDTO.state,
                                                                        "status" : cust.baseDTO.status
                                                                    } 
                                                                };
                                                                $('.loginholder').find('.profile-text').text("Hi " + customerObj.customers.firstName);
                                                                $.cookie('_FUI', JSON.stringify(userData), {path: '/'});
                                                            
                                                                //self.render();
																
																if (self.myAccountSidePanel.clear().set()) {
																	self.myAccountSidePanel.save({}, {
																		error: function() {},
																		success: function(model, response) {
																			if (response.customerWrapper.responseCode === "SUCCESS") {
																			   var data = response;
																			   self.render(data , subscriptionHolder);
																			  }
																		}                                                                            
																	});
																};
                                                                
                                                        } else {
                                                            console.log(jsonObject.customerWrapper.errorMessage);
                                                            $('.errormsg2').show();
                                                            $('.errormsg2').find('#errorMessage').text(jsonObject.customerWrapper.errorMessage);
                                                        }
                                                        
                                                    }
                                                });
                                            }
                                        });
                                        
                                        },
                                        onClosed: function(){
                                            $('.errormsg2').hide();
                                        }
                                    });
                            }
        },


		notifyMePop: function(e) {
            var self = this;
                self.notifications.fetch({
                        error : function(response) {},
                        success : function(model, response) {
                        $("#notifyMeBox").html(self.templates.notifications(model.toJSON()));
                        if(typeof(customerObj.customers.customerSubscription)!='undefined'){
                         if(customerObj.customers.customerSubscription.length){
                            for(var i=0;i<customerObj.customers.customerSubscription.length;i++){
                                $("#"+customerObj.customers.customerSubscription[i].subscriptionMaster.subscriptionMasterId).prop("checked", true);
                            }
                        }else{
                            $("#"+customerObj.customers.customerSubscription.subscriptionMaster.subscriptionMasterId).prop("checked", true);
                        }
                    }
                }
            });
        },
		notifyMePopOnLoad: function(subscriptionData) {
            var self = this;
                //console.log("customer d -----"+JSON.stringify(customerObj));
                        $("#notifyMeBox").html(self.templates.notifications(subscriptionData));
                        if(typeof(customerObj.customers.customerSubscription)!='undefined'){
                         if(customerObj.customers.customerSubscription.length){
                            for(var i=0;i<customerObj.customers.customerSubscription.length;i++){
                                $("#"+customerObj.customers.customerSubscription[i].subscriptionMaster.subscriptionMasterId).prop("checked", true);
                            }
                        }else{
                            $("#"+customerObj.customers.customerSubscription.subscriptionMaster.subscriptionMasterId).prop("checked", true);
                        }
                    }
            
        },

        stylePreferences: function(e) {
            e.preventDefault();
            $('.errormsg5').hide();$('.statusmsg').hide(); 
            $('#showStylePreferences').toggle();
            if($("#styleClearFix").hasClass("expanded")) {  
                $("#styleClearFix").removeClass("expanded");    
            } else {  
                $("#styleClearFix").addClass("expanded"); 
            }
        },

        notificationSubmit: function(e) {
            e.preventDefault();
                            
                            var self=this, subscriptions = [],
                            selectedSubscriptionsList = $("input:checkbox[name=subscription]:checked");
                        
                            $.each( selectedSubscriptionsList, function( i, element ) {
                                subscriptions.push({
                                      "subscriptionMasterId": $(element).attr("id")
                                });
                                
                            });
                            
                            var subscriptionWrapper = {
                                    "subscriptionWrapper":{
                                        "subscriptions" : subscriptions
                                    }
                                    
                            };
                        
                            if (self.subscription.set(subscriptionWrapper)) {
                                self.subscription.save({}, {
                                    error : function() {},
                                    success : function(model,response) {
                                        var jsonObject = response;
                                            if((jsonObject.subscriptionWrapper.responseCode)==="SUCCESS")
                                                {
                                                    /*alert("Subscriptions Updated successfully");*/
                                                    $('.statusmsg1').show(1500).hide(3000);
                                                    //setInterval(function(){self.render();},5000);
                                                    self.render();
                                                }
                                            else
                                                {
                                                    console.log(jsonObject.subscriptionWrapper.errorMessage);
                                                }
                                    }
                                });
                            } else {
                                this.$('.alert-error').fadeIn();
                            }

        },

        showAddressPrimaryPop: function(e) {
            e.preventDefault();
            $("#showAddressPrimary").toggle();
            if ($("#addressClearFix").hasClass("expanded")) {
                $("#addressClearFix").removeClass("expanded");
            } else {
                $("#addressClearFix").addClass("expanded");
            }
        },

        addToCustomerStylePreferences: function(e) {

            e.preventDefault();
            var self = this,
                customerStylePreferenceWrapper,
                stylePrefText = $("#stylePrefText").val();

            if (stylePrefText === "") {
                alert("Please enter a valid style");
            } else {
                customerStylePreferenceWrapper = {
                    "customerStylePreferenceWrapper": {
                        "customerStylePreferences": [{
                            "stylePreference": stylePrefText
                        }]
                    }
                };

                if (self.stylePreference.set(customerStylePreferenceWrapper)) {
                    self.stylePreference.save({}, {
                        success: function(model, response) {
                            /*alert("Added to your styles");*/
                            $('.statusmsg ').show();
                        }
                    });
                } else {}
            }
        },

        sizeLinkBtn: function(e) {
            e.preventDefault();
            $("#showSize").toggle();
            if ($("#showSizeClearFix").hasClass("expanded")) {
                $("#showSizeClearFix").removeClass("expanded");
            } else {
                $("#showSizeClearFix").addClass("expanded");
            }

        },


        sizeBtn: function(e) {
            e.preventDefault();

            var self = this,

                chest = $("#chestTxtBox").val(),
                chestAtrMstrId = $("#chestTxtBox").attr("sizeAttbMstrId"),
                waist = $("#waistTxtBox").val(),
                waistAtrMstrId = $("#waistTxtBox").attr("sizeAttbMstrId"),
                hip = $("#hipTxtBox").val(),
                hipAtrMstrId = $("#hipTxtBox").attr("sizeAttbMstrId"),
                bottom = $("#bottomTxtBox").val(),
                bottomAtrMstrId = $("#bottomTxtBox").attr("sizeAttbMstrId"),
                customerSize = [],
                customer = {};

            if (customerObj.customers.customerSize) {
                customerSize = [{
                    "customerSizeId": chestAtrMstrId,
                    "sizeCode": "CHEST",
                    "sizeValue": chest
                }, {
                    "customerSizeId": waistAtrMstrId,
                    "sizeCode": "WAIST",
                    "sizeValue": waist
                }, {
                    "customerSizeId": hipAtrMstrId,
                    "sizeCode": "HIP",
                    "sizeValue": hip
                }, {
                    "customerSizeId": bottomAtrMstrId,
                    "sizeCode": "BOTTOM",
                    "sizeValue": bottom
                }];
            } else {
                customerSize = [{
                    "sizeCode": "CHEST",
                    "sizeValue": chest
                }, {
                    "sizeCode": "WAIST",
                    "sizeValue": waist
                }, {
                    "sizeCode": "HIP",
                    "sizeValue": hip
                }, {
                    "sizeCode": "BOTTOM",
                    "sizeValue": bottom
                }];
            }



            customerObj['customers']['customerSize'] = customerSize;

            customer = {
                customerWrapper: customerObj
            };

            if (self.updateCustomer.set(customer)) {
                self.updateCustomer.save({}, {
                    success: function(model, response) {
                        alert("Size details added to your account");
                        self.render();
                    }
                });
            } else {}
        },

        editNewAddressPop: function(e) {
            e.preventDefault();
                            var self= this;
                            if ($('.fancybox').length > 0) {
                                $('.fancybox').fancybox({
                                    afterShow  :   function() {
                                        
                                        $('#editPinCode1').on('keyup', function(e){
                                            e.preventDefault();

                                            self.generateCityStateForEdit();
                                        });
                                        
                                        $('#editAddress').on('click', function(e){
                                            e.preventDefault();
                                            
                                            if($("#editAddress1").val() !== ""){
                                                $('.errormsg4').hide();
                                            }else{
                                                $('.errormsg4').show();
                                                $('.errormsg4').find('#errorMessage').text(ADDRESS_PROPERTIES.get('address_required'));
                                                return false;
                                            }
                                            
                                            if($("#editPinCode1").val() !== ""){
                                                $('.errormsg4').hide();
                                            }else{
                                                $('.errormsg4').show();
                                                $('.errormsg4').find('#errorMessage').text(ADDRESS_PROPERTIES.get('zip_code_required'));
                                                return false;
                                            }
                                            
                                            if($('.errormsg4').find('#errorMessage').text() === "PinCode doesn't exist."){
                                                $('.errormsg4').show();
                                                return false;
                                            }
                                            
                                            if(customerObj.customers.customerAddresses.length){
                                                var index = 0;
                                                for(var i = 0; i<customerObj.customers.customerAddresses.length;i++){
                                                    if(customerObj.customers.customerAddresses[i].addressType === 'BILLING'){
                                                        index = i;
                                                        console.log("index: "+index);
                                                    }
                                                }
                                                customerObj['customers']['customerAddresses'][index]['customerAddressesId'] = customerObj.customers.customerAddresses[0].customerAddressesId;
                                                customerObj['customers']['customerAddresses'][index]['address1'] =  $("#editAddress1").val();
                                                customerObj['customers']['customerAddresses'][index]['address2'] = $("#editAddress2").val();
                                                customerObj['customers']['customerAddresses'][index]['address3'] = $("#editAddress3").val();
                                                customerObj['customers']['customerAddresses'][index]['landMark'] = $('#editLandmark').val();
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster'] = {};
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster']['pinCode'] = $("#editPinCode1").val();
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster']['cityMaster'] = {};
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster']['cityMaster']['stateMaster'] = {};
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster']['cityMaster']['stateMaster']['stateName'] =  $("#editState").val();
                                                customerObj['customers']['customerAddresses'][index]['pinCodeMaster']['cityMaster']['cityName']  = $("#editCity").val();
                                                
                                            }else{
                                                customerObj['customers']['customerAddresses']['customerAddressesId'] = customerObj.customers.customerAddresses.customerAddressesId;
                                                customerObj['customers']['customerAddresses']['address1'] = $("#editAddress1").val();
                                                customerObj['customers']['customerAddresses']['address2'] = $("#editAddress2").val();
                                                customerObj['customers']['customerAddresses']['address3'] = $("#editAddress3").val();
                                                customerObj['customers']['customerAddresses']['landMark'] = $('#editLandmark').val();
                                                customerObj['customers']['customerAddresses']['pinCodeMaster'] = {};
                                                customerObj['customers']['customerAddresses']['pinCodeMaster']['pinCode'] = $("#editPinCode1").val();
                                                customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster'] = {};
                                                customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['stateMaster'] = {};
                                                customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['stateMaster']['stateName'] =  $("#editState").val();
                                                customerObj['customers']['customerAddresses']['pinCodeMaster']['cityMaster']['cityName']     = $("#editCity").val();
                                            }
                                            
                                            var customer = {
                                                    customerWrapper : customerObj
                                            };

                                            if (self.updateCustomer.set(customer)) {
                                                self.updateCustomer.save({}, {
                                                    error : function() {},
                                                    success : function(model, response) {
                                                        var jsonObject = response;
                                                        if (jsonObject.customerWrapper.responseCode === "SUCCESS") {
                                                             $.fancybox.close(); 
                                                                    if (self.myAccountSidePanel.clear().set()) {
																		self.myAccountSidePanel.save({}, {
																			error: function() {},
																			success: function(model, response) {
																				if (response.customerWrapper.responseCode === "SUCCESS") {
																				   var data = response;
																				   self.render(data , subscriptionHolder);
																				  }
																			}                                                                            
                                                                        });
                                                                    };

                                                            
                                                        } else {}
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                        }
        },
        linkOtherAccounts: function(e) {
            e.preventDefault();
            fbLoad(document);
            googleLoad();
            $('#showLinkOtherAccountsSection').toggle();

        },
        linkFacebook: function(e) {
            e.preventDefault();
            var self = this;

            fbAuthCheck(function(data) {
                var response = data;
                var link_account = new LinkAccount({
                    customerId: (response.first_name === undefined) ? "" : response.first_name,
                    email: (response.email === undefined) ? "" : response.email,
                    sourceCode: CONSTANTS_PROPERTIES.get('fb_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });

                link_account.save({}, {
                    error: function(response) {
                        alert("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {} else {}
                    }
                });
            });
        },
        linkGmail: function(e) {
            e.preventDefault();
            var self = this;

            googleAuthCheck(function(data) {
                var response = data;

                var link_account = new LinkAccount({
                    customerId: (response.name.givenName === undefined) ? "" : response.name.givenName,
                    email: (response.emails === undefined) ? "" : response.emails[0].value,
                    sourceCode: CONSTANTS_PROPERTIES.get('google_login'),
                    gender: (response.gender == "male") ? "M" : "F"
                });

                link_account.save({}, {
                    error: function(response) {
                        alert("some error occured...");
                    },
                    success: function(model, response) {
                        if (response.customerWrapper.responseCode === "FAILURE") {} else {}
                    }
                });
            });
        },
        generateCityState: function() {
            var self = this,
                            pinCode = $("#addPinCode1").val(),
                            data = {};
                        
                        if(pinCode.length === 6) {
                                data = {
                                    pincode : pinCode
                                };
                            self.getCityState.clear();
                            
                            if(self.getCityState.set(data)) {
                                self.getCityState.save({}, {
                                    success : function(model, response) {

                                        if(response.pinCodeWrapper.responseCode === "FAILURE"){
                                            //alert(response.pinCodeWrapper.errorMessage);
                                            $('.errormsg3').show();
                                            $('.errormsg3').find('#errorMessage').text(response.pinCodeWrapper.errorMessage);
                                        } else {
                                            $('.errormsg3').hide();
                                            $('.errormsg3').find('#errorMessage').text("");
                                            var cityName = "", stateName = "", countryName = "";
                                            
                                            if(response.pinCodeWrapper.pinCodes.cityMaster != undefined && 
                                               response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
                                               response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
                                                cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
                                                stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
                                                countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
                                            }                                   
                                            
                                            $("#billing_city").val(cityName);
                                            $("#billing_state").val(stateName);
                                        }
                                    }
                                });
                            } else {
                                this.$('.alert-error').fadeIn();
                            }
                        }
        },
        generateCityStateForEdit: function() {

            var self = this,
                            pinCode = $("#editPinCode1").val(),
                            data = {};
                        
                        if(pinCode.length === 6) {
                                data = {
                                    pincode : pinCode
                                };
                            self.getCityState.clear();
                            
                            if(self.getCityState.set(data)) {
                                self.getCityState.save({}, {
                                    success : function(model, response) {

                                        if(response.pinCodeWrapper.responseCode === "FAILURE"){
                                            //alert(response.pinCodeWrapper.errorMessage);
                                            $('.errormsg4').show();
                                            if(response.pinCodeWrapper.errorMessage){
                                            $('.errormsg4').find('#errorMessage').text(response.pinCodeWrapper.errorMessage);
                                            }
                                           else
                                           {
                                           $('.errormsg4').find('#errorMessage').text("Invalid pincode ");
                                            }
                                            return false;
                                        } else {
                                            $('.errormsg4').hide();
                                            $('.errormsg4').find('#errorMessage').text("");
                                            var cityName = "", stateName = "", countryName = "";
                                            
                                            if(response.pinCodeWrapper.pinCodes.cityMaster != undefined && 
                                               response.pinCodeWrapper.pinCodes.cityMaster.stateMaster != undefined &&
                                               response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster != undefined) {
                                                cityName = response.pinCodeWrapper.pinCodes.cityMaster.cityName;
                                                stateName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.stateName;
                                                countryName = response.pinCodeWrapper.pinCodes.cityMaster.stateMaster.countryMaster.countryname;
                                            }                                   
                                            
                                            $("#editCity").val(cityName);
                                            $("#editState").val(stateName);
                                        }
                                    }
                                });
                            } else {
                                this.$('.alert-error').fadeIn();
                            }
                        }
        },
        toggleSidePanelBox: function(e) {
           e.preventDefault();
           $('.errormsg5').hide();$('.statusmsg').hide();
        }

    });

})();