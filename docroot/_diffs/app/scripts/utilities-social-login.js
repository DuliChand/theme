window.fbAsyncInit = function(){
         var em ="sjs";
         FB.init({
          appId:'311689739016067',
          status: true, 
          cookie: true,
          xfbml: true,
          oauth: true
         });      
};

function fbLoad(d){
 // This function load the Facebook API
    var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
    //alert("fb loaded");
}

function fbAuthCheck(func) {
  FB.login(function(response) {
    if (response.authResponse) {
  FB.api('/me', function(response) {  
   if (response.email == null || response.email == "" || response.id == null  || response.id == "" || response.first_name == null || response.first_name == ""){
    alert("Couldn't get proper information from facebook! Kindly try again!");
    location.href = 'http://' + window.location.host;
   }
   else{
    if(response.last_name == null || response.last_name == ""){
     response.last_name = response.first_name;
    } if (response.gender == "Unspecified"){
     response.gender= "Female";
    }
    func(response);
   }
  });
    } else {
    	location.href = 'http://' + window.location.host;
    }
 }, {
    scope : 'email'
   });
  }
 
function googleLoad() {
	// This function load the Google API
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	  	po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}

function googleAuthCheck(func) {
	var additionalParams = {
			'clientid' : '845825255863-22cvfh7m02bd3grtcgapje14c6mct0h4.apps.googleusercontent.com',
			'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
			'cookiepolicy' : 'single_host_origin',
			'callback': function(authResult){
				if (authResult && !authResult.error) {
					gapi.client.load('plus', 'v1', function() {
					    var request = gapi.client.plus.people.get({
					      'userId': 'me'
					    });
					    request.execute(function(response) {
					    	func(response);
					    });
					});
				}
			}
	};
	gapi.auth.signIn(additionalParams);
}