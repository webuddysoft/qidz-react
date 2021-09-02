const { render } = wp.element;
import App from './App';
import config from './config';
import {isMobile} from 'react-device-detect';
import BrowseByCategory from "./components/BrowseByCategory";
import EventDetails from './components/EventDetails';
import SearchDetails from './components/SearchDetails';
import EventList from './components/EventList';
import Booking from './components/Booking';
// import Header from './components/Header';
import CollectionList from './components/CollectionList';
import IndoorsOutdoors from './components/IndoorsOutdoors';
import UserProfile from './components/UserProfile';
import Favrouite from './components/Favrouite';
import Static from './components/Static';
import MyBooking from './components/MyBooking';
import LoginMobileSection from './components/LoginMobileSection';
import axios from "axios";
console.log(isMobile,'isMobile');
window.$ = window.jQuery = require('jquery');

const hrefUrl = window.location.href;
const splitHref=hrefUrl.split('/');;

if(!localStorage.getItem('languageId') && splitHref[3]=='en'){
  localStorage.setItem('languageId','en')  
}else{
	if(splitHref[3]=='ar'){
	localStorage.setItem('languageId','ar') 
	}
  if(splitHref[3]=='en'){
	localStorage.setItem('languageId','en') 
	}
}
if(!localStorage.getItem('cityId') && splitHref[3]=='en'){
  localStorage.setItem('cityId',1)
  localStorage.setItem('city','Dubai')
  localStorage.setItem('lang','["en"]')
}else{
	if(splitHref[3]=='ar'){
    if(localStorage.getItem('cityId')==null || localStorage.getItem('cityId')==''){
      localStorage.setItem('cityId',2)
      localStorage.setItem('city','Riyadh')
      localStorage.setItem('lang','["en","ar"]')
    }
	 
	}
}

const url = window.location.pathname;
var parts = url.split("/");
var last_part = parts[parts.length - 2];
//localStorage.setItem('languageId',last_part);
let staticLanguage='';
 axios.get(config.apiRootLang, {
  })
      .then((response) => {
        staticLanguage=response.data;
		console.log(staticLanguage,'staticLanguage');
        if (last_part === config.page.eventDetails) {
            render(<EventDetails staticLanguage={staticLanguage}/>, document.getElementById('event-root'));
          } else if (last_part === config.page.search) {
            render(<SearchDetails staticLanguage={staticLanguage}/>, document.getElementById('search-root'));
          } else if (last_part === config.page.eventListing) {
            render(<EventList staticLanguage={staticLanguage} />, document.getElementById('eventlist-root'));
          } else if (last_part === config.page.booking) {
            render(<Booking staticLanguage={staticLanguage}/>, document.getElementById('booking-root'));
          } else if (last_part === config.page.collection) {
            render(<CollectionList staticLanguage={staticLanguage}/>, document.getElementById('collection-root'));
          } else if (last_part === config.page.indoors || last_part === config.page.outdoors) {
            render(<IndoorsOutdoors staticLanguage={staticLanguage}/>, document.getElementById('inoutdoors-root'));
          } else if (last_part === config.page.kidsCollection) {
            render(<CollectionList staticLanguage={staticLanguage}/>, document.getElementById('collection-root'));
          } else if (last_part === config.page.userProfile) {
            render(<UserProfile staticLanguage={staticLanguage}/>, document.getElementById('userprofile-root'));
          }else if (last_part === config.page.favActivity) {
            render(<Favrouite staticLanguage={staticLanguage}/>, document.getElementById('favactivity-root'));
          }else if (last_part === config.page.myBooking) {
            render(<MyBooking staticLanguage={staticLanguage}/>, document.getElementById('myBooking-root'));
          } else if (last_part === '' || last_part === 'ar'  || last_part === 'en') {
            render(<App staticLanguage={staticLanguage} />, document.getElementById('root'));
          }else{
            render(<Static staticLanguage={staticLanguage} />, document.getElementById('static-root'));
          }
         // if (isMobile) {
            render(<LoginMobileSection staticLanguage={staticLanguage}/>, document.getElementById('login-root'));
         // }
      })
      .catch((error) => {
          console.log(error);
      })
// render(<Header />, document.getElementById('header-root'));


