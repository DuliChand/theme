/*global Webshop, Backbone*/

Webshop.Helpers = Webshop.Helpers || {};

(function() {
    'use strict';

    Webshop.Helpers = {
        BASE_URI: {

          
          //API:'http://52.90.180.2'
          API:'http://dev.fashionandyou.com'
        
        },
        API_URI: {
			CLICK_PIXLET_DATA :'/api/utm/business?operationType=findUtmPixels&utmSource',
            CLICK_THANK_PIXLET_DATA:'/api/utm/business?operationType=updatePixelFired',
            CLICK_STREAM_DATA: '/api/click/business?operationType=clickStreamData',
            CREATE_TOKEN: '/api/auth/business',
            STORE_CATEGORY: '/api/event/business?operationType=getStoredProducts&groupCategory={groupCategory}&tag={tag}',
            GET_CART: '/cartnew/api/getCart?_='+new Date().getTime(),
            NAV: '/search-new/web/menu',
            CHANGE_VARIANT: '/cartnew/api/changeVariant?_='+new Date().getTime(),
            POST_FEEDBACK : '/api/account/business?operationType=addFeedback&deviceId={deviceId}',
            CATEGORY_EVENTS: '/search-new/web/events?ptype={categoryName}',
            CATEGORY_EVENTS_PREVIEW : '/api/category/business?operationType=getLiveCategoryEvents&category={categoryName}&env=preview',
            FEATURED_PRODUCTS: '/api/event/business?operationType=getLiveFeaturedProducts',
            FEATURED_CATEGORIES: '/api/category/business?operationType=getLiveCategoriesFeatured',
            EVENT_PRODUCTS: '/search-new/products',
            CATEGORY_PRODUCTS: '/api/event/business?operationType=getLiveCategoryProducts',
            SKU_INVENTORY: '/inventory/api/getInventory',
            GET_PRODUCT: '/search-new/product/{title}/{vendorProductId}',
            ADD_PRODUCT: '/cartnew/api/addProduct?_='+new Date().getTime(),
            DELETE_PRODUCT: '/cartnew/api/deleteProduct?_='+new Date().getTime(),
            UPDATE_PRODUCT: '/cartnew/api/addProduct?_='+new Date().getTime(),
            ADD_FAVOURITE_PRODUCT: '/customer/favourite/add?customerId={customerId}&productId={productId}',
            DELIVERY_TIME: '/delivery/dsp/getDeliveryTime/{fromPincode}/{toPincode}/{tat}',
            SIZE_CHART:'/search-new/product/size-chart?webshopId={webshopId}',
            ADD_PRODUCT_BROWSING_HISTORY: '/api/account/business?operationType=addProductBrowsingHistory&deviceId={deviceId}',
            IS_FAVOURITE_PRODUCT: '/customer/favourite?customerId={customerId}&productId={productId}',
            REMOVE_FAVOURITE_PRODUCT: '/customer/favourite/remove?customerId={customerId}&productId={productId}',
            SERVICEABILITY: '/api/shipping/business?operationType=getPinCode&pinCode={pinCode}',
            GET_PRODUCT_BROWSING_HISTORY: '/api/account/business?operationType=getProductBrowsingHistory&deviceId={deviceId}',
            SIMILAR_EVENTS: '/api/event/business?operationType=getSimilarEvents&eventId={eventId}',
            IS_FAVOURITE_EVENT: '/customer/favourite/products?customerId={customerId}',
            REMOVE_FAVOURITE_EVENT: '/customer/favourite/remove?customerId={customerId}&productId={productId}',
            ADD_FAVOURITE_EVENT: '/customer/favourite/add?customerId={customerId}&productId={productId}',
            REGISTER_USER: '/api/account/business?operationType=registerCustomer&deviceId={deviceId}',
            SOCIAL_LOGIN: '/api/socialLogin/business?operationType=socialLogin',
            FORGOT_PASSWORD: '/api/account/business?operationType=forgotPassword&loginId={loginId}&deviceId={deviceId}',
            LOGIN_USER: '/api/login/business?operationType=login',
            LOGOUT_USER: '/api/login/business?operationType=logout&deviceId={deviceId}',
            GET_CREDIT_BALANCE: '/api/storedcredit/business?operationType=getCustomerCreditSum&customerId={customerId}&deviceId={deviceId}',
            REWARD_POINTS: '/api/account/business?operationType=getRewardsForCustomer&deviceId={deviceId}',
            APPLY_VOUCHER : '/api/cart/business?operationType=applyPromotion&promotionType={promotionType}&promotionValue={promotionValue}&deviceId={deviceId}',
            REMOVE_VOUCHER : '/api/cart/business?operationType=removePromotion&promotionType={promotionType}&promotionValue={promotionValue}&deviceId={deviceId}',
            GET_PERSONALIZE_VOUCHER: '/api/account/business?operationType=getCustomerAllVouchers&deviceId={deviceId}',
            CHECKOUT: '/api/cart/business?operationType=checkout&deviceId={deviceId}',
            GET_LAST_ORDER_ADDRESS: '/api/order/business?operationType=getLastOrderAddress&deviceId={deviceId}&customerId={customerId}',
            GET_CITY_STATE: '/api/shipping/business?operationType=getPinCode&pinCode={pinCode}',
            ADD_FAVORITE_BRANDS : '/api/account/business?operationType=insertCustomerFavouriteBrand&customerId={customerId}&deviceId={deviceId}',
            GET_CUSTOMER_STYLES : '/api/account/business?operationType=getStyleGuides&deviceId={deviceId}',
            VALIDATE_CART_ON_PAYMENT : '/api/cart/business?operationType=validateCartOnPayment&paymentChannel={paymentChannel}&deviceId={deviceId}',
            GET_CUSTOMER : '/api/account/business?operationType=getCustomer&deviceId={deviceId}',
            GET_FAVORITE_BRANDS : '/api/account/business?operationType=getFavouriteBrands&deviceId={deviceId}',
            CUSTOMER_RECENTLY_BROWSED : '/api/account/business?operationType=getCustomerHistory&customerId={customerId}',
            SIZE_GUIDE : '/api/product/business?operationType=insertCustomerSize',
            RESET_PASSWORD : '/api/account/business?operationType=resetPassword&loginId={loginId}&deviceId={deviceId}',
            UPDATE_CUSTOMER : '/api/account/business?operationType=updateCustomer&deviceId={deviceId}',
            SUBSCRIPTION : '/api/account/business?operationType=subscribeServices&loginId={loginId}&deviceId={deviceId}',
            ADD_CUSTOMER_STYLE_PREFERENCES : '/api/account/business?operationType=addCustomerStylePreference&deviceId={deviceId}',
            GET_SUBSCRIPTION_CHANNEL : '/api/account/business?operationType=getSubscriptionServices&deviceId={deviceId}',
            LINK_ACCOUNTS : '/api/account/business?operationType=linkOtherAccounts&deviceId={deviceId}&customerId={customerId}&otherEmail={email}&sourceCode={sourceCode}',
            STORED_CREDITS : '/api/storedcredit/business?operationType=getCustomerStoredCredit&customerId={customerId}&deviceId={deviceId}',
            GET_LAST_ORDER : '/api/order/business?operationType=getLastOrder&deviceId={deviceId}&customerId={customerId}',
            ORDER_LINE : '/api/order/business?operationType=getOrderByNumber&&deviceId={deviceId}&orderNumber={orderNumber}',
            ORDER_SHIPMENT_TRACK : '/api/order/business?operationType=getAggregatedShipmentTrack&orderId={orderId}&deviceId={deviceId}',
            GET_PAST_ORDERS : '/api/order/business?operationType=getOrderHistory&deviceId={deviceId}&condition=DELIVERED',
            GET_RECENT_ORDERS : '/api/order/business?operationType=getOrderHistory&deviceId={deviceId}&condition=RECENT',
            SHIPMENT_TRACK : '/order/track/v1/track/orderline/{orderLineId}',
            ORDER_CANCEL : '/order/api/v1/order/getCancelScreenData/{orderNumber}/{orderLineId}',
            GET_CANCEL_ORDER : '/order/api/v1/order/customerCancel/{deviceId}/{orderNumber}/{orderLineId}',
            ACCEPTED_INVITE : '/api/account/business?operationType=acceptedInvites&customerId={customerId}&deviceId={deviceId}',
            OPEN_INVITATION : '/api/account/business?operationType=getCustomerInvitees&customerId={customerId}&deviceId={deviceId}',
            SEND_INVITE : '/api/account/business?operationType=sendInvite&deviceId={deviceId}',
            GET_FAVOURITES : '/customer/favourite/products/list?customerId={customerId}',
            GET_FAVOURITE_EVENT : '/customer/favourite/products/list?customerId={customerId}',
            GET_FAVOURITE_PRODUCT : '/customer/favourite/products/list?customerId={customerId}',
            REMOVE_FAVOURITES : '/customer/favourite/remove?customerId={customerId}&productId={productId}',
            STORED_CREDITS_STATEMENT : '/api/storedcredit/business?operationType=getCreditStatement&customerId={customerId}&month={month}&year={year}',
            GET_GLOBAL_VOUCHER : '/api/voucher/business?operationType=getAllGlobalVouchers',
			ORDER_SUMMARY :'/api/order/business?operationType=getAggregatedInboundOrder&deviceId={deviceId}&orderNumber={orderNumber}',
			AGGR_ORDER : '/api/order/business?operationType=getAggregatedOrder&deviceId={deviceId}&orderId={orderNumber}',
            TOP_KEYWORDS : '/api/search/business?operationType=getTopSearchTerms',
            SEARCH_RESULT : '/api/search/business?operationType=performSearch&searchOps=product&size={size}&from={from}',
            SEARCH_EVENTS_RESULT : '/api/search/business?operationType=performSearch&searchOps=event&size={size}&from={from}',
            INVITE_REGISTRATION : '/api/account/business?operationType=inviteRegistration&customerId={customerId}&invitedEmailId={invitedEmailId}&deviceId={deviceId}',
            CCE_LOGIN : '/api/login/business?operationType=cceLogin&customerLoginId={customerLoginId}',
            CCE_LOGIN_LOG : '/api/login/business?operationType=captureCCEOrder&customerLoginId={customerLoginId}&orderNumber={orderNumber}',
            GET_RETURNABLE_ORDERS : '/api/cir/business?operationType=getOrderHistoryCir&customerId={customerId}&condition=RECENT',
            CREATE_RETURN_REQUEST : '/api/cir/business?operationType=createReturnRequest',
            RETURN_PRODUCT_IMAGE_UPLOAD : '/api/cir/business?operationType=imageUpload',
            GET_RETURN_REQUEST_STATUS : '/api/cir/business?operationType=getReturnRequestStatusByOrderLineId&orderLineId={orderLineId}',
            REASON_FOR_RETURN : '/api/cir/business?operationType=getReasonForReturn',
			APPLY_NEW_VOCHER : '/cartnew/api/applyVouchers?_='+new Date().getTime(),
			REMOVE_NEW_VOCHER : '/cartnew/api/removeVouchers?_='+new Date().getTime(),
			APPLY_SOTRECREDITS : '/cartnew/api/applyCredit?_='+new Date().getTime(),
			REMOVE_SOTRECREDITS : '/cartnew/api/removeCredit?_='+new Date().getTime(),
			CHECK_SOLD_OUT : '/cartnew/api/checkSoldOut/deviceId/{deviceId}',
			CHECKOUT_URL : '/webfront/checkout/checkout-page?deviceId={deviceId}'
			
        },
        Utils: {
            get: function(name) {
                if (typeof(name) != "undefined") {
                    return Webshop.Helpers.BASE_URI.API + Webshop.Helpers.API_URI[name];
                } else {
                    return "test";
                }
            },
            getCookie: function(name) {
                if (typeof(name) != "undefined") {
                    return COOKIES[name];
                }
            }
        }
    }
})();




