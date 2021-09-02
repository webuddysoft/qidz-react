import React, { Component } from 'react'
import ModalService from './services/modal.service'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import config from '../config'

class LoginSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cityId: localStorage.getItem('cityId'),
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
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
    // localStorage.removeItem('settoken')
    // localStorage.removeItem('userId')
    // localStorage.removeItem('name')
    // localStorage.removeItem('email')
    // localStorage.removeItem('phone')
    // localStorage.removeItem('promo_code_id')
    // localStorage.removeItem('wallet_id')
    // localStorage.removeItem('wallet_balance')
    // localStorage.removeItem('point_details')
    // localStorage.removeItem('children')
    // localStorage.removeItem('profileImage')
    // localStorage.removeItem('nationality')
    // localStorage.removeItem('favorite_activities')
    // localStorage.removeItem('points_level')
    window.open('/', '_self')
  }

  render () {
    const token = localStorage.getItem('settoken')
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    
    return (
      <>
        <div className='login_section'>
          {token === null || token === undefined ? (
            <a href="#" onClick={() => this.showModal('login')}>
              {languageId === config.lang
                ? staticLanguage.login.login
                : 'Login'}
            </a>
          ) : (
            // <a href="javascript:void(0)" onClick={() => this.Logout()}>Logout</a>
            <div className='dropdown user_menu'>
              <a
                className='dropdown-toggle'
                href={ languageId=='en' ? '/user-profile/':'/ar/user-profile/'}
                id='dropdownMenu1'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                {localStorage.getItem('name')}
              </a>
              <div className='dropdown-menu' aria-labelledby='dropdownMenu1'>
                <a className='dropdown-item' href={languageId=='en'?'/user-profile/':'/ar/user-profile/'}>
                  {' '}
                  {languageId === config.lang
                    ? staticLanguage.common.my_profile
                    : 'My Profile'}
                </a>
                <a className='dropdown-item' href={languageId=='en'?'/my-booking/':'/ar/my-booking/'}>
                  {' '}
                  {languageId === config.lang
                    ? staticLanguage.common.my_profile
                    : 'My Bookings'}
                </a>
                <a className='dropdown-item' href="#" onClick={() => this.Logout()}>
                  {' '}
                  {languageId === config.lang
                    ? staticLanguage.profile.logout_title
                    : 'Log out'}
                </a>
              </div>
            </div>
          )}
          {token === null || token === undefined ? ' / ' : ''}
          {token === null || token === undefined ? (
            <a href="#" onClick={() => this.showModal('register')}>
              {languageId === config.lang
                ? staticLanguage.register.register
                : 'Register'}
            </a>
          ) : (
            ''
          )}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href={languageId=='en'?'become-a-partner/':'/ar/become-a-partner/'} target='_blank'>
            {languageId === config.lang
              ? staticLanguage.common.partner_with_us
              : 'Partner With Us'}
          </a>
        </div>
      </>
    )
  }
}
export default LoginSection
