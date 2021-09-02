import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'

const language = localStorage.getItem('language')
const tenant_id = localStorage.getItem('cityId')

class MyBooking extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: this.props.show,
      upcomingReservations: [],
      pastReservations: [],
      city: localStorage.getItem('city'),
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
  }
  componentDidMount () {
    let token = localStorage.getItem('settoken')
    this.cities()
    if (token !== null) {
      this.getBookings()
    } else {
      window.open('/', '_self')
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
  getBookings () {
    const token = localStorage.getItem('settoken')
    const languageId = localStorage.getItem('languageId')
    axios
      .post(
        config.qidz.endpoints.reservations +
          '?tenantId=' +
          tenant_id +
          '&locale=' +
          languageId +
          '&token=' +
          token
      )
      .then(response => {
        console.log(response, 'user details')
        this.setState({
          upcomingReservations: response.data.upcoming_reservations,
          pastReservations: response.data.past_reservations
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  displayUpcomingBooking () {
    const { upcomingReservations } = this.state
    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const bookingData = upcomingReservations
      ? upcomingReservations.map((data, i) => {
          return (
            <div className='col-md-3'>
              <div className='event-list-item'>
                <div className='event-img'>
                  <a href={`event-details?activityId=` + data.id}>
                    <img
                      width='224'
                      height='160'
                      src={data.activity.attachment_large.replace(
                        'q_30',
                        'q_80'
                      )}
                    />
                  </a>
                </div>
                <div className='event-list-detail'>
                  <h3>{data.activity.name}</h3>
                  <div className='event_btm_des'>
                    <div className='event_list_cat_section'>
                      <span className='small_text'>
                        {data.activity.categories[0]}
                      </span>
                    </div>
                  </div>
                  <div className='event_list_price'>
                    {data.activity.original_price && (
                      <span className='dis_price'>
                        {currency}{' '}
                        {data.activity.original_price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                    {data.activity.price && (
                      <span className='main_price'>
                        {currency} {data.activity.price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      : ''
    return (
      <div className='favourite_item'>
        {bookingData.length > 0 ? bookingData : ''}
      </div>
    )
  }
  displayPastBooking () {
    const { upcomingReservations } = this.state
    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const bookingData = upcomingReservations
      ? upcomingReservations.map((data, i) => {
          return (
            <div className='col-md-3'>
              <div className='event-list-item'>
                <div className='event-img'>
                  <a href={`event-details?activityId=` + data.id}>
                    <img
                      width='224'
                      height='160'
                      src={data.activity.attachment_large.replace(
                        'q_30',
                        'q_80'
                      )}
                    />
                  </a>
                </div>
                <div className='event-list-detail'>
                  <h3>{data.activity.name}</h3>
                  <div className='event_btm_des'>
                    <div className='event_list_cat_section'>
                      <span className='small_text'>
                        {data.activity.categories[0]}
                      </span>
                    </div>
                  </div>
                  <div className='event_list_price'>
                    {data.activity.original_price && (
                      <span className='dis_price'>
                        {currency}{' '}
                        {data.activity.original_price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                    {data.activity.price && (
                      <span className='main_price'>
                        {currency} {data.activity.price.replace(/\.?0+$/, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      : ''
    return (
      <div className='favourite_item'>
        {bookingData.length > 0 ? bookingData : ''}
      </div>
    )
  }
  changeLanguage (event) {
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false, languageId: event.target.value })
    this.eventDetails()
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
    this.eventDetails()
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
    window.location.reload()
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
                    id='mySelect'
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
  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <>
        {this.getHeader()}
        <main id='main'>
          <section id='breadcrumb'>
            <div className='container'>
              <div className='breadcrumb_inner'>
                <span>
                  <a href='/'>
                    {languageId === config.lang
                      ? staticLanguage.tab.home
                      : 'Home'}
                    &nbsp;&nbsp;{'>>'}&nbsp;&nbsp;
                  </a>
                  {languageId === config.lang
                    ? staticLanguage.tickts.bookings
                    : 'My Bookings'}
                </span>
              </div>
            </div>
          </section>
          <div id='page'>
            <div className='container'>
              <div className='row' id='event_listing_main'>
                <div className='col-md-12'>
                  <div className='event-list-area'>
                    <div className='event-list-inner'>
                      <div class='widget_heading widget_head_blue'>
                        <h3>
                          {languageId === config.lang
                            ? staticLanguage.tickts.bookings
                            : 'My Bookings'}
                        </h3>
                      </div>
                      <div class='event-list-category'>
                        {this.state.upcomingReservations.length>0 ||
                        this.state.pastReservations.length>0 ? (
                          <div class='row'>
                            {this.displayUpcomingBooking()}
                            {this.displayPastBooking()}
                          </div>
                        ) : (
                          <div>
                            <h3>
                              {
                                (languageId === config.lang
                                  ? staticLanguage.bookings.nobookings
                                  : 'No bookings have been made')
                              }
                            </h3>
                            <span>
                              {
                                (languageId === config.lang
                                  ? staticLanguage.bookings.nobookingstext
                                  : "You haven't made any bookings. Just you know, all your bookings will be saved here so you can easliy find them.")
                              }
                            </span>
                          </div>
                        )}
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
export default MyBooking
