/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function() {
        'use strict';

        Webshop.Models.GetDeliveryTime = Backbone.Model.extend({
		sync : function(method, model, options) {
			var data = model.toJSON(),
				toPincode = $.cookie('COOKIE_PINCODE_DELIVERABLE'),
				fromPincode = wareHousePin,
				tat = data.tatDays,
				urlBase = URL_PROPERTIES.get('DELIVERY_TIME'),
            	urlRoot = urlBase.replace("{fromPincode}", fromPincode).replace("{toPincode}", toPincode).replace("{tat}", tat),
            	json_data = JSON.stringify(data);
			
            	 var params = _.extend({
					type: 'GET',
					dataType: 'json',
					url: urlRoot,
					processData: false,
					async : true,
					data: json_data
			}, options);
			
			
			return $.ajax(params);
		}
	});

})();