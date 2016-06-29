/*global Webshop, Backbone, JST*/

Webshop.Views = Webshop.Views || {};

(function() {
    'use strict';
    Webshop.Views.Pixlet = Backbone.View.extend({

        templates: {
            
        },

	  el: '#backbone-portlet-invite',
      
      events: {                              
    	 
      },
      
      initialize: function () {
        _.bindAll(this, 'render' ,'homepixelet','globalPixel','allPagePixel');
        
      },
      
      render: function (orderId , orderAmount ,customerId) {
        var self = this;

        //console.log('Pixlet fired....');

        //self.tyrooPixlet(orderId , orderAmount);
        //self.advantagePixlet(orderId , orderAmount);
        //self.komliPixlet(orderId , orderAmount);
        //self.dgmPixlet(orderId , orderAmount);
        //self.sokratiPixlet(orderId , orderAmount);
        self.facebookPixelet(orderId , orderAmount);
        //self.yebhiPixelet(orderId , orderAmount ,customerId);
		//self.newkomliPixlet(orderId , orderAmount);
		//self.couponduniaPixelet(orderId , orderAmount);
		//self.mbazaarPixelet(orderId , orderAmount);
		//self.adsplayPixelet(orderId , orderAmount);
		//self.inviteRefferalPixelet(orderId , orderAmount);
		//self.vcommission(orderId , orderAmount);
		//self.httpoolPixlet(orderId , orderAmount);
		//self.affinityPixlet(orderId , orderAmount);
		//self.icubePixlet(orderId , orderAmount);
		//self.tyrooPLA(orderId , orderAmount);
		//self.payoom(orderId , orderAmount);
		//self.alive(orderId , orderAmount);
		//self.kenscio(orderId , orderAmount);
		//self.omg(orderId , orderAmount); 
		//self.digit(orderId , orderAmount); 
		//self.vserv(orderId , orderAmount);
		//self.icube(orderId , orderAmount);
		   
      },

      homepixelet: function () {
        var self = this;

        //console.log('Home Pixlet fired....');

        //self.homeKomliPixlet();
        //self.homeAdvantagePixlet();
     	
       
      },
	  
	  allPagePixel: function(){
		var self = this;
		//self.yahooPixels();
		self.googleRemarketting();
		//self.mbazaarTracker();
		//self.vizuryPixel();
		self.googleTagManager();
		//self.homeCriteoPixlet();
		//self.tyrooDR();    	
	  },
	  googleTagManager: function(){
	  	var self = this;
	  	var ngtmpldata = getParameterByName('beta');
			
	 	  var scr = document.createElement("iframe");
		    var host = '//www.googletagmanager.com/ns.html?id=GTM-N7VGLW';
		    scr.setAttribute('src', host);
		    (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

		  	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','GTM-N7VGLW');
	  
	  },/*,
	 
      facebookCustomAudience : function(){

      		var scr = document.createElement("script");
		    var host = '//connect.facebook.net/en_US/fbevents.js';
		    scr.setAttribute('src', host);
		    (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

		  	(!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
			n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
			n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
			t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
			document,'script','//connect.facebook.net/en_US/fbevents.js'));

			fbq('init', '721420987963869');
			fbq('track', 'CompleteRegistration');
			fbq('track', 'PageView');
			fbq('track', 'ViewContent');
			fbq('track', 'Purchase', {value: '1.00', currency: 'USD'});
			fbq('track', 'AddToCart');
			fbq('track', 'AddToWishlist');
			fbq('track', 'InitiateCheckout');
			fbq('track', 'Lead');

	      // <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=721420987963869&ev=PageView&noscript=1"/></noscript>

	      },
	  googleRemarketting: function(){
		var self = this;
		var oldDocumentWrite = document.write

		
		document.write = function(node){
			$("body").append(node)
		}

		$.getScript("http://www.googleadservices.com/pagead/conversion.js", function() {
			
			setTimeout(function() {
				document.write = oldDocumentWrite
			}, 100)
		});
	  },  
	  mbazaarTracker: function(){
		var self = this;
		var oldDocumentWrite = document.write

		
		document.write = function(node){
			$("body").append(node)
		}

	
		$.getScript("https://js.m-bazaar.in/mengage.min.js", function() {
			
			setTimeout(function() {
				document.write = oldDocumentWrite
				
				try{
					var partner="fnu";
					var protocol=(document.location.protocol == "https:" ? "https://"+partner : "http://"+partner+".enr-api"); // check http and https
					var initFrame = new loadframe(protocol+".m-bazaar.in/","s=");   //inject the frame
					initFrame.loadurl();
				}
				catch(e)
				{
				   console.log(e);
				}
			}, 100)
		});
		
		

	  },
	  vizuryPixel: function(){
		 try {
			var viz = document.createElement("script");
			viz.type = "text/javascript";
			viz.async = true;
			viz.src = ("https:" == document.location.protocol ?"https://in-tags.vizury.com" : "http://in-tags.vizury.com")+ "/analyze/pixel.php?account_id=VIZVRM3176";

			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(viz, s);
			viz.onload = function() {
				try {
					pixel.parse();
				} catch (i) {
				}
			};
			viz.onreadystatechange = function() {
				if (viz.readyState == "complete" || viz.readyState == "loaded") {
					try {
						pixel.parse();
					} catch (i) {
					}
				}
			};
		} catch (i) {
		}
	  },
	  vcommission: function(orderId , orderAmount){
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          if(map.utm_source.match(/vcommission/gi)){
			  var scr = document.createElement("iframe");
            var host = 'https://tracking.vcommission.com/SL4KU?adv_sub='+orderId+'&amount='+orderAmount+'&adv_sub2=ModeOfPayment&adv_sub3=noncoupon&adv_sub4=couponname&adv_sub5=Category';
            scr.setAttribute('src', host);
            (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

              
          }
          
        }
		

	  },
	  inviteRefferalPixelet: function(orderId , orderAmount){
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          
            var inviteRefferal = '<img style="position:absolute; visibility:hidden" src="https://www.ref-r.com/campaign/t1/settings?bid_e=6452D8CE6B668ECD28C8DD1F471165EA&bid=6875&t=420&event=sale&email='+custEmail+'&orderID='+orderId+'&purchaseValue='+orderAmount+'&fname='+custName+'" />';
            $('head').append(inviteRefferal);

       

	  },
	  adsplayPixelet: function(orderId , orderAmount){
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.match(/adsplay/gi)){
            
            var scr = document.createElement("iframe");
			var host = 'https://affiliates.adsplay.in/trackingcode_sale_new.php?pgmid=597&sale='+orderAmount+'&goal=Category&orderId='+orderId;
			scr.setAttribute('src', host);
			(document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
             
              
          }
          
        }
	  },
	  globalPixel: function (pixelData) {
        var self = this;
		
		// advantage global pixel----
		var  pageURL = window.location.pathname.toLowerCase();
		
		// advantage global pixel Ends here----
		
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.toLowerCase() == 'komli'){
            
            
				window._atm_client_id = "6669";
				window._atm_params = new Object;
				
				_atm_params.t = "r";   
				_atm_params.f = pixelData.pageType; //-- INSERT PAGE TYPE (v - home page, b - category page, c - product page, s - add to cart, p - transaction confirmation page)
				_atm_params.id = pixelData.prdtId; //-- INSERT ID OF THE PRODUCT
				_atm_params.title = pixelData.prdtName; //--INSERT TITLE OF THE PRODUCT
				_atm_params.clr = ""; //--INSERT Colour of the product
				_atm_params.br = ""; //--INSERT Brand of the product
				_atm_params.oprc = ""; //--INSERT MRP of the product
				_atm_params.sprc = pixelData.salePrice; //--INSERT Sale price of the product
				_atm_params.avl = pixelData.qtyAvailable; //--INSERT Availability of product
				_atm_params.sc = ""; //--INSERT Sub category id
				_atm_params.c = pixelData.catId; //--INSERT Category id
				_atm_params.gender = ""; //--INSERT the Description
				_atm_params.cn = pixelData.catName; //-- INSERT NAME OF THE PRODUCT CATEGORY
				_atm_params.scn = ""; //-- INSERT NAME OF THE PRODUCT SUB CATEGORY
				_atm_params.channel = "d"; //-- INSERT d for Desktop, m for Mobile, a for App
				_atm_params.custom_prop1= pixelData.cartVal; 
				_atm_params.custom_prop2=""; 
				_atm_params.custom_prop3=""; 

				var ast=document.createElement('script'); ast.type="text/javascript";
				ast.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//cdn.atomex.net/static/js/pxs/" + _atm_client_id + "/ast.js";
				document.body.appendChild(ast);
              
          }
          
        } 
        	
       
      },
	  
	  advantageGlobalPixlet: function(){
	    
		//console.log("advantageGlobalPixlet init-----");
		
	  },
	  yahooPixels: function(){
		if((pageURL.match(/confirmation$/) == null)) { 
			var ast=document.createElement('img'); ast.type="text/javascript";
			ast.src = "https://sp.analytics.yahoo.com/spp.pl?a=1000165288879&.yp=32715&js=no";
			document.body.appendChild(ast);
		}
		else{
			var ast=document.createElement('img'); ast.type="text/javascript";
			ast.src = "https://sp.analytics.yahoo.com/spp.pl?a=1000165288879&.yp=32714&js=no";
			document.body.appendChild(ast);
		}
	  },
	  newkomliPixlet: function (orderId , orderAmount) {
        var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
  
          if(map.utm_source.toLowerCase() == 'komli'){
            
				var data = JSON.parse($('#orderData').html());
				var productId = [],productName =[];
				if(data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.length){
					for(var i=0;i<data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.length;i++){
						productId.push(data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines[i].vendorProductId);
						productName.push(data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines[i].productName);
					}
					
				}
				else{
					productId.push(data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.vendorProductId);
					productName.push(data.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.productName);
				}
				
				window._atm_client_id = "6669";
				window._atm_params = new Object;
				
				_atm_params.t = "r";   
				_atm_params.f = "p"; //-- INSERT PAGE TYPE (v - home page, b - category page, c - product page, s - add to cart, p - transaction confirmation page)
				_atm_params.id = productId; //-- INSERT ID OF THE PRODUCT
				_atm_params.title = productName; //--INSERT TITLE OF THE PRODUCT
				_atm_params.clr = ""; //--INSERT Colour of the product
				_atm_params.br = ""; //--INSERT Brand of the product
				_atm_params.oprc = ""; //--INSERT MRP of the product
				_atm_params.sprc = ""; //--INSERT Sale price of the product
				_atm_params.avl = ""; //--INSERT Availability of product
				_atm_params.sc = ""; //--INSERT Sub category id
				_atm_params.c = ""; //--INSERT Category id
				_atm_params.gender = ""; //--INSERT the Description
				_atm_params.cn = ""; //-- INSERT NAME OF THE PRODUCT CATEGORY
				_atm_params.scn = ""; //-- INSERT NAME OF THE PRODUCT SUB CATEGORY
				_atm_params.channel = "d"; //-- INSERT d for Desktop, m for Mobile, a for App
				_atm_params.custom_prop1= orderAmount; 
				_atm_params.custom_prop2=""; 
				_atm_params.custom_prop3=""; 

				var ast=document.createElement('script'); ast.type="text/javascript";
				ast.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//cdn.atomex.net/static/js/pxs/" + _atm_client_id + "/ast.js";
				document.body.appendChild(ast);
				
				
				var ast=document.createElement('script'); ast.type="text/javascript";
				ast.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//trk.atomex.net/cgi-bin/tracker.fcgi/conv?px=10743&ty=1&tid="+orderId+"&tamt="+orderAmount+"&info=";
				document.body.appendChild(ast);
				
				
              
          }
          
        } 
        

       
      },

      tyrooPixlet : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  			
  			 var utmTryroo = map.utm_source;
  		     if(!(map.utm_source.match(/tyroopla/gi))){ 
  		     	if(!(map.utm_source.match(/tyroodr/gi))){
		          if(map.utm_source.match(/tyroo/gi)){
	            
	              var cookieid = $.cookie($('#FnyCustomToken').data('tokenid'));
	              var getjson ={"TRANSACTIONID_VALUE": orderId, "CARTVALUE_VALUE": orderAmount , "ACTION_KEY":'', "OPTIONALADVER_VALUE":$.cookie('COOKIE_FNY_LOGIN_ID')+',$city,$mobileNo'};
	              var res =encodeURIComponent( JSON.stringify( getjson ) );
	              var loc = document.URL;
	              var scr = document.createElement("script");
	              var host = (("https:" == document.location.protocol) ? "https://" : "http://") + "srv.tyroodr.com/www/delivery";
	              scr.setAttribute('async', 'true');
	              scr.type = "text/javascript";
	              scr.src = host + "/container.php?cid=6&getjson="+res+'&loc='+loc+'&cookieid='+cookieid; (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
	              
	              
	              var tyrooCloud = '<img src="https://tyroo.go2cloud.org/aff_l?offer_id=107&adv_sub='+orderId+'&amount='+orderAmount+'" width="1" height="1" />';
	              $('head').append(tyrooCloud);

	            }  
	          }
          	}
        }
      },
      tyrooPLA : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });


			var utmTryroo = map.utm_source;
  		     if(!(map.utm_source=='tyroo')){ 
  		     	if(!(map.utm_source.match(/tyroodr/gi))){
		
          		if(map.utm_source.match(/tyroopla/gi)){
            
            
              var cookieid = $.cookie($('#FnyCustomToken').data('tokenid'));
              //var cookieid ='';
              var getjson ={"TRANSACTIONID_VALUE":orderId, "CARTVALUE_VALUE":orderAmount, "ACTION_KEY":'', "OPTIONALADVER_VALUE":$.cookie('COOKIE_FNY_LOGIN_ID')+',$city,$mobileNo'};
              var res =encodeURIComponent( JSON.stringify( getjson ) );
              var loc = document.URL;
              var scr = document.createElement("script");
              var host = (("https:" == document.location.protocol) ? "https://" : "http://") + "srv.tyroodr.com/www/delivery";
              scr.setAttribute('async', 'true');
              scr.type = "text/javascript";
              scr.src = host + "/container.php?cid=1804&getjson="+res+'&loc='+loc+'&cookieid='+cookieid; ((document.getElementsByTagName('head') || [null])[0] || document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
                        
            }
          }
          }
        }
      },
      tyrooDR : function(orderId , orderAmount){

			  var cookieData = $.cookie('UTM_DATA');
			      var cookieid = $.cookie($('#FnyCustomToken').data('tokenid'));
			      //var cookieid ='';
			      var getjson;

			       var  pageURL = window.location.pathname.toLowerCase();
			       var pathname = window.location.pathname.split('/').pop(-1).split('_').pop(-1);

			      var SubCatePagName = $('#backbone-portlet-product-listing.productListingPage').attr('data-page-value');
			      var catName = $('#backbone-portlet-product-listing.productListingPage').attr('data-category-name');
			      var subcateId = $('#backbone-portlet-product-listing.productListingPage').attr('data-id');

			      var catIdList;
			      if(catName == 'women')
			      {
			        catIdList =1;
			      }
			      else if(catName == 'men')
			      {
			        catIdList =2;
			      }
			      else if(catName == 'accessories')
			      {
			        catIdList =5;
			      }
			      else if(catName == 'kids')
			      {
			        catIdList =4;
			      }
			      else if(catName == 'home_and_living')
			      {
			        catIdList =3;
			      }
			      else if(catName == 'lounge')
			      {
			        catIdList =665;
			      }
			      else if(catName == 'shops')
			      {
			        catIdList =666;
			      }
			      else if(catName == 'clearance')
			      {
			        catIdList =689;
			      }
			      else if(catName == 'designers')
			      {
			        catIdList =690;
			      }


			      var  pageURL = window.location.pathname;
			      var locationPath = pageURL;
			     
			      var Productpathname = window.location.pathname.split('/');
			      var path = Productpathname[1];


			      if((locationPath == '/')|| (locationPath == '/home'))
			      {
			        getjson ={ user_type: 'New' ,depth: '0'};
			        //console.log("Home page" + JSON.stringify(getjson));
			       }

			      if(SubCatePagName == 'productListingPage'){
			        if(isNaN(pathname)){
			          getjson = {
			            category: catName, // subcategory *women*
			            category_id: catIdList, //actual category id here *women id*
			            subcategory: pathname,
			            subcategory_id: subcateId, //actual subcategory id here
			            user_type: 'New' ,
			            depth: '2'
			          };
			        //  console.log("product listing" + JSON.stringify(getjson));
			        }

			      }

			      if((ProductPageName == 'productDetailPage') || (path == 'product-detail')){

			        var ProductPageName = $('#backbone-portlet-product.productDetailPage').attr('data-page-value');
			        var productId = $('#backbone-portlet-product.productDetailPage').attr('data-product-id');
			        var catsu = $('.breadcrumb-container .breadcrumb li:nth-child(2)').text();
			        var subcatsu = $('.breadcrumb-container .breadcrumb li:nth-child(3)').text();

			        getjson = {  //product Page
			          product_id: productId, //actual productid here
			          category: catsu,
			          category_id: catIdList, //actual category id here
			          // subcategory: subcatsu,
			          //subcategory_id: '111', //actual subcategory id here
			          user_type: 'New' ,
			          depth: '3'
			        };
			        //console.log("product Detail " + JSON.stringify(getjson));
			      }

			      if(locationPath == '/billing')
			      {

			        var cartDataValue = JSON.parse($('#cartData').html());
			        var cartQuantity = cartDataValue.cart.products.length();
			        var cartValue = cartDataValue.cart.youPayValue;

			        var confrimDataValue = JSON.parse($('#orderData').html());

			        var confirmOrderIdarry =[];
			        $.each(confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines,function(index,data){
			          confirmOrderIdarry.push(data.erpSku)
			        });

			         getjson = { //billing
			          product_id: confirmOrderIdarry, //actual product ids here
			          quantity: cartQuantity,
			          cart_value: cartValue,
			          user_type: 'New' ,
			          depth: '5'
			        };
			       // console.log("billing page" + JSON.stringify(getjson));
			      }

			      if(locationPath == '/cart')
			      {

			        var cartDataValue = JSON.parse($('#cartData').html());
			        var cartQuantity = cartDataValue.cart.products.length;
			        var cartValue = cartDataValue.cart.youPayValue;

			        var productIdarry =[]
			        $.each(cartDataValue.cart.products,function(index,data){
			          productIdarry.push(data.erpSku)
			        });

			        getjson = { //cart
			          product_id: productIdarry, //actual product ids here
			          quantity: cartQuantity, //['1','1'],
			          cart_value: cartValue,
			          user_type: 'New' ,
			          depth: '4'
			        };
			        //console.log("cart page " + JSON.stringify(getjson));
			      }

			      if(locationPath == '/confrimation')
			      {
			        var confrimDataValue = JSON.parse($('#orderData').html());
			        var transicationValue = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalAmountPaid;
			        var transicationId = confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderHeaderId;
			        var totalOrderItems = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalOrderItems;

			        var confirmOrderIdarry =[];
			        if(typeof confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.length)
			        {
			          confirmOrderIdarry.push(confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.erpSku);
			        }
			        else{
			          $.each(confrimDataValue.domainResponse.entitiesResponse.baseDTO,function(index,data){
			            confirmOrderIdarry.push(data.erpSku)
			          });
			        }

			        getjson = { //confirmation
			          attribution:'TyrooRT', // Other value 'False' if transaction not attributed to Tyroo(include this if you have real time attribution capability)
			          transaction_id: transicationId, //'XYZ123' ,
			          transaction_value: transicationValue,
			          product_id: confirmOrderIdarry, //actual product ids here
			          quantity: totalOrderItems,
			          user_type: 'New' ,
			          depth: '6'
			        };
			       // console.log("confirmation page " + JSON.stringify(getjson));
			      }

			      var queries = {};
			      $.each(document.location.search.substr(1).split('='),function(c,q){
			        var catName = q.split('=');
			        if(catName == 'mainNav')
			        {
			         getjson = {
			            category: catName,
			            category_id: subcateId, //actual category id here
			            user_type: 'New' ,
			            depth: '1'
			          };

			         // console.log("main menu " + JSON.stringify(getjson));
			        }
			      });

			      var res =encodeURIComponent( JSON.stringify(getjson));
			      var loc = document.URL;
			      var scr = document.createElement("script");
			      var host = (("https:" == document.location.protocol) ? "https://" : "http://") + "srv.tyroodr.com/www/delivery";
			      scr.setAttribute('async', 'true');
			      scr.type = "text/javascript";
			      scr.src = host + "/container.php?cid=1807&getjson="+res+'&cookieid='+cookieid;
			      ((document.getElementsByTagName('head') || [null])[0] || document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
			   
			},
      icube: function(orderId , orderAmount){
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.match(/icube/gi)){
            
            var scr = document.createElement("iframe");
			var host = 'https://icubes.go2cloud.org/SL2tT?adv_sub='+orderId+'&adv_sub1=SUB_ID1&amount='+orderAmount;
			scr.setAttribute('src', host);
			(document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
             
                 }
          
        }
	  },
      digit: function(orderId , orderAmount){
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.match(/digit/gi)){
            
            var scr = document.createElement("iframe");
			var host = 'http://www.digit.in/microsites/pixelcode.html';
			scr.setAttribute('src', host);
			(document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
             
                }
          
        }
	  },
      payoom : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });

          if(map.utm_source.match(/payoom/gi)){
            
            var scr = document.createElement("iframe");
	        var host = 'https://payoom.go2cloud.org/aff_l?offer_id=701&adv_sub='+orderId+'&amount='+orderAmount;

	        scr.setAttribute('src', host);
	        (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

	               
          }
          
        }
      },
      vserv : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });

          if(map.utm_source.match(/VSERV/gi)){
            
          	  var scr = document.createElement("script");
              var host = 'http://c.vserv.mobi/delivery/ti.php?trackerid=2607&app=1&vserv='+map.utm_source.toString().split('-').pop(-1);
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
          }
          
        }
      },
      alive : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });

          if(map.utm_source.match(/alive/gi)){
                            
              var aliveCloud = '<img src="https://event.aliveonescan.com/aff/?uid=fashgsv10&transID='+orderId+'&uPrice='+orderAmount+'" width="1" height="1" />';
              $('head').append(aliveCloud);
              
          }
          
        }
      },
      omg : function(orderId , orderAmount){

      var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });

          if(map.utm_source.match(/omg/gi)){
                   
          	  var scr = document.createElement("script");

              var host = 'https://track.in.omgpm.com/832173/transaction.asp?APPID='+orderId+'&MID=832173&PID=15764&status='+orderAmount; 
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
                            
               }
          
        }
      },
      kenscio: function(orderId , orderAmount){
	  
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          if(map.utm_source.match(/kenscio/gi)){
		  
            var kensciopxl = '<img style="position:absolute; visibility:hidden; left: 0px; top: 0px;" src="http://go.myimgt.com/ti.php?trackerid='+orderId+'&cb='+orderAmount+'"/>';
            $('head').append(kensciopxl);

              
            }
          
        }
		
	  },

      advantagePixlet : function(orderId , orderAmount){

        var scr = document.createElement("iframe");
        var host = 'http://54.84.151.220/advantages_pixel/FashionAndYou/fashionandyouConversion.php?transaction_id='+orderId;
        scr.setAttribute('src', host);
        (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

        //<iframe src="http://54.84.151.220/advantages_pixel/FashionAndYou/fashionandyouConversion.php?transaction_id=<%=request.getAttribute("orderId")%>" style="border:none" width="1" height="1" frameborder="0" scrolling="no"></iframe>

      },

      komliPixlet : function(orderId , orderAmount){

        var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
    
          if(map.utm_source.match(/komli/gi)){
            
            
              var scr = document.createElement("iframe");
              var host = 'https://secure.komli.com/p.ashx?o=263&e=270&t='+orderId+'&ect='+orderAmount;
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
              
          }
          
        } 

        

        //<iframe src="https://secure.komli.com/p.ashx?o=263&e=270&t=<%=request.getAttribute("orderId")%>&ect=<%=request.getAttribute("amount")%>" height="1" width="1" frameborder="0" style="display:none;"></iframe>

      },
	  
	  couponduniaPixelet: function(orderId , orderAmount){

        var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
  

  
  
          if(map.utm_source.match(/coupondunia/gi)){
            
            
              var scr = document.createElement("iframe");
              var host = 'https://coupondunia.go2cloud.org/aff_l?offer_id=506&adv_sub='+orderId+'&amount='+orderAmount;
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
              
          }
          
        } 

        

      },
	  formattedDate: function(date){
		var self = this;
		var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [day, month, year].join('-');
	  
	  },
	  mbazaarPixelet: function(orderId , orderAmount){
		var self = this;
        var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.match(/mbazaar/gi)){
            
			 // var tempCurrentTime = $('#FnyFirstRecord').attr('data-firstrecord'),
			 var  currentTime = self.formattedDate();	
			  
              var scr = document.createElement("script");
              var host = 'http://tracking.m¬bazaar.in?i=fnu&oid='+orderId+'&tv='+orderAmount+'v2&od='+currentTime;
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
              
          }
          
        } 

        

        //<iframe src="https://secure.komli.com/p.ashx?o=263&e=270&t=<%=request.getAttribute("orderId")%>&ect=<%=request.getAttribute("amount")%>" height="1" width="1" frameborder="0" style="display:none;"></iframe>

      },
	  httpoolPixlet: function(orderId , orderAmount){
	  
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          if(map.utm_source.match(/httpool/gi)){
		  
            var httpoolpxl = '<img style="position:absolute; visibility:hidden" src="https://httpool.go2cloud.org/aff_l?offer_id=965&adv_sub='+orderId+'&amount='+orderAmount+'" />';
            $('head').append(httpoolpxl);

              
          }
          
        }
		
	  },
	  affinityPixlet: function(orderId , orderAmount){
	  
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          if(map.utm_source.match(/network2-1126/gi)){
		  
            var affinityPxlFrst = '<img src="http://ib.adnxs.com/px?id=567195&t=2" width="1" height="1" />',
			affinityPxlScnd = '<img src="https://ck.ads.affinity.com/cnv?hx=3310">';
            $('head').append(affinityPxlFrst);
			$('head').append(affinityPxlScnd);

              
          }
          
        }
		
	  },
	  icubePixlet: function(orderId , orderAmount){
	  
		var self = this;
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
			var customerObj = JSON.parse($.cookie('_FUI'));
			var custName = customerObj.baseDTO.firstName+" "+customerObj.baseDTO.lastName;
			var custEmail = customerObj.baseDTO.loginId;

          if(map.utm_source.match(/network2-1132/gi)){
		  
			  var scr = document.createElement("iframe");
              var host = 'http://tracking.icubeswire.com/SL2cg?adv_sub='+orderId;
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr)

              
          }
          
        }
		
	  },
      dgmPixlet : function(orderId , orderAmount){
	  
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
  
          if(map.utm_source.match(/dgm/gi)){
		  var coupon ;
		  if(!($.cookie('existingCoupon') === "" ||$.cookie('existingCoupon') === undefined ||$.cookie('existingCoupon') === null)){
			coupon = $.cookie('existingCoupon');
			$.removeCookie('existingCoupon');
		  }
		  else{
			coupon = 'no-coupon';
		  }
		  
		  var data = JSON.parse($('#orderData').html()),
		  quantity = data.domainResponse.entitiesResponse.baseDTO.totalOrderItems;
		  
		  
            
			if( navigator.userAgent.match(/Android/i)
                 || navigator.userAgent.match(/webOS/i)
                 || navigator.userAgent.match(/iPhone/i)
                 || navigator.userAgent.match(/iPad/i)
                 || navigator.userAgent.match(/iPod/i)
                 || navigator.userAgent.match(/BlackBerry/i)
                 || navigator.userAgent.match(/Windows Phone/i)
                 || navigator.userAgent.match(/bada/i)
                 || navigator.userAgent.match(/Bada/i)
                 ){
				
				var scr = document.createElement("script");
				var host = 'http://rt.s2d6.com/x/?x=sp&h=61056&o='+orderId+'&g=PRODUCT_CLASS&s='+orderAmount+'&q='+quantity+'&i='+map.clickid+'&coupon='+coupon;
				scr.setAttribute('src', host);
				(document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
				
			   
            }
			else {
            
                var scr = document.createElement("script");
				var host = 'https://www.s2d6.com/js/globalpixel.js?x=sp&a=130&h=61056&o='+orderId+'&g=new&s='+orderAmount+'&q='+quantity+'&coupon='+coupon;
				scr.setAttribute('src', host);
				(document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
				
			}	
              
          }
          
        } 

        
        //<script src="https://www.s2d6.com/js/globalpixel.js?x=sp&a=130&h=61056&o=<%=request.getAttribute("orderId")%>&g=&s=<%=request.getAttribute("amount")%>&q=1"></script>

      },

      sokratiPixlet : function(orderId , orderAmount){

       var a = document.createElement('script');a.type = 'text/javascript'; a.async = true; 
       a.src=('https:'==document.location.protocol?'https://':'http://cdn.')+'chuknu.sokrati.com/14717/tracker.js'; 
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(a, s);

       
      },

      homeKomliPixlet : function(){

        var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
  
          if(map.utm_source.match(/komli/gi)){
            
            
              var scr = document.createElement("iframe");
              var host = 'https://secure.komli.com/p.ashx?o=263&t=conversion';
              scr.setAttribute('src', host);
              (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
              
          }
          
        } 


        //<iframe src="https://secure.komli.com/p.ashx?o=263&t=conversion" height="1" width="1" frameborder="0"></iframe>
      },
      homeCriteoPixlet : function(orderId , orderAmount){

      	//console.log("Method enter -------------------");
         var cpw = document.createElement('script');
         cpw.async = true;
         cpw.src = (location.protocol=='http:'?'http':'https')+'://static.criteo.net/js/ld/ld.js';
         var ref = document.getElementsByTagName('script')[0];
         ref.parentNode.insertBefore(cpw, ref);

         var  pageURL = window.location.pathname.toLowerCase();

         var userEmail = '';
         if($.cookie("_FUI")){
         	var customerObj = JSON.parse($.cookie('_FUI'));
         	var custEmail = customerObj.baseDTO.loginId;
         	userEmail = custEmail;
         }
         
        	
      
         var pathname = window.location.pathname.split('/').pop(-1).split('_').pop(-1);
		 var productId = pathname;

          var SubCatePagName = $('#backbone-portlet-product-listing.productListingPage').attr('data-page-value');
          var ProductPagName = $('#backbone-portlet-product.productDetailPage').attr('data-page-value');
          var EventId = $('#backbone-portlet-product-listing.productListingPage').attr('data-id');

		  var criteoPageName; 
		  if(SubCatePagName == 'productListingPage'){
			  //if(!(isNaN(pathname))){
			  	//console.log("Page Display listing");
			    criteoPageName = "listing";
			  //}
			}

		  if(ProductPagName == 'productDetailPage'){
		  	//console.log("product page Display");
			  criteoPageName = "product";
			}

			var Productpathname = window.location.pathname.split('/');
         	var path = Productpathname[1];

         if( navigator.userAgent.match(/Android/i)
                 || navigator.userAgent.match(/webOS/i)
                 || navigator.userAgent.match(/iPhone/i)
                 || navigator.userAgent.match(/iPad/i)
                 || navigator.userAgent.match(/iPod/i)
                 || navigator.userAgent.match(/BlackBerry/i)
                 || navigator.userAgent.match(/Windows Phone/i)
                 || navigator.userAgent.match(/bada/i)
                 || navigator.userAgent.match(/Bada/i)
                 ){

         		//var Productpathname = window.location.pathname.split('/');
         		//var path = Productpathname[1];


				//console.log("Home page Mobile 0000");

         		if((pageURL ===  "/")|| (pageURL ===  "/home")) { 
         			
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: orderId },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "m" },
		        	{ event: "viewHome" }
		        	);

				}
				else if(criteoPageName == 'listing')
				{
					
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: orderId },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "m" },
		        	{ event: "viewList", item: EventId  }
		        	);
				}

				else if((criteoPageName == 'product') || (path == 'product-detail'))
				{
					
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: orderId },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "m" },
		        	{ event: "viewItem", item: productId }
		        	);
				}
				else if(pageURL ===  "/cart")
				{

					var cartDataValue = JSON.parse($('#cartData').html());
			        var cartQuantity = cartDataValue.cart.products.length;
			        var cartValue = cartDataValue.cart.youPayValue;

			        var productId = [],salePrice = [], quantity = [], i = 0
			      
			      	
				        $.each(cartDataValue.cart.products,function(index,data){
				          productId.push(data.vendorProductId,data.salePrice,data.quantity);
					     				        
				        });
				  
			   	
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: orderId },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "m" },
		        	{ event: "viewItem", item: productId}
		        	);
				}
				else if(pageURL ===  "/confirmation")
				{

				var confrimDataValue = JSON.parse($('#orderData').html());
		        var transicationValue = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalAmountPaid;
		        var transicationId = confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderHeaderId;
		        var totalOrderItems = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalOrderItems;

		        var confirmOrderIdarry =[];
		        
		          $.each(confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines,function(index,data){
		            confirmOrderIdarry.push(data.transicationId, data.mrp, data.erpSku, data.quantity);
		          });
			      			   	
				window.criteo_q = window.criteo_q || [];
				window.criteo_q.push(
		        	{ event: "setAccount", account: orderId },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "m" },
		        	{ event: "trackTransaction", id: transicationId, item: confirmOrderIdarry }
		        	);
				}
					   
            }
			else {

				
            
				//console.log("Home page Desktop 0000");
         		if((pageURL ===  "/") ||(pageURL ===  "/home")) { 
         			
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: '22045' },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "d" },
		        	{ event: "viewHome" }
		        	);

				}
				else if(criteoPageName == 'listing')
				{
					
					//console.log("listing criteo pages");
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: '22045' },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "d" },
		        	{ event: "viewList", item: productListErps }
		        	);
				}

				else if((criteoPageName == 'product') || (path == 'product-detail'))
				{
					
					//console.log("product criteo pages");
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: '22045' },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "d" },
		        	{ event: "viewItem", item: globalProductErp }
		        	);
				}
				else if(pageURL ===  "/cart")
				{

					var cartDataValue = JSON.parse($('#cartData').html());
			        var cartQuantity = cartDataValue.cart.products.length;
			        var cartValue = cartDataValue.cart.youPayValue;

			        var productId = [],salePrice = [],criteoCartData=[], quantity = [], i = 0
			      
			      	
						$.each(cartDataValue.cart.products,function(index,data){
							criteoCartData.push({"id":index.toString().split('-')[0],"price":data.salePrice,"quantity":data.quantity})
					     				        
				        });
				  
			   	
					window.criteo_q = window.criteo_q || [];
					window.criteo_q.push(
		        	{ event: "setAccount", account: '22045' },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "d" },
		        	{ event: "viewBasket", item: criteoCartData}
		        	);
				}
				else if(pageURL ===  "/confirmation")
				{

				var confrimDataValue = JSON.parse($('#orderData').html());
		        var transicationValue = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalAmountPaid;
		        var transicationId = confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderHeaderId;
		        var totalOrderItems = confrimDataValue.domainResponse.entitiesResponse.baseDTO.totalOrderItems;

		        var criteoConfirmData =[];
		      
				if(confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.length){
					$.each(confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines,function(index,data){
						criteoConfirmData.push({ "id":data.erpSku.toString().split('-')[0],"price":data.salePrice,"quantity":data.quantity});
					});
				}
				else{
					criteoConfirmData.push({"id":confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.erpSku.toString().split('-')[0],"price":confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.salePrice,"quantity":confrimDataValue.domainResponse.entitiesResponse.baseDTO.inboundOrderLines.quantity});
				}   
			      			   	
				window.criteo_q = window.criteo_q || [];
				window.criteo_q.push(
		        	{ event: "setAccount", account: '22045' },
		        	{ event: "setHashedEmail", email: userEmail },
		        	{ event: "setSiteType", type: "d" },
		        	{ event: "trackTransaction", id: transicationId, item: criteoConfirmData}
		        	);
				}
			}
        },

      homeAdvantagePixlet : function(){

          var scr = document.createElement("iframe");
          var host = 'http://54.84.151.220/advantages_pixel/FashionAndYou/fashionandyouRemarketing.js';
          scr.setAttribute('src', host);
          (document.getElementsByTagName('script')[0].parentNode).appendChild(scr);

          //<script src="http://54.84.151.220/advantages_pixel/FashionAndYou/fashionandyouRemarketing.js"></script>
      },

      yebhiPixelet : function(orderId , orderAmount , customerId){
	  
		var cookieData = $.cookie('UTM_DATA');
        if(!(cookieData === "" || cookieData === undefined || cookieData === null)){
          var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));
          var emailID  = null;
           var customerId = $.cookie('COOKIE_FNY_CUSTOMER_ID');
            var j = cookieData.split('&'); 
            var utdata = [],referdata="",splitData,map = {},urlHeader="",urlFooter="";
            emailID = $.cookie('COOKIE_FNY_LOGIN_ID');
            $.each(j,function(index,data){
              splitData =  data.split('=');
                var indexName = splitData[0];
                var indexValue = splitData[1];
                map[indexName] = indexValue;
               
            });
  
          if(map.utm_source.match(/yebhi/gi)){
            
            
             var order = new Array();
          //Adding Order Item
			order.push({
                      _0: orderId,               //Order Id - required
                      _1: "0",             //OrderItem Id - required
                      _2: "00.00",                   //Unit Price - required  
                      _3: "NULL",    //Product Code - required
                      _4: "NULL",                  //Category - required
                      _5: "NULL",            //Sub Category - required
                      _6: "FSH",                     //Vendor Code (given to you by us) - required
                      _7: $.cookie('COOKIE_FNY_LOGIN_ID'), //Order User Id (This is the UID sent by Yebhi in your URL when sending user. It should be saved in a Cookie and taken from there. Cookie should be valid for 30 days) - Required
                      _8: orderAmount,                   //Order Total Price - required
                      _9: orderId              //Order Number - required
                   });
                  //Submit order tracking data to tracking page
                 
                       var temp = [];
                       var tempparm = "";          //temporary parameter variable containing track order data 
                       var count = 0;
                       for (var i = 0; i < order.length; i++) {
                           temp.push(order[i]);    //pushing order data to temporary array
                           if (i >= 0) {
                               if ((i % 4) == 0 || i == order.length - 1) {
                                   if (tempparm == "") {
                                       tempparm = "data=" + JSON.stringify(temp); // assigning track order data
                                       //alert("upper"+tempparm);
                                   }
                                   else {
                                       count++;
                                       tempparm += "&data" + count + "=" + JSON.stringify(temp); // assigning track order data
                                       //alert("lower"+tempparm);
                                   }
                                   temp = [];        //creating new array object
                               }
                           }
                       }
                       var url = "http://afftrack.yebhi.com/tracking.aspx?" + tempparm;   //tracking url with order tracking data
                    
                       $('#frm_yebhi_tracking').attr('src',url); 
              
          }
          
        } 

          

      },*/

      facebookPixelet : function(orderId , orderAmount){

        var fb_param = {};
        fb_param.pixel_id = 6006387383214; 
        fb_param.value = orderId;
        
         var fpw = document.createElement('script');
         fpw.async = true;
         fpw.src = (location.protocol=='http:'?'http':'https')+'://connect.facebook.net/en_US/fp.js';
         var ref = document.getElementsByTagName('script')[0];
         ref.parentNode.insertBefore(fpw, ref);
        

      }

    });
  
})();
