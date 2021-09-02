// const apiRoot = "http://app.qidz.com/api/v1/";
const url = window.location.protocol;

let apiRootLang ='';
const apiRoot = "https://qidz.mangoitsol.com/wp-json/qidz/v1";
if(url==='http:'){
	apiRootLang = "http://qidz.mangoitsol.com/wp-content/themes/wpreactqidz/qidz-ar.json";	
}
if(url==='https:'){
	apiRootLang = "https://qidz.mangoitsol.com/wp-content/themes/wpreactqidz/qidz-ar.json";
}

const setResourceHost = () => {
    return `${apiRoot}/`;
};
const resourceHost = setResourceHost();
const config = {
    resourceHost,
    apiRoot,
    apiRootLang,
    qidz: {
        endpoints: {
            homePageData: `${resourceHost}home_data`,
            cities: `${resourceHost}tenants`,
            eventDetail:`${resourceHost}activities`,
            addReviews:`${resourceHost}addReviews`,
            addFavourite:`${resourceHost}addFavourite`,
            modifiyActivity:`${resourceHost}modifiyActivity`,
			search:`${resourceHost}search`,		
            login:`${resourceHost}login`,
            register:`${resourceHost}register`,
            forgotPassword: `${resourceHost}forgotPassword`,
            reservation:`${resourceHost}reservation`,
            subBuckets: `${resourceHost}sub_buckets`,
			updateProfile: `${resourceHost}updateProfile`,
			userDetails: `${resourceHost}user_details`,
            socialLogin: `${resourceHost}socialLogin`,
			reservations: `${resourceHost}reservations`,			
            promoCode: `${resourceHost}promoCode`,
            reservationRynaTimeSlot: `${resourceHost}reservationRynaTimeSlot`,
            hotelReservation: `${resourceHost}hotelReservation`,
            getAvailability: `${resourceHost}getAvailability`,
        },
    },
	 page :{
        eventDetails:"event-details",
        search:"search",
        eventListing:"event-list",
		booking:"booking",
        collection: "collection-list",
        indoors: "indoors",
        outdoors: "outdoors",
        kidsCollection: "qids-collection",
		userProfile:"user-profile",
        favActivity:"favourite-activities",
		myBooking:"my-booking"
    },
	partnerId:116,
    partnerKey:"LejKKl54WeA8i",
    remoteIdentifier:"DUB58Al15opO5Wr",
	lang:"ar",
	eventVisible:12,
	googlemapKey:"AIzaSyB1gys8HmT1uZ_N93s5IP27OQj5xBKHe4k",
	fbAppId:"446448743314609",//"798484464090572",
	googleClientId:"640421600100-9ii53t08s89fv71dr0eag6h9u1etedt2.apps.googleusercontent.com",
	noReview:"There aren't any reviews for this activity yet. Be the first to write one!",
	appStoreUrl:"https://apps.apple.com/gb/app/qidz-uae-family-activities/id1265147563?utm_source=qidz_website&utm_medium=download_button&utm_campaign=qidz",
    googlePlayUrl:"https://play.google.com/store/apps/details?id=com.qidz&referrer=utm_source%3Dqidz_website%26utm_medium%3Ddownload_button%26utm_campaign%3Dqidz",
    
	options: {
        lines: 15,
        length: 10,
        width: 8,
        radius: 20,
        scale: 1.00,
        corners: 1,
        color: 'red',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 60,
        fps: 20,
        zIndex: 2e9,
        top: '50%',
        left: '50%',
        shadow: false,
        hwaccel: false,
        position: 'absolute'
    }
}
export default config;
