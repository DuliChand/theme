/*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.UploadImage = Backbone.Model.extend({


      sync: function (method, model, options) {
        var dataSend = fd,
        //customerId =  $.cookie('COOKIE_FNY_CUSTOMER_ID'),
        urlRoot = URL_PROPERTIES.get('RETURN_PRODUCT_IMAGE_UPLOAD'),
        //var urlRoot = 'http://172.16.34.24:8080/api/cir/business?operationType=imageUpload',
       
        params = _.extend({
                type : 'POST',
                beforeSend : function(xhr) {
                    xhr.withCredentials = true;
                    if (xhr && xhr.overrideMimeType) {
                        xhr.overrideMimeType("multipart/form-data");
                    }
                },
                contentType : 'multipart/form-data',
                url : urlRoot,
                processData : false,
                data : dataSend
            }, options);
        return $.ajax(params);
      }
    });

})();
