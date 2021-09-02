import React from 'react'
import queryString from 'query-string'
import config from '../config'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import ReactStars from "react-rating-stars-component";
import Loader from 'react-loader'
import moment from 'moment/moment'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'

const params = queryString.parse(location.search)

class SearchDetails extends React.Component {
  constructor (props) {
    super(props)
    this.categoryList = []
    this.allSearchCriteria = []
    this.watchID = ''
    if (params.activity != '') {
      this.allSearchCriteria.push({ id: params.activity, name: 'searchText' })
    }
    this.state = {
      startDate: '',
      endDate: '',
      date: new Date(),
      searchResultData: '',
      searchButton: '',
      cityData: '',
      mainData: '',
      parentCategories: '',
      categories: '',
      ages: '',
      ageFromList: [],
      ageToList: [],
      lookingForVisible: 5,
      activityTypeVisible: 5,
      searchResultVisible: config.eventVisible,
      searchText: params.activity ? params.activity : '',
      showFilter: false,
      parentCategoryId: [],
      cityId: localStorage.getItem('cityId'),
      isDeals: false,
      free: false,
      buy_now: false,
      dealsactive: false,
      freeactive: false,
      buy_nowactive: false,
      environment: '',
      indoorActive: false,
      outdoorActive: false,
      bothActive: false,
      lat: '',
      lng: '',
      loaded: false,
      optionTop: '50%',
      nearme: false,
      ads: '',
      locationName: '',
      ageFromErrorMessage: '',
      ageTOErrorMessage: '',
      bannerResultCategories: '',
      bannerResultActivities: '',
      bannerResultBuckets: '',
      bannerResultCollections: '',
      lookingChecked: '',
      checkedStatus: false,
      parentCategoryList: params.parentcategory
        ? [parseInt(params.parentcategory)]
        : [],
      parentCategoryListName: [],
      allSearchCriteria: params.activity ? this.allSearchCriteria : [],
      location: '',
      city: localStorage.getItem('city'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
  }

  componentDidMount () {
    this.getSearchData()
    this.cities()
    this.searchResult()
    this.bannerResult()
  }
  clearOnce (data, p) {
    let name = data.name
    if (p != '') {
      var index = data.id.indexOf(p)
      if (index !== -1) {
        data.id.splice(index, 1)   
        console.log(this.state.parentCategoryList,'parent catroty');    
        this.setState({ allSearchCriteria: this.allSearchCriteria })
      }
    }
    if ((p == '' || p == undefined) && name != '') {
      if (name == 'searchText') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({ allSearchCriteria: filteredItems })
        window.history.pushState(
          '',
          '',
          window.location.href.replace('activity=' + data.id, 'activity=')
        )
      }
      if (name == 'locationName') {        
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          [data.name]: '',
          allSearchCriteria: filteredItems
        })
      }
      if (name == 'startDate') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          startDate: '',
          allSearchCriteria: filteredItems
        })
      }

      if (name == 'nearmeName') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          lat: '',
          lng: '',
          nearme: false,
          allSearchCriteria: filteredItems
        })
      }
      if (name == 'ageList') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          ageFromList: [],
          ageToList: [],
          allSearchCriteria: filteredItems
        })
      }
      if (name == 'freeName') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          freeactive: false,
          free: '',
          allSearchCriteria: filteredItems
        })
      }
      if (name == 'dealsName') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          dealsactive: false,
          isDeals: false,
          allSearchCriteria:filteredItems
        })
      }
      if (name == 'buyNowName') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        this.setState({
          buy_nowactive: false,
          buy_now: false,
          allSearchCriteria: filteredItems
        })
      }
      if (name == 'environment') {
        const filteredItems = this.state.allSearchCriteria.filter(item => item.name !== data.name)
        if ((data.id = 'indoor')) {
          this.setState({ indoorActive: false })
        }
        if ((data.id = 'outdoor')) {
          this.setState({ outdoorActive: false })
        }
        if ((data.id = 'both')) {
          this.setState({ bothActive: false })
        }
        this.setState({ allSearchCriteria: filteredItems })
      }
    }
    this.setState(
      { [data.name]: '', [data.name1]: '', loaded: false },
      this.searchResult
    )
  }
  clearFilter () {
    this.allSearchCriteria = []
    window.history.pushState(
      '',
      '',
      window.location.href.replace(
        'activity=' + this.state.searchText,
        'activity='
      )
    )
    this.setState(
      {
        searchButton: '',
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
        environment: '',
        parentCategoryListName: [],
        allSearchCriteria: []
      },

      this.searchResult,
      this.bannerResult
    )
  }
  clearAll (e) {
    this.parentCategoryListName = []
    window.history.pushState(
      '',
      '',
      window.location.href.replace(
        'activity=' + this.state.searchText,
        'activity='
      )
    )
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
        parentCategoryListName: [],
        environment: 'both',
        allSearchCriteria: []
      },
      this.searchResult,
      this.bannerResult
    )
  }

  searchData (event) {
    if (this.state.ageFromErrorMessage === '') {
      this.allSearchCriteria = []

      const {
        environment,
        searchText,
        startDate,
        dealsName,
        freeName,
        buyNowName,
        nearmeName,
        ageFromList,
        ageToList,
        parentCategoryListName,
        locationName
      } = this.state
     
      if (searchText) {
        this.allSearchCriteria.push({ id: searchText, name: 'searchText' })
      }
      if (locationName) {
        this.allSearchCriteria.push({
          id: locationName,
          name: 'locationName',
          name1: 'location'
        })
      }
      if (parentCategoryListName.length > 0) {
        this.allSearchCriteria.push({
          id: parentCategoryListName,
          name: 'parentCategoryListName',
          name1: 'parentCategoryList'
        })
      }
      if (startDate) {
        this.allSearchCriteria.push({
          id: moment(startDate).format('YYYY-MM-DD'),
          name: 'startDate'
        })
      }
      if (nearmeName) {
        this.allSearchCriteria.push({ id: nearmeName, name: 'nearmeName' })
      }
      if (ageFromList.length > 0 && ageToList.length > 0) {
        let age = ageFromList + ' to ' + ageToList
        this.allSearchCriteria.push({ id: age, name: 'ageList' })
        // this.allSearchCriteria.push({ id: ageToList, name: 'ageToList' })
      }
      if (dealsName) {
        this.allSearchCriteria.push({ id: dealsName, name: 'dealsName' })
      }
      if (freeName) {
        this.allSearchCriteria.push({ id: freeName, name: 'freeName' })
      }
      if (buyNowName) {
        this.allSearchCriteria.push({ id: buyNowName, name: 'buyNowName' })
      }
      if (environment) {
        this.allSearchCriteria.push({ id: environment, name: 'environment' })
      }
      this.setState(
        {
          searchButton: event.target.value,
          allSearchCriteria: this.allSearchCriteria,
          loaded: false,
          optionTop: '90%'
        },
        this.searchResult,
        this.bannerResult
      )
    }
  }
  searchResult () {
    let city = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    let ageList = []
    if (this.state.ageFromList != '' && this.state.ageToList != '') {
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
        : this.state.parentCategoryList
        ? this.state.parentCategoryList
        : [],
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
          city +
          '&locale=' +
          language,
        {
          data: body
        }
      )
      .then(response => {
        this.setState({
          searchResultData: response.data.activities,
          ads: response.data && response.data.ads ? response.data.ads : null,
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  bannerResult () {
    let city = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    let ageList = []
    if (this.state.ageFromList != '' && this.state.ageToList != '') {
      ageList = this.rangeBetween(
        parseInt(this.state.ageFromList),
        parseInt(this.state.ageToList)
      )
    }
    let body = {
      with_companies: false,
      with_qidz_tour_items: true,
      date: params.startDate
        ? params.startDate.toLocaleString()
        : this.state.startDate
        ? moment(this.state.startDate).format('YYYY-MM-DD')
        : null,
      end_date: params.endDate ? params.endDate.toLocaleString() : null,
      q: this.state.searchText,
      order: 'average_rating',
      environment: this.state.environment,
      parent_category_id: 1,
      category_ids: params.category
        ? [params.category]
        : this.state.parentCategoryList,
      sub_category_ids: [],
      ages_list: ageList ? ageList : params.age,
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
    axios
      .post(
        config.qidz.endpoints.search +
          '?tenantId=' +
          city +
          '&locale=' +
          language,
        {
          data: body
        }
      )
      .then(response => {
        this.setState({
          bannerResultCategories: response.data.categories,
          bannerResultBuckets: response.data.buckets,
          bannerResultCollections: response.data.collections,
          bannerResultActivities: response.data.activities,
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  rangeBetween (start, end) {
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

  onChangeLookingForData (e, s) {
    const checkedBoxes = [...this.state.parentCategoryList]
    const checkBoxName = [...this.state.parentCategoryListName]
    if (e.target.checked) {
      checkedBoxes.push(s.id)
      checkBoxName.push(s.name)
    } else {
      const index = checkedBoxes.findIndex(ch => ch === s.id)
     checkedBoxes.splice(index,1)
      checkBoxName.splice(index,1)
    }
    this.setState({
      parentCategoryList: checkedBoxes,
      parentCategoryListName: checkBoxName
    })
  }
  onChangeActivityTypeData (e, s) {
    const checkedBoxes = [...this.state.parentCategoryList]
    const checkBoxName = [...this.state.parentCategoryListName]
    if (e.target.checked) {
      checkedBoxes.push(s.id)
      checkBoxName.push(s.name)
    } else {
      const index = checkedBoxes.findIndex(ch => ch === s.id)
      checkedBoxes.splice(index , 1)
      checkBoxName.splice(index , 1)
    }
    this.setState({
      parentCategoryList: checkedBoxes,
      parentCategoryListName: checkBoxName
    })
  }
  onchangeDeals (event, name) {
    if (event.target.value == 'false') {
      this.setState({ isDeals: true, dealsactive: true, dealsName: name })
    } else {
      this.setState({ isDeals: false, dealsactive: false, dealsName: name })
    }
  }
  onchangeFree (event, name) {
    if (event.target.value === 'false') {
      this.setState({ free: 'free', freeactive: true, freeName: name })
    } else {
      this.setState({ free: false, freeactive: false, freeName: name })
    }
  }
  onchangeBuyNow (event, name) {
    if (event.target.value == 'false') {
      this.setState({ buy_now: true, buy_nowactive: true, buyNowName: name })
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
  getSearchData () {
    let tenant_id = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
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
  onAgeFromChange (event) {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    if (parseInt(event.target.value) > parseInt(this.state.ageToList)) {
      this.setState({
        ageFromList: event.target.value,
        ageFromErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.fromAge_error
            : 'From age must be less than to age'
      })
    } else {
      this.setState({
        ageFromList: event.target.value,
        ageFromErrorMessage: ''
      })
    }
  }
  onAgeToChange (event) {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    if (this.state.ageFromList.length == 0) {
      this.setState({
        ageToList: event.target.value,
        ageFromErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.select_age
            : 'Please select from age'
      })
    }
    if (parseInt(this.state.ageFromList) > parseInt(event.target.value)) {
      this.setState({
        ageToList: event.target.value,
        ageFromErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.toAge_error
            : 'To age must be greater than from age'
      })
    } else {
      this.setState({ ageToList: event.target.value, ageFromErrorMessage: '' })
    }
  }
  eventDetails (activityId) {
    const languageId = localStorage.getItem('languageId')
    window.open(
      '/' + languageId + '/event-details?activityId=' + activityId,
      '_self'
    )
  }
  booking (activityId, ticket_url) {
    const languageId = localStorage.getItem('languageId')
    if (ticket_url != '' && ticket_url != null) {
      window.open(ticket_url, '_blank')
    } else {
      window.open(
        '/' + languageId + '/booking?activityId=' + activityId,
        '_self'
      )
    }
  }
  youtube (youtube_url) {
    window.open(youtube_url, '_blank')
  }

  displaySearchResultData () {
    const { searchResultData, searchResultVisible } = this.state
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const searchData = searchResultData
      ? searchResultData.slice(0, searchResultVisible).map((data, i) => {
          return (
            <div className='search_list_item'>
              <div className='search_event_img'>
                <a href={`/event-details?activityId=${data.id}`}>
                  <img
                    width='224'
                    height='160'
                    src={data.attachment_large.replace('q_30', 'q_80')}
                  />
                </a>
                {data.has_deal && data.has_deal == true ? (
                  <div className='ribbon'>
                    <span className='badge_tag'>DEAL</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className='serch_event_detail'>
                <a href={`/event-details?activityId=${data.id}`}>
                  <h3>{data.name}</h3>
                </a>

                <div className='search_cat_area'>
                  <div className='search_cat'>{data.categories[0]}</div>
                  <div className='review'>
                    {/* <ReactStars
                  count={5}
                  value={data.average_rating}
                  size={20}
                  isHalf={true}
                  activeColor="#ffd700"
                /> */}
                    {data.average_rating &&
                      data.average_rating != undefined && (
                        <StarRatings
                          rating={parseInt(data.average_rating)}
                          starRatedColor='#ffd700'
                          numberOfStars={5}
                          name='rating'
                          starDimension='15px'
                          starSpacing='5px'
                        />
                      )}
                  </div>
                </div>
                <div className='search_price'>
                  {data.original_price && (
                    <span className='dis_price'>
                      {currency} {data.original_price.replace(/\.?0+$/, '')}
                    </span>
                  )}
                  {data.price && (
                    <span className='main_price'>
                      {currency} {data.price.replace(/\.?0+$/, '')}
                    </span>
                  )}
                </div>
                <div className='search_book_btns'>
                  {/* <button type="button" className="bn_btn">{data.book_now_button}</button>
              <button type="button" className="rm_btn">Read More</button> */}
                  {data.original_price || data.price ? (
                    <button
                      type='button'
                      onClick={() => this.booking(data.id, data.ticket_url)}
                      className='btn bn_btn'
                    >
                      {data.book_now_button}!
                    </button>
                  ) : data.has_youtube_url == true ? (
                    <button
                      type='button'
                      onClick={() => this.youtube(data.youtube_url)}
                      className='btn bn_btn'
                    >
                      Youtube
                    </button>
                  ) : (
                    ''
                  )}
                  <button
                    type='button'
                    onClick={() => this.eventDetails(data.id)}
                    className='btn rm_btn'
                  >
                    {languageId === config.lang
                      ? staticLanguage.common.readmore
                      : 'Read More'}
                  </button>
                </div>
              </div>
            </div>
          )
        })
      : ''
    return (
      <div className='search_listing_sec'>
        {searchData.length > 0 ? (
          searchData
        ) : (
          <div className='no_data'>{languageId==config.lang?staticLanguage.common.no_search:"No result found"}</div>
        )}
        <div className='show_more_btn'>
          {searchResultData && searchResultVisible < searchResultData.length && (
            <button
              type='button'
              className='see_more_btn'
              onClick={e => this.seeMoreSearchResult(e)}
            >
              {languageId === config.lang
                ? staticLanguage.common.seemore
                : 'See More...'}
            </button>
          )}
        </div>
      </div>
    )
  }
  seeMoreSearchResult () {
    const { searchResultData, searchResultVisible } = this.state
    if (searchResultData && searchResultData.length === searchResultVisible) {
      this.setState({ searchResultVisible: 10 })
    } else {
      this.setState(old => {
        return { searchResultVisible: old.searchResultVisible + 10 }
      })
    }
  }
  showMoreLooking () {
    const { parentCategories, lookingForVisible } = this.state
    this.setState({ lookingForVisible: parentCategories.length + 5  })
    // if (lookingForVisible <= parentCategories.length) {
    //   this.setState(old => {
    //     return { lookingForVisible: old.lookingForVisible + 5 }
    //   })
    // } else {
    //   this.setState(old => {
    //     return {
    //       lookingForVisible: old.lookingForVisible + 1 - parentCategories.length
    //     }
    //   })
    // }
  }
  showMoreActivity () {
    const { categories, activityTypeVisible } = this.state
    this.setState({ activityTypeVisible: categories.length + 5  })
    // if (activityTypeVisible <= categories.length) {
    //   this.setState(old => {
    //     return { activityTypeVisible: old.activityTypeVisible + 5 }
    //   })
    // } else {
    //   this.setState(old => {
    //     return {
    //       activityTypeVisible: old.activityTypeVisible + 1 - categories.length
    //     }
    //   })
    // }
  }

  getLookingContentData () {
    const { parentCategories, parentCategoryList } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
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
                        parentCategoryList.find(ch => parseInt(ch) == parseInt(pc.id))
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
  onsearchText (value) {
    this.setState({ searchText: value })
    // history.push('/search/?activity=&startDate=&endDate=&day=&age=')
    // this.searchResult();
  }
  locationChange (e) {
    var index = e.target.selectedIndex
    var optionElement = e.target.childNodes[index]
    var option = optionElement.getAttribute('data-id')
    this.setState({ location: option, locationName: e.target.value })
    // this.searchResult();
    // this.bannerResult();
  }

  setStartDate (date) {
    this.setState({ startDate: date })
  }
  getNearMeLocation (event) {alert(event.target.value)
    if (event.target.value == 'false') {alert(1);
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
            nearme: true,
            nearmeName: 'Near Me'
          })
        },
        error => console.log(error)
      )
    }else{alert(2);
      this.setState({
        lat: '',
        lng: '',
        nearme: false,
        nearmeName: 'Near Me'
      })
    }
   

    //this.searchResult();
    //this.bannerResult();
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
                          id={
                            languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en
                          }
                          key={
                            languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en
                          }
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
                  data-no-translation=''
                >
                  <select
                    id='myLanguageSelect'
                    value={this.state.languageId}
                    class='form-control'
                    onChange={e => this.changeLanguage(e)}
                  >
                    {this.state.language &&
                      this.state.language.map((lg, i) => (
                        <option value={lg}>{lg}</option>
                      ))}
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
    this.setState({ loaded: false, languageId: event.target.value })
    this.searchResult()
    const nextTitle = 'My new page title'
    const nextState = { additionalInformation: 'Updated the URL with JS' }
    if (event.target.value === config.lang) {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('/en', '/ar')
      )
    } else {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('/ar', '/en')
      )
    }
    window.location.reload()
  }
  changeCityData (event) {
    var index = event.target.selectedIndex
    var optionElement = event.target.childNodes[index]
    var currency = optionElement.getAttribute('data-currency')
    var available_locales = optionElement.getAttribute('data-available_locales')
    var cityId = optionElement.getAttribute('data-id')

    let cityName = event.target.value
    localStorage.setItem('city', cityName)
    localStorage.setItem('cityId', cityId)
    localStorage.setItem('currency', currency)
    let lang = available_locales.split(',')
    this.setState({ language: lang, city: cityName })
    localStorage.setItem('lang', JSON.stringify(lang))
    //localStorage.setItem('languageId', lang[0])
    this.setState({ loaded: false, languageId: lang[0] })
    this.searchResult()
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
    window.location.reload()
  }

  render () {
    const {
      bannerResultCategories,
      bannerResultActivities,
      bannerResultBuckets,
      bannerResultCollections
    } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <>
        {this.getHeader()}
        <section id='breadcrumb'>
          <div className='container'>
            <div className='breadcrumb_inner'>
            <span>
                <a href='/'>
                  {languageId === config.lang
                    ? staticLanguage.tab.home
                    : 'Home'}
                  &nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
                </a>
                {languageId === config.lang
                  ? staticLanguage.shared.search
                  : 'Search'}
              </span>
            </div>
          </div>
        </section>
        <section id='search_banner_section'>
          <div className='search_banner_img'>
            <img
              className='img-fluid'
              alt='Responsive image'
              src='/wp-content/themes/wpreactqidz/assets/img/search/banner_search.jpg'
            />
          </div>
        </section>
        <Loader options={config.options} loaded={this.state.loaded}></Loader>
        <main id='main'>
          <div id='page'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-3'>
                  <div className='filter-widget-sidebar-left'>
                    <div className='filter-widget-inner'>
                      <div className='widget_heading widget_head_red'>
                        <h3>
                          {languageId === config.lang
                            ? staticLanguage.common.filter_by
                            : 'Filter By'}
                        </h3>
                      </div>
                      <div className='search-filters'>
                        <div className='search-filters-inner'>
                          <div className='first-field field-area'>
                            <label>
                              {languageId === config.lang
                                ? staticLanguage.shared.search
                                : 'Search'}
                            </label>
                            <input
                              type='text'
                              value={this.state.searchText || ''}
                              placeholder={
                                languageId === config.lang
                                  ? staticLanguage.common.keyword
                                  : 'Keyword'
                              }
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
                              <option>
                                {languageId === config.lang
                                  ? staticLanguage.common.select_location
                                  : 'Select Location'}
                              </option>
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
                          {this.getLookingContentData()}
                          {this.getActivityTypeContentData()}
                          {/* {this.getMoreOptionContentData()} */}
                          <div className='date_picker'>
                            <label>
                              {languageId === config.lang
                                ? staticLanguage.reservation.pick_date
                                : 'Pick a Date'}
                            </label>
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
                          <div className='row distance_field'>
                            <div className='first-field field-area col-md-6'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.filters.sorting.distance
                                  : 'Distance'}
                              </label>
                              <button
                                type='button'
                                className={`btn ${
                                  this.state.nearme == true
                                    ? 'near_me active'
                                    : ''
                                }`}
                                value={
                                  this.state.nearme == true
                                    ? true
                                    : false
                                }
                                onClick={e => this.getNearMeLocation(e)}
                              >
                                {languageId === config.lang
                                  ? staticLanguage.home.near_me
                                  : 'Near Me'}
                              </button>
                            </div>
                            {/* <div className="first-field field-area col-md-6">
                              <label>Location</label>
                              <select className="form-control">
                                <option selected="">Location</option>
                                {
                                  this.state.cityData && this.state.cityData.map(
                                    (cities, i) => (
                                      <option key={cities.id}>{cities.name}</option>
                                    )
                                  )
                                }
                              </select>
                            </div> */}
                          </div>
                          <div className='row distance_field'>
                            <div className='first-field field-area col-md-6'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.shared.amount.from
                                  : 'From'}
                              </label>
                              <select
                                className='form-control'
                                value={this.state.ageFromList || ''}
                                onChange={e => this.onAgeFromChange(e)}
                              >
                                <option selected=''>
                                  {languageId === config.lang
                                    ? staticLanguage.common.from_age
                                    : 'Age From'}
                                </option>
                                {this.state.ages &&
                                  this.state.ages.map((age, i) => (
                                    <option key={i}>{age}</option>
                                  ))}
                              </select>
                            </div>
                            <div className='first-field field-area col-md-6'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.common.to_age
                                  : 'Age To'}
                              </label>
                              <select
                                className='form-control'
                                value={this.state.ageToList || ''}
                                onChange={e => this.onAgeToChange(e)}
                              >
                                <option selected=''>
                                  {languageId === config.lang
                                    ? staticLanguage.shared.amount.to
                                    : 'To'}
                                </option>
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
                          <div className='sort-by-filter'>
                            <div className='first-field field-area'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.filters.sort_by
                                  : 'Sort By'}
                              </label>
                            </div>
                            <div className='row'>
                              <div
                                className={`first-field field-area col-md-4 ${
                                  this.state.freeactive === true ? 'active' : ''
                                }`}
                              >
                                <button
                                  type='button'
                                  value={
                                    this.state.freeactive === true
                                      ? true
                                      : false
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
                                    this.state.isDeals === true ? true : false
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
                                    this.state.buy_nowactive == true
                                      ? true
                                      : false
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
                          <div className='sort-by-filter else_filter'>
                            <div className='first-field field-area'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.common.what_else
                                  : 'What else are you Looking for?'}
                              </label>
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
                                    ? staticLanguage.filters.environments
                                        .outdoor
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
                <div className='col-md-6'>
                  <div className='search-area'>
                    <div className='search-area-inner'>
                      <div className='widget_heading widget_head_blue'>
                        <h3>
                          {languageId === config.lang
                            ? staticLanguage.common.search_result
                            : 'Search Results'}
                        </h3>
                      </div>
                      {this.state.allSearchCriteria.length > 0 && (
                        <div className='search-keyword-area'>
                          <div className='search-key-heading'>
                            <h3>
                              {languageId === config.lang
                                ? staticLanguage.common.filter
                                : 'Filter'}
                            </h3>
                            <a
                              href
                              value='clearFilter'
                              onClick={e => this.clearFilter(e)}
                            >
                              {languageId === config.lang
                                ? staticLanguage.common.clear_filter
                                : 'Clear Filter'}
                            </a>
                          </div>
                          <div className='keywaord-tag'>
                            <ul>
                              {this.state.allSearchCriteria &&
                                this.state.allSearchCriteria.map((data, i) =>
                                  data && typeof data.id == 'object' ? (
                                    data.id.map((p, j) => (
                                      <li>
                                        <a href>{p}</a>
                                        <button
                                          className='close_btn'
                                          onClick={() =>
                                            this.clearOnce(data, p)
                                          }
                                        ></button>
                                      </li>
                                    ))
                                  ) : (
                                    <li>
                                      <a href> {data.id ? data.id : data}</a>
                                      <button
                                        className='close_btn'
                                        onClick={() => this.clearOnce(data)}
                                      ></button>
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        </div>
                      )}
                      {/* <div className='ad_category_banner'>
                        {bannerResultCategories &&
                          bannerResultCategories.length > 0 && (
                            <div className='ad_category_img'>
                              <img
                                className='img-fluid'
                                src={
                                  bannerResultCategories &&
                                  bannerResultCategories[0].avatar_url.replace(
                                    'q_30',
                                    'q_80'
                                  )
                                }
                              />
                            </div>
                          )}
                        {bannerResultActivities &&
                          bannerResultActivities.length > 0 && (
                            <div className='ad_category_img'>
                              <img
                                className='img-fluid'
                                src={
                                  bannerResultActivities &&
                                  bannerResultActivities[0].attachment_large.replace(
                                    'q_30',
                                    'q_80'
                                  )
                                }
                              />
                            </div>
                          )}
                        {bannerResultBuckets && bannerResultBuckets.length > 0 && (
                          <div className='ad_category_img'>
                            <img
                              className='img-fluid'
                              src={
                                bannerResultBuckets &&
                                bannerResultBuckets[0].avatar_url.replace(
                                  'q_30',
                                  'q_80'
                                )
                              }
                            />
                          </div>
                        )}
                        {bannerResultCollections &&
                          bannerResultCollections.length > 0 && (
                            <div className='ad_category_img'>
                              <img
                                className='img-fluid'
                                src={
                                  bannerResultCollections &&
                                  bannerResultCollections[0].avatar_url
                                }
                              />
                            </div>
                          )}
                      </div> */}
                      {this.displaySearchResultData()}
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  {/* {this.state.ads && */}
                  <div className='featured-widget-sidebar-right'>
                    <div className='filter-widget-inner'>
                      <div className='widget_heading widget_head_red'>
                        <h3>
                          {languageId === config.lang
                            ? staticLanguage.common.featured
                            : 'Featured'}
                        </h3>
                      </div>
                      <div className='featured_events_list'>
                        {this.state.ads &&
                          this.state.ads.map((ads, i) => (
                            <div className='featured_events'>
                              <a href={`/event-details?activityId=${ads.id}`}>
                                <img
                                  src={ads.attachment_large.replace(
                                    'q_30',
                                    'q_80'
                                  )}
                                />
                              </a>
                              <div className='feat_details'>
                                <h4>
                                  {ads.name} @ {ads.city}
                                </h4>
                                <a href={`/event-details?activityId=${ads.id}`}>
                                  {ads.area_name}, {ads.city}
                                </a>
                              </div>
                            </div>
                          ))}
                      </div>
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
export default SearchDetails
