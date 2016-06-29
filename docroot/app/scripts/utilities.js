

$('.searchInputBox').on('input',function(){
		$('.cart-dropdown.popup , .dropdown-menu.profile').css('display','none !important');
		  var i = $(this).val().toLowerCase();
		  var ulData = $('#autoSuggestBox ul').html();
		  if(i!=""){
		  $('#autoSuggestBox , #autoSuggestBox ul').css('display','block'); 
		 var productSize = 30, productFrom = 0, eventSize = 12, eventFrom = 0, eventsCount, productsCount;
		 var urlBase = URL_PROPERTIES.get('SEARCH_RESULT'),
		 urlRoot = urlBase.replace("{size}", productSize).replace("{from}", productFrom);
		  var data ={
				  "fields": [
				             "product.name.englishanalyzer",
				             "event.eventName.englishanalyzer",
							 "product.status"
							 
				           ],
				           "query": {
				             "multi_match": {
				               "query": i,
				               "fields": [
				                 "product.product.name.englishanalyzer^4",
				                 "product.category.categoryName.englishanalyzer",
				                 "product.event.description.englishanalyzer"
				               ],
				               "use_dis_max": true
				             }
				           }
		 };
		  var dataSerch = JSON.stringify(data) ; 
		  console.log(i);
		  $.ajax({
		type: "POST",
		url: urlRoot,
		data: dataSerch
		})
		.done(function( msg ) {
		    var evtArrydata =[],
		    productArrydata = [];
		    
		  if(ulData == ""){
			$('#autoSuggestBox ul').append('<li class="ProductHeadline">Products</li>');  
		    $.each(msg.hits.hits, function(index, data) {
		      
		     
		      /*$.each(data.fields['event.eventName.englishanalyzer'],function(index,data){
		        if($.inArray(data,evtArrydata) == -1){
		        	
		        $('.EvtHeadline').after('<li class="eventName">'+data.replace(':',' ')+'</li>');
		        evtArrydata.push(data);
		        }
		        
		      });*/
		      
		      $.each(data.fields['product.name.englishanalyzer'],function(index,data){
			        if($.inArray(data,productArrydata) == -1){
			        $('.ProductHeadline').after('<li class="productName">'+data.replace(':',' ')+'</li>');
			        productArrydata.push(data);
			        }
			        
			   });
		      
		      
		      /* $('#autoSuggestBox ul').append('<li class="productName">'+data.fields['product.name.englishanalyzer']+'</li>');*/ 
		       
		    });
		 
		  }
		  
		  else{
		    $('#autoSuggestBox ul').empty();
		    $('#autoSuggestBox ul').append('<li class="ProductHeadline">Products</li>'); 
		    $.each(msg.hits.hits, function(index, data) {
		      
		     
		    	/*$.each(data.fields['event.eventName.englishanalyzer'],function(index,data){
			        if($.inArray(data,evtArrydata) == -1){
			        $('.EvtHeadline').after('<li class="eventName">'+data.replace(':',' ')+'</li>');
			        evtArrydata.push(data);
			        }
			        
			      });*/
			      
			      $.each(data.fields['product.name.englishanalyzer'],function(index,data){
				        if($.inArray(data,productArrydata) == -1){
				        $('.ProductHeadline').after('<li class="productName">'+data.replace(':',' ')+'</li>');
				        productArrydata.push(data);
				        }
				        
				   });
		      
		      /* $('#autoSuggestBox ul').append('<li class="productName">'+data.fields['product.name.englishanalyzer']+'</li>'); */
		       
		    });
		  
		  }
		    
		  $('.ProductHeadline').css('background','#f0f0f0');
		  
		   $('#autoSuggestBox ul li').on('click',function(){
		 var classChk = $(this).attr('class');
		 if(classChk === 'productName' || classChk === 'eventName' ){
		    
		  $('.searchInputBox').val($(this).text());
		    $('#autoSuggestBox ul,#autoSuggestBox').css('display','none');
		    var keyword = $(this).text(),
			redirectURL = window.location.origin + "/search/result/"+keyword;
			window.location.replace(redirectURL);
		 }
		 });  
		  
		   
		     
		});
		    
		    
		}
		  else{
		  $('#autoSuggestBox , #autoSuggestBox ul').css('display','none');
		  }
		  
		});

	/*$('.searchInputBox').on('input',function(){
		$('.cart-dropdown.popup , .dropdown-menu.profile').css('display','none');
	});*/
	
	
	$('.searchInputBox').on('keyup', function(e) {
	    if (e.which == 13) {
	        e.preventDefault();
	    var keyword = $('.searchInputBox').val();
		redirectURL = window.location.origin + "/search/result/"+keyword;
		window.location.replace(redirectURL);
	   
	    }
	});
	
function getCookie(name) { 
	var re = new RegExp(name + "=([^;]+)"); 
	var value = re.exec(document.cookie); 
	return (value != null) ? unescape(value[1]) : null; 
}

/*$('.searchInputBox').on('input',function(){
	$('.cart-dropdown.popup , .dropdown-menu.profile').css('display','none');
});*/

$('#searchForm').submit(function(e){
	e.preventDefault();
	var keyword = $('.searchInputBox').val();
	redirectURL = window.location.origin + "/search/result/"+keyword;
	window.location.replace(redirectURL);
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

var ngtmpldata = getParameterByName('beta');
if(ngtmpldata === 'beta'){
	document.cookie="ngAppTmpl=true";
}	
setTimeout(function(){

$(".search-icon").on("click", function() {
  keyword = $('#searchInputBox').val(),
  redirectURL = window.location.origin + "/search/result/"+keyword;
  window.location.replace(redirectURL);
 });
	},1000);

function loadjscssfile(filename, filetype) {
	
	if (filetype == "js") { //if filename is a external JavaScript file
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
		
		$('body').append(fileref);

		return fileref;
	}
	
	if (filetype == "css") { //if filename is a external CSS file
		var fileref = document.createElement('link');
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
		fileref.setAttribute("rel", "stylesheet");
		
		$('body').append(fileref);

		return fileref;
	}
}

function secondsToTime(duration) {
    var seconds = parseInt(duration%60)
        , minutes = parseInt((duration/60)%60)
        , hours = parseInt((duration/(60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function getTimeToexpire(duration) {
	
	var date = new Date(), month, today, year, seconds, minutes, hours, localDuration;
	
	today = date.getDate();
	month = date.getMonth() + 1;
	year = date.getFullYear();
	var timerFix = date.getHours()+""+date.getMinutes();
	if(timerFix > 2329){
		today = date.getDate() + 1;
	}
	localDuration = (duration + date.getSeconds() + (date.getMinutes()*60) + (date.getHours()*60*60));
	
	seconds = parseInt( (localDuration%60) );
	minutes = parseInt( ((localDuration/60)%60) );
	hours = parseInt( ((localDuration/(60*60))%24) );
	
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	today = (today < 10) ? "0" + today : today;
	month = (month < 10) ? "0" + month : month;
	
	return year + "/" + month + "/" + today + " " + hours + ":" + minutes + ":" + seconds;   
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

function cartProductsImpl(data){
	if(data.cart){
		if(data.cart.products){
			var productsObj = data.cart.products,
      voucherObj;
      if(data.cart.vouchers){
        voucherObj = data.cart.vouchers
      }
			var count = 0;
			var productsArry = [],vouchersArry =[];
			for(var prop in productsObj) {
				if(productsObj.hasOwnProperty(prop))
				  var multiProductsObj = {
            "erpSku":productsObj[prop].sku,
            "webshopSku":productsObj[prop].webshopSku,
            "deliveryDay":productsObj[prop].deliveryDay,
            "maxAllowedQuantity":productsObj[prop].maxQntyAllowed,
			"maxAvailableQuantity":productsObj[prop].availableQuantity,
            "productName":productsObj[prop].name,
            "quantity":productsObj[prop].quantity,
            "status":productsObj[prop].status,
            "expireDuration":productsObj[prop].expireTimeLimit,
            "timeToExpire":productsObj[prop].expireTimeLimit,
            "vendorProductId":productsObj[prop].vendorProductId,
            "costPrice":productsObj[prop].costPrice,
            "salePrice":productsObj[prop].salePrice,
            "mrp":productsObj[prop].mrp,
            "vat":productsObj[prop].vat,
			"expectedTimeDelivery":productsObj[prop].expectedTimeDelivery,
            "warehouseLocation":productsObj[prop].warehouseLocation,
            "thumbnailUrl":productsObj[prop].thumbnailUrl,
			"createTime":productsObj[prop].createTime,
			"variants":productsObj[prop].sizeVariants,
			"eventId":productsObj[prop].eventId,
            "currencyType":"INR"
					
				  };
				  productsArry.push(multiProductsObj)
				   ++count;
			}
      if(data.cart.vouchers){
        for(var prop in voucherObj) {
          if(voucherObj.hasOwnProperty(prop))
            var voucherNewObj = {
              "valueType":voucherObj[prop].valueType,
              "code":voucherObj[prop].code,
              "value":voucherObj[prop].value,
              "type":voucherObj[prop].type,
              "voucherAmount":voucherObj[prop].voucherAmount,
              "description":voucherObj[prop].description

            };
            vouchersArry.push(voucherNewObj)
            
        }
      }
			data.cart.products = productsArry;
      if(data.cart.vouchers){
        data.cart.vouchers = vouchersArry;
      }
			return data;
		}
	}
	else{
		
		return {"cart":{}};
	}
}; 

$(document).ready(function() {

	$('.logobar').html($("#companyLogoData").html());
	$('.info-links-outer').html($("#infoLinkData .info-links-outer ").html());
	$('.footer-brand-names').html($("#topBrandsData .footer-brand-names ").html());
	$('.copyrightbar').html($("#copyRightData .copyrightbar ").html());
	
	$(".top-area-sticky li a").click(function(e){
		 e.preventDefault();
		 $(".mobile-search").toggle();
		 //console.log();
	});

	/*$("#powerTip .social-share-link").on('click', function(e){
		
		e.preventDefault();
		
		var classesList = $(e.currentTarget).attr("class").split(' '),
			curProductId = $(".product-popup-info").data('product-id'),
			curEventId = $(".product-popup-info").data('event-id'),
			sharingData = {
				url : window.location.origin + '/product-detail/product/' + curEventId + '/' + curProductId,
				title : $(".product-popup-info .product-name").text(),
				imageUrl : $("#product-gallery-thumbnails div a").first().data("image-detail"),
				description : "I found an amazing deal at fashionandyou.com and I bet you'll love it too. Check it out!",
				handlerName : classesList[1]
		};
		
		socialShare(e, sharingData);
		
	});*/
	


	$(window).scroll(function() {    
	    var scroll = $(window).scrollTop();
	    if (scroll >= 95) {
	        $(".stickheader").addClass("fixedHeader");
			$(".logobar").addClass("hide-block");
			$(".favorites-block").addClass("hide-block");
			$(".timeremaining").addClass("hide-block");
			$(".midddle-area").addClass("heightset");
			$(".login-favorites").addClass("show-block");
			
	    } else {
	        $(".stickheader").removeClass("fixedHeader");
			$(".logobar").removeClass("hide-block");
			$(".favorites-block").removeClass("hide-block");
			$(".timeremaining").removeClass("hide-block");
			$(".midddle-area").removeClass("heightset");
			$(".login-favorites").removeClass("sahow-block");
	    }
	});
	
});


	
	/*$("#feedback_but").click(function(e){
		e.preventDefault();
		e.stopPropagation();
		
		/*if($.cookie('_FUI') != undefined){
			var user = JSON.parse($.cookie('_FUI'));
				$('#feedbackName').val(user.baseDTO.firstName);
				$('#feedbackEmail').val(user.baseDTO.loginId);
		}
	    /*if($(".feedbackpop_form").is(':visible'))
	      {
			$(".feedbackpop_form").animate({ width: 'hide' }); 
	      }
	      else
	      {
	        $(".feedbackpop_form").animate({ width: 'show' }); 
	      }
	});*/
	$("#feedback_but").click(function(){
    if($(".feedbackpop_form").is(':visible'))
      {
		$(".feedbackpop_form").animate({ width: 'hide' }); 
      }
      else
      {
        $(".feedbackpop_form").animate({ width: 'show' }); 
      }
	  
	  if($.cookie('_FUI') != undefined){
			var user = JSON.parse($.cookie('_FUI'));
				$('#feedbackName').val(user.baseDTO.firstName);
				$('#feedbackEmail').val(user.baseDTO.loginId);
		}
	  
});
	$("#feedbackForm, .feedback-form").submit(function(e){
		e.preventDefault();

		var fnyToken = $.cookie($('#FnyCustomToken').data('tokenid'));

		var filter = /^[a-zA-Z\s]+$/ ,numericfilter = /^[0-9]+$/;
		 var filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(($('#feedbackName').val() != "")  && (filter.test($("#feedbackName").val()))){
        	$('.errormsg').hide();
        }else{
        	$('.errormsg').show();
            $('.errormsg').find('#errorMessage').text('Please enter your name');
        	return false;
        }
		if($('#feedbackEmail').val() === ""){
        	$('.errormsg').show();
        	$('.errormsg').find('#errorMessage').text('Please enter your email address');
        	return false;
        }
        if (!filterEmail.test($('#feedbackEmail').val())) {
        	$('.errormsg').show();
        	$('.errormsg').find('#errorMessage').text('Please provide a valid email address');
        	return false;
        }else{
        	$('.errormsg').hide();
        }
		if($("#feedbackPhone").val() === ""){
        	$('.errormsg').hide();
        }else{
        	if($("#feedbackPhone").val().length === 10){
    			if(numericfilter.test($("#feedbackPhone").val())){
            	$('.errormsg').hide();
    			}else{
    				$('.errormsg').show();
                	$('.errormsg').find('#errorMessage').text('Please enter valid contact');
                	return false;
    			}
            }else{
            	$('.errormsg').show();
            	$('.errormsg').find('#errorMessage').text('Please enter valid contact');
            	return false;
            }
        }
		
		if($('#feedbackMessage').val() === ""){
        	$('.errormsg').show();
        	$('.errormsg').find('#errorMessage').text('Please enter your valuable comments');
        	return false;
        }
		
		var feedbackData = {
            "feedbackWrapper": {
                "feedbacks": [{
                    "name": $('#feedbackName').val(),
                    "email": $('#feedbackEmail').val(),
                    "phone": $('#feedbackPhone').val(),
                    "feedbackType": $('#feedbackType').val(),
                    "message": $("#feedbackMessage").val()
                }]
            }
        }, json_data = JSON.stringify(feedbackData), 
        	urlBase = URL_PROPERTIES
				.get('POST_FEEDBACK'),
			urlRoot = urlBase.replace('{deviceId}',fnyToken);

		$.ajax({
			url : urlRoot,
			type : 'POST',
			data : json_data,
			contentType : 'application/json; charset=utf-8',
			dataType : 'json',
			async : true,
			success: function(response){
				$('.errormsg').hide();
				if(response.feedbackWrapper.responseCode === "SUCCESS"){
					$('.statusmsg').show();
					
					setTimeout(function(){
						if($.cookie('_FUI') != undefined){
							var user = JSON.parse($.cookie('_FUI'));
							$('#feedbackName').val(user.baseDTO.firstName);
							$('#feedbackEmail').val(user.baseDTO.loginId);
						}else{
							$('#feedbackEmail').val("");
							$('#feedbackName').val("");
						};
						$('#feedbackMessage').val("");
						$('.statusmsg').hide();
						if($(".feedbackpop_form").is(':visible'))
					    {
							$(".feedbackpop_form").animate({ width: 'hide' }); 
					    }
					    /*else
					    {
					        $(".feedbackpop_form").animate({ width: 'show' }); 
					    }*/
					},1000);
					
				}else{
					$('.errormsg').show();
		        	$('.errormsg').find('#errorMessage').text('Sorry!!!! Some error occured');
				}
				
			}
		});
		
	});
	
	
	$("#back-top").hide();
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-top a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});

	var  pageURL = window.location.pathname.toLowerCase();
	if((pageURL.match(/cart$/) != null)) {
        $("#backbone-portlet-cart-content").show();
        $("#backbone-portlet-cart-nav").show();
    }
	$(window).load(function(){
		setTimeout(function(){
			$('.navbar-toggle.mtoggle').on('click',function(e){
				e.preventDefault();
				setTimeout(function(){
					$('.side-menu.active .navbar-nav.nav2.nav-menu li.dropdown').on('click',function(e){
						e.preventDefault();
						e.stopPropagation();
						$(this).find('.dropdown-menu.submenu').slideToggle();
						$('.dropdown-menu.submenu li a').on('click',function(e){
							e.preventDefault();
							e.stopPropagation();
							window.location.href = $(this).attr('href');
						});
					});
				},1000);
			});			
		},1000);	
	})
	function newCartTimeExpire(createdTime , timetoExpire){
	  var minutes = 	 Math.round(timetoExpire/60),
	  currentTime = new Date(createdTime);
	  var newExpTime = currentTime.setMinutes(currentTime.getMinutes() + minutes);
	  return new Date(newExpTime)
	  
	};
/*$(function() {
    if (!$.support.placeholder) {
        $("[placeholder]").focus(function () {
            if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
        }).blur(function () {
            if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
        }).blur();

        $("[placeholder]").parents("form").submit(function () {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() == $(this).attr("placeholder")) {
                    $(this).val("");
                }
            });
        });
    }
});*/