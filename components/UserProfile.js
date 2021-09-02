import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import Select from 'react-select'
import ReactFlagsSelect from 'react-flags-select'
import Loader from 'react-loader'
import { InlineShareButtons } from 'sharethis-reactjs'
import MyWalletModal from './MyWalletModal'
import ModalService from './services/modal.service'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment/moment'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import LoginModal from './LoginModal'

const language = localStorage.getItem('language')
const tenant_id = localStorage.getItem('cityId')

class UserProfile extends Component {
  constructor (props) {
    super(props)
    let loc = localStorage.getItem('location')
      ? JSON.parse(localStorage.getItem('location'))
      : null
    let cat = localStorage.getItem('category')
      ? JSON.parse(localStorage.getItem('category'))
      : ''
    let resultCat = []
    cat &&
      cat.filter(function (number) {
        resultCat.push(number.value)
      })
    let resultLoc = []
    loc &&
      loc.filter(function (number) {
        resultLoc.push(number.value)
      })

    this.state = {
      loaded: false,
      profileName: '',
      name: '',
      wallet: localStorage.getItem('wallet_balance'),
      phone: localStorage.getItem('phone'),
      profileCity: '',
      email: '',
      profileImage: '',
      point_details: localStorage.getItem('point_details'),
      nationality: '',
      ProfileThankyouMessage: '',
      kidsThankyouMessage: '',
      reviewThankyouMessage: '',
      reviewsRatingError: '',
      reviewsCommentError: '',
      reviewsActivityError: '',
      reviewErrorMessage: '',
      errorProfileMessage:"",
      OpenSharePopUp: false,
      howToScore: false,
      userProfile: true,
      editProfile: false,
      children: false,
      leaveReview: false,
      categories: '',
      areas: '',
      isRemoveloading: false,
      isLoadingUpload: false,
      isProfileLoading: false,
      starRating: '',
      addMore: [],
      errorMessage: '',
      location: resultLoc,
      category: resultCat,
      childrenList: [],
      profilecityId:'',
      selectedLocationOption: localStorage.getItem('location')
        ? JSON.parse(localStorage.getItem('location'))
        : '',
      selectedCategoryOption: localStorage.getItem('category')
        ? JSON.parse(localStorage.getItem('category'))
        : '',
      selectedActivityOption: [],
      isloading: false,
      city: localStorage.getItem('city'),
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      pointsLevel: '',
      allPoints: '',
      selectCatLength: 0,
      childDOB: '',
      childFirstName: '',
      childLastName: ''
    }
    this.categoryOptions = []
    this.areasOptions = []
    this.category = []
    this.location = []
    this.activityOptions = []
  }
  componentDidMount () {
    let token = localStorage.getItem('settoken')
    //this.cleverTap();
    if (token != null) {
      this.getCategories()
      this.cities()
      this.getUserDetails()
    } else {
      window.open('/', '_self')
    }
  }
  cleverTap () {
    axios
      .post('https://api.clevertap.com/1/message/report.json', {
        data: '{"from":"20210101","to":"20211225"}'
      })
      .then(response => {
        console.log(response, 'sssssssssss')
      })
      .catch(error => {
        console.log(error)
      })
  }
  myWallet () {
    ModalService.open(
      <MyWalletModal show={true} staticLanguage={this.state.staticLanguage} />,
      {
        modalClass: 'myWallet-component',
        width: 800,
        padding: 0,
        overFlow: 'hidden'
      }
    )
  }
  howToScorePoints () {
    this.setState({
      howToScore: true,
      userProfile: false,
      leaveReview: false,
      editProfile: false,
      children: false
    })
  }
  editProfile () {
    this.setState({
      editProfile: true,
      userProfile: false,
      howToScore: false,
      leaveReview: false,
      children: false,
      loaded: true
    })
  }
  getChildren () {
    this.setState({
      editProfile: false,
      userProfile: false,
      howToScore: false,
      leaveReview: false,
      children: true
    })
  }
  leaveReview () {
    this.setState({
      editProfile: false,
      userProfile: false,
      howToScore: false,
      children: false,
      leaveReview: true
    })
  }
  getUserDetails () {
    const token = localStorage.getItem('settoken')
    const userId = localStorage.getItem('userId')
    const languageId = localStorage.getItem('languageId')
    axios
      .get(
        config.qidz.endpoints.userDetails +
          '?tenantId=' +
          tenant_id +
          '&locale=' +
          languageId +
          '&user_id=' +
          userId +
          '&token=' +
          token,
        {}
      )
      .then(response => {
        if (response.data.children != '') {
          this.setState({
            childrenList: response.data.children
          })
        }
        this.setState({
          profileImage: response.data.full_avatar_url,
          pointsLevel: response.data.points_level,
          allPoints: response.data.all_points,
          totalPoints: response.data.total_points,
          name: response.data.name,
          profileName: response.data.name,
          profileCity: response.data.city,
          email: response.data.email,
          nationality: response.data.nationality,
          phone: response.data.phone
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  cities () {
    axios
      .get(config.qidz.endpoints.cities, {
        data: {},
        headers: {
          accept: 'application/json'
        }
      })
      .then(response => {
        this.setState({
          cityData: response.data
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  updateProfile () {
    const {
      name,
      phone,
      city,
      profilecityId,
      email,
      nationality,
      location,
      category,
      currency,
      country_code,
      cityName,
      lang,
      staticLanguage
    } = this.state
    const languageId = localStorage.getItem('languageId');
   
    if(name=='' || email ==''){
      this.setState({errorProfileMessage:(languageId==config.lang?staticLanguage.common.blank_fields:"Fields can't be blank")});
    }
    if(name!='' && email !=''){
    let body = {
      user: {
        phone: phone,
        email: email,
        name: name,
        authentication_token: localStorage.getItem('settoken'),
        nationality: nationality != undefined ? nationality : null,
        tenant: {
          name: cityName,
          id: profilecityId,
          country_code: country_code,
          locale: lang,
          currency: currency
        },
        last_shown_deal: '2020-11-28',
        city: cityName,
        area_ids: location,
        category_ids: category
      }
    }
    this.setState({ isProfileLoading: true })
    
    axios
      .post(
        config.qidz.endpoints.updateProfile +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          languageId +
          '&user_id=' +
          localStorage.getItem('userId'),
        {
          data: body,
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
        if (response.data) {
          localStorage.setItem('name', response.data.name)
          localStorage.setItem('email', response.data.email)
          localStorage.setItem('phone', response.data.phone)
          localStorage.setItem('promo_code_id', response.data.promo_code_id)
          localStorage.setItem('nationality', response.data.nationality)
          localStorage.setItem('city', response.data.city)
          // localStorage.setItem('location', this.state.selectedLocationOption);
          let loc = []
          if (this.state.selectedLocationOption != null) {
            let lp = this.state.selectedLocationOption
            for (var i = 0; i < lp.length; i++) {
              loc.push({ value: lp[i].value, label: lp[i].label })
            }
            localStorage.setItem('location', JSON.stringify(loc))
          }
          let cat = []
          if (this.state.selectedCategoryOption != null) {
            let cp = this.state.selectedCategoryOption
            for (var i = 0; i < cp.length; i++) {
              cat.push({ value: cp[i].value, label: cp[i].label })
            }
            localStorage.setItem('category', JSON.stringify(cat))
          }

          this.setState({
            loaded: true,
            isProfileLoading: false,
            ProfileThankyouMessage:
              languageId === config.lang
                ? staticLanguage.common.profile_thankyou
                : 'Profile updated successfully'
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
  uploadPhoto (event) {
    let reader = new FileReader()
    let base64data = ''
    reader.readAsDataURL(event.target.files[0])
    reader.onloadend = () => {
      base64data = reader.result
      let body = {
        user: {
          authentication_token: localStorage.getItem('settoken'),
          avatar: base64data,
          id: localStorage.getItem('userId')
        }
      }
      this.setState({ isLoadingUpload: true })
      axios
        .post(
          config.qidz.endpoints.updateProfile +
            '?tenant_id=' +
            tenant_id +
            '&locale=' +
            language +
            '&user_id=' +
            localStorage.getItem('userId'),
          {
            data: body,
            headers: {
              accept: 'application/json'
            }
          }
        )
        .then(response => {
          this.setState({
            profileImage: response.data.full_avatar_url,
            isLoadingUpload: false
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  getCategories () {
    const tenant_id = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    axios
      .post(
        config.qidz.endpoints.homePageData +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          language,
        {
          data: {},
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
        response.data.categories.map((c, i) => {
          this.categoryOptions.push({ value: c.id, label: c.name })
        })
        response.data.areas.map((c, i) => {
          this.areasOptions.push({ value: c.id, label: c.name })
        })
        // let cat = JSON.parse(localStorage.getItem('category'));
        // let area=JSON.parse(localStorage.getItem("location"));

        // let result = cat.filter(o1 => response.data.categories.some(o2 => o1.value === o2.id));
        // let result1 = area.filter(o1 => response.data.areas.some(o2 => o1.value === o2.id));
        // console.log(response.data.areas, 'categorycategory',result1);
        this.setState({
          categories: response.data.categories,
          areas: response.data.areas
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onNameChange (key, value) {
    this.setState({ name: value,errorProfileMessage:"" })
  }
  onEmailChange (key, value) {
    this.setState({ email: value,errorProfileMessage:"" })
  }
  onPhoneChange ( value) {
    this.setState({ phone: value })
  }

  onCityChange (e) {
    var index = e.target.selectedIndex
    var optionElement = e.target.childNodes[index]
    var currency = optionElement.getAttribute('data-currency')
    var country_code = optionElement.getAttribute('data-country_code')
    var cityName = optionElement.getAttribute('data-cityName')
    var lang = optionElement.getAttribute('data-lang')
    this.setState({
      profilecityId: e.target.value,
      currency: currency,
      country_code: country_code,
      cityName: cityName,
      lang: lang
    })
  }
  handleCategoriesChange (selectedCategoryOption) {
    this.category = []
    selectedCategoryOption.map((c, i) => {
      this.category.push(c.value)
      // if (this.category.length > 2) {
      //   this.setState({ selectCatLength: this.category.length })
      // }
    })
    this.setState({
      selectedCategoryOption: selectedCategoryOption,
      category: this.category
    })
  }
  handleLocationChange (selectedLocationOption) {
    this.location = []
    selectedLocationOption.map((c, i) => {
      this.location.push(c.value)
    })
    this.setState({
      selectedLocationOption: selectedLocationOption,
      location: this.location,
      // locationCount:selectedLocationOption.length
    })
  }
  handleActivityChange (selectedActivityOption) {
    this.setState({
      selectedActivityOption: selectedActivityOption
    })
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

  dobChange (date) {
    this.setState({ childDOB: date, errorMessage: '' })
  }
  firstNameChange (event) {
    this.setState({ childFirstName: event.target.value })
  }
  lastNameChange (event) {
    this.setState({ childLastName: event.target.value })
  }
  createChildrenUI () {
    const { staticLanguage, isloading } = this.state
    const languageId = localStorage.getItem('languageId')
    return (
      <div className='row kids_adding_field'>
        <div className='col-md-3 add_fields'>
          <label>
            {languageId === config.lang
              ? staticLanguage.form.firstname
              : 'First Name'}
          </label>
          <input
            type='text'
            name='firstname'
            value={this.state.childFirstName ? this.state.childFirstName : ''}
            className='form-control'
            placeholder={
              languageId === config.lang
                ? staticLanguage.form.firstname
                : 'First Name'
            }
            onChange={e => this.firstNameChange(e)}
          />
          <span className='errorMessage'></span>
        </div>
        <div className='col-md-3 add_fields'>
          <label>
            {languageId === config.lang
              ? staticLanguage.form.lastname
              : 'Last Name'}
          </label>
          <input
            type='text'
            name='lastname'
            value={this.state.childLastName ? this.state.childLastName : ''}
            className='form-control'
            placeholder={
              languageId === config.lang
                ? staticLanguage.form.lastname
                : 'Last Name'
            }
            onChange={e => this.lastNameChange(e)}
          />
        </div>
        <div className='col-md-3 add_fields'>
          <label>
            {languageId === config.lang
              ? staticLanguage.form.dob
              : 'Date Of Birth'}
          </label>
          <div className='add_last_field'>
            <DatePicker
              onChange={date => this.dobChange(date)}
              selected={this.state.childDOB ? this.state.childDOB : ''}
              dateFormat='yyyy-MM-d'
              placeholderText={
                languageId === config.lang
                  ? staticLanguage.form.dob
                  : 'Date Of Birth'
              }
              maxDate={moment().toDate()}
            />
          </div>
          <span className='error_message2'>{this.state.errorMessage}</span>
        </div>
         <div className='col-md-3 add_fields'>
         <label></label>
          <div className='add_remove_btn'>
              <button
                className='btn update_btn btn_custom'
                onClick={() => this.updateChildren()}
              >
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
                      ? staticLanguage.common.add_child
                      : 'Add Children'}
                  </span>
                )}
              </button>
            </div>
            </div>
      </div>
    )
  }

  updateChildren () {
    const {
      childFirstName,
      childLastName,
      childDOB,
      staticLanguage,
      childrenList
    } = this.state
    const languageId = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
    if (childDOB == '' || childDOB == undefined) {
      this.setState({
        kidsThankyouMessage: '',
        errorMessage:
          languageId === config.lang
            ? staticLanguage.common.dob_error
            : 'Please select date of birth'
      })
    }
    if (childDOB != '') {
      childrenList.push({
        firstname: childFirstName,
        lastname: childLastName,
        date_of_birth: moment(childDOB).format('YYYYMMDD')
      })
      this.setState({ isloading: true })

      let body = {
        user: {
          authentication_token: localStorage.getItem('settoken'),
          children_attributes: childrenList
        }
      }
      axios
        .post(
          config.qidz.endpoints.updateProfile +
            '?tenant_id=' +
            tenant_id +
            '&locale=' +
            languageId +
            '&user_id=' +
            localStorage.getItem('userId'),
          {
            data: body,
            headers: {
              accept: 'application/json'
            }
          }
        )
        .then(response => {
          if (response.data) {
            this.setState({
              isloading: false,
              childFirstName: '',
              childLastName: '',
              childDOB: '',
              loaded: true,
              errorMessage: '',
              childrenList: response.data.children,
              kidsThankyouMessage:
                languageId === config.lang
                  ? staticLanguage.common.kidsThankyouMessage
                  : 'Children updated successfully'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  removeChildren (index) {
    const { staticLanguage, childrenList } = this.state
    const languageId = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')

    childrenList.splice(index, 1)
    this.setState({ isRemoveloading: true })

    let body = {
      user: {
        authentication_token: localStorage.getItem('settoken'),
        children_attributes: childrenList
      }
    }
    axios
      .post(
        config.qidz.endpoints.updateProfile +
          '?tenant_id=' +
          tenant_id +
          '&locale=' +
          languageId +
          '&user_id=' +
          localStorage.getItem('userId'),
        {
          data: body,
          headers: {
            accept: 'application/json'
          }
        }
      )
      .then(response => {
        if (response.data) {
          if (index != undefined) {
            this.setState({ isRemoveloading: false })
          } else {
            this.setState({ isloading: false })
          }
          this.setState({
            errorMessage: '',
            loaded: true,
            childrenList: response.data.children,
            kidsThankyouMessage:
              languageId === config.lang
                ? staticLanguage.common.kidsThankyouMessage
                : 'Children updated successfully'
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  showModal () {
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
  onInviteOpenModal () {
    this.setState({
      OpenSharePopUp: true
    })
  }
  onInviteCloseModal () {
    this.setState({
      OpenSharePopUp: false
    })
  }

  changeLanguage (event) {
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false, languageId: event.target.value })
    this.getCategories()
    this.getUserDetails()
    const nextTitle = 'My new page title'
    const nextState = { additionalInformation: 'Updated the URL with JS' }

    if (event.target.value === config.lang) {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('/en', '/ar')
      )
    } else {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('/ar', '/en')
      )
    }
    window.location.reload()
  }
  changeCityData (event) {
    var index = event.target.selectedIndex
    var optionElement = event.target.childNodes[index]
    var currency = optionElement.getAttribute('data-currency')
    var available_locales = optionElement.getAttribute('data-available_locales')
    var cityId = optionElement.getAttribute('data-id')

    let cityName = event.target.value
    localStorage.setItem('city', cityName)
    localStorage.setItem('cityId', cityId)
    localStorage.setItem('currency', currency)
    let lang = available_locales.split(',')
    this.setState({ language: lang, city: cityName })
    localStorage.setItem('lang', JSON.stringify(lang))
    localStorage.setItem('languageId', lang[0])
    this.setState({ loaded: false, languageId: lang[0] })
    this.getCategories()
    this.getUserDetails()
    if(lang.length==1){
      window.history.pushState( '', '', window.location.href.replace('/ar', '/en'))
    }
    window.location.reload()
  }

  getHeader () {
    const languageId = localStorage.getItem('languageId')
    return (
      <div class='top-header'>
        <div class='container'>
          <div class='top-header-inner row'>
            <DownloadSection staticLanguage={this.state.staticLanguage} />
            <div class='top-header-right col-md-6'>
              <LoginSection staticLanguage={this.state.staticLanguage} />
              <div class='country_field'>
                <div class='form-group'>
                  <select
                    id='mySelect'
                    class='form-control'
                    value={this.state.city}
                    onChange={e => this.changeCityData(e)}
                  >
                    {this.state.cityData &&
                      this.state.cityData.map((cities, i) => (
                        <option
                          id={
                            languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en
                          }
                          key={
                            languageId === config.lang
                              ? cities.names.ar
                              : cities.names.en
                          }
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
              <div class='language_field'>
                <div
                  class='trp-language-switcher trp-language-switcher-container'
                  data-no-translation=''
                >
                  <select
                    id='mySelect'
                    value={this.state.languageId}
                    class='form-control'
                    onChange={e => this.changeLanguage(e)}
                  >
                    {this.state.language &&
                      this.state.language.map((lg, i) => (
                        <option value={lg}>{lg}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {
      name,
      profileName,
      wallet,
      phone,
      profileCity,
      email,
      profileImage,
      point_details,
      userProfile,
      editProfile,
      howToScore,
      nationality,
      selectedCategoryOption,
      selectedLocationOption,
      selectedActivityOption,
      children,
      isloading,
      pointsLevel,
      allPoints,
      totalPoints,
      isLoadingUpload,
      isProfileLoading,
      staticLanguage
    } = this.state
    let pointDetails = JSON.parse(point_details)
    let a = []
    selectedCategoryOption &&
      selectedCategoryOption.map((ct, i) => a.push(ct.label))
    let cat = a.join(', ')
    let b = []
    selectedLocationOption &&
    selectedLocationOption.map((lc, i) => b.push(lc.label))
    let loc = b.join(', ')

    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    return (
      <>
        {this.getHeader()}
        <section id='page_heading'>
          <div className='page_head_inner'>
            <h1>
              {' '}
              {languageId === config.lang
                ? staticLanguage.common.user_profile
                : 'User Profile'}
            </h1>
          </div>
        </section>
        <main id='main'>
          <div id='page'>
            <div className='container bootstrap snippets bootdey'>
              <div className='row'>
                <div className='profile-nav col-md-3'>
                  <div className='panel'>
                    <div className='user-heading round'>
                      <a href={languageId=='en'?'/user-profile/':'/ar/user-profile/'}>
                        <img src={profileImage} alt='' />
                      </a>
                      <h1>{profileName}</h1>
                      {pointsLevel ? <p>{pointsLevel.name}</p> : ''}
                      {/* <button className="btn edit_profile_btn btn_custom" onClick={() => this.uploadPhoto()}><i className="fa fa-pencil-square" aria-hidden="true"></i>Upload photo</button> */}
                      <div className='profile_upload'>
                        <input
                          accept='image/gif,image/jpeg,image/jpg,image/png'
                          type='file'
                          className='btn edit_profile_btn btn_custom'
                          onChange={e => this.uploadPhoto(e)}
                        />
                        <button className='btn edit_profile_btn btn_custom'>
                          {isLoadingUpload && (
                            <span>
                              {languageId === config.lang
                                ? staticLanguage.common.loading
                                : 'Loading...'}
                            </span>
                          )}
                          {!isLoadingUpload && (
                            <span>
                              {languageId === config.lang
                                ? staticLanguage.common.upload_now
                                : 'Upload Photo'}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    <ul className='nav nav-pills nav-stacked'>
                      <li className='dropdown_main'>
                          <a href='#'>
                            {' '}
                            {languageId === config.lang
                              ? staticLanguage.shared.information
                              : 'Information'}
                          </a>
                      </li>
                      <li>
                      <a href onClick={() => this.editProfile()} >
                              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.profile.change_profile
                                : 'Edit Profile'}
                            </a>
                      </li>
                      <li className='dropdown_main'>
                        <a href='#'>
                         {' '}
                          {languageId === config.lang
                            ? staticLanguage.common.favourites
                            : 'Favourites'}
                        </a>
                      </li>
                      <li>
                        <a href={config.page.favActivity}>
                          {' '}
                          <i
                            className='fa fa-heart'
                            aria-hidden='true'
                          ></i>{' '}
                          {languageId === config.lang
                            ? staticLanguage.common.favourite
                            : 'Favourites'}
                        </a>
                      </li>
                      <li className='dropdown_main'>
                          <a href='#'>
                            {' '}
                            {' '}
                            {languageId === config.lang
                              ? staticLanguage.profile.community
                              : 'Community'}
                          </a>
                          </li>
                          <li>
                            <a href onClick={() => this.howToScorePoints()} >
                              <i class="fa fa-trophy" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.common.how_to_score
                                : 'How to Score Points'}
                            </a>
                            </li>
                            <li>
                            <a
                              href
                              onClick={() => this.onInviteOpenModal()}
                            >
                              <i class="fa fa-user-plus" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.common.invite_friends
                                : 'Invite Friends'}
                            </a>
                            </li>
                            <Modal
                              open={this.state.OpenSharePopUp}
                              onClose={() => this.onInviteCloseModal()}
                              center
                            >
                              <InlineShareButtons
                                config={{
                                  alignment: 'center', // alignment of buttons (left, center, right)
                                  color: 'social', // set the color of buttons (social, white)
                                  enabled: true, // show/hide buttons (true, false)
                                  font_size: 16, // font size for the buttons
                                  // labels: 'cta',        // button labels (cta, counts, null)
                                  language: 'en', // which language to use (see LANGUAGES)
                                  labels: null, // button labels (cta, counts, null)
                                  networks: [
                                    // which networks to include (see SHARING NETWORKS)
                                    'whatsapp',
                                    'linkedin',
                                    'telegram',
                                    'facebook',
                                    'twitter'
                                  ],
                                  padding: 12, // padding within buttons (INTEGER)
                                  radius: 4, // the corner radius on each button (INTEGER)
                                  //show_total: true,
                                  size: 40, // the size of each button (INTEGER)

                                  // OPTIONAL PARAMETERS
                                  url: window.location.hostname, // (defaults to current url)
                                  image: 'https://bit.ly/2CMhCMC', // (defaults to og:image or twitter:image)
                                  description:
                                    'Hey there! Check out QiDZ that gives you an up to date guide of all fun kid-friendly activities in your city.', // (defaults to og:description or twitter:description)
                                  title:
                                    'Kids Activities In DUbai- UAE, Saudi Arabia, Bahrain | QiDZ',
                                  message:
                                    'Hey there! Check out QiDZ that gives you an up to date guide of all fun kid-friendly activities in your city.', // (only for email sharing)
                                  subject:
                                    'Kids Activities In DUbai- UAE, Saudi Arabia, Bahrain | QiDZ'
                                }}
                              />
                            </Modal>
                            <li>
                            <a href={languageId=='en'?'/about-qidz':'/ar/about-qidz'}>
                              <i class="fa fa-question-circle-o" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.profile.about
                                : 'About Us'}
                            </a>
                            </li>
                            <li>
                            <a
                              href={languageId=='en'?'/become-a-partner/':'/ar/become-a-partner/'}
                            >
                              <i className='fa fa-user'></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.common.sell_activity
                                : 'Sell Your Activity With Us'}
                            </a>
                            </li>
                            <li>
                            <a
                              target='_blank'
                              href={config.googlePlayUrl}
                              // onClick={() => this.leaveReview()}
                            >
                              <i class="fa fa-star" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.profile.leave_a_review
                                : 'Leave a Review'}
                            </a>
                            </li>
                            <li>
                            <a  href={languageId=='en'?'/contact-us':'/ar/contact-us'}>
                              <i class="fa fa-envelope-o" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.profile.contact
                                : 'Contact Us'}
                            </a>
                            </li>
                            <li>
                            <a
                              href={languageId=='en'?'/terms-and-conditions':'/ar/terms-and-conditions'}
                            >
                              <i class="fa fa-file-text-o" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.common.terms_condition
                                : 'Terms & Conditions'}
                            </a>
                            </li>
                            <li>
                            <a  href={languageId=='en'?'/privacy':'/ar/privacy'}>
                              <i class="fa fa-file-text-o" aria-hidden="true"></i>{' '}
                              {languageId === config.lang
                                ? staticLanguage.profile.privacy
                                : 'Privacy Policy'}
                            </a>
                            </li>
                      <li className='dropdown_main'>
                        <a href onClick={() => this.getChildren()}>
                          {' '}
                          {' '}
                          {languageId === config.lang
                            ? staticLanguage.profile.add_kids
                            : 'Kids'}
                        </a>
                      </li>
                       <li>
                        <a href onClick={() => this.getChildren()}>
                          {' '}
                          <i
                            className='fa fa-child'
                            aria-hidden='true'
                          ></i>{' '}
                          {languageId === config.lang
                            ? staticLanguage.profile.add_kids
                            : 'Add Your Kids'}
                        </a>
                      </li>
                      <li className='dropdown_main'>
                        <a href onClick={() => this.Logout()}>
                          {' '}
                          {languageId === config.lang
                            ? staticLanguage.profile.logout_title
                            : 'Log out'}
                        </a>
                      </li>
                      <li>
                        <a href onClick={() => this.Logout()}>
                          <i className='fa fa-power-off' aria-hidden='true'></i>{' '}
                          {languageId === config.lang
                            ? staticLanguage.profile.logout_title
                            : 'Log out'}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='profile-info col-md-9'>
                  <div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='panel wallet_main'>
                          <div className='panel-body wallet_box'>
                            <div className='bio-chart wallet_bal'>
                              <div className='widget_icn'>
                                <i
                                  className='fa fa-credit-card'
                                  aria-hidden='true'
                                ></i>
                              </div>
                              <div className='widget_info'>
                                <p>
                                  {languageId === config.lang
                                    ? staticLanguage.wallet.balance
                                    : 'Balance'}
                                </p>
                                <h4 className='red'>
                                  {currency} {wallet}
                                </h4>
                              </div>
                            </div>
                            <div className='bio-desk'>
                              <a
                                href='javascript:void()'
                                onClick={() => this.myWallet()}
                              >
                                {languageId === config.lang
                                  ? staticLanguage.wallet.wallet
                                  : 'My Wallet'}
                                <i
                                  className='fa fa-chevron-right'
                                  aria-hidden='true'
                                ></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='panel rank_main'>
                          <div className='panel-body rank_box'>
                            <div className='bio-chart fun_star'>
                              <div className='widget_icn'>
                                <i
                                  className='fa fa-trophy'
                                  aria-hidden='true'
                                ></i>
                              </div>
                              <div className='widget_info'>
                                <p>
                                  {languageId === config.lang
                                    ? staticLanguage.profile.next_rank
                                    : 'Next Rank'}
                                </p>
                                <h4 className='red'>{languageId === config.lang
                                    ? staticLanguage.common.fun_superstar
                                    : 'Fun Superstar'}</h4>
                              </div>
                            </div>
                            <div className='bio-desk red_cl'>
                              <a href onClick={() => this.howToScorePoints()}>
                                {languageId === config.lang
                                  ? staticLanguage.profile.progress
                                  : 'Progress'}
                                <i
                                  className='fa fa-chevron-right'
                                  aria-hidden='true'
                                ></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-12'>
                        <div className='panel'>
                          {/* <div className="bio-graph-heading">
                                                        Aliquam ac magna metus. Nam sed arcu non tellus fringilla fringilla ut vel ispum. Aliquam ac magna metus.
                                                     </div> */}
                          {userProfile && (
                            <div className='panel-body bio-graph-info'>
                              <h1>Information</h1>
                              <div className='row'>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {languageId === config.lang
                                        ? staticLanguage.add_or_edit.name
                                        : 'Name'}{' '}
                                    </span>
                                    {' '}
                                    <div className='info_user'>{name}</div>
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {' '}
                                      {languageId === config.lang
                                        ? staticLanguage.first.email_label
                                        : 'Email Address'}
                                    </span>
                                   {' '}
                                    <div className='info_user'>{email}</div>
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {' '}
                                      {languageId === config.lang
                                        ? staticLanguage.first.phone_label
                                        : 'Phone Number'}{' '}
                                    </span>
                                    {' '}
                                    <div className='info_user'>{phone}</div>
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {languageId === config.lang
                                        ? staticLanguage.profile.main_interest
                                        : 'Main Interest'}
                                    </span>
                                   {' '}
                                    <div className='info_user'>{cat}</div>{' '}
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {languageId === config.lang
                                        ? staticLanguage.profile.city
                                        : 'Your City'}{' '}
                                    </span>
                                   {' '}
                                    <div className='info_user'>{profileCity}</div>
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {languageId === config.lang
                                        ? staticLanguage.profile.your_location
                                        : 'Your Location'}{' '}
                                    </span>
                                    {' '}
                                    <div className='info_user'>{loc}</div>
                                  </p>
                                </div>
                                <div className='bio-row'>
                                  <p>
                                    <span>
                                      {languageId === config.lang
                                        ? staticLanguage.profile
                                            .choose_nationality
                                        : 'Your Nationality'}{' '}
                                    </span>
                                    {' '}
                                    <div className='info_user'>{nationality != undefined
                                      ? nationality
                                      : ''}</div>
                                  </p>
                                </div>
                                <div className='full_row'></div>
                              </div>
                            </div>
                          )}{' '}
                          {howToScore == true && (
                            <>
                              <div class='panel-body bio-graph-info'>
                              <div className='score_heading'>
                              {pointsLevel.max + 1 - totalPoints}{' '}
                                        {languageId === config.lang
                                    ? staticLanguage.points.your_points
                                    : 'Your Points'}
                                
                                
                                <span> {languageId === config.lang
                                    ? staticLanguage.common.how_to_score
                                    : 'How to Score Points'} <i class="fa fa-chevron-right" aria-hidden="true"></i></span></div>
                                <div className='row'>
                                <div className='score_data'>
                                <div class="sc_left"><p><b>
                                    {pointsLevel ? (
                                      <p>{pointsLevel.name}</p>
                                    ) : (
                                      ''
                                    )}
                                    </b></p></div>
                                    <div class="sc_right"><span>
                                    {totalPoints ? (
                                      <p>{totalPoints} points</p>
                                    ) : (
                                      ''
                                    )}
                                    </span>
                                    </div>
                                    </div>
                              <div className='score_data'>
                                <div class="sc_left"><p><b>
                                <span>
                                {languageId === config.lang
                                    ? staticLanguage.common.fun_superstar
                                    : 'Fun Superstar'}</span>
                                    </b></p>
                                    </div>
                                    <div class="sc_right">
                                  <span>
                                    {totalPoints ? (
                                      <p>
                                        {pointsLevel.max + 1 - totalPoints}{' '}
                                        {languageId === config.lang
                                    ? staticLanguage.points.your_points
                                    : 'Points Left'}
                                      </p>
                                    ) : (
                                      ''
                                    )}
                                  </span>
                                  </div>
                                </div>
                                </div>
                                <div class='row'>
                                  {allPoints &&
                                    allPoints.map((p, i) => (
                                      <div class='score_data'>
                                        <div class='sc_left'>
                                          <p>
                                            <b>
                                              <span>
                                                {' '}
                                                {p.kind === 'share'
                                                  ? 'share with friends'
                                                  : ' '}
                                              </span>
                                            </b>
                                            <span>
                                              {moment(p.created_at).format(
                                                'ddd MMM DD'
                                              )}
                                            </span>
                                          </p>
                                        </div>
                                        <div class='sc_right'>
                                          <span>+{p.points} Points</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                                <div class='score_details'>
                                  <div class='score_heading'>{languageId==config.lang?staticLanguage.common.point_system:"Point System"}</div>
                                  <p>
                                    {languageId==config.lang?staticLanguage.common.score_points:"In the QiDZ app you can score points by completing simple actions. These points will be added to your rank. Every 500 points you will rank up. Below you will find how to score points:"}
                                  </p>
                                </div>
                                <div class='row'>
                                  {pointDetails &&
                                    pointDetails.actions.map((points, i) => (
                                      <div class='score_data'>
                                        <div class='sc_left'>
                                          <p>
                                            <b>
                                              {points.type == 'review'
                                                ? (languageId==config.lang?staticLanguage.activity.add_review.title:'Adding a review')
                                                : points.type ==
                                                  'suggestion_add'
                                                ? (languageId==config.lang?staticLanguage.points.suggestion_add:'Adding an Activity')
                                                : points.type ==
                                                  'suggestion_edit'
                                                ? (languageId==config.lang?staticLanguage.points.suggestion_edit:'Editing an Activity')
                                                : points.type == 'share'
                                                ? (languageId==config.lang?staticLanguage.points.share:'Sharing with friends')
                                                : points.type == 'reservation'
                                                ? (languageId==config.lang?staticLanguage.common.make_booking:'Make a Booking')
                                                : ''}
                                            </b>
                                          </p>
                                        </div>
                                        <div class='sc_right'>
                                          <span>+{points.points} {languageId===config.lang?staticLanguage.common.points:"points"}</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              <div class='panel-body bio-graph-info'>
                                <div class='score_details'>
                                  <div class='score_heading'>
                                    {languageId === config.lang
                                      ? staticLanguage.points.rank.title
                                      : 'Ranks'}
                                  </div>
                                  <p>
                                    {languageId === config.lang
                                      ? staticLanguage.points.rank.explanation
                                      : 'There are 5 different ranks you can reach. Each rank gives its own badge. Below you will find the different ranks:'}
                                  </p>
                                </div>
                                <div class='row'>
                                  {pointDetails &&
                                    pointDetails.levels.map((level, j) => (
                                      <div class='score_data'>
                                        <div class='sc_left'>
                                          <p>
                                            <b>{level.name}</b>
                                          </p>
                                        </div>
                                        <div class='sc_right'>
                                          <span>{level.range}</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </>
                          )}
                          {editProfile == true && (
                            <div className='panel-body bio-graph-info'>
                              <h1>
                                {' '}
                                {languageId === config.lang
                                  ? staticLanguage.common.edit_profile
                                  : 'Edit Profile'}
                              </h1>
                              <Loader
                                options={config.options}
                                loaded={this.state.loaded}
                              ></Loader>
                              <div className='row'>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.add_or_edit.name
                                      : 'Name'}
                                  </label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    placeholder={
                                      languageId === config.lang
                                        ? staticLanguage.add_or_edit.name
                                        : 'Name'
                                    }
                                    value={name ? name : ''}
                                    onChange={e =>
                                      this.onNameChange('name', e.target.value)
                                    }
                                  />
                                </div>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.first.email_label
                                      : 'Email Address'}
                                  </label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    placeholder={
                                      languageId === config.lang
                                        ? staticLanguage.first.email_placeholder
                                        : 'Email Address'
                                    }
                                    value={email ? email : ''}
                                    onChange={e =>
                                      this.onEmailChange(
                                        'email',
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.first.phone_label
                                      : 'Phone Number'}
                                  </label>
                                  <PhoneInput
                                      className='form-control'
                                      placeholder={
                                        languageId === config.lang
                                          ? staticLanguage.first.phone_placeholder
                                          : 'Phone Number'
                                      }
                                      country={'ae'}
                                      value={this.state.phone}
                                      onChange={phone =>
                                        this.onPhoneChange(phone)
                                      }
                                    />
                                </div>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.profile.main_interest
                                      : 'Main Interest'}
                                  </label>
                                  <Select
                                    // styles={styles}
                                    value={selectedCategoryOption}
                                    options={this.categoryOptions}
                                    allowSelectAll={true}
                                    isMulti
                                    onChange={e =>
                                      this.handleCategoriesChange(e)
                                    }
                                  />
                                </div>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.profile.your_city
                                      : 'Your City'}
                                  </label>
                                  <select
                                    defaultValue={'DEFAULT'}
                                    className='form-control'
                                    onChange={e => this.onCityChange(e)}
                                  >
                                    {this.state.profilecityId && (
                                      <option value={this.state.profileCity}>
                                        {this.state.profileCity}
                                      </option>
                                    )}
                                    {this.state.cityData &&
                                      this.state.cityData.map((cities, i) => (
                                        <option
                                          value={cities.id}
                                          data-currency={cities.currency}
                                          data-cityName={cities.name}
                                          data-country_code={
                                            cities.country_code
                                          }
                                          data-lang={cities.available_locales}
                                        >
                                          {cities.name}
                                        </option>
                                      ))}
                                  </select>
                                  {/* <input type="text" className="form-control" placeholder="City" value={city} /> */}
                                </div>
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.profile.your_location
                                      : 'Your Location'}
                                  </label>
                                  <Select
                                    value={selectedLocationOption}
                                    options={this.areasOptions}
                                    allowSelectAll={true}
                                    isMulti
                                    onChange={e => this.handleLocationChange(e)}
                                  />
                                </div>                                
                                <div className='bio-row'>
                                  <label>
                                    {' '}
                                    {languageId === config.lang
                                      ? staticLanguage.profile.choose_nationality
                                      : 'Your Nationality'}
                                    y
                                  </label>
                                  <ReactFlagsSelect
                                    selected={nationality}
                                    onSelect={nationality =>
                                      this.setState({ nationality })
                                    }
                                  />
                                  {/* <input type="text" className="form-control" placeholder="Nationality" value={nationality} onChange={(e) => this.onNationalityChange('nationality', e.target.value)} /> */}
                                </div>
                                <div className='full_row'>
                                  <button
                                    className='btn update_btn btn_custom'
                                    onClick={() => this.updateProfile()}
                                  >
                                    {isProfileLoading && (
                                      <span>
                                        {languageId === config.lang
                                          ? staticLanguage.common.loading
                                          : 'Loading...'}
                                      </span>
                                    )}
                                    {!isProfileLoading && (
                                      <span>
                                        {languageId === config.lang
                                          ? staticLanguage.profile.update
                                          : 'Update'}
                                      </span>
                                    )}
                                  </button>
                                <span className='thankyouMessage'>
                                {this.state.ProfileThankyouMessage && (
                                <span class="alert alert-success">
                                  {this.state.ProfileThankyouMessage}
                                  </span>
                                   )}
                                </span>
                                <span className="error_message2">{this.state.errorProfileMessage}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {children == true && (
                            <div className='panel-body bio-graph-info'>
                              <h1>
                                {' '}
                                {languageId === config.lang
                                  ? staticLanguage.common.bit_kid
                                  : 'A bit about your kids'}
                              </h1>
                              <span>
                                {languageId === config.lang
                                  ? staticLanguage.common.need_copy
                                  : 'We need to know some information about your kids for better recommendations'}
                              </span>
                              <div className='kids_info_main'>
                                {this.state.childrenList.length > 0 && (
                                  <div className='row'>
                                    <div className='col-md-3 add_fields'>
                                      <label>
                                        {languageId === config.lang
                                          ? staticLanguage.form.firstname
                                          : 'First Name'}
                                      </label>
                                    </div>
                                    <div className='col-md-3 add_fields'>
                                      <label>
                                        {languageId === config.lang
                                          ? staticLanguage.form.lastname
                                          : 'Last Name'}
                                      </label>
                                    </div>
                                    <div className='col-md-3 add_fields'>
                                      <label>
                                        {languageId === config.lang
                                          ? staticLanguage.form.dob
                                          : 'Date Of Birth'}
                                      </label>
                                    </div>
                                     <div className='col-md-3 add_fields'>
                                      <label>
                                      </label>
                                    </div>
                                  </div>
                                )}
                                {this.state.childrenList.length > 0 &&
                                  this.state.childrenList.map((child, i) => (
                                    <div className='row kids_inner_field'>
                                      <div className='col-md-3 '>
                                        <label>{child.firstname}</label>
                                      </div>
                                      <div className='col-md-3 '>
                                        <label>{child.lastname}</label>
                                      </div>
                                      <div className='col-md-3 '>
                                        <label>{child.date_of_birth}</label>
                                      </div>
                                      <div className='col-md-3 '>
                                        <button
                                          className='btn update_btn btn_custom kids_button'
                                          onClick={() => this.removeChildren(i)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              {this.createChildrenUI()}

                              <div className='full_row kids_row'>
                                <span className='thankyouMessage'>
                                {this.state.kidsThankyouMessage && (
                                <span class="alert alert-success">
                                  {this.state.kidsThankyouMessage}
                                  </span>
                                   )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }
}
export default UserProfile
