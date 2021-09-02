import React, { Component } from 'react'
import config from '../config'

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
        <div class='top-header-left col-md-6'>
          <div class='download_label'>{languageId === config.lang
                          ? staticLanguage.common.download_now
                          : 'DOWNLOAD NOW'}</div>
          <div class='app_btn'>
            <a href={config.appStoreUrl} target='_blank'>
              <img src='/wp-content/themes/wpreactqidz/assets/images/apple.png' />
            </a>
          </div>
          <div class='app_btn'>
            <a href={config.googlePlayUrl} target='_blank'>
              <img src='/wp-content/themes/wpreactqidz/assets/images/google.png' />
            </a>
          </div>
        </div>
      </>
    )
  }
}
export default DownloadSection
