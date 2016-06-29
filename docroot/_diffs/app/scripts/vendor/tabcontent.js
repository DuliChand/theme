//** Tab Content script- © Dynamic Drive DHTML code library (http://www.dynamicdrive.com)
//** Last updated: Nov 8th, 06

var enabletabpersistence=1 //enable tab persistence via session only cookies, so selected tab is remembered?

////NO NEED TO EDIT BELOW////////////////////////
var tabcontentIDs=new Object()

function expandcontent(linkobj){

	var ulid=linkobj.parentNode.parentNode.id //id of UL element
	var ullist=document.getElementById(ulid).getElementsByTagName("li") //get list of LIs corresponding to the tab contents
	for (var i=0; i<ullist.length; i++){
		ullist[i].className=""  //deselect all tabs
		if (typeof tabcontentIDs[ulid][i]!="undefined") //if tab content within this array index exists (exception: More tabs than there are tab contents)
		document.getElementById(tabcontentIDs[ulid][i]).style.display="none" //hide all tab contents
	}
	linkobj.parentNode.className="selected" //highlight currently clicked on tab

	document.getElementById(linkobj.getAttribute("data-name")).style.display="block" //expand corresponding tab content
	saveselectedtabcontentid(ulid, linkobj.getAttribute("data-name"))

}


function expandtab(tabcontentid, tabnumber){ //interface for selecting a tab (plus expand corresponding content)
var thetab=document.getElementById(tabcontentid).getElementsByTagName("a")[tabnumber]
if (thetab.getAttribute("data-name"))
expandcontent(thetab)
}

function savetabcontentids(ulid, relattribute){// save ids of tab content divs
	if (typeof tabcontentIDs[ulid]=="undefined") //if this array doesn't exist yet
		tabcontentIDs[ulid]=new Array()
	tabcontentIDs[ulid][tabcontentIDs[ulid].length]=relattribute
}

function saveselectedtabcontentid(ulid, selectedtabid){ //set id of clicked on tab as selected tab id & enter into cookie
if (enabletabpersistence==1) //if persistence feature turned on
setCookie(ulid, selectedtabid)
}

function getullistlinkbyId(ulid, tabcontentid){ //returns a tab link based on the ID of the associated tab content
var ullist=document.getElementById(ulid).getElementsByTagName("li")
for (var i=0; i<ullist.length; i++){
if (ullist[i].getElementsByTagName("a")[0].getAttribute("data-name")==tabcontentid){
return ullist[i].getElementsByTagName("a")[0]
break
}
}
}

function initializetabcontent(){
	// If the Tab needs to be selected based on Request URL - Begin
	var qsParm = new Array();
	qsParm['text'] = null;
	var query = document.location.search.substring(1);
	var parms = query.split('&');
	for (var i=0; i<parms.length; i++)
	{
		var pos = parms[i].indexOf('=');
		if (pos > 0)
		{
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			qsParm[key] = val;

		}
	}
	// If the Tab needs to be selected based on Request URL - Ends
	
	
	
	for (var i=0; i<arguments.length; i++)
	{ //loop through passed UL ids
		if (enabletabpersistence==0 && getCookie(arguments[i])!="") //clean up cookie if persist=off
			setCookie(arguments[i], "")
			var clickedontab=getCookie(arguments[i]) //retrieve ID of last clicked on tab from cookie, if any
			var ulobj=document.getElementById(arguments[i])
			var ulist=ulobj.getElementsByTagName("li") //array containing the LI elements within UL
			for (var x=0; x<ulist.length; x++)
			{ //loop through each LI element
				var ulistlink=ulist[x].getElementsByTagName("a")[0]
				if (ulistlink.getAttribute("data-name")){
					savetabcontentids(arguments[i], ulistlink.getAttribute("data-name")) //save id of each tab content as loop runs
					ulistlink.onclick=function(){
						expandcontent(this)
					return false
				}
				if (ulist[x].className=="selected" && clickedontab=="") //if a tab is set to be selected by default
					expandcontent(ulistlink) //auto load currenly selected tab content
				}
				// Request URL 
				if (qsParm['tab']){
					var ReqValue = qsParm['tab'] ;
					var RelValue = ulistlink.getAttribute("data-name");
					
				//	alert('ReqValue ,RelValue: ' + ReqValue +" , " + RelValue);
					if(ReqValue == RelValue){
						expandcontent(ulistlink);
						clickedontab="";
					}
				}				
			} //end inner for loop
		if (clickedontab!=""){ //if a tab has been previously clicked on per the cookie value
			var culistlink=getullistlinkbyId(arguments[i], clickedontab)
			if (typeof culistlink!="undefined") //if match found between tabcontent id and data-name attribute value
				expandcontent(culistlink) //auto load currenly selected tab content
			else //else if no match found between tabcontent id and data-name attribute value (cookie mis-association)
				expandcontent(ulist[0].getElementsByTagName("a")[0]) //just auto load first tab instead
		}
		


		
		
	} //end outer for loop
}


function getCookie(Name){ 
var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
if (document.cookie.match(re)) //if cookie found
return document.cookie.match(re)[0].split("=")[1] //return its value
return ""
}

function setCookie(name, value){
document.cookie = name+"="+value //cookie value is domain wide (path=/)
}

function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.className == 'pos_expand')
	  e.className = 'pos_normal';
   else
	  e.className = 'pos_expand';
}
function legal_visibility(id) {
   var e = document.getElementById(id);
   if(e.className == 'legal_expand')
	  e.className = 'legal_normal';
   else
	  e.className = 'legal_expand';
}
function changeClass(id)
{
	if(document.getElementById(id).className=='down_arrow')
	{
		document.getElementById(id).className = 'up_arrow';
	}
	else
	{
		document.getElementById(id).className = 'down_arrow';
	}
}