/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
    'use strict';

    Webshop.Models.ForgotPassword = Backbone.Model.extend({
	  
	  validation: {
		  	email_id: [{
				required : true,
				msg : LOGIN_PROPERTIES.get('login_email_required')
			},{
				pattern : "email",
				msg : LOGIN_PROPERTIES.get('login_email_valid')
			}]
	      },
      sync: function (method, model, options) {
        var data = model.toJSON(),
        	loginId = data.email_id,
        	urlBase = URL_PROPERTIES.get('FORGOT_PASSWORD'),
        	urlRoot = urlBase.replace("{loginId}",loginId),
       
        
        	params = _.extend({
				type : 'GET',
				dataType : 'json',
				url : urlRoot,
				processData : false,
				data : $.param(data)
			}, options);
		return $.ajax(params);
      }
    });
  	
})();