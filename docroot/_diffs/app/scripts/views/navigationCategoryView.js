 /*global Webshop, Backbone*/

Webshop.Models = Webshop.Models || {};

(function () {
    'use strict';

    Webshop.Models.NavigationCategoryView = Backbone.Model.extend({
 el: '#backbone-portlet-main',
      event: {},
      initialize: function () {
        _.bindAll(this, 'render');
        this.navigation = new Category();
        //this.render();
      },
      render: function () {

    	  var self = this;
    	  
          self.navigation.fetch({        	
        	error: function(xhr, status, errorThrown){
        		console.log(errorThrown+'\n'+status+'\n'+xhr.statusText);
        	}, 
            success: function (model, response) {
            	var data = model.toJSON();
            	
            	$(self.el).html(Handlebars.templates.category(data));
            	
            	$("#menulink").on("click", function(e){
            		e.preventDefault();
            		$(".menulisting").toggle();	
            	});
            	
            	$('.ref_link').hover(function(e) {
            	    e.preventDefault();
            	    var hidemenu = $(this).attr('rel');
            	    $('.hidemenu').hide();
            	    $('#' + hidemenu).show();
            	}, function(e){
            		e.preventDefault();
            	    var hidemenu = $(this).attr('rel');
            	});
            	
            	/*$.each($(".navbar-left .menu-h"), function(i, elem){ 
            		if($(elem).find(".menu-dropdown").children().length === 0) { 
            			$(elem).find(".menu-dropdown").remove(); 
        			}
        		});*/
            }
          });
        }
        });
        })();