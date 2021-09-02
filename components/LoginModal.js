import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import ModalService from './services/modal.service'
import Loader from 'react-loader'
import RegisterModal from './RegisterModal'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import ForgotModal from './ForgotModal'

const language = localStorage.getItem('language')
const tenant_id = localStorage.getItem('cityId')

class LoginModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: this.props.show,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      loaded: true,
      isloading: false,
      email: '',
      password: '',
      cityId: localStorage.getItem('cityId'),
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
  }
  handleShow () {
    this.setState({ show: true })
  }
  showModal () {
    ModalService.open(
      <RegisterModal show={true} staticLanguage={this.state.staticLanguage} />,
      {
        modalClass: 'register-component',
        width: 800,
        padding: 0,
        overFlow: 'hidden'
      }
    )
  }
  onEmailChange (event) {
    this.setState({ email: event.target.value })
  }
  onPasswordChange (event) {
    this.setState({ password: event.target.value })
  }
  Login () {
    const { email, password,staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const tenantId = localStorage.getItem('cityId')
    if (email === '') {
      this.setState({ emailErrorMessage:(languageId === config.lang
        ? staticLanguage.common.email_error
        :'Please enter email') })
      return false
    }
    if (password === '') {
      this.setState({ passwordErrorMessage:  (languageId === config.lang
        ? staticLanguage.common.password_error
        :'Please enter password')  })
      return false
    }
    if (email != '' && password != '') {
      this.setState({ isloading: true })
      this.setState({ emailErrorMessage: '', passwordErrorMessage: '' })
      let body = {
        user: {
          email: this.state.email,
          password: this.state.password
        }
      }
      axios
        .post(config.qidz.endpoints.login+'?tenantId='+tenantId+'&locale='+languageId, {
          data: body
        })
        .then(response => {
          if (response.data.error) {
            this.setState({
              isloading: false,
              passwordErrorMessage: (languageId === config.lang
                ? staticLanguage.common.correct_ep_error
                :'Enter correct Email & password')
            })
          } else {
            localStorage.setItem('settoken', response.data.authentication_token)
            localStorage.setItem('userId', response.data.id)
            localStorage.setItem('name', response.data.name)
            localStorage.setItem('email', response.data.email)
            localStorage.setItem('phone', response.data.phone)
            localStorage.setItem('promo_code_id', response.data.promo_code_id)
            localStorage.setItem('wallet_id', response.data.wallet.id)
            localStorage.setItem('wallet_balance', response.data.wallet.balance)
            localStorage.setItem(
              'point_details',
              JSON.stringify(response.data.point_details)
            )
            localStorage.setItem('children', response.data.children)
            localStorage.setItem('profileImage', response.data.full_avatar_url)
            localStorage.setItem('nationality', response.data.nationality)
            let favActivity = []
            response.data.favorite_activities.map((fav, i) => {
              favActivity.push({ id: fav.id })
            })
            localStorage.setItem(
              'favorite_activities',
              JSON.stringify(favActivity)
            )
            localStorage.setItem(
              'points_level',
              JSON.stringify(response.data.points_level)
            )
            this.setState({
              token: response.data.authentication_token,
              name: response.data.name,
              loaded: true,
              isloading: false,
              openLogin: false
            })
            ModalService.close(true)
            window.location.reload()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  responseFacebook (user) {
    const language = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    let body = {
      user: {
        phone: null,
        ages: [],
        skipped: false,
        favorite_activities: [],
        categories: [],
        location: null,
        facebook: {
          userId: user.id,
          permissions: ['email', 'public_profile'],
          token: user.accessToken,
          tokenExpirationDate: user.data_access_expiration_time
        },
        apple: null,
        google: null,
        avatar_url: null,
        avatar: null,
        email: user.email,
        points: 1100,
        name: user.name,
        areas: [],
        authentication_token: '',
        id: null,
        startups: 9,
        phoneSaved: true,
        points_level: {
          name: 'Fun champion',
          range: '1000 - 1499 points',
          max: 1499
        },
        point_details: {
          actions: [
            {
              type: 'review',
              points: 50
            },
            {
              type: 'suggestion_add',
              points: 50
            },
            {
              type: 'suggestion_edit',
              points: 40
            },
            {
              type: 'share',
              points: 50
            },
            {
              type: 'reservation',
              points: 50
            }
          ],
          levels: [
            {
              name: 'Fun explorer',
              range: '0 - 499 points',
              max: 499
            },
            {
              name: 'Fun superstar',
              range: '500 - 999 points',
              max: 999
            },
            {
              name: 'Fun champion',
              range: '1000 - 1499 points',
              max: 1499
            },
            {
              name: 'Fun guru',
              range: '1500 - 1999 points',
              max: 1999
            },
            {
              name: 'Fun master',
              range: '2000 points',
              max: 99999999
            }
          ]
        },
        nationality: {},
        promo_code_id: null,

        last_shown_deal: null,
        children: [],
        city: null,
        gets_credit_after_signup: false,
        password: '',
        confirmed_at: '2017-09-18T12:10:50.765Z',
        full_avatar_url:
          'http://staging.qidz.com/system/users/avatars/000/000/021/thumb/temp1558691388.jpg?1558691386',
        area_ids: [],
        category_ids: [],
        all_points: [
          {
            created_at: '2017-12-19T21:25:57.786Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2017-12-21T08:45:03.318Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2017-12-21T17:38:24.322Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2017-12-21T17:49:36.554Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2017-12-21T18:10:25.354Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2018-10-08T09:01:21.283Z',
            kind: 'share',
            points: 50
          },
          {
            created_at: '2019-11-10T12:37:54.001Z',
            kind: 'share',
            points: 50
          }
        ],
        total_points: 1100,
        wallet: {
          id: null,
          balance: 0
        },
        ages_list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 99, 12]
      }
    }
    axios
      .post(
        config.qidz.endpoints.socialLogin +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          language,
        {
          data: body
        }
      )
      .then(response => {
        if (response.data && response.data.id) {
          localStorage.setItem('settoken', response.data.authentication_token)
          localStorage.setItem('userId', response.data.id)
          localStorage.setItem('name', response.data.name)
          localStorage.setItem('email', response.data.email)
          localStorage.setItem('phone', response.data.phone)
          localStorage.setItem('promo_code_id', response.data.promo_code_id)
          localStorage.setItem('wallet_id', response.data.wallet.id)
          localStorage.setItem('wallet_balance', response.data.wallet.balance)
          localStorage.setItem(
            'point_details',
            JSON.stringify(response.data.point_details)
          )
          localStorage.setItem('children', response.data.children)
          localStorage.setItem('profileImage', response.data.full_avatar_url)
          localStorage.setItem('nationality', response.data.nationality)
          let favActivity = []
          response.data.favorite_activities.map((fav, i) => {
            favActivity.push({ id: fav.id })
          })
          localStorage.setItem(
            'favorite_activities',
            JSON.stringify(favActivity)
          )
          localStorage.setItem(
            'points_level',
            JSON.stringify(response.data.points_level)
          )
          window.location.reload()
        } else {
          if (response.data && response.data.error) {
            
            alert(response.data.error);
            // this.setState({fbErrorMessage:response.data.error})
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  componentClicked () {}
  responseGoogle (user) {
    const language = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    if (user.tokenObj != '' && user.tokenObj!=undefined) {
      let body = {
        user: {
          phone: null,
          ages: [],
          skipped: false,
          favorite_activities: [],
          categories: [],
          location: null,
          facebook: null,
          apple: null,
          google: {
            idToken: user.tokenObj.id_token,
            serverAuthCode: user.tokenObj.access_token,
            scopes: [
              'https://www.googleapis.com/auth/userinfo.email',
              'openid',
              'https://www.googleapis.com/auth/userinfo.profile'
            ],
            user: {
              photo: user.profileObj.imageUrl,
              givenName: user.profileObj.givenName,
              familyName: user.profileObj.familyName,
              name:
                user.profileObj.givenName + ' ' + user.profileObj.familyName,
              email: user.profileObj.email,
              id: user.profileObj.googleId
            }
          },
          avatar_url: null,
          avatar: null,
          email: user.profileObj.email,
          points: 1100,
          name: user.profileObj.givenName + ' ' + user.profileObj.familyName,
          areas: [],
          authentication_token: null,
          id: null,
          startups: 9,
          phoneSaved: true,
          points_level: {
            name: 'Fun champion',
            range: '1000 - 1499 points',
            max: 1499
          },
          point_details: {
            actions: [
              {
                type: 'review',
                points: 50
              },
              {
                type: 'suggestion_add',
                points: 50
              },
              {
                type: 'suggestion_edit',
                points: 40
              },
              {
                type: 'share',
                points: 50
              },
              {
                type: 'reservation',
                points: 50
              }
            ],
            levels: [
              {
                name: 'Fun explorer',
                range: '0 - 499 points',
                max: 499
              },
              {
                name: 'Fun superstar',
                range: '500 - 999 points',
                max: 999
              },
              {
                name: 'Fun champion',
                range: '1000 - 1499 points',
                max: 1499
              },
              {
                name: 'Fun guru',
                range: '1500 - 1999 points',
                max: 1999
              },
              {
                name: 'Fun master',
                range: '2000 points',
                max: 99999999
              }
            ]
          },
          nationality: {},
          promo_code_id: null,
          last_shown_deal: null,
          children: [],
          city: null,
          gets_credit_after_signup: false,
          password: '',
          confirmed_at: '2017-09-18T12:10:50.765Z',
          full_avatar_url: user.profileObj.imageUrl,
          area_ids: [],
          category_ids: [],
          all_points: [
            {
              created_at: '2017-12-19T21:25:57.786Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2017-12-21T08:45:03.318Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2017-12-21T17:38:24.322Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2017-12-21T17:49:36.554Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2017-12-21T18:10:25.354Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2018-10-08T09:01:21.283Z',
              kind: 'share',
              points: 50
            },
            {
              created_at: '2019-11-10T12:37:54.001Z',
              kind: 'share',
              points: 50
            }
          ],
          total_points: 1100,
          wallet: {
            id: null,
            balance: 0
          },
          ages_list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 99, 12]
        }
      }
      axios
        .post(
          config.qidz.endpoints.socialLogin +
            '?tenant_id=' +
            tenant_id +
            '&locale=' +
            language,
          {
            data: body
          }
        )
        .then(response => {
          if (response.data && response.data.id) {
            localStorage.setItem('settoken', response.data.authentication_token)
            localStorage.setItem('userId', response.data.id)
            localStorage.setItem('name', response.data.name)
            localStorage.setItem('email', response.data.email)
            localStorage.setItem('phone', response.data.phone)
            localStorage.setItem('promo_code_id', response.data.promo_code_id)
            localStorage.setItem('wallet_id', response.data.wallet.id)
            localStorage.setItem('wallet_balance', response.data.wallet.balance)
            localStorage.setItem(
              'point_details',
              JSON.stringify(response.data.point_details)
            )
            localStorage.setItem('children', response.data.children)
            localStorage.setItem('profileImage', response.data.full_avatar_url)
            localStorage.setItem('nationality', response.data.nationality)
            let favActivity = []
            response.data.favorite_activities.map((fav, i) => {
              favActivity.push({ id: fav.id })
            })
            localStorage.setItem(
              'favorite_activities',
              JSON.stringify(favActivity)
            )
            localStorage.setItem(
              'points_level',
              JSON.stringify(response.data.points_level)
            )
            window.location.reload()
          } else {
            if (response.data && response.data.error) {
              alert(response.data.error)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  forgotPassword () {
    ModalService.open(
      <ForgotModal show={true} staticLanguage={this.state.staticLanguage} />,
      {
        modalClass: 'forgot-component',
        width: 800,
        padding: 0,
        overFlow: 'hidden'
      }
    )
  }
  render () {
    const { isloading, staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    return (
      <div className='reveiw_form_section'>
        <span
          className='icon icon-close'
          onClick={e => ModalService.close(true)}
        >
          <svg
            width='28'
            height='28'
            viewBox='0 0 36 36'
            data-testid='close-icon'
          >
            <path d='M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z'></path>
          </svg>
        </span>
        <h3>
          {languageId === config.lang ? staticLanguage.login.login : 'Login'}
        </h3>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.login.email_label
              : 'Email:'}
          </label>
          <input
            type='text'
            placeholder={
              languageId === config.lang
                ? staticLanguage.login.email_label
                : 'E-mail'
            }
            onChange={e => this.onEmailChange(e)}
          />
          <span className='error_message2'>{this.state.emailErrorMessage}</span>
        </div>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.login.password
              : 'Password:'}
          </label>
          <input
            type='password'
            placeholder={
              languageId === config.lang
                ? staticLanguage.login.password
                : 'Password'
            }
            onChange={e => this.onPasswordChange(e)}
          />
          <span className='error_message2'>
            {this.state.passwordErrorMessage}
          </span>
          <a
            className='pass_link'
            href
            onClick={() => this.forgotPassword()}
          >
            {languageId === config.lang
              ? staticLanguage.login.forgot
              : 'Forgot Password?'}
          </a>
        </div>
        {isloading && (
          <Loader options={config.options} loaded={this.state.loaded}></Loader>
        )}
        <div className='review_inputs d-flex pp_form_submit'>
          <button type='button' onClick={() => this.Login()}>
            {isloading && (
              <span>
                {languageId === config.lang
                  ? staticLanguage.common.loading
                  : 'Loading...'}
              </span>
            )}
            {!isloading && (
              <span>
                {languageId === config.lang
                  ? staticLanguage.login.login
                  : 'Login'}
              </span>
            )}
          </button>
        </div>
        <div className='row'>
          <div className="col-md-6 social_login">
            <FacebookLogin
            textButton= {languageId === config.lang
              ? staticLanguage.login.facebook
              : 'Login with Facebook'}
              appId={config.fbAppId}
              fields='name,email'
              onClick={this.componentClicked}
              callback={this.responseFacebook}
              redirectUri={window.location.href}
              isMobile={false}
            />
          </div>
          <div className="col-md-6 social_login">
            <GoogleLogin
              clientId={config.googleClientId}
              buttonText= {languageId === config.lang
                ? staticLanguage.login.google
                : 'Login with Google'}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </div>
        <div>
          <span className="error_message2">
{this.state.fbErrorMessage}
          </span>
        </div>

        <div className='signup_link'>
          {languageId === config.lang
            ? staticLanguage.common.not_member
            : 'Not a Member?'}
          <a
            href
            onClick={() => this.showModal('register')}
          >
            {languageId === config.lang
              ? staticLanguage.register.join
              : 'Signup Now!'}
          </a>
        </div>
      </div>
    )
  }
}
export default LoginModal
