import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import ModalService from './services/modal.service'
import Loader from 'react-loader'
import { lang } from 'moment'

class ForgotModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: this.props.show,
      emailErrorMessage: '',
      userResetId: '',
      loaded: true,
      isloading: false,
      email: '',
      thankyouMessage: '',
      passwordErrorMessage: '',
      cityId: localStorage.getItem('cityId'),
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
  }
  ForgotPassword () {
    const {staticLanguage}=this.state;
    const languageId = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    const { email } = this.state
    if (email === '') {
      this.setState({
        emailErrorMessage: languageId === config.lang
        ? staticLanguage.common.email_error_message
        : 'Please enter a valid email address with ( @ ) sign'
      })
      return false
    }
    if (email != '') {
      this.setState({
        emailErrorMessage: '',
        passwordErrorMessage: '',
        thankyouMessage: ''
      })
      this.setState({ isloading: true })
      let body = { email: this.state.email }
      axios
        .post(
          config.qidz.endpoints.forgotPassword +
            '?tenant_id=' +
            tenant_id +
            '&locale=' +
            languageId,
          {
            data: body
          }
        )
        .then(response => {
          console.log(response, 'forgot response')
          if (response.data.error) {
            this.setState({
              emailErrorMessage:'',
              passwordErrorMessage:
                languageId === config.lang
                  ? staticLanguage.common.correct_ep_error
                  : 'Enter correct Email & password',
              thankyouMessage: ''
            })
          } else {
            if (response.data.id) {
              this.setState({
                email:'',
                userResetId: response.data.id,
                loaded: true,
                isloading: false,
                thankyouMessage:
                  languageId === config.lang
                    ? staticLanguage.common.reset_message
                    : 'Please check email and reset your password'
              },this.clearAll)
              // ModalService.close(true)
            }
            if (response.data.id == null) {
              this.setState({
                loaded: true,
                isloading: false,
                thankyouMessage: '',
                passwordErrorMessage:
                  languageId === config.lang
                    ? staticLanguage.common.email_register
                    : 'The email is not registered with Qidz'
              })
              // ModalService.close(true)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  clearAll(){
    this.setState({email:""})
  }
  onEmailChange (event) {
    const {staticLanguage}=this.state;
    const languageId = localStorage.getItem('languageId')
    const email = event.target.value
    let lastAtPos = email.lastIndexOf('@')
    let lastDotPos = email.lastIndexOf('.')
    if (
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        email.indexOf('@@') == -1 &&
        lastDotPos > 2 &&
        email.length - lastDotPos > 2
      )
    ) {
      this.setState({
        email: event.target.value, 
        emailErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.email_error_message
            : 'Please enter a valid email address with ( @ ) sign'
      })
    } else {
      this.setState({ email: event.target.value, emailErrorMessage: '' })
    }
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
          {languageId === config.lang
            ? staticLanguage.login.forgot
            : 'Forgot Password'}
        </h3>
        <span className='thankyouMessage'>
          {this.state.thankyouMessage && (
            <span className=' alert alert-success'>
              {this.state.thankyouMessage}
            </span>
          )}
        </span>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.login.email_label
              : 'E-mail:'}
          </label>
          <input
            type='text'
            value={this.state.email?this.state.email:""}
            placeholder={
              languageId === config.lang
                ? staticLanguage.login.email_label
                : 'E-mail'
            }
            onChange={e => this.onEmailChange(e)}
          />
          <span className='error_message2'>{this.state.emailErrorMessage}</span>
        </div>
        <span className='error_message2'>
          {this.state.passwordErrorMessage}
        </span>

        {isloading && (
          <Loader options={config.options} loaded={this.state.loaded}></Loader>
        )}
        <div className='review_inputs d-flex pp_form_submit'>
          <button type='button' onClick={() => this.ForgotPassword()}>
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
                  ? staticLanguage.shared.reset
                  : 'Reset Password'}
              </span>
            )}
          </button>
        </div>
      </div>
    )
  }
}
export default ForgotModal
