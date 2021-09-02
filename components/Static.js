import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'

class Static extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
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
    return (
      <>
        {this.getHeader()}
        {/* <Loader options={config.options} loaded={this.state.loaded}></Loader> */}
      </>
    )
  }
}
export default Static
