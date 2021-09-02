import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
// import ReactStars from "react-rating-stars-component";
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'

const pathname = window.location.pathname

// const segment = pathname.substring(pathname.indexOf('/') ).replace('/', '')
const url = pathname.split('/')
let segment = url[2]
console.log(segment)
// alert(segment);
const language = localStorage.getItem('language')
const tenant_id = localStorage.getItem('cityId')

class IndoorsOutdoors extends Component {
  constructor (props) {
    super(props)
    this.state = {
      indoorOutdoorData: [],
      isFetching: true,
      indoorOutdoorListVisible: 10,
      loaded: false,
      city: localStorage.getItem('city'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
  }

  componentDidMount () {
    this.getIndoorOutList()
    this.cities()
  }
  cities () {
    axios
      .get(config.qidz.endpoints.cities, {
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
  getIndoorOutList () {
    let city = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    let body = {
      with_companies: false,
      with_qidz_tour_items: true,
      date: null,
      end_date: null,
      q: null,
      order: 'average_rating',
      environment: segment === 'indoors' ? 'indoor' : 'outdoor',
      category_ids: [],
      sub_category_ids: [],
      ages_list: [],
      time_of_day: 'anytime',
      free_or_paid: false,
      is_deal: false,
      city: city,
      book_now: false,
      area_ids: [],
      bounds: false,
      is_class_or_workshop: null,
      coordinates: null,
      delta_coordinates: null
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
          indoorOutdoorData: response.data.activities,
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
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
      window.open(ticket_url, '_self')
    } else {
      window.open(
        '/' + languageId + '/booking?activityId=' + activityId,
        '_self'
      )
    }
  }

  displayEventList () {
    const { indoorOutdoorListVisible, indoorOutdoorData } = this.state
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const eventData =
      indoorOutdoorData &&
      indoorOutdoorData.length > 0 &&
      indoorOutdoorData.slice(0, indoorOutdoorListVisible).map((in_out, i) => {
        return (
          <div className='col-md-3'>
            <div className='event-list-item'>
              <div className='event-img'>
                <a href={`event-details?activityId=${in_out.id}`}>
                  <img src={in_out.attachment_large.replace('q_30', 'q_80')} />
                </a>
              </div>
              <div className='event-list-detail'>
                <a href={`event-details?activityId=${in_out.id}`}>
                  <h3>{in_out.name.substring(0, 50)}</h3>
                </a>
                <div className='event_btm_des'>
                  <div className='event_list_cat_section'>
                    <span className='small_text'>{in_out.area_name}</span>
                    <div className='review'>
                      {in_out.average_rating &&
                      in_out.average_rating != undefined ? (
                        <StarRatings
                          rating={parseInt(in_out.average_rating)}
                          starRatedColor='#ffd700'
                          numberOfStars={5}
                          name='rating'
                          starDimension='15px'
                          starSpacing='5px'
                        />
                      ) : (
                        <StarRatings
                          rating={0}
                          starRatedColor='grey'
                          numberOfStars={5}
                          name='rating'
                          starDimension='15px'
                          starSpacing='5px'
                        />
                      )}
                    </div>
                  </div>
                  <div className='event_list_price'>
                    {in_out.original_price && (
                      <span className='dis_price'>
                        {currency} {in_out.original_price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                    {in_out.price && (
                      <span className='main_price'>
                        {currency} {in_out.price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                  </div>
                  <div className='event_list_btn'>
                    <button
                      type='button'
                      onClick={() => this.booking(in_out.id, in_out.ticket_url)}
                      className='btn bn_btn'
                    >
                      {in_out.book_now_button}!
                    </button>
                    <button
                      type='button'
                      onClick={() => this.eventDetails(in_out.id)}
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

    return (
      <div className='event-list-category'>
        {/* <div className="events_main_heading"><h2>Indoors</h2></div> */}
        <div className='row'>
          {eventData ? (
            eventData
          ) : (
            <div className='no_data'>
              No {this.capitalize(segment)} event found
            </div>
          )}
          {indoorOutdoorListVisible < indoorOutdoorData.length && (
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
  seeMoreEventResult () {
    const { indoorOutdoorData, indoorOutdoorListVisible } = this.state
    if (
      indoorOutdoorData &&
      indoorOutdoorData.length === indoorOutdoorListVisible
    ) {
      this.setState({ indoorOutdoorListVisible: 10 })
    } else {
      this.setState(old => {
        return { indoorOutdoorListVisible: old.indoorOutdoorListVisible + 10 }
      })
    }
  }
  capitalize (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  changeLanguage (event) {
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false,languageId:event.target.value })
    this.getIndoorOutList()
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
    //localStorage.setItem('languageId', lang[0])
    this.setState({ loaded: false,languageId:lang[0] })
    this.setState({ loaded: false })
    this.getIndoorOutList()
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
      window.location.reload();  
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
                        this.state.cityData.map((cities, i) => (console.log(cities.names.en,'cccccccc',cities.names.ar),
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
                          <option value={lg}>{lg}</option>
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
  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <>
        {this.getHeader()}
        <section id='breadcrumb'>
          <div className='container'>
            <div className='breadcrumb_inner'>
              <span>
                <a href>
                  <a href='/'>{languageId === config.lang
                    ? staticLanguage.tab.home
                    : 'Home'}</a>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
                </a>
                {this.capitalize(segment)}
              </span>
            </div>
          </div>
        </section>
        <main id='main'>
          <Loader options={config.options} loaded={this.state.loaded}></Loader>
          <div id='page'>
            <div className='container'>
              <div className='row' id='event_listing_main'>
                <div className='col-md-12'>
                  <div className='event-list-area'>
                    <div className='event-list-inner'>
                      <div className='widget_heading widget_head_blue'>
                        <h3>{this.capitalize(segment)}</h3>
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

export default IndoorsOutdoors
