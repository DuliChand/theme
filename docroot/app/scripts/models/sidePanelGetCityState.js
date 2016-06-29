/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.SidePanelGetCityState = Backbone.Model.extend({

    	validation : {
			billing_pincode : [{
				required : true,
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			},{
				pattern: 'digits',
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			},{
				length: 6,
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			}],
			shipping_pincode : [{
				required : true,
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			},{
				pattern: 'digits',
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			},{
				length: 6,
				msg : ADDRESS_PROPERTIES.get('zip_code_required')
			}]
		},
		sync : function(method, model, options) {

			var data = model.toJSON(),
				pinCode = data.pincode, 
				urlBase = URL_PROPERTIES.get('SERVICE_URL_CITYSTATE'),
				urlRoot = urlBase.replace("{pinCode}", pinCode),
			
				params = _.extend({
					type : 'GET',
					dataType : 'json',
					url : urlRoot,
					processData : false,
					data : ""
				}, options);
		
			return $.ajax(params);
		}

    });

}}();