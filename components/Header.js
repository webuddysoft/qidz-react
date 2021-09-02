import React, { Component } from "react";
import ReactDOM from 'react-dom';
import config from "../config";
import axios from "axios";
import ModalService from "./services/modal.service";
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import App from '../App';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            language: "",
            loaded: false,
            isFetching: true,
            HomePageData: [],
        };
        this.showModal = this.showModal.bind(this);
    }
    componentDidMount() {
        this.cities();
    }
    changeCityData(event) {
        let name = event.target.value.split('@@');
        let cityName = name[0];
        let cityId = name[2];
        localStorage.setItem('city', cityName);
        localStorage.setItem('cityId', cityId);
        let lang = name[1].split(',');
        this.setState({ language: lang });
        localStorage.setItem('language', lang[0]);
        this.homeData();
        
        // this.setState({
        //     isFetching: false,
        //     loaded: true
        // })
        //if (!this.state.isFetching) {
        // let cta = document.getElementById('root');
        // console.log(cta, 'cta');
        // ReactDOM.render(<App isProcess={false} cityId={cityId} language={lang} />, cta);
        //}

    }
    myCondition1() {
        const cityId = localStorage.getItem('cityId');
        const language = localStorage.getItem('language');
        return (
            <App isProcess={false} cityId={cityId} language={language} HomePageData={this.state.HomePageData} />
        );
     }
    changeLanguage(event) {
        localStorage.setItem('language', event.target.value);
    }
    Logout() {
        localStorage.clear();
        window.open("/", '_self');
    }
    userProfile() {
        window.open("/user-profile", '_self');
    }
    showModal(form) {
        if (form === 'login') {
            ModalService.open(
                <LoginModal show={true} />,
                {
                    modalClass: "login-component",
                    width: 800,
                    padding: 0,
                    overFlow: "hidden",
                }
            );
        }
        if (form === 'register') {
            ModalService.open(
                <RegisterModal show={true} />,
                {
                    modalClass: "register-component",
                    width: 800,
                    padding: 0,
                    overFlow: "hidden",
                }
            );
        }
    }

    cities() {
        axios.get(config.qidz.endpoints.cities, {
            data: {},
            headers: {
                "accept": 'application/json'
            }
        })
            .then((response) => {
                console.log(response, 'city data');
                this.setState({
                    cityData: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    homeData() {
        const city = localStorage.getItem('cityId');
        const language = localStorage.getItem('language');
        axios.post(config.qidz.endpoints.homePageData + '?tenant_id=' + city + '&locale=' + language, {
        })
            .then((response) => {
                console.log('response', response);

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
        const token = localStorage.getItem('settoken');
        const city = localStorage.getItem('city');
        const cityId = localStorage.getItem('cityId');
        const language = localStorage.getItem('language');
        return (
            <>
                <div class="top-header">
                    <div class="container">
                        <div class="top-header-inner row">
                            <div class="top-header-left col-md-6">
                                <div class="download_label">DOWNLOAD NOW</div>
                                <div class="app_btn"><a href={config.appStoreUrl} target="_blank"><img src="https://qidz.mangoitsol.com/wp-content/themes/wpreactqidz/assets/images/apple.png" /></a></div>
                                <div class="app_btn"><a href={config.googlePlayUrl} target="_blank"><img src="https://qidz.mangoitsol.com/wp-content/themes/wpreactqidz/assets/images/google.png" /></a></div>
                            </div>
                            <div class="top-header-right col-md-6">
                                <div class="login_section">
                                    {(token === null || token === undefined) ?
                                        <a href="javascript:void(0)" onClick={() => this.showModal('login')}>Login</a> :
                                        // <a href="javascript:void(0)" onClick={() => this.Logout()}>Logout</a>
                                        <a href="/user-profile/">{localStorage.getItem('name')}</a>
                                    }
                                    {(token === null || token === undefined) ? ' / ' : ""}

                                    {(token === null || token === undefined) ?
                                        <a href="javascript:void(0)" onClick={() => this.showModal('register')}>Register</a> : ""}
                                    &nbsp;&nbsp;|&nbsp;&nbsp;<a href="become-a-partner/" target="_blank">Partner With Us</a>
                                </div>
                                <div class="country_field">
                                    {/* <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle"
                                            type="button" id="dropdownMenu1" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                            <span className="country_text">Select City</span><i class="fa fa-globe" aria-hidden="true"></i></button>
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                            {(city == null || city == undefined) ? <a class="dropdown-item" href="#!"></a> : ""}
                                            {this.state.cityData && this.state.cityData.map(
                                                (cities, i) => (
                                                    <a class="dropdown-item" href="#!">{cities.name}</a>
                                                )
                                            )
                                            }
                                        </div>
                                    </div> */}
                                    <div class="form-group">
                                        <select id="mySelect" class="form-control" value={city} onChange={(e) => this.changeCityData(e)}>
                                            {(city == null || city == undefined) ? <option selected="">Select City</option> : ""}
                                            {
                                                this.state.cityData && this.state.cityData.map(
                                                    (cities, i) => (
                                                        <option value={cities.name + '@@' + cities.available_locales + '@@' + cities.id}>{cities.name}</option>
                                                    )
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div class="language_field">
                                    <div class="trp-language-switcher trp-language-switcher-container" data-no-translation="">
                                        <select id="mySelect" class="form-control" onChange={(e) => this.changeLanguage(e)}>
                                            {(language != null || language != undefined) ? <option value={language}>{language}</option> :
                                                this.state.language ? this.state.language.map(
                                                    (lg, i) => (
                                                        <option value={lg}>{lg}</option>
                                                    )
                                                ) : <option selected="">Select Language</option>
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { !this.state.isFetching ?
                this.myCondition1()
                      : ""
                }
            </>
        );
    }
}



export default Header;