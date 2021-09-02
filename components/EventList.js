import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
// import ReactStars from "react-rating-stars-component";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader'
import moment from 'moment/moment'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'

const queryString = require('query-string')
const params = queryString.parse(location.search)

class EventList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      BucketData: [],
      isFetching: true,
      Activities: [],
      adBanners: [],
      BucketName: '',
      itemsToShow: 9,
      location: '',
      ageFromErrorMessage:'',
      eventListVisible: config.eventVisible,
      adBannerVisibile: config.eventVisible,
      loaded: false,
      cityData: '',
      mainData: '',
      parentCategories: '',
      categories: '',
      ages: '',
      lookingForVisible: 5,
      activityTypeVisible: 5,
      isDeals: false,
      free: false,
      buy_now: false,
      dealsactive: false,
      freeactive: false,
      buy_nowactive: false,
      isIndoor: false,
      isOutdoor: false,
      isBoth: false,
      indoorActive: false,
      outdoorActive: false,
      bothActive: false,
      lat: '',
      lng: '',
      ageFromList: [],
      ageToList: [],
      cityErrorMessage: '',
      date: new Date(),
      nearme: false,
      parentCategoryList: [],
      locationName: '',
      city: localStorage.getItem('city'),
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
    //this.parentCategoryList = [];
    this.categoryList = []
  }

  componentDidMount () {
    this.cities()
    this.getLeftSectionDataForSearching()
    if (params && params.bucketId && params.bucketId != '') {
      this.getEventList()
    }
    if (params && params.collectionId && params.collectionId != '') {
      this.getCollectionBucketList(params.collectionId)
    }
    if (params && params.bannerId && params.bannerId != '') {
      this.getCollectionBucketList(params.bannerId)
    }
  }
  getEventList () {
    let banners = []
    let ads = []
    const language = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    this.setState({loaded:false});
    axios
      .post(
        config.qidz.endpoints.homePageData +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          language,
        {
          data: {},
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
          console.log(response,'event list');
        if (response.data) {
          response.data.buckets.map((bucket, i) => {
            if (bucket.id == params.bucketId) {
              this.setState({
                Activities: bucket.activities,
                isFetching: false,
                BucketName: bucket.name,
                loaded: true
              })
            }
          })

          response.data.ad_banners.map((ads, i) => {
            if (ads.bucket == params.adId) {
              banners.push({ image: ads.image })
              this.setState({
                adBanners: banners
              })
            }
          })
          this.setState({ loaded: true});
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  getCollectionBucketList (id) {
    const language = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    axios
      .get(
        config.qidz.endpoints.subBuckets +
          '?subBucket_id=' +
          id +
          '&tenant_id=' +
          tenant_id +
          '&locale=' +
          language,
        {
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
        console.log(response.data.activities,'response.data.activities');
        this.setState({
          Activities: response.data.activities,
          isFetching: false,
          BucketName: response.data.name,
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchResult () {
    const language = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    let ageList =[];
    if(this.state.ageFromList!='' && this.state.ageToList!=''){
       ageList = this.rangeBetween(
        parseInt(this.state.ageFromList),
        parseInt(this.state.ageToList)
      )
   }
    let parent_category_id = { parent_category_id: params.parentcategory }
    let body = {
      with_companies: false,
      with_qidz_tour_items: true,
      date: params.startDate
        ? moment(params.startDate).format('YYYY-MM-DD')
        : this.state.startDate
        ? moment(this.state.startDate).format('YYYY-MM-DD')
        : null,
      end_date: params.endDate
        ? moment(params.endDate).format('YYYY-MM-DD')
        : null,
      q: this.state.searchText,
      order: 'average_rating',
      environment: this.state.environment,
      category_ids: params.category
        ? [params.category]
        : this.state.parentCategoryList,
      sub_category_ids: [],
      ages_list: ageList ? ageList : params.age,
      //parent_category_id: 1,
      time_of_day: params.day,
      free_or_paid: this.state.free
        ? this.state.free
        : this.state.book_now
        ? this.state.book_now
        : null,
      is_deal: this.state.isDeals ? true : false,
      city: this.state.cityId
        ? this.state.cityId
        : localStorage.getItem('cityId'),
      book_now: this.state.buy_now ? true : false,
      area_ids: [this.state.location],
      bounds: false,
      is_class_or_workshop: null,
      coordinates: null,
      delta_coordinates: null,
      latitude: this.state.lat ? this.state.lat : null,
      longitude: this.state.lng ? this.state.lng : null
    }
    body = Object.assign(body, parent_category_id)
    axios
      .post(
        config.qidz.endpoints.search +
          '?tenantId=' +
          tenant_id +
          '&locale=' +
          language,
        {
          data: body
        }
      )
      .then(response => {
        this.setState({
          Activities: response.data.activities,
          isFetching: false,
          BucketName: '',
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  rangeBetween (start, end) {
    let resarrult = []
    if (start > end) {
      var arr = new Array(start - end + 1)
      for (var i = 0; i < arr.length; i++, start--) {
        resarrult[i] = start
      }
      return arr
    } else {
      var arro = new Array(end - start + 1)

      for (var j = 0; j < arro.length; j++, start++) {
        arro[j] = start
      }
      return arro
    }
  }

  onsearchText (value) {
    this.setState({ searchText: value })
  }

  locationChange (e) {
    var index = e.target.selectedIndex
    var optionElement = e.target.childNodes[index]
    var option = optionElement.getAttribute('data-id')
    this.setState({ location: option, locationName: e.target.value })
    // this.searchResult();
    // this.bannerResult();
  }
  searchData (event) {
    if (this.state.ageFromErrorMessage === '' ) {
    this.setState(
      { searchButton: event.target.value, loaded: false, optionTop: '90%' },
      this.searchResult
    )
    }
  }
  clearAll () {
    this.setState(
      {
        loaded: false,
        freeactive: false,
        free: '',
        buy_now: '',
        isDeals: false,
        dealsactive: false,
        buy_nowactive: false,
        startDate: '',
        searchText: '',
        indoorActive: false,
        outdoorActive: false,
        bothActive: false,
        location: '',
        ageFromList: [],
        ageToList: [],
        locationName: '',
        parentCategoryList: [],
        environment: 'both'
      },
      this.searchResult
    )
  }
  getLeftSectionDataForSearching () {
    const tenant_id = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    console.log(language,'aaaaaaaaaaa',tenant_id);
    axios
      .post(
        config.qidz.endpoints.homePageData +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          language,
        {
          data: {},
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
        this.setState({
          mainData: response.data,
          parentCategories: response.data.parent_categories,
          categories: response.data.categories,
          ages: response.data.ages,
          areas: response.data.areas
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  cities () {
    axios
      .get(config.qidz.endpoints.cities, {
        // + "?latitude=37.33233141&longitude=-122.0312186&ad_banners=true&tenant_id=1&locale='en'&level0=true", {
        data: {},
        headers: {
          accept: 'application/json'
        }
      })
      .then(response => {
        this.setState({
          cityData: response.data
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onchangeDeals (event, name) {
    if (event.target.value == 'false') {
      this.setState({ isDeals: true, dealsactive: true })
    } else {
      this.setState({ isDeals: false, dealsactive: false })
    }
  }
  onchangeFree (event, name) {
    if (event.target.value == 'false') {
      this.setState({ free: 'free', freeactive: true })
    } else {
      this.setState({ free: false, freeactive: false })
    }
  }
  onchangeBuyNow (event, name) {
    if (event.target.value == 'false') {
      this.setState({ buy_now: true, buy_nowactive: true })
    } else {
      this.setState({ buy_now: false, buy_nowactive: false })
    }
    // this.searchResult();
  }
  onChangeIndoor (event, name) {
    if (event.target.value == 'false') {
      this.setState({
        environment: 'indoor',
        indoorActive: true,
        outdoorActive: false,
        bothActive: false
      })
    } else {
      this.setState({ environment: '', indoorActive: false })
    }
  }
  onChangeOutdoor (event, name) {
    if (event.target.value == 'false') {
      this.setState({
        environment: 'outdoor',
        outdoorActive: true,
        indoorActive: false,
        bothActive: false
      })
    } else {
      this.setState({ environment: '', outdoorActive: false })
    }
  }
  onChangeBoth (event, name) {
    if (event.target.value == 'false') {
      this.setState({
        environment: 'both',
        bothActive: true,
        indoorActive: false,
        outdoorActive: false
      })
    } else {
      this.setState({ environment: '', bothActive: false })
    }
  }
  // onchangeLookingWhatData(event, name) {
  //     if (name === 'indoor') {
  //         this.setState({ environment: 'indoor', indoorActive: true });
  //     } else {
  //         this.setState({ indoorActive: false });
  //     }
  //     if (name === 'outdoor') {
  //         this.setState({ environment: 'outdoor', outdoorActive: true });
  //     } else {
  //         this.setState({ outdoorActive: false });
  //     }
  //     if (name === 'both') {
  //         this.setState({ environment: 'both', bothActive: true });
  //     } else {
  //         this.setState({ bothActive: false });
  //     }
  //     //this.searchResult();
  // }
  onAgeFromChange (event) {
    if (parseInt(event.target.value) > parseInt(this.state.ageToList)) {
      this.setState({
        ageFromList: event.target.value,
        ageFromErrorMessage: 'From age must be less than to age'
      })
    } else {
      this.setState({
        ageFromList: event.target.value,
        ageFromErrorMessage: ''
      })
    }
  }
  onAgeToChange (event) {
    if (this.state.ageFromList.length == 0) {
      this.setState({
        ageToList: event.target.value,
        ageFromErrorMessage: 'Please select from age'
      })
    }
    if (parseInt(this.state.ageFromList) > parseInt(event.target.value)) {
      this.setState({
        ageToList: event.target.value,
        ageFromErrorMessage: 'To age must be greater than from age'
      })
    } else {
      this.setState({ ageToList: event.target.value, ageFromErrorMessage: '' })
    }
  }
  onChangeLookingForData (e, s) {
    const checkedBoxes = [...this.state.parentCategoryList]
    if (e.target.checked) {
      checkedBoxes.push(s.id)
    } else {
      const index = checkedBoxes.findIndex(ch => ch === s.id)
      checkedBoxes.splice(index, 1)
    }
    this.setState({ parentCategoryList: checkedBoxes })
  }
  onChangeActivityTypeData (e, s) {
    const checkedBoxes = [...this.state.parentCategoryList]
    if (e.target.checked) {
      checkedBoxes.push(s.id)
    } else {
      const index = checkedBoxes.findIndex(ch => ch === s.id)
      checkedBoxes.splice(index, 1)
    }
    this.setState({ parentCategoryList: checkedBoxes })
  }
  getLookingContentData () {
    const { parentCategories, parentCategoryList } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    console.log(
      parentCategories,
      'parentCategoryList',
      this.state.lookingForVisible
    )
    return (
      <div className='first-field field-area check_area'>
        <label>
          {languageId === config.lang
            ? staticLanguage.common.select_location
            : 'Looking For'}
        </label>
        {parentCategories &&
          parentCategories
            .slice(0, this.state.lookingForVisible)
            .map((pc, i) => {
              return (
                <div className='custom-checkbox'>
                  <label className='control control--checkbox'>
                    {pc.name}
                    {/* <input type="checkbox" checked={lookingChecked == pc.id ? checkedStatus : false}  onChange={(e) => this.onChangeLookingForData(e,pc.id)} /> */}
                    <input
                      type='checkbox'
                      id={`sensor${pc.id}`}
                      name='sensorId'
                      checked={
                        parentCategoryList.length > 0 &&
                        parentCategoryList.find(ch => parseInt(ch) === pc.id)
                      }
                      onChange={e => this.onChangeLookingForData(e, pc)}
                    />
                    <div className='control__indicator'></div>
                  </label>
                </div>
              )
            })}
        <div>
          <a href onClick={() => this.showMoreLooking()}>
            {this.state.lookingForVisible <= parentCategories.length
              ? languageId === config.lang
                ? staticLanguage.common.showmore
                : 'Show More'
              : ''}
          </a>
        </div>
      </div>
    )
  }
  getActivityTypeContentData () {
    const { categories, parentCategoryList } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='first-field field-area check_area'>
        <label>
          {languageId === config.lang
            ? staticLanguage.common.select_location
            : 'Activity Type'}
        </label>
        {categories.length > 0 &&
          categories.slice(0, this.state.activityTypeVisible).map((c, i) => {
            return (
              <>
                <div className='custom-checkbox'>
                  <label className='control control--checkbox'>
                    {c.name}
                    {/* <input type="checkbox" value={c.id} onChange={(e) => this.onChangeActivityTypeData(e)} /> */}
                    <input
                      type='checkbox'
                      id={`activity${c.id}`}
                      name='sensorId'
                      checked={
                        parentCategoryList.length > 0 &&
                        parentCategoryList.find(ch => ch.id === c.id)
                      }
                      onChange={e => this.onChangeActivityTypeData(e, c)}
                    />
                    <div className='control__indicator'></div>
                  </label>
                </div>
              </>
            )
          })}
        <div>
          <a href onClick={() => this.showMoreActivity()}>
            {this.state.activityTypeVisible <= categories.length
              ? languageId === config.lang
                ? staticLanguage.common.showmore
                : 'Show More'
              : ''}
          </a>
        </div>
      </div>
    )
  }
  getMoreOptionContentData () {
    return (
      <div className='first-field field-area check_area'>
        <label>More Options</label>
        <div className='custom-checkbox'>
          <label className='control control--checkbox'>
            Halloween
            <input type='checkbox' checked='checked' />
            <div className='control__indicator'></div>
          </label>
        </div>
        <div className='custom-checkbox'>
          <label className='control control--checkbox'>
            Halloween
            <input type='checkbox' checked='checked' />
            <div className='control__indicator'></div>
          </label>
        </div>
      </div>
    )
  }
  showMoreLooking () {
    const { parentCategories, lookingForVisible } = this.state
    this.setState({ lookingForVisible: parentCategories.length + 5  })
  }
  showMoreActivity () {
    const { categories, activityTypeVisible } = this.state
    this.setState({ activityTypeVisible: categories.length + 5  })
  }
  getNearMeLocation (event) {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        // Create the object to update this.state.mapRegion through the onRegionChange function
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.setState({
          lat: region.latitude,
          lng: region.longitude,
          nearme: true
        })
      },
      error => console.log(error)
    )
    // this.searchResult();
  }
  seeMoreEventResult () {
    const { Activities, eventListVisible } = this.state
    if (Activities && Activities.length === eventListVisible) {
      this.setState({ eventListVisible: config.eventVisible })
    } else {
      this.setState(old => {
        return { eventListVisible: old.eventListVisible + config.eventVisible }
      })
    }
  }
  seeMoreAdBannerResult () {
    const { adBanners, adBannerVisibile } = this.state
    if (adBanners && adBanners.length === adBannerVisibile) {
      this.setState({ adBannerVisibile: config.adBannerVisibile })
    } else {
      this.setState(old => {
        return {
          adBannerVisibile: old.adBannerVisibile + config.adBannerVisibile
        }
      })
    }
  }

  displayEventList () {
    const {
      eventListVisible,
      adBannerVisibile,
      Activities,
      adBanners
    } = this.state
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    const eventData =
      Activities &&
      Activities.length > 0 &&
      Activities.slice(0, eventListVisible).map((activity, i) => {
        return (
          <div className='col-md-4'>
            <div className='event-list-item'>
              <div className='event-img'>
                <a href={`event-details?activityId=${activity.id}`}>
                  <img
                    src={activity.attachment_large.replace('q_30', 'q_80')}
                  />
                </a>
                {activity.has_deal && activity.has_deal == true ? (
                  <div className='ribbon'>
                    <span className='badge_tag'>DEAL</span>
                  </div>
                ) : (
                  activity.free_activity && activity.free_activity == true ? <div className='ribbon'>
                  <span className='badge_tag'>FREE</span>
                </div>:""
                )}
              </div>
              <div className='event-list-detail'>
                <a href={`event-details?activityId=${activity.id}`}>
                  <h3>{activity.name.substring(0, 50)}</h3>
                </a>
                <div className='event_btm_des'>
                  <div className='event_list_cat_section'>
                    <span className='small_text'>{activity.area_name}</span>

                    <div className='review'>
                      {/* <ReactStars
                                            count={5}
                                            value={activity.average_rating}
                                            size={20}
                                            isHalf={true}
                                            activeColor="#ffd700"
                                        /> */}
                      {activity.average_rating &&
                      activity.average_rating != undefined && (
                        <StarRatings
                          rating={parseInt(activity.average_rating)}
                          starRatedColor='#ffd700'
                          numberOfStars={5}
                          name='rating'
                          starDimension='15px'
                          starSpacing='5px'
                        />
                      )}
                    </div>
                  </div>
                  <div className='event_list_price'>
                    {activity.original_price && (
                      <span className='dis_price'>
                        {currency}{' '}
                        {activity.original_price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                    {activity.price && (
                      <span className='main_price'>
                        {currency} {activity.price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                  </div>
                  <div className='event_list_btn'>
                    {activity.original_price || activity.price ? (
                      <button
                        type='button'
                        onClick={() =>
                          this.booking(activity.id, activity.ticket_url)
                        }
                        className='btn bn_btn'
                      >
                        {activity.book_now_button}!
                      </button>
                    ) : activity.has_youtube_url == true ? (
                      <button
                        type='button'
                        onClick={() => this.youtube(activity.youtube_url)}
                        className='btn bn_btn'
                      >
                        Youtube
                      </button>
                    ) : (
                      ''
                    )}
                    <button
                      type='button'
                      onClick={() => this.eventDetails(activity.id)}
                      className='btn rm_btn'
                    >
                      {languageId === config.lang
                        ? staticLanguage.common.readmore
                        : 'Read More'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })

    const adBannerData =
      adBanners &&
      adBanners.length > 0 &&
      adBanners.slice(0, adBannerVisibile).map((ads, i) => {
        return (
          <div className='col-md-4'>
            <div className='event-list-item'>
              <div className='event-img'>
                <a href>
                  <img src={ads.image} />
                </a>
              </div>
            </div>
          </div>
        )
      })

    return (
      <div className='event-list-category'>
        {params && params.bucketId && params.bucketId != '' && (
          <div className='events_main_heading'>
            <h2>{this.state.BucketName}</h2>
          </div>
        )}
        <div className='row'>
          {eventData ? (
            eventData
          ) : (
            <div className='no_data'>
              {languageId === config.lang
              ? staticLanguage.common.no_event
              : 'No event found'}</div>
          )}
          {Activities && eventListVisible < Activities.length && (
            <div className='show_more_btn'>
              <button
                type='button'
                className='see_more_btn'
                onClick={e => this.seeMoreEventResult(e)}
              >
                {languageId === config.lang
                ? staticLanguage.common.seemore
                : 'See More'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  setStartDate (date) {
    this.setState({ startDate: date })
  }
  eventDetails (activityId) {
    window.open('event-details?activityId=' + activityId, '_self')
  }
  booking (activityId, ticket_url) {
    if (ticket_url != '' && ticket_url != null) {
      window.open(ticket_url, '_blank')
    } else {
      window.open('booking?activityId=' + activityId, '_self')
    }
  }
  youtube (youtube_url) {
    window.open(youtube_url, '_blank')
  }

  
  getHeader () {
    const languageId = localStorage.getItem('languageId')
      return (
        <div class='top-header'>
          <div class='container'>
            <div class='top-header-inner row'>
              <DownloadSection staticLanguage={this.state.staticLanguage} />
              <div class='top-header-right col-md-6'>
                <LoginSection staticLanguage={this.state.staticLanguage} />
                <div class='country_field'>
                  <div class='form-group'>
                    <select
                      id='mySelect'
                      class='form-control'
                      value={this.state.city}
                      onChange={e => this.changeCityData(e)}
                    >
                      {this.state.cityData &&
                        this.state.cityData.map((cities, i) => (
                          <option
                            id={languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en}
                            key={languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en}
                              value={cities.name}
                            data-id={cities.id}
                            data-available_locales={cities.available_locales}
                            data-currency={cities.currency}
                          >
                           {languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div class='language_field'>
                  <div
                    class='trp-language-switcher trp-language-switcher-container'
                    data-no-translation='' >
                    <select
                      id='mySelect'
                      value={this.state.languageId}
                      class='form-control'
                      onChange={e => this.changeLanguage(e)}>
                      {this.state.language && (
                        this.state.language.map((lg, i) => (
                          <option value={lg}>
                          {lg}
                        </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  changeLanguage (event) {
   
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false,languageId:event.target.value })
    //getLeftSectionDataForSearching();
    if (params && params.bucketId && params.bucketId != '') {
      this.getEventList()
    }
    if (params && params.collectionId && params.collectionId != '') {
      this.getCollectionBucketList(params.collectionId)
    }
    if (params && params.bannerId && params.bannerId != '') {
      this.getCollectionBucketList(params.bannerId)
    }
    const nextTitle = 'My new page title'
    const nextState = { additionalInformation: 'Updated the URL with JS' }
    if(event.target.value===config.lang){
      window.history.pushState(nextState, nextTitle, window.location.href.replace('/en', '/ar'));
     
  }else{
      window.history.pushState(nextState, nextTitle, window.location.href.replace('/ar', '/en'));
  }
  window.location.reload();
  }
  changeCityData (event) {
    var index = event.target.selectedIndex;
    var optionElement =event.target.childNodes[index]
    var currency = optionElement.getAttribute('data-currency');
    var available_locales = optionElement.getAttribute('data-available_locales');
    var cityId = optionElement.getAttribute('data-id');

    let cityName = event.target.value
    localStorage.setItem('city', cityName)
    localStorage.setItem('cityId', cityId)
    localStorage.setItem('currency', currency)
    let lang = available_locales.split(',')
    this.setState({ language: lang, city: cityName })
    localStorage.setItem('lang', JSON.stringify(lang))
   // localStorage.setItem('languageId', lang[0])
    this.setState({ loaded: false,languageId:lang[0] })
    this.setState({ loaded: false })
    //this.getLeftSectionDataForSearching();
    // if (params && params.bucketId && params.bucketId != '') {
    //   this.getEventList()
    // }
    // if (params && params.collectionId && params.collectionId != '') {
    //   this.getCollectionBucketList(params.collectionId)
    // }
    // if (params && params.bannerId && params.bannerId != '') {
    //   this.getCollectionBucketList(params.bannerId)
    // }
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
      window.location.reload();  
  }

  render () {
    const { cityErrorMessage } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <>
        {this.getHeader()}
        <section id='breadcrumb'>
          <div className='container'>
            <div className='breadcrumb_inner'>
              <span>
                <a href='/'>{languageId === config.lang
                    ? staticLanguage.tab.home
                    : 'Home'}&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;</a>
                {params && params.bucketId && params.bucketId != ''
                  ? languageId === config.lang
                  ? staticLanguage.common.event_listing
                  : 'Event Listing'
                  : languageId === config.lang
                    ? staticLanguage.home.collections
                    : 'Collections'}
              </span>
            </div>
          </div>
        </section>
        <main id='main'>
          <Loader options={config.options} loaded={this.state.loaded}></Loader>
          <div id='page'>
            <div className='container'>
              <div className='row' id='event_listing_main'>
                <div className='col-md-3'>
                  <div className='filter-widget-sidebar-left'>
                    <div className='filter-widget-inner'>
                      <div className='widget_heading widget_head_red'>
                        <h3> {languageId === config.lang
                            ? staticLanguage.common.filter_by
                            : 'Filter By'}</h3>
                      </div>
                      <div className='search-filters'>
                        <div className='search-filters-inner'>
                          <div className='first-field field-area'>
                            <label>{languageId === config.lang
                                ? staticLanguage.shared.search
                                : 'Search'}</label>
                            <input
                              type='text'
                              value={this.state.searchText || ''}
                              placeholder={languageId === config.lang
                                ? staticLanguage.common.keyword
                                : 'Keyword'}
                              onChange={e => this.onsearchText(e.target.value)}
                            />
                          </div>
                          <div className='first-field field-area'>
                          <label>
                              {languageId === config.lang
                                ? staticLanguage.common.select_location
                                : 'Select Location'}
                            </label>
                            <select
                              className='form-control'
                              value={
                                this.state.locationName
                                  ? this.state.locationName
                                  : ''
                              }
                              onChange={e => this.locationChange(e)}
                            >
                              <option>{languageId === config.lang
                                ? staticLanguage.common.select_location
                                : 'Select Location'}</option>
                              {this.state.areas &&
                                this.state.areas.map((areas, i) => (
                                  <option
                                    id={areas.id}
                                    value={areas.name}
                                    data-id={areas.id}
                                  >
                                    {areas.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          {/* check area first start */}
                          {this.getLookingContentData()}
                          {/* check area first End */}
                          {/* check area second start */}
                          {this.getActivityTypeContentData()}
                          {/* check area second end */}
                          {/* check area second start */}
                          {/* {this.getMoreOptionContentData()} */}
                          {/* check area second end */}
                          {/* Date picker Start */}
                          <div className='first-field field-area date_picker'>
                          <label>{languageId === config.lang
                                ? staticLanguage.reservation.pick_date
                                : 'Pick a Date'}</label>
                            <div id='datetimepicker1'>
                              <DatePicker
                                onChange={date => this.setStartDate(date)}
                                selected={
                                  this.state.startDate
                                    ? this.state.startDate
                                    : ''
                                }
                                dateFormat='d-MM-yyyy'
                                placeholderText='dd-mm-yyyy'
                                minDate={moment().toDate()}
                              />
                            </div>
                          </div>
                          {/* Date picker End */}
                          {/* Distance filter start */}
                          <div className='row distance_field'>
                            <div className='first-field field-area col-md-6'>
                              <label>{languageId === config.lang
                                  ? staticLanguage.filters.sorting.distance
                                  : 'Distance'}</label>
                              <button
                                type='button'
                                className={`btn ${
                                  this.state.nearme == true ? 'near_me' : ''
                                }`}
                                value='nearme'
                                onClick={e => this.getNearMeLocation(e)}
                              >
                                {languageId === config.lang
                                  ? staticLanguage.home.near_me
                                  : 'Near Me'}
                              </button>
                            </div>
                          </div>
                          {/* Distance filter End */}
                          {/* age range filter start */}
                          <div className='row distance_field'>
                            <div className='first-field field-area col-md-6'>
                              <label>{languageId === config.lang
                                  ? staticLanguage.common.from_age
                                  : 'Age From'}</label>
                              <select
                                className='form-control'
                                value={this.state.ageFromList || ''}
                                onChange={e => this.onAgeFromChange(e)}
                              >
                                <option selected>{languageId === config.lang
                                  ? staticLanguage.shared.amount.from
                                  : 'From'}</option>
                                {this.state.ages &&
                                  this.state.ages.map((age, i) => (
                                    <option key={i}>{age}</option>
                                  ))}
                              </select>
                              {/* <span className="errorMessage alert alert-danger">{this.state.ageFromErrorMessage}</span> */}
                            </div>
                            <div className='first-field field-area col-md-6'>
                              <label>{languageId === config.lang
                                  ? staticLanguage.common.to_age
                                  : 'Age To'}</label>
                              <select
                                className='form-control'
                                value={this.state.ageToList || ''}
                                onChange={e => this.onAgeToChange(e)}
                              >
                                <option selected>{languageId === config.lang
                                  ? staticLanguage.shared.amount.to
                                  : 'To'}</option>
                                {this.state.ages &&
                                  this.state.ages.map((age, i) => (
                                    <option key={i}>{age}</option>
                                  ))}
                              </select>
                            </div>
                            <span className='validate_msg'>
                              {this.state.ageFromErrorMessage}
                            </span>
                          </div>
                          {/* age range filter End */}
                          {/* Sort By filter Start */}
                          <div className='sort-by-filter'>
                            <div className='first-field field-area'>
                              <label>{languageId === config.lang
                                  ? staticLanguage.filters.sort_by
                                  : 'Sort By'}</label>
                            </div>
                            <div className='row'>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.freeactive == true ? 'active' : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.freeactive == true ? true : false
                                  }
                                  onClick={e => this.onchangeFree(e, 'free')}
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.filters.free
                                  : 'Free'}
                                </button>
                              </div>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.dealsactive == true ? 'active' : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.isDeals == true ? true : false
                                  }
                                  onClick={e => this.onchangeDeals(e, 'deals')}
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.filters.deals
                                  : 'Deals'}
                                </button>
                              </div>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.buy_nowactive == true
                                    ? 'active'
                                    : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.buy_now == true ? true : false
                                  }
                                  onClick={e =>
                                    this.onchangeBuyNow(e, 'buy_now')
                                  }
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.activity.buy
                                  : 'Buy Now'}
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Sort By filter End */}
                          {/* What else filter Start */}
                          <div className='sort-by-filter else_filter'>
                            <div className='first-field field-area'>
                              <label>{languageId === config.lang
                                  ? staticLanguage.common.what_else
                                  : 'What else are you Looking for?'}</label>
                            </div>
                            <div className='row'>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.indoorActive == true
                                    ? 'active'
                                    : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.indoorActive == true
                                      ? true
                                      : false
                                  }
                                  onClick={e =>
                                    this.onChangeIndoor(e, 'indoor')
                                  }
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.filters.environments.indoor
                                  : 'Indoor'}
                                </button>
                              </div>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.outdoorActive == true
                                    ? 'active'
                                    : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.outdoorActive == true
                                      ? true
                                      : false
                                  }
                                  onClick={e =>
                                    this.onChangeOutdoor(e, 'outdoor')
                                  }
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.filters.environments.outdoor
                                  : 'Outdoor'}
                                </button>
                              </div>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.bothActive == true ? 'active' : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.bothActive == true ? true : false
                                  }
                                  onClick={e => this.onChangeBoth(e, 'both')}
                                >
                                  {languageId === config.lang
                                  ? staticLanguage.filters.environments.both
                                  : 'Both'}
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* What else filter End */}
                          <div className='submit-filter-btn'>
                            <button
                              type='button'
                              className='search_btn_filter'
                              value='search'
                              onClick={e => this.searchData(e)}
                            >
                              {languageId === config.lang
                                  ? staticLanguage.shared.search
                                  : 'Search'}
                            </button>
                            <button
                              type='button'
                              className='clear_btn_filter'
                              value='clearall'
                              onClick={e => this.clearAll(e)}
                            >
                              {languageId === config.lang
                                  ? staticLanguage.common.clear_all
                                  : 'Clear All'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-9'>
                  <div className='event-list-area'>
                    <div className='event-list-inner'>
                      <div className='widget_heading widget_head_blue'>
                        <h3>
                          {params && params.bucketId && params.bucketId != ''
                            ? languageId === config.lang
                            ? staticLanguage.common.all_events
                            : 'All Events'
                            : this.state.BucketName
                            ? this.state.BucketName
                            : languageId === config.lang
                            ? staticLanguage.common.all_events
                            : 'All Events'}
                        </h3>
                      </div>
                      {this.displayEventList()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }
}

export default EventList
