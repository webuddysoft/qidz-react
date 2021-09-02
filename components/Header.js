import React, { Component } from "react";
import ReactDOM from 'react-dom';
import config from "../config";
import axios from "axios";
import ModalService from "./services/modal.service";
import LoginModal from './LoginModal';
import DownloadSection from './DownloadSection';
import LoginSection from './LoginSection';
import App from '../App';

class Header extends Component {
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
        this.cities();
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
    render() {
        const languageId = localStorage.getItem('languageId')

        return (
            <div className='top-header'>
                <div className='container'>
                <div className='top-header-inner row'>
                    <DownloadSection staticLanguage={this.state.staticLanguage} />
                    <div className='top-header-right col-md-6'>
                    <LoginSection staticLanguage={this.state.staticLanguage} />
                    <div className='country_field'>
                        <div className='form-group'>
                        <select
                            id='mySelect'
                            className='form-control'
                            value={this.state.city}
                            onChange={e => this.changeCityData(e)}
                        >
                            {this.state.cityData &&
                            this.state.cityData.map((cities, i) => (console.log(cities.names.en,'cccccccc',cities.names.ar),
                                <option
                                key={cities.id}
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
                    <div className='language_field'>
                        <div
                        className='trp-language-switcher trp-language-switcher-container'
                        data-no-translation='' >
                        <select
                            id='mySelect'
                            value={this.state.languageId}
                            className='form-control'
                            onChange={e => this.changeLanguage(e)}>
                            {this.state.language && (
                            this.state.language.map((lg, i) => (
                                <option value={lg} key={i}>{lg}</option>
                            ))
                            )}
                        </select>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}



export default Header;