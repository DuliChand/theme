/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.CCELogin = Backbone.Model.extend({

    defaults : {
        "loginId" : "",
        "password" : "",
        "customerLoginId" : ""
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
          var data = model.toJSON(),
            json_data, 
            fnyToken = $.cookie($('#FnyCustomToken').data('tokenid')),
            urlRoot = "http://172.18.87.23:8282/api/ccelogin/business?operationType=cceLogin";

            json_data = JSON.stringify({
                CCELogin : {
                    "loginId":data.loginId,
                    "password":data.password,
                    "customerLoginId" : data.customerId
                }
            });

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
