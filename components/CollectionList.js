import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'

const queryString = require('query-string')

class CollectionList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFetching: true,
      collections: [],
      loaded: false,
      Activities: [],
      city: localStorage.getItem('city'),
      collectionVisibility: config.eventVisible,
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : ''
    }
  }

  componentDidMount () {
    this.getCollectionBucketList()
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
  getCollectionBucketList () {
    const tenant_id = localStorage.getItem('cityId')
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
        if (response.data) {
          this.setState({
            collections: response.data.collections,
            isFetching: false,
            loaded: true
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  eventDetails (activityId) {
    window.open('event-details?activityId=' + activityId, '_self')
  }
  onCollectionSelect (id) {
    window.open('event-list?collectionId=' + id, '_self')
  }
  displayCollectionList () {
    const { collectionVisibility, collections, staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const collectionData =
      collections &&
      collections.length > 0 &&
      collections.slice(0, collectionVisibility).map((collection, i) => {
        return (
          <div className='col-md-3'>
            <div className='event-list-item'>
              <div className='event-img'>
                <a href={`event-list?collectionId=${collection.id}`}>
                  <img src={collection.avatar_url.replace('q_30', 'q_80')} />
                </a>
              </div>
              <div className='event-list-detail'>
                <a href={`event-list?collectionId=${collection.id}`}>
                  <h3>{collection.name.substring(0, 50)} </h3>
                </a>
                <div className='event_btm_des'>
                  <div className='event_list_cat_section'>
                    <span className='small_text'>
                      <a href={`event-list?collectionId=${collection.id}`}>
                        {collection.name}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })

    return (
      <div className='event-list-category'>
        {/* { (params && params.bucketId && params.bucketId != '') && <div className="events_main_heading"><h2>{this.state.BucketName}</h2></div>} */}
        <div className='row'>
          {collectionData ? (
            collectionData
          ) : (
            <div className='no_data'>
              {languageId === config.lang
                ? staticLanguage.common.no_collection
                : 'No Collection Found'}
            </div>
          )}
          {collectionVisibility < collections.length && (
            <div className='show_more_btn'>
              <button
                type='button'
                className='see_more_btn'
                onClick={e => this.seeMoreCollectionResult(e)}
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
  seeMoreCollectionResult () {
    const { collections, collectionVisibility } = this.state
    if (collections && collections.length === collectionVisibility) {
      this.setState({ collectionVisibility: config.eventVisible })
    } else {
      this.setState(old => {
        return {
          collectionVisibility: old.collectionVisibility + config.eventVisible
        }
      })
    }
  }
  homeClick () {
    window.open('/', '_self')
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
    this.getCollectionBucketList()
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
    this.getCollectionBucketList()
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
        window.location.reload();  
    
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
                <a href='/'>
                  {languageId === config.lang
                    ? staticLanguage.tab.home
                    : 'Home'}
                  &nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
                </a>
                {languageId === config.lang
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
                <div className='col-md-12'>
                  <div className='event-list-area'>
                    <div className='event-list-inner'>
                      <div className='widget_heading widget_head_blue'>
                        <h3>
                          {languageId === config.lang
                            ? staticLanguage.common.all_collection
                            : 'All Collections'}
                        </h3>
                      </div>
                      {this.displayCollectionList()}
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

export default CollectionList
