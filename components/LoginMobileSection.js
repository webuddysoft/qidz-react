import React, { Component } from 'react'
import ModalService from './services/modal.service'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import config from '../config'
import {FaBars} from 'react-icons/fa'; 

class LoginMobileSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cityId: localStorage.getItem('cityId'),
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      showAlert: false
    }
    // console.log(th);
  }

  showModal (form) {
    if (form === 'login') {
      ModalService.open(
        <LoginModal show={true} staticLanguage={this.state.staticLanguage} />,
        {
          modalClass: 'login-component',
          width: 800,
          padding: 0,
          overFlow: 'hidden'
        }
      )
    }
    if (form === 'register') {
      ModalService.open(
        <RegisterModal
          show={true}
          staticLanguage={this.state.staticLanguage}
        />,
        {
          modalClass: 'register-component',
          width: 800,
          padding: 0,
          overFlow: 'hidden'
        }
      )
    }
  }
  Logout () {
    localStorage.clear()
    window.open('/', '_self')
  }
  alertClick () {
    this.setState({ showAlert: true })
  }
  render () {
    const token = localStorage.getItem('settoken')
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    return (
      <>
        <nav className='navbar navbar-default'>
          <div className='navbar-header'>
            <button
              type='button'
              className='navbar-toggle collapsed'
              data-toggle='collapse'
              data-target='#navbar-main'
              aria-expanded='false'
            >
              <FaBars size="15px" />
            </button>
          </div>
          {this.state.showAlert == true && (
            <div id='show'>
              <div id='title'></div>
              <div id='description'></div>
              <div id='button'></div>
            </div>
          )}
          <div className='collapse navbar-collapse' id='navbar-main'>
            <ul className='nav navbar-nav'>
              <li>
                <a href={languageId == 'en' ? '/blog' : '/ar/blog'}>
                  {' '}
                  {languageId === config.lang
                    ? staticLanguage.common.our_blog
                    : 'Our Blog'}
                </a>
              </li>
              <li className='cont_ic'>
                <a onClick={e => this.alertClick(e)}>
                  {languageId === config.lang
                    ? staticLanguage.common.alerts
                    : 'Alerts'}
                </a>
              </li>
              {token === null || token === undefined ? (
                <li>
                  <a href onClick={() => this.showModal('login')}>
                    {languageId === config.lang
                      ? staticLanguage.login.login
                      : 'Login'}
                  </a>
                </li>
              ) : (
                ''
              )}
              {token === null || token === undefined ? (
                <li>
                  <a href onClick={() => this.showModal('register')}>
                    {languageId === config.lang
                      ? staticLanguage.register.register
                      : 'Register'}
                  </a>
                </li>
              ) : (
                <div className='dropdown user_menu'>
                  <a
                    className='dropdown-toggle'
                    href={
                      languageId == 'en'
                        ? '/user-profile/'
                        : '/ar/user-profile/'
                    }
                    id='dropdownMenu1'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    {localStorage.getItem('name')}
                  </a>
                  <div className='dropdown-menu' aria-labelledby='dropdownMenu1'>
                    <a
                      className='dropdown-item'
                      href={
                        languageId == 'en'
                          ? '/user-profile/'
                          : '/ar/user-profile/'
                      }
                    >
                      {' '}
                      {languageId === config.lang
                        ? staticLanguage.common.my_profile
                        : 'My Profile'}
                    </a>
                    <a
                      className='dropdown-item'
                      href={
                        languageId == 'en' ? '/my-booking/' : '/ar/my-booking/'
                      }
                    >
                      {' '}
                      {languageId === config.lang
                        ? staticLanguage.common.my_profile
                        : 'My Bookings'}
                    </a>
                    <a className='dropdown-item' href onClick={() => this.Logout()}>
                      {' '}
                      {languageId === config.lang
                        ? staticLanguage.profile.logout_title
                        : 'Log out'}
                    </a>
                  </div>
                </div>
              )}
              <li>
                <a
                  href={
                    languageId == 'en'
                      ? 'become-a-partner/'
                      : '/ar/become-a-partner/'
                  }
                  target='_blank'
                >
                  {languageId === config.lang
                    ? staticLanguage.common.partner_with_us
                    : 'Partner With Us'}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </>
    )
  }
}
export default LoginMobileSection
