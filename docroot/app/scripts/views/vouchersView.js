/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function () {
    'use strict';

    Webshop.Views.VouchersView = Backbone.View.extend({


   template: JST['app/scripts/templates/vouchers.hbs'],

   /*
   JST['app/scripts/templates/globalvouchers.hbs']
   */
 
      el: '#backbone-portlet-vouchers',
      
      events: {                              
        
      },
      
      initialize: function () {
        
        console.log("vouchers view initialized"); 
        _.bindAll(this, 'render');
        
        this.getPersonalizeVouchers = new GetPersonalizeVouchers();
        this.getGlobalVouchers = new GetGlobalVouchers();
        
      },
      
      render: function () {
        var self = this;
        self.getPersonalizeVouchers.fetch({
            error: function(response){
            console.log("error");
            },
              success: function (model, response) {
              var jsonObject = model.toJSON();
              if(jsonObject.domainResponse.responseCode==='SUCCESS'){
                  $(self.el).html(Handlebars.templates.vouchers(jsonObject));
                  if(jsonObject.domainResponse.entitiesResponse.length){
                    for(var i=0;i<jsonObject.domainResponse.entitiesResponse.length;i++){
                      var string = $(jsonObject.domainResponse.entitiesResponse[i].baseDTO.endDate).text(),
                          sub = string.substring(0, 10);
                          $(jsonObject.domainResponse.entitiesResponse[i].baseDTO.endDate).text(sub);
                    }
                  }else{
                    var string = $(jsonObject.domainResponse.entitiesResponse.baseDTO.endDate).text(),
                      sub = string.substring(0, 10);
                      $(jsonObject.domainResponse.entitiesResponse.baseDTO.endDate).text(sub);
                  }
                  self.getVouchers ();
              }
              }
            });
      },
      
      getVouchers  : function(){
        
        var self = this;
        self.getGlobalVouchers.fetch({
            error: function(response){
            console.log("error");
            },
              success: function (model, response) {
              var jsonObject = model.toJSON();
              if(jsonObject.domainResponse.responseCode==='SUCCESS'){
                  $("#globalVoucher").html(Handlebars.templates.globalvouchers(jsonObject));
                  if(jsonObject.domainResponse.entitiesResponse.length){
                    for(var i=0;i<jsonObject.domainResponse.entitiesResponse.length;i++){
                      var id = jsonObject.domainResponse.entitiesResponse[i].baseDTO.endDate,
                      string = $(id).text(),
                          sub = string.substring(0, 10);
                          $(id).text(sub);
                    }
                  }else{
                    var string = $(jsonObject.domainResponse.entitiesResponse.baseDTO.endDate).text(),
                      sub = string.substring(0, 10);
                      $(jsonObject.domainResponse.entitiesResponse.baseDTO.endDate).text(sub);
                  }
              }
              }
            });
        }
    });

})();
