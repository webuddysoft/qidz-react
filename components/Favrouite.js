import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'

const language = localStorage.getItem('language')
const tenant_id = localStorage.getItem('cityId')

class Favrouite extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: this.props.show,
      favActivities: [],
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
    this.cities();
    if (token != null) {
      this.getUserDetails()
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
  getUserDetails () {
    const token = localStorage.getItem('settoken')
    const userId = localStorage.getItem('userId')
    const languageId = localStorage.getItem('languageId')
    axios
      .get(
        config.qidz.endpoints.userDetails +
          '?tenantId=' +
          tenant_id +
          '&locale=' +
          languageId +
          '&user_id=' +
          userId +
          '&token=' +
          token,
        {
          // + "?latitude=37.33233141&longitude=-122.0312186&ad_banners=true&tenant_id=1&locale='en'&level0=true", {
        }
      )
      .then(response => {
        console.log(response, 'user details')
        this.setState({
          favActivities: response.data.favorite_activities
        })
      })
      .catch(error => {
        console.log(error)
      })
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
  eventDetails (activityId) {
    window.open('event-details?activityId=' + activityId, '_self')
  }
  displayEventList () {
    const { favActivities,staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const eventData = favActivities
      ? favActivities.map((data, i) => {
          return (
            <div className='col-md-3'>
              <div className='event-list-item'>
                <div className='event-img'>
                  <a href={`event-details?activityId=` + data.id}>
                    <img
                      width='224'
                      height='160'
                      src={data.attachment_large.replace('q_30', 'q_80')}
                    />
                  </a>
                </div>
                <div className='event-list-detail'>
                  <a href={`event-details?activityId=` + data.id}>
                    <h3>{data.name}</h3>
                  </a>
                  <div className='event_btm_des'>
                    <div className='event_list_cat_section'>
                      <span className='small_text'>{data.categories[0]}</span>
                      {/* <div className='review'>
                        <StarRatings
                          rating={parseInt(data.average_rating)}
                          starRatedColor='#ffd700'
                          numberOfStars={5}
                          name='rating'
                          starDimension='15px'
                          starSpacing='5px'
                        />
                      </div> */}
                    </div>
                  </div>
                  <div className='event_list_price'>
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
                  <div className='event_list_btn'>
                    {/* <button type="button" className="bn_btn">{data.book_now_button}</button>
                    <button type="button" className="rm_btn">Read More</button> */}
                    {data.original_price ? (
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
                         {languageId === config.lang
                      ? staticLanguage.common.you_tube
                      : 'Youtube'}
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
            </div>
          )
        })
      : ''
    return (
      <div className='row'>
        {eventData.length > 0 ? (
          eventData
        ) : (
          <div className='no_data'>{languageId === config.lang
            ? staticLanguage.common.no_fav
            : 'No favourite activity found'}</div>
        )}
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
                      this.state.cityData.map(
                        (cities, i) => (
                          (
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
                          )
                        )
                      )}
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
                    ? staticLanguage.favorites.activities
                    : 'Favourite Activities'}
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
                            ? staticLanguage.favorites.activities
                            : 'Favourite Activities'}
                        </h3>
                      </div>
                      <div class='event-list-category'>
                        <div class='favourite_item'>{this.displayEventList()}</div>
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
export default Favrouite
