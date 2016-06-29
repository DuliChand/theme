// Constant Properties
var CONSTANTS_PROPERTIES = function() {
	'use strict';
	var LOGIN_SOURCE = {
		'fb_login' : 'FB002',
		'google_login' : 'GOOG'
	};
	return {
		get : function(name) {
			return LOGIN_SOURCE[name];
		}
	};
}();

// Login Validation Messages
var LOGIN_PROPERTIES = function () {
    'use strict';
    var LOGIN_VALIDATIONS = {
        'login_email_required': 'Please enter an email address',
        'login_email_valid': 'Please enter an valid email',
        'login_pass_required': 'Please enter a password'
      };
    return {
      get: function (name) {
        return LOGIN_VALIDATIONS[name];
      }
    };
  }();
//SignUp and Forgot Password Validation Messages
var SIGN_UP_PROPERTIES = function () {
    'use strict';
    var SIGN_UP_VALIDATIONS = {
        'user_name_required': 'Please enter name',
        'user_firstname_required': 'Please enter first name',
        'user_firstname_invalid' : 'Please enter valid first name',
        'user_lastname_required': 'Please enter last name',
        'user_lastname_invalid' : 'Please enter valid last name',
        'user_email_required': 'Please enter an email address',
        'user_email_valid': 'Please enter an valid email',
        'user_pass_required': 'Please enter an password',
        'confirm_pass_mismatch':'Password does not match',
        'dob_invalid' : 'Please enter valid dob',
        'doa_invalid' : 'Please enter valid anniversary date'
      };
    return {
      get: function (name) {
        return SIGN_UP_VALIDATIONS[name];
      }
    };
  }();
//Address Validations
var ADDRESS_PROPERTIES = function () {
    'use strict';
    var ADDRESS_VALIDATIONS = {
    	'address_required':'Please enter address',
        'first_name_required': 'Please enter first name',
        'last_name_required': 'Please enter an last name',
        'street_ext_required': 'Please enter street extension email',
        'street_required': 'Please enter street',
        'city_required': 'Please enter city',
        'zip_code_required': 'Please enter zip code',
        'country_required': 'Please enter country',
        'phone_no_required': 'Please enter phone no',
        'phone_no_length':'Phone no is Invalid',
        'phone_no_digit':'Phone no should be number',
        'zip_code_digit':'Zip code should be digit'
      };
    return {
      get: function (name) {
        return ADDRESS_VALIDATIONS[name];
      }
    };
  }();