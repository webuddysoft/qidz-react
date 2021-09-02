import React, { Component } from 'react'
import config from '../config'
import applePng from "../assets/images/apple.png";
import googlePng from "../assets/images/google.png";

class DownloadSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : ''
    }
  }
  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <>
        <div className='top-header-left col-md-6'>
          <div className='download_label'>{languageId === config.lang
                          ? staticLanguage.common.download_now
                          : 'DOWNLOAD NOW'}</div>
          <div className='app_btn'>
            <a href={config.appStoreUrl} target='_blank'>
              <img src={applePng} />
            </a>
          </div>
          <div className='app_btn'>
            <a href={config.googlePlayUrl} target='_blank'>
              <img src={googlePng} />
            </a>
          </div>
        </div>
      </>
    )
  }
}
export default DownloadSection
