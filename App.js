import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import config from "./config";
import Categories from "./components/categories";
import BucketCategoryDetails from "./components/BucketCategoryDetails";
import Collections from "./components/Collections";
import Search from "./components/Search";
import Bucket from "./components/Bucket";
import BrowseByCategory from "./components/BrowseByCategory";
import Header from './components/Header';
import LoginSection from './components/LoginSection';
import DownloadSection from './components/DownloadSection';
import Loader from 'react-loader';

class App extends Component {
    constructor(props) {
        super(props);
        // const lang = typeof (localStorage.getItem('language'))
        this.state = {
            HomePageData: "",
            isFetching: true,
            loaded: false,
            city:localStorage.getItem('city'),
            cityId: localStorage.getItem('cityId'),
            language: localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')) : '',
            languageId: localStorage.getItem('languageId'),
            isProcess: true,
            isData: true,
            staticLanguage:this.props.staticLanguage,
        };
    }

    componentDidMount() {
        this.homeData();
        this.cities();
    }
    

    homeData() {
        let language = this.state.languageId;
        let tenant_id = this.state.cityId;
        axios.post(config.qidz.endpoints.homePageData + '?tenant_id=' + tenant_id + '&locale=' + language, {
        })
            .then((response) => {
                this.setState({
                    HomePageData: response.data,
                    isFetching: false,
                    loaded: true
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    cities() {
        axios.get(config.qidz.endpoints.cities, {
            data: {},
            headers: {
                "accept": 'application/json'
            }
        })
            .then((response) => {
                this.setState({
                    cityData: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    changeLanguage(event) {
        localStorage.setItem('languageId', event.target.value);
        this.setState({ loaded: false });
        const nextTitle = 'My new page title';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        // window.history.pushState(nextState, nextTitle, 'http://qidz.mangoitsol.com/ar/');
        this.homeData();
        if(event.target.value===config.lang){
            window.history.pushState(nextState, nextTitle, window.location.href.replace('/en', '/ar'));
           
        }else{
            window.history.pushState(nextState, nextTitle, window.location.href.replace('/ar', '/en'));
        }
        window.location.reload();        
    }
    changeCityData(event) {
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
        this.setState({ loaded: false })
        this.homeData();
        if(lang.length==1){
          window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
        }
        //
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
    render() {
        return (
            <>
                {this.getHeader()}
                {/* {isProcess == undefined ? <Header /> : ""} */}
                <main id="main">
                    <section id="filter-section">
                        {!this.state.isFetching ? <Categories staticLanguage={this.state.staticLanguage} parentCategoryData={this.state.HomePageData.parent_categories} /> : ''}
                        <div className="container">
                            {!this.state.isFetching ? <Search staticLanguage={this.state.staticLanguage} homeData={this.state.HomePageData} /> : ''}
                        </div>
                    </section>
                    <section id="advertisement" className="advertisement">
                        <div className="container">
                            {!this.state.isFetching ? <BucketCategoryDetails staticLanguage={this.state.staticLanguage} ad_banners={this.state.HomePageData.ad_banners} /> : ''}
                        </div>
                    </section>
                    <section id="event_category" className="event_category">
                        <div className="container">
                            {!this.state.isFetching ? <Collections staticLanguage={this.state.staticLanguage} collectionData={this.state.HomePageData.collections} /> : ''}
                            {!this.state.isFetching ? <Bucket staticLanguage={this.state.staticLanguage} bucketData={this.state.HomePageData} /> : ''}
                        </div>
                    </section>
                </main>
                <Loader options={config.options} loaded={this.state.loaded}></Loader>
            </>
        )
    }
}
export default App;
