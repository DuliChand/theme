/*(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();*/


var shareBox;

function socialShare(e, data) {
	
	var url = encodeURIComponent(data.url),
        title = encodeURIComponent(data.title),
        imgURL = encodeURIComponent(data.imageUrl),
        description = encodeURIComponent(data.description),
        nw = data.handlerName,
        popupURL,
        popupName;
	
    switch (nw) {
        case 'facebook':
        	
        	var redirectURI = encodeURIComponent(window.location.origin + '/close');
        	popupName = 'facebook';
        	popupURL = [
                'https://www.facebook.com/dialog/feed?app_id=',
                '311689739016067',
                '&display=',
                'popup',
                '&caption=',
                'FashionAndYou',
                '&picture=',
                imgURL,
                '&description=',
                description,
                '&redirect_uri=',
                redirectURI,
                '&link=',
                url,
                '&name=',
                title
            ].join('');
            break;
            
        case 'twitter':
        	popupName = 'twitter';
        	popupURL = [
                'https://twitter.com/share?text=',
                description,
                '&url=',
                url
            ].join('');
            break;
        case 'pinterest':
        	popupName = 'pinterest';
        	popupURL = [
                'http://www.pinterest.com/pin/create/button/?url=',
                url,
                '&media=',
                imgURL,
                '&description=',
                title,
                ' | ',
                description
            ].join('');
            break;
        case 'googleplus':
        	popupName = 'googleplus';
        	popupURL = [
                'https://plus.google.com/share?url=',
                url/*,
                '&media=',
                imgURL,
                '&description=',
                description*/
            ].join('');
            break;
        case 'email':
        	popupName = 'email';
        	popupURL = [
                'mailto:?Subject=',
                title,
                '&Body=',
                description,
                '%0D',
                 url
            ].join('');
            break;
    }
    if (popupURL && popupName === 'email') {
        
    	shareBox = window.open(popupURL, popupName, 'width=626,height=436');
        setTimeout(function(){ shareBox.close() }, 1000);
        
    } else {
    	
    	shareBox = window.open(popupURL, popupName, 'width=626,height=436');
    }
    
}