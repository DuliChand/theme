/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};



(function () {
    'use strict';

    Webshop.Models.RegisteredLoginUser = Backbone.Model.extend({
	defaults : {
		"loginId" : "",
		"password" : "",
		"loginSource" : "APP",
		"cartId" : $.cookie("CARTID"),
		"deviceId" : $.cookie($('#FnyCustomToken').data('tokenid'))
	  },
	  validation : {
		    loginId : [{
				required : true,
				msg : LOGIN_PROPERTIES.get('login_email_required')
			},{
				pattern : "email",
				msg : LOGIN_PROPERTIES.get('login_email_valid')
			}],
			password : [{
				required : true,
				minLength: 6,
				maxLength: 12,	
				msg : LOGIN_PROPERTIES.get('login_pass_required')
			}]
	  },
      sync: function (method, model, options) {
      	$("#invalid-popup").removeClass('invalid');
			$("span").removeClass('icon');
        	$("#invalid-popup h2").text("signing up");
    		$("#invalid-popup .row p").html('<div class="product-loader"><span></span></div>');
    		$.fancybox($('#invalid-popup'),{
    			 helpers : { 
    				  overlay : {closeClick: false}
    				},
    			 'afterShow'     : function () {
    			            $('.fancybox-close').hide();
    			            
    			        }
    		});
    	  var data = model.toJSON(),
			json_data, 
			fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
			urlNormaltemp = URL_PROPERTIES.get('SERVICE_URL_LOGIN_USER'),
			urlSocial = URL_PROPERTIES.get('SERVICE_URL_SOCIAL_LOGIN'), 
			urlNormal = urlNormaltemp.replace("{deviceId}", fnyToken), 
			urlRoot = "";

		if (data.sourceCode == "" || data.sourceCode == undefined) {
			json_data = JSON.stringify({
				login : {
					"loginId":data.loginId,
					"password":data.password,
					"loginSource" : "APP",
					"deviceId" : $.cookie($('#FnyCustomToken').data('tokenid'))
					
				}
			});
			urlRoot = urlNormal;
		} else {
			var loginSourceMaster = [{
				"sourceMaster" : {
					"sourceCode" : data.sourceCode
				}
			}];

			var contact = [ {
				type : "EMAIL",
				value : data.email
			}];
			

			var customer = {
				loginSource : loginSourceMaster,
				contact : contact,
				customerType : "EMAIL",
				firstName : data.firstName,
				gender : data.gender,
				lastName : data.lastName,
				loginId : data.email,
				loginType : "EMAIL",
				title : "Mr"
			};
			
			var customerData = {
					customer : customer,
					cartId : $.cookie("CARTID"),
				   	deviceId :$.cookie($('#FnyCustomToken').data('tokenid'))
			};

			json_data = JSON.stringify(customerData);
			urlRoot = urlSocial;
		}

		var params = _.extend({
				type : 'POST',
				beforeSend : function(xhr) {
					xhr.withCredentials = true;
				},
				contentType : "application/json; charset=utf-8",
				dataType : 'json',
				url : urlRoot,
				processData : false,
				data : json_data
			}, options);
		
		return $.ajax(params);
      }
});

})();
