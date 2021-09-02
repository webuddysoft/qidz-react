import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import config from './config'


localStorage.setItem('languageId','en') 
localStorage.setItem('cityId',1)
localStorage.setItem('city','Dubai')
localStorage.setItem('lang','["en"]')

let staticLanguage='';
axios.get(config.apiRootLang, {})
    .then((response) => {
      staticLanguage=response.data;
      console.log(staticLanguage,'staticLanguage');
      
      ReactDOM.render(
        <React.StrictMode>
          <App staticLanguage={staticLanguage} />
        </React.StrictMode>,
        document.getElementById('root')
      );
    })
    .catch((error) => {
        console.log(error);
    })
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
