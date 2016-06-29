/*global Webshop, $*/

window.Webshop = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Helpers: {},
    init: function() {
        'use strict';

        //console.log('Hello from Backbone');

        /*var authTokenView = new Webshop.Views.AuthTokenView();
        authTokenView.render();*/

        setTimeout(function() {
        
            var userSectionView = new Webshop.Views.UserSectionView();
            userSectionView.render();

        }, 700);
    }
};

URL_PROPERTIES = {};

$(document).ready(function() {
    'use strict';

    URL_PROPERTIES = Webshop.Helpers.Utils;
    Webshop.init();
});
