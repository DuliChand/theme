soldOutArry = [] ; duplicateProduct = [];repeatedProducts =[];
(function() {
    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
    
    Handlebars.registerHelper('lowerEqual', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if ((lvalue != "undefined") && (rvalue != "undefined") && (typeof(lvalue) === "string") && (lvalue.toLowerCase() != rvalue)) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
    
    Handlebars.registerHelper('divide', function(str, options) {
          if (str != "undefined" && typeof(str) === "string") {
           var value=str.split("|");
           return value.toLowerCase();
          } else {
           return str;
          }
    });
    
    Handlebars.registerHelper('notEqual', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if ((lvalue != "undefined") && (rvalue != "undefined") && (lvalue === rvalue)) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
    
    Handlebars.registerHelper('notLowerEqual', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if ((lvalue != "undefined") && (rvalue != "undefined") && (lvalue.toLowerCase() === rvalue)) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
    
    Handlebars.registerHelper('if_gt', function (value, test, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if ((value != "undefined") && (test != "undefined") && (value > test)) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper('getSearchSpecificData', function (value, options) {
        if ((value != "undefined")) {
            var mystring = value;
            var newString = mystring.replace(/_/g, " ").replace(/ AND/g, "&").replace(/ and/g, "&");
            return newString;
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper('if_less_equal', function (value, test, options) {
        if (value <= test) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper('if_less', function (value, test, options) {
        if (value < test) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper("splitString", function(context, options){
        if(context){
          var ret = "";
          
          var tempArr = context.trim().split(options.hash["delimiter"]);

          for(var i=0; i < tempArr.length; i++)
          {
            ret = ret + options.fn(tempArr[i]);
          }

          return ret;
        }
      });
    
    Handlebars.registerHelper('lastElement', function (value, test, options) {
        if ( (value -1) == test) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper("categoryChk", function(catname , catid) {
        var catGroupName = catname.toLowerCase();
        var catGroupid;
        var catdatas = [];
        var CatMapVal = {};
        $.each(catid, function(index, data) {
        var catgrpname = data.categoryName;
        var catgrpid = data.categoryId;
        CatMapVal[catgrpname] = data.categoryId;

        catdatas.push(CatMapVal);


        });

        $.each(CatMapVal,function(indextwo, data) {
        var  mynew = indextwo.toLowerCase(); 
        if(catGroupName == 'home_and_living'){
            if(mynew == 'home & living'){catGroupid = data;}
        }
        else if(mynew == catGroupName){catGroupid = data;}


        });

        return catGroupid;

        });
    
    
    Handlebars.registerHelper('if_not_less_equal', function (value, test, options) {
        if (!(value <= test)) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });
    
    Handlebars.registerHelper('isAvailable', function (value, test, options) {
        
        if (value != "undefined" && typeof(value) === "string"){
            var val = value.toLowerCase(),
            tempVal = val.split("|");
            if(tempVal > 1){
                for (var j=0; j<tempVal.length; j++) {
                    if (tempVal[j].match(test)) 
                        return options.fn(this);
                }
            }else{
                if (val.match(test) != null) {
                   return options.fn(this);
                } else {
                   return options.inverse(this);
              }
            }
        }
        
        
        /*return -1;
        if (val.match(test) != null) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }*/
    });
    
    Handlebars.registerHelper('toLowerCase', function(str, options) {
        if (str != "undefined" && typeof(str) === "string") {
            return str.toLowerCase();
        } else {
            return str;
        }
    });
    
    Handlebars.registerHelper('hasValue', function(str, options) {
        if (str != "undefined" && typeof(str) === "string") {
            return true;
        } else {
            return false;
        }
    });
    
    Handlebars.registerHelper('getImageBaseURL', function(str, options) {
        if (str != "undefined" && typeof(str) === "string") {
            
            var imageURL = str;
            var imageNameStartIndex = imageURL.indexOf("banner");
            var imageBaseURL = imageURL.substring(0,imageNameStartIndex);
            
            return imageBaseURL;
        } else {
            return str;
        }
    });
    
    Handlebars.registerHelper('product', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        return (parseFloat(lvalue) * parseFloat(rvalue));
    });
    
    Handlebars.registerHelper('difference', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        return (parseFloat(lvalue) - parseFloat(rvalue));
    });
    
    
    Handlebars.registerHelper('getPercentage', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        
        return Math.ceil( (parseInt(lvalue) * 100) / parseInt(rvalue) );
    });
    
    Handlebars.registerHelper('getQntySoldPercent', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        
        var totalQnty = parseInt(rvalue),
            qntySold = parseInt(lvalue);
        
        return Math.ceil( (qntySold * 100) / totalQnty );
    });
    
    Handlebars.registerHelper('getQntyLeftPercent', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        
        var totalQnty = parseInt(rvalue),
            qntySold = parseInt(lvalue),
            qntyLeft = parseInt(totalQnty - qntySold);
        
        return Math.floor( (qntyLeft * 100) / totalQnty );
    });
    
    
    
    Handlebars.registerHelper('discountInPercentage', function(lvalue, rvalue, options) {
        
        var newPrice = parseFloat(lvalue);
        var oldPrice = parseFloat(rvalue);
        var discountInCurrency = (oldPrice - newPrice);
        var discountInPercent = Math.round( (discountInCurrency * 100) / oldPrice );
        
        discountInPercent = (discountInPercent > 0) ? discountInPercent : 0;
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        return discountInPercent;
    });
	
	Handlebars.registerHelper('promoDiscountInPercentage', function(mrp, discount, saleprice , options) {
        
        var oldPrice = parseFloat(mrp);
		var saleprice = parseFloat(saleprice);
        var percentageDiscount = parseFloat(discount);
		var newPrice = Math.round( (percentageDiscount * saleprice ) / 100 );
		var newsaleprice = parseFloat(saleprice - newPrice);
        var discountInCurrency = (oldPrice - newsaleprice);
        var discountInPercent = Math.round( (discountInCurrency * 100) / oldPrice );
        
        discountInPercent = (discountInPercent > 0) ? discountInPercent : 0;
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 3 parameters");
        return discountInPercent;
    });
	
	Handlebars.registerHelper('promoTotalSaving', function(mrp, discount, saleprice , options) {
        
        var oldPrice = parseFloat(mrp);
		var saleprice = parseFloat(saleprice);
        var percentageDiscount = parseFloat(discount);
		var newPrice = Math.round( (percentageDiscount * saleprice ) / 100 );
		var newsaleprice = parseFloat(saleprice - newPrice);
        var discountInCurrency = (oldPrice - newsaleprice);
        
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 3 parameters");
        return discountInCurrency ;
    });
    
    Handlebars.registerHelper('cleanString', function(str, options) {
        if (str != "undefined" && typeof(str) === "string") {

            str = str.replace(/[^a-zA-Z0-9 ]/g, "");
            /*str = str.replace(/&+/g,"and");
            str = str.replace(/@+/g,"at");*/
            
            str = str.replace(/ +/g,"-");
            
            return str.toLowerCase();
            
        } else {
            return str;
        }
    });
    
    Handlebars.registerHelper('getTimeInSecs', function(lvalue, rvalue, options) {
        
        var startTime, currTime, endTime, startTimeSecs, endTimeSecs, timeToExpire;
        
        startTime = new Date(lvalue);
        currTime  = new Date();
        endTime = new Date(rvalue);
        
        // Convert both dates to seconds
        startTimeSecs = parseInt(currTime.getTime() / 1000);
        endTimeSecs = parseInt(endTime.getTime() / 1000);

        // Calculate the difference in seconds
        timeToExpire = endTimeSecs - startTimeSecs;
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        
        return timeToExpire;
    });
    
    Handlebars.registerHelper('getTimeInSecs', function(lvalue, rvalue, options) {
        
        var startTime, currTime, endTime, startTimeSecs, endTimeSecs, timeToExpire;
        
        startTime = new Date(rvalue);
        currTime  = new Date();
        endTime = new Date(rvalue);
        
        // Convert both dates to seconds
        startTimeSecs = parseInt(currTime.getTime() / 1000);
        endTimeSecs = parseInt(endTime.getTime() / 1000);

        // Calculate the difference in seconds
        timeToExpire = endTimeSecs - startTimeSecs;
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        
        return timeToExpire;
    });

    Handlebars.registerHelper('getDOB', function(str, options) {
        
        var dateOfBirth, dobMonth, dobYear, dobDate;

        if (str != "undefined" || str != "") {
            
            dateOfBirth = new Date(str);
            dobMonth = dateOfBirth.getMonth() + 1;
            dobMonth = (dobMonth < 10) ? "0" + dobMonth : dobMonth;
            dobYear = dateOfBirth.getFullYear();
            dobDate = dateOfBirth.getDate();
            dobDate = (dobDate < 10) ? "0" + dobDate : dobDate;
            
            return dobDate + "/" + dobMonth + "/" + dobYear;
            
        } else {
            
            return str;
        }
        
    });
    
    Handlebars.registerHelper('getDate', function(lvalue, rvalue, options) {
        
        var currDateTime, currMonth, currYear, currDate, currHour, currMin, currSec;
        
        if (typeof(rvalue) != "undefined" || rvalue != "" || typeof(lvalue) != "undefined" || lvalue != "") {
            
            currDateTime = new Date(rvalue);
            
            currMonth = currDateTime.getMonth() + 1;
            currMonth = (currMonth < 10) ? "0" + currMonth : currMonth;
            currYear = currDateTime.getFullYear();
            currDate = currDateTime.getDate();
            currDate = (currDate < 10) ? "0" + currDate : currDate;
            currHour = currDateTime.getHours();
            currHour = (currHour < 10) ? "0" + currHour : currHour;
            currMin = currDateTime.getMinutes();
            currMin = (currMin < 10) ? "0" + currMin : currMin;
            currSec = currDateTime.getSeconds();
            currSec = (currSec < 10) ? "0" + currSec : currSec;
            
            switch (lvalue) {
                case 'DDMMYYYY':
                    return currDate + "/" + currMonth + "/" + currYear; 
                    break;
                    
                case 'DDMMYYYYHHMM':
                    return currDate + "/" + currMonth + "/" + currYear + " " + currHour + ":" + currMin; 
                    break;
                    
                case 'YYYY/MM/DD hh:mm:ss':
                    return currYear + "/" + currMonth + "/" + currDate + " " + currHour + ":" + currMin + ":" + currSec; 
                    break;
            }
        } else {
            /*console.log("some issue with parsed data");*/
        }
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
    });
Handlebars.registerHelper('getTime', function(lvalue, rvalue, options) {
        
        var currDateTime,currHour, currMin;
        
        if (typeof(rvalue) != "undefined" || rvalue != "" || typeof(lvalue) != "undefined" || lvalue != "") {
            
            currDateTime = new Date(rvalue);
            
            
            currHour = currDateTime.getHours();
            currHour = (currHour < 10) ? "0" + currHour : currHour;
            currMin = currDateTime.getMinutes();
            currMin = (currMin < 10) ? "0" + currMin : currMin;
            
            switch (lvalue) {   
                case 'HH:MM':
                    return currHour + ":" + currMin; 
                    break;
                    
                case 'hh:mm':
                    return currHour + ":" + currMin ; 
                    break;
            }
        } else {
            /*console.log("some issue with parsed data");*/
        }
        
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
    });

    Handlebars.registerHelper('getTimerDate', function(lvalue, rvalue, options) {
        
     var currDateTime;
     
       if (typeof(rvalue) != "undefined" || rvalue != "" || typeof(lvalue) != "undefined" || lvalue != "") {
           var currDateTime, currMonth, currYear, currDate, currHour, currMin, currSec, tempCurrDate;
            
            tempCurrDate = new Date(rvalue);
            currDateTime = tempCurrDate.toLocaleString();
            var dateArr = currDateTime.split(" "),
            time = dateArr[1], date = dateArr[0],
            timeArr = time.split(":"),
            dateform = date.split("/");
            currYear = dateform[2], currMonth = dateform[1], currDate = dateform[0], currHour = timeArr[0], currMin = timeArr[1], currSec = timeArr[2];
            //eventExpireDate = dateform[2]+'/'+dateform[1]+'/'+dateform[0]+" "+time;
            
            currDate = (currDate < 10) ? "0" + currDate : currDate;
            currHour = (currHour < 10) ? "0" + currHour : currHour;
            currMonth = (currMonth < 10) ? "0" + currMonth : currMonth;
            /*currSec = (currSec < 10) ? "0" + currSec : currSec;*/
            
            console.log("curryear "+dateform[2] +" currmonth "+ dateform[1] + " currday "+dateform[0]);
            
            switch (lvalue) {
            case 'DDMMYYYY':
                return currDate + "/" + currMonth + "/" + currYear; 
                break;
                
            case 'DDMMYYYYHHMM':
                return currDate + "/" + currMonth + "/" + currYear + " " + currHour + ":" + currMin; 
                break;
                
            case 'YYYY/MM/DD hh:mm:ss':
                return currYear + "/" + currMonth + "/" + currDate + " " + currHour + ":" + currMin + ":" + currSec; 
                break;
            }
        
       } else {
        /*console.log("some issue with parsed data");*/
       }
     });
    Handlebars.registerHelper('subtract', function(str, options) {
        
           return parseInt(str)-1;
        
    });
    Handlebars.registerHelper('add', function(str, options) {
    
        return parseInt(str)+1;
        
    });
    

    Handlebars.registerHelper('splitEventName', function(str, options) {
        if(str != undefined){
            var eventName = str.split(':');
            return eventName[0];
        }
    });
    
    Handlebars.registerHelper('categoryEventName', function(str, options) {
        if(str != undefined){
            var eventName = str.split(':');
            return eventName[1];
        }
    });
    
    Handlebars.registerHelper('Ordercheck', function(data) {
        var value = data.toLowerCase();
                switch(value){
         case 'dispatched':
                return 'Product dispatched and  at present the courier partner tracking is not available  but we assure you to have your product delivered to you at earliest';
                break;
        case 'undercourier':
                return 'Product dispatched and  at present the courier partner tracking is not available  but we assure you to have your product delivered to you at earliest';
                break;
        case 'delivered':
               return 'Product has been Delivered';
                break;
        case 'received':
               return 'Product has been Received';
          break;
        default:
              return 'Shipment not started';

        }
        });
		
		Handlebars.registerHelper('nullCheck', function(str , options ) {
		//console.log("null check -----"+str);
			if(str == "" ) {
				return options.inverse(this); 
				//console.log("if condition satified-----"+str);
			}
			else{
				return options.fn(this);
				//console.log("else condition satified-----"+str);
			}
      
		});

		Handlebars.registerHelper('erpSkuSize', function(str, options) {
			
			var erpSku = str.split("-"),
			erpskuSize = erpSku[1]+"-"+erpSku[2];
			
			if( erpSku[2] != undefined && erpSku[1] != undefined){

			   return erpskuSize;
			}
			else if(erpSku[2] == undefined && erpSku[1] != undefined){
			
				return erpSku[1] ;
			}
			
			else if(erpSku[2] == undefined && erpSku[1] == undefined){
			
				return options.inverse(this);
			}
			
			
		});
	
	
    Handlebars.registerHelper('getProductCode', function(str, options) {
        
        var n = str.search("PRODUCT CODE"),
        data = str.substr(n,(str.length-1)),
        code = data.replace("</strong>","");
        tempdata =data.search("<strong>");
        if(tempdata !== -1){
                var tmp = data.substr(0,tempdata);
                var prodcode = tmp.replace("</strong>","");
            //productcodeArr = tmp.split("</strong>"),
            return prodcode;
        }else{
            return code;
        }

	});

	Handlebars.registerHelper('filtersubcat', function(str,  options) {
		if(str != 'Sub Category'){
		 return options.fn(this);
		}
	});
	
	Handlebars.registerHelper('specialCharReplace', function(str,  options) {
		var result = str.split(' ').join('_').split('&').join('and').replace(/[^\w\s]/gi, '_');
		return result.toLowerCase();
	});
	
	Handlebars.registerHelper('navurlformation', function(str,  options) {
		var result = str.split(' ').join('-').split(':').join('_').split('&').join('and');
		var finalurl =  result.toLowerCase();
		return window.location.origin+'/'+finalurl;
	});
	
	Handlebars.registerHelper('spacetounderscore', function(str,  options) {
		var data = str.split(" ").join("_").replace("&","and");
		return data.toLowerCase();
		
		
		
	});
	
	Handlebars.registerHelper('deliveryCheck', function(str,  options) {

		if(str == 'delivered'){
		 $('.shipment-box').next().find('tr td:nth-child(2)').html('delivered');
		}
		else{

		}
	});
	
	Handlebars.registerHelper('filterSequence', function(str,  options) {
	
		if(str.toLowerCase() == 'category'){
			return 1;
		}
		else if(str.toLowerCase() == 'brand'){
			return 3;
		}
	});
	
	Handlebars.registerHelper('soldout', function(equal, one , two , three , options) {
	
		var i = {} 
		if ($.inArray(one.vendorProductId, duplicateProduct) > -1){
			repeatedProducts.push(one.vendorProductId);
			return options.inverse(this);
		}	
		else{
			
			duplicateProduct.push(one.vendorProductId);	
			
			if ((equal != "undefined") && (equal != "undefined") && (equal === 0)) {
				
		   
					 i['vendorProduct'] = one ;
					 i['eventInventories'] = two ;
					 i['liveinventory'] = three ;
					//alert(JSON.stringify(i));
					soldOutArry.push(i);
					return options.inverse(this);
			}   
			else{
				return options.fn(this);
			}
		}	
	});	
    Handlebars.registerHelper('returnstatus', function(str, options) {
       if(str == "" ){
            return false;
        }else{
            return str.substring(0, str.length - 2);
        }
    });
    Handlebars.registerHelper('retrnablechk', function(str,value,options) {
        if(str == "" ) {
               
                //console.log("if condition satified-----"+str);
            }
            else{
                var tempStr = str,
                last2 = tempStr.slice(-2);
                if (last2 != value) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
    });
	
	Handlebars.registerHelper('mainGroupUrl', function(str, eventcode ,options) {
       if(str.toLowerCase() == 'all'){
           var eventName =  eventcode.split('_')[0].toLowerCase();
           if(eventName == 'wo'){
             return 'women';
           }
           else if(eventName == 'mn'||eventName == 'm'){
             return 'men';
           }
           else if(eventName == 'h'){
             return 'home_and_living';
           }
           else{
            return 'accessories';
           }
        
       }
	   else if(str.toLowerCase() == 'home & living'){
        return  'home_and_living';
      }
      else if(str.toLowerCase() == 'fashion garage'){
        return  'fashion_garage';
      }
       else {
        return  str.toLowerCase();
      }
    });
	
})();