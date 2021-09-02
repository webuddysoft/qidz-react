import logo from './logo.svg';
import './App.css';
import StaticHeader from './components/StaticHeader';
import Header from './components/Header';
import Categories from './components/Categories';
import Search from './components/Search';
import Bucket from './components/Bucket';
import BucketCategoryDetails from './components/BucketCategoryDetails';
import Collections from './components/Collections';
import Loader from 'react-loader';
import config from './config';
import { Component } from 'react';
import axios from 'axios';
import RevolutionSlider from './components/RevolutionSlider';
import StaticWidget from './components/StaticWidget';
import FamilySectionMain from './components/FamilySectionMain';

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
      console.log(this.state);
  }

  componentDidMount() {
    this.homeData();
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
  render() {
    return (
      <>
        <StaticHeader staticLanguage={this.state.staticLanguage} />
        <RevolutionSlider />
        <Header />
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
        <StaticWidget />
        <FamilySectionMain />
        <Loader options={config.options} loaded={this.state.loaded}></Loader>
      </>
    );
  }

}
export default App;
