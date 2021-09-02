import React, { Component } from 'react'
import ModalService from './services/modal.service'
import axios from 'axios'
import config from '../config'
import Loader from 'react-loader'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ReactFlagsSelect from 'react-flags-select'

class RegisterModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: this.props.show,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      passwordConfirmationErrorMessage: '',
      commonErrorMessage: '',
      nameErrorMessage: '',
      loaded: false,
      isloading: false,
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      termCondition: false,
      phoneErrorMessage: '',
      termsErrorMessage: '',
      countryErrorMessage: '',
      phone: '',
      countrySelected: '',
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage
    }
    console.log(this.props.staticLanguage, 'register')
  }
  handleShow () {
    this.setState({ show: true })
  }
  onEmailChange (event) {
    this.setState({ email: event.target.value, emailErrorMessage: '' })
  }
  onPasswordChange (event) {
    this.setState({ password: event.target.value, passwordErrorMessage: '' })
  }
  onPasswordConfirmationChange (event) {
    this.setState({
      passwordConfirmation: event.target.value,
      passwordConfirmationErrorMessage: ''
    })
  }
  onNameChange (event) {
    this.setState({ name: event.target.value, nameErrorMessage: '' })
  }
  phoneChange (phone) {
    this.setState({ phone: phone, phoneErrorMessage: '' })
  }
  countryChange (countrySelected) {
    this.setState({ countrySelected: countrySelected, countryErrorMessage: '' })
  }
  Register () {
    const {
      email,
      password,
      passwordConfirmation,
      name,
      phone,
      countrySelected,
      termCondition,
      termsErrorMessage,
      staticLanguage,
      cityId,
      languageId
    } = this.state
    if (email === '') {
      this.setState({
        emailErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.email_error
            : 'Please enter email'
      })
    }
    if (password === '') {
      this.setState({
        passwordErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.password_error
            : 'Please enter password'
      })
    }
    if (passwordConfirmation === '') {
      this.setState({
        passwordConfirmationErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.password_confirm_error
            : 'Please enter confirm password'
      })
    }
    if (name.trim() === '') {
      this.setState({
        nameErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.name_error
            : 'Please enter name'
      })
    }
    if (countrySelected === '') {
      this.setState({
        countryErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.nationality_error
            : 'Please select Nationality'
      })
    }
    if (phone === '') {
      this.setState({
        phoneErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.phone_error
            : 'Please phone number'
      })
    }
    if (termCondition === false || termCondition === '') {
      this.setState({
        termsErrorMessage:
          languageId === config.lang
            ? staticLanguage.common.accept_error
            : 'Please accept terms and conditions'
      })
    }
    if (
      name.trim() != '' &&
      email != '' &&
      password != '' &&
      countrySelected != '' &&
      phone != '' &&
      termsErrorMessage === ''
    ) {
      this.setState({
        isloading: true,
        commonErrorMessage:"",
        countryErrorMessage: '',
        emailErrorMessage: '',
        passwordErrorMessage: '',
        passwordConfirmationErrorMessage: '',
        nameErrorMessage: '',
        termsErrorMessage: ''
      })
      let body = {
        user: {
          email: this.state.email,
          password: this.state.password,
          password_confirmation: this.state.passwordConfirmation,
          name: this.state.name.trim(),
          loading: true,
          focus: true,
          gets_credit_after_signup: true,
          phone: phone,
          country: countrySelected
        }
      }
      axios
        .post(config.qidz.endpoints.register+"?tenantId="+cityId+"&locale="+languageId, {
          data: body
        })
        .then(response => {
          console.log(response, 'register response')
          if (response.data.error) {
            this.setState({
              isloading: false,
              commonErrorMessage: response.data.error,
              loaded: true,
              thankyouMessage: ''
            })
          } else {
            // localStorage.setItem('settoken', response.data.authentication_token);
            // localStorage.setItem('name', response.data.name);
            // localStorage.setItem('email', response.data.email);
            // localStorage.setItem('phone', response.data.phone);
            this.setState(
              {
                token: response.data.authentication_token,
                id: response.data.id,
                // loaded: true,
                openLogin: false,
                isloading: false,
                commonErrorMessage: '',

                thankyouMessage:
                  languageId === config.lang
                    ? staticLanguage.common.register_confirm
                    : 'You have to confirm your email address before continuing'
              },
              this.clearAll
            )
            // ModalService.close(true);
            // window.location.reload();
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  clearAll () {
    this.setState({
      name:'',
      termCondition: false,
      email: '',
      password: '',
      passwordConfirmation: '',
      phone: 'ae',
      countrySelected: ''
    })
  }
  onChangeAccept (event) {
    //alert(event.target.value)
    if(event.target.value==true){
      this.setState({ termCondition: false, termsErrorMessage: '' })
    }else{
      this.setState({ termCondition: true, termsErrorMessage: '' })
    }
    // this.setState({ termCondition: event.target.value, termsErrorMessage: '' })
  }

  render () {
    const { isloading, countrySelected, staticLanguage } = this.state
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
            ? staticLanguage.register.register
            : 'Register'}
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
              ? staticLanguage.register.title
              : 'Name:'}
            <span className='required_star'>*</span>
          </label>
          <input
            type='text'
            value={this.state.name?this.state.name:""}
            placeholder={
              languageId === config.lang
                ? staticLanguage.register.title
                : 'Name'
            }
            onChange={e => this.onNameChange(e)}
          />
          <span className='error_message2'>{this.state.nameErrorMessage}</span>
        </div>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.register.email_label
              : 'E-mail:'}
            <span className='required_star'>*</span>
          </label>
          <input
            type='text'
            value={this.state.email?this.state.email:""}
            placeholder={
              languageId === config.lang
                ? staticLanguage.register.email_label
                : 'E-mail'
            }
            onChange={e => this.onEmailChange(e)}
          />
          <span className='error_message2'>{this.state.emailErrorMessage}</span>
        </div>
        <div className='row'>
          <div className='review_inputs d-flex col-md-6'>
            <label>
              {languageId === config.lang
                ? staticLanguage.register.password
                : 'Password:'}
              <span className='required_star'>*</span>
            </label>
            <input
              type='password'
              value={this.state.password?this.state.password:""}
              placeholder={
                languageId === config.lang
                  ? staticLanguage.register.password
                  : 'Password'
              }
              onChange={e => this.onPasswordChange(e)}
            />
            <span className='error_message2'>
              {this.state.passwordErrorMessage}
            </span>
          </div>
          <div className='review_inputs d-flex col-md-6'>
            <label>
              {languageId === config.lang
                ? staticLanguage.register.confirm_password
                : 'Password Confirmation'}
              <span className='required_star'>*</span>
            </label>
            <input
              type='password'
              value={this.state.passwordConfirmation?this.state.passwordConfirmation:""}
              placeholder={
                languageId === config.lang
                  ? staticLanguage.register.confirm_password
                  : 'Password Confirmation'
              }
              onChange={e => this.onPasswordConfirmationChange(e)}
            />
            <span className='error_message2'>
              {this.state.passwordConfirmationErrorMessage}
            </span>
            {/* {isloading && <Loader options={config.options} loaded={this.state.loaded}></Loader>} */}
          </div>
        </div>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.profile.choose_nationality
              : 'Nationality:'}
            <span className='required_star'>*</span>
          </label>
          {/* <input type="text" placeholder="Phone Number" onChange={(e) => this.onSelectPhoneNumber(e)} /> */}
          <ReactFlagsSelect
            selected={countrySelected}
            placeholder={
              languageId === config.lang
                ? staticLanguage.profile.choose_nationality
                : 'Choose Nationality'
            }
            onSelect={countrySelected => this.countryChange(countrySelected)}
          />
          <span className='error_message2'>
            {this.state.countryErrorMessage}
          </span>
        </div>

        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.common.phone_number
              : 'Phone Number:'}
            <span className='required_star'>*</span>
          </label>
          {/* <input type="text" placeholder="Phone Number" onChange={(e) => this.onSelectPhoneNumber(e)} /> */}
          <PhoneInput
            country={'ae'}
            placeholder='Enter Phone Number'
            placeholder={countrySelected}
            value={this.state.phone ? this.state.phone : ''}
            onChange={phone => this.phoneChange(phone)}
          />
          <span className='error_message2'>{this.state.phoneErrorMessage}</span>
        </div>
        <div className='custom-control custom-checkbox terms-register'>
          <input
            type='checkbox'
            checked={this.state.termCondition==true?true:false}
            className='custom-control-input'
            onChange={e => this.onChangeAccept(e)}
          />
          <label className='custom-control-label' for='defaultChecked'>
            {languageId === config.lang
              ? staticLanguage.common.accept
              : 'Accept'}{' '}
            <a href='/terms-and-conditions' target='_blank'>
              {languageId === config.lang
                ? staticLanguage.common.terms_condition
                : 'Terms & Conditions'}
            </a>{' '}
            {languageId === config.lang
              ? staticLanguage.common.to_process
              : ' to continue process.'}
          </label>
          <span className='error_message2'>{this.state.termsErrorMessage}</span>
        </div>
        <span className='error_message2'>{this.state.commonErrorMessage}</span>
        <div className='review_inputs d-flex register_btn'>
          <button type='button' onClick={() => this.Register()}>
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
                  ? staticLanguage.activity.post_review
                  : 'Register'}
              </span>
            )}
          </button>
        </div>
      </div>
    )
  }
}
export default RegisterModal
