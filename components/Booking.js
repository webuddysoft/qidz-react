import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import Carousel from 'react-multi-carousel'
import 'react-responsive-modal/styles.css'
import 'react-multi-carousel/lib/styles.css'
import { Modal } from 'react-responsive-modal'
import ReactStars from 'react-rating-stars-component'
import ReactHtmlParser from 'react-html-parser'
import Loader from 'react-loader'
import ModalService from './services/modal.service'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import ShowMoreText from 'react-show-more-text'
import moment from 'moment/moment'
import { InlineShareButtons } from 'sharethis-reactjs'
import AddToCalendar from 'react-add-to-calendar'
import GoogleMapReact from 'google-map-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AnyReactComponent = ({ text }) => <div>{text}</div>
const queryString = require('query-string')
const params = queryString.parse(location.search)
const currentUrl = window.location.href
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1
  },
  largeMobile: {
    breakpoint: { max: 768, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

class Booking extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ActivityData: [],
      isErrorForm1:false,
      isErrorForm2:false,
      isFetching: true,
      readDeals: false,
      percentageArr: [],
      childList: [],
      maxValue: 0,
      pickTime: '',
      reviewImage: '',
      reviewPostImage: '',
      ageGroup: '',
      hotelTime: '',
      commentForm1: '',
      starRatingForm1: 0,
      commentForm2: '',
      starRatingForm2: 0,
      childFirstName:'',
      childLastName:'',
      childDOB:'',
      childGender:"",
      commentForm3: '',
      openChildInfo: false,
      starRatingForm3: 0,
      selectedFile: null,
      Open: false,
      favText: '',
      OpenReview: false,
      OpenReview1: false,
      OpenSharePopUp: false,
      displayName: 'Example',
      promoCodeLoading: false,
      event: {},
      mob_number: localStorage.getItem('phone')
        ? localStorage.getItem('phone')
        : 0,
      activityAge: 0,
      editActivity: '',
      modalImage: '',
      whenDate: '',
      personErrorMessage: '',
      timeErrorMessage: '',
      whenDateErrorMessage: '',
      errorMessage: '',
      isVisibleActivity: 2,
      promoAmtMessage: '',
      promoSuccessMessage: '',
      errorMessagePromocode: '',
      reviewsCommentError: '',
      reviewsRatingError: '',
      reviewsRatingError1: '',
      reviewsCommentError2: '',
      reviewsRatingError2: '',
      favErrorMessage: '',
      modifyActivityError: '',
      thankyouMessage1: '',
      thankyouMessage2: '',
      loaded: false,
      viewScheduleModal: false,
      isloading: false,
      events: [],
      qty: [],
      items: [{ google: 'Google' }],
      defaultProps: {
        center: {
          lat: 59.95,
          lng: 30.33
        },
        zoom: 11
      },
      token: '',
      email: localStorage.getItem('email'),
      password: '',
      passwordConfirmation: '',
      name: localStorage.getItem('name'),
      phone: '',
      openLogin: false,
      openRegister: false,
      termCondition: false,
      walletPay: false,
      totalAmount: 0,
      totalAdultQty: 0,
      totalAdultAmt: 0,
      totalChildQty: 0,
      totalChildAmt: 0,
      viewSchedule: '',
      personNUmber: 0,
      city: localStorage.getItem('city'),
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      promoCode: '',
      discount: '',
      absolute: '',
      flat: '',
      street: '',
      building: '',
      area: '',
      deliveryCity: '',
      country: '',
      addInstruction: ''
    }
    this.childList = []
    this.showModal = this.showModal.bind(this)
    this.ratingChangedForm1 = this.ratingChangedForm1.bind(this)
    this.ratingChangedForm2 = this.ratingChangedForm2.bind(this)
    this.modifyActivityForm = this.modifyActivityForm.bind(this)
  }
  componentDidMount () {
    this.eventDetails()
    this.cities()
    this.getUserDetails()
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
  getUserDetails () {
    const token = localStorage.getItem('settoken')
    const userId = localStorage.getItem('userId')
    const languageId = localStorage.getItem('languageId')
    const tenant_id = localStorage.getItem('cityId')
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
        this.setState({
          walletBalance: response.data.wallet.balance,
          phone: response.data.phone,
          name: response.data.name,
          email: response.data.email
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  promoCode () {
    const { staticLanguage, totalAmount } = this.state
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    let tenantId = localStorage.getItem('cityId')
    let languageId = localStorage.getItem('languageId')
    let activityId = params.activityId
    if (this.state.promocodeText == undefined) {
      this.setState({
        promoSuccessMessage: '',
        errorMessagePromocode:
          languageId == config.lang
            ? staticLanguage.common.promoMsg
            : 'Please enter promo code'
      })
    }
    if (this.state.promocodeText != undefined) {
      let body = {
        code: this.state.promocodeText
      }
      this.setState({ promoCodeLoading: true, errorMessagePromocode: '' })
      axios
        .post(
          config.qidz.endpoints.promoCode +
            '?tenantId=' +
            tenantId +
            '&activityId=' +
            activityId,
          {
            data: body,
            headers: {
              accept: 'application/json'
            }
          }
        )
        .then(response => {
          if (response.data.error) {
            this.setState({
              promoCodeLoading: false,
              promocodeText: '',
              errorMessagePromocode: response.data.error,
              promoAmtMessage: '',
              promoSuccessMessage: ''
            })
          } else {
            if (response.data.absolute != null) {
              const amt =
                totalAmount - (totalAmount * response.data.absolute) / 100
              this.setState({
                totalAmount: amt,
                promoAmtMessage: 'Your saving' + response.data.absolute + '%'
              })
            }
            if (response.data.discount != null) {
              const amt = totalAmount - response.data.discount
              this.setState({
                totalAmount: amt,
                promoAmtMessage:
                  'Your saving' + response.data.discount + currency
              })
            }
            this.setState({
              promocodeText: '',
              promoCodeLoading: false,
              promoCode: response.data.name,
              absolute: response.data.absolute,
              discount: response.data.discount,
              promoSuccessMessage:
                languageId == config.lang
                  ? staticLanguage.common.promoSuccess
                  : 'Promo code applied successfully',
              errorMessagePromocode: ''
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  promoCodeText (event) {
    this.setState({
      promocodeText: event.target.value,
      errorMessagePromocode: ''
    })
  }
  viewSchedule () {
    const { ActivityData } = this.state
    this.setState({ viewSchedule: ActivityData.available_days })
  }
  onOpenModalReview1 () {
    this.setState({
      OpenReview1: true,
      thankyouMessage1: '',
      errorMessage1: '',
      reviewsRatingError1: '',
      reviewsCommentError1: ''
    })
  }

  onOpenModifyModal () {
    this.setState({
      Open: true,
      thankyouMessage: ''
    })
  }
  onCloseModal () {
    this.setState({
      Open: false,
      modifyActivityError: '',
      ModifyImage: ''
    })
  }
  onCloseModalReview (form) {
    if (form == 'form1') {
      this.setState({
        reviewsRatingError: '',
        OpenReview1: false,
        reviewImage: ''
      })
    }

    if (form == 'form2') {
      this.setState({
        reviewsRatingError1: '',
        reviewPostImage: ''
      })
    }
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
  setMobileNumber (event) {
    this.setState({
      mob_number: event.target.value
    })
  }
  setAge (event) {
    this.setState({
      activityAge: event.target.value
    })
  }

  setActivity (event) {
    this.setState({
      editActivity: event.target.value,
      modifyActivityError: ''
    })
  }

  setActivityImg (event) {
    let reader = new FileReader()
    let base64data = ''
    this.setState({
      modalImage: event.target.files[0]
    })
    reader.readAsDataURL(event.target.files[0])
    reader.onloadend = () => {
      base64data = reader.result
      this.setState({
        ModifyImage: base64data
      })
    }
  }
  modifyActivityForm (e) {
    const language = localStorage.getItem('languageId')
    const token = localStorage.getItem('settoken')
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    if (this.state.editActivity === '') {
      if (languageId === config.lang) {
        this.setState({
          modifyActivityError: staticLanguage.common.desc_error
        })
      } else {
        this.setState({
          modifyActivityError: "Description field can't be blank"
        })
      }
    }

    if (token != null) {
      if (this.state.editActivity != '') {
        let jsonBodyData = {
          authentication_token: token,
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email'),
          activity_id: params.activityId,
          kind: 'edit_activity',
          phone: this.state.mob_number,
          ages: this.state.activityAge,
          description: this.state.editActivity ? this.state.editActivity : '',
          suggestion_attachments_attributes: [
            {
              attachment_attributes: this.state.modalImage
                ? this.state.modalImage.name
                : ''
            }
          ]
        }
        this.setState({ isModifyActivityloading: true })
        axios
          .post(config.qidz.endpoints.modifiyActivity + '?locale=' + language, {
            data: jsonBodyData,
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            if (response.data.success === true) {
              this.setState(
                {
                  isModifyActivityloading: false,
                  mob_number: '',
                  activityAge: '',
                  editActivity: '',
                  ModifyImage: '',
                  thankyouMessage:
                    languageId === config.lang
                      ? staticLanguage.common.thankyou_modify
                      : 'Thank you for your suggestion, the QiDZ team will contact you should we require more information'
                },
                () => {
                  this.clearAllModifyActivity()
                }
              )
            } else {
              this.setState(
                {
                  isModifyActivityloading: false,
                  mob_number: '',
                  activityAge: '',
                  editActivity: '',
                  ModifyImage: '',
                  modifyActivityError: response.data.error
                },
                () => {
                  this.clearAllModifyActivity()
                }
              )
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      this.showModal('login')
    }
  }
  clearAllModifyActivity () {
    this.setState({
      // thankyouMessage: '',
      mob_number: '',
      activityAge: '',
      editActivity: ''
    })
  }
  onChangeAccept (event) {
    //alert(event.target.value)
    this.setState({ termCondition: event.target.value, errorMessage: '' })
  }
  onChangeWalletPay (event) {
    const { totalAmount, walletPay, walletBalance, qty } = this.state
    const token = localStorage.getItem('settoken')
    const totalqty =
      qty.length > 0 &&
      qty
        .map(datum => datum !== '' && datum !== undefined && datum.count)
        .reduce((a, b) => parseInt(a) + b)
    if (token != '' && token != null) {
      if (totalqty > 0) {
        if (walletPay == false) {
          let amt =
            totalAmount - (walletBalance != null ? parseInt(walletBalance) : 0)
          localStorage.setItem('wallet_balance', walletBalance)
          this.setState({ totalAmount: amt, walletPay: true, walletBalance: 0 })
        } else {
          let amt =
            totalAmount +
            (localStorage.getItem('wallet_balance') != null &&
            localStorage.getItem('wallet_balance') != undefined
              ? parseInt(localStorage.getItem('wallet_balance'))
              : 0)
          this.setState({
            totalAmount: amt,
            walletPay: false,
            walletBalance: localStorage.getItem('wallet_balance')
          })
        }
      }
    } else {
      this.showModal('login')
    }
  }
  increment (
    event,
    price,
    member,
    timeOptId,
    rayna_id,
    price_rayna_id,
    activityName
  ) {
    const { walletPay } = this.state
    const index = event
    let qty = [...this.state.qty]
    //   var filtered = arr.filter(function(x) {
    //     return x !== undefined;
    //  });
    if (qty[index]) {
      qty[index].count = qty[index].count + 1
      qty[index].price = parseInt(price * qty[index].count)
      qty[index].member = member
      qty[index].name = activityName
      qty[index].id = timeOptId
      qty[index].rayna_id = rayna_id
      qty[index].price_rayna_id = price_rayna_id
    } else {
      qty[index] = {
        count: 1,
        price: parseInt(price),
        member: member,
        name: activityName,
        id: timeOptId,
        rayna_id: rayna_id,
        price_rayna_id: price_rayna_id
      }
    }

    let totalAmount = 0
    var qtyAmt = qty.filter(function (x) {
      return x !== undefined
    })
    if (walletPay === true) {
      totalAmount =
        this.state.totalAmount + qtyAmt.length > 0 &&
        qtyAmt
          .map(datum => datum !== '' && datum !== undefined && datum.price)
          .reduce((a, b) => parseInt(a) + b)
    } else {
      totalAmount =
        qtyAmt.length > 0 &&
        qtyAmt
          .map(datum => datum !== '' && datum !== undefined && datum.price)
          .reduce((a, b) => parseInt(a) + b)
    }
    var adultFiltered = qty.filter(function (x) {
      return x !== undefined && x.member == 'Adults'
    })
    let totalAdultQty =
      adultFiltered.length > 0 &&
      adultFiltered
        .map(
          datum =>
            datum !== '' &&
            datum !== undefined &&
            datum.member === 'Adults' &&
            datum.count
        )
        .reduce((a, b) => parseInt(a) + b)

    var filtered = qty.filter(function (x) {
      return x !== undefined && x.member == 'Children'
    })
    let totalChildQty =
      filtered.length > 0 &&
      filtered
        .map(
          datum =>
            datum !== '' &&
            datum !== undefined &&
            datum.member === 'Children' &&
            datum.count
        )
        .reduce((a, b) => parseInt(a) + parseInt(b))

    let totalAdultAmt =
      adultFiltered.length > 0 &&
      adultFiltered
        .map(
          datum =>
            datum !== '' &&
            datum !== undefined &&
            datum.member === 'Adults' &&
            datum.price
        )
        .reduce((a, b) => parseInt(a) + b)

    let totalChildAmt =
      filtered.length > 0 &&
      filtered
        .map(
          datum =>
            datum !== undefined && datum.member === 'Children' && datum.price
        )
        .reduce((a, b) => parseInt(a) + b)
    this.setState({
      qty,
      totalAmount: totalAmount,
      totalAdultQty: totalAdultQty,
      totalAdultAmt: totalAdultAmt,
      totalChildQty: totalChildQty,
      totalChildAmt: totalChildAmt
    })
  }

  decrement (
    event,
    price,
    member,
    timeOptId,
    rayna_id,
    price_rayna_id,
    activityName
  ) {
    const { walletPay } = this.state
    const index = event
    let qty = [...this.state.qty]
    if (qty[index]) {
      if (qty[index].count > 0) {
        qty[index].count = qty[index].count - 1
        qty[index].price = parseInt(price * qty[index].count)
        qty[index].member = member
        qty[index].name = activityName
        qty[index].id = timeOptId
        qty[index].rayna_id = rayna_id
        qty[index].price_rayna_id = price_rayna_id
      }
    } else {
      if (qty[index] > 0 && qty[index] != undefined) {
        qty[index] = {
          count: -1,
          price: parseInt(price),
          member: member,
          name: activityName,
          id: timeOptId,
          rayna_id: rayna_id,
          price_rayna_id: price_rayna_id
        }
      }
    }
    let totalAmount = 0
    if (walletPay === true) {
      totalAmount = this.state.totalAmount
    } else {
      totalAmount =
        qty.length > 0 &&
        qty
          .map(datum => datum !== '' && datum !== undefined && datum.price)
          .reduce((a, b) => parseInt(a) + b)
    }

    let totalAdultQty =
      qty.length > 0 &&
      qty
        .map(
          datum =>
            datum !== '' &&
            datum !== undefined &&
            datum.member === 'Adults' &&
            datum.count
        )
        .reduce((a, b) => parseInt(a) + b)

    let totalChildQty =
      qty.length > 0 &&
      qty
        .map(
          datum =>
            datum !== undefined && datum.member === 'Children' && datum.count
        )
        .reduce((a, b) => parseInt(a) + b)

    let totalAdultAmt =
      qty.length > 0 &&
      qty
        .map(
          datum =>
            datum !== '' &&
            datum !== undefined &&
            datum.member === 'Adults' &&
            datum.price
        )
        .reduce((a, b) => parseInt(a) + b)

    let totalChildAmt =
      qty.length > 0 &&
      qty
        .map(
          datum =>
            datum !== undefined && datum.member === 'Children' && datum.price
        )
        .reduce((a, b) => parseInt(a) + b)

    this.setState({
      qty,
      totalAmount: totalAmount,
      totalAdultQty: totalAdultQty,
      totalAdultAmt: totalAdultAmt,
      totalChildQty: totalChildQty,
      totalChildAmt: totalChildAmt
    })
  }
  eventDetails () {
    const tenant_id = localStorage.getItem('cityId')
    const language = localStorage.getItem('languageId')
    let body = {
      activityId: params.activityId,
      with_qidz_tour_items: 't',
      tenant_id: tenant_id,
      locale: language
    }
    axios
      .post(config.qidz.endpoints.eventDetail, {
        // + "?latitude=37.33233141&longitude=-122.0312186&ad_banners=true&tenant_id=1&locale='en'&level0=true", {
        data: body,
        headers: {
          accept: 'application/json'
        }
      })
      .then(response => {
        this.setState({
          ActivityData: response.data,
          event: {
            title: response.data.name,
            description: response.data.description,
            location: response.data.location_name,
            startTime: '2016-09-16T20:15:00-04:00',
            endTime: '2016-09-16T21:45:00-04:00'
          },
          isFetching: false,
          loaded: true
        })
        if (!this.state.isFetching) {
          let ageNumber = this.state.ActivityData && this.state.ActivityData.ages[
            this.state.ActivityData.ages.length - 1
          ]
          if (ageNumber > 13) {
            this.setState({
              ageGroup: '13+'
            })
          } else {
            this.setState({
              ageGroup: ageNumber
            })
          }
          this.state.ActivityData.tour_items
            ? this.state.ActivityData.tour_items.map((data, l) => {
                data.price_groups.map((price, j) => {
                  price.time_options.map((timeOpt, i) => {
                    let difference =
                      timeOpt.original_price_adult - timeOpt.price_adult
                    let percentage =
                      (difference / timeOpt.original_price_adult) * 100
                    percentage = Math.round(percentage)
                    this.state.percentageArr.push(percentage)
                  })
                })
              })
            : ''
          this.state.ActivityData.tour_items
            ? this.setState({
                maxValue: Math.max(...this.state.percentageArr)
              })
            : 0
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  buyNow () {
    const { ActivityData } = this.state
    if (ActivityData.reserve_out_id != null) {
      this.reservation()
    }
    if (ActivityData.book_now == 'rayna') {
      this.raynaReservation()
    }
    if (ActivityData.book_now == 'qidz') {
      this.booking()
    } 
  }
  booking () {
    const {
      ActivityData,
      qty,
      termCondition,
      phone,
      promoCode,
      walletPay,
      whenDate,
      name,
      email,
      flat,
      building,
      street,
      area,
      deliveryCity,
      country,
      addInstruction,
      totalAmount,
      totalAdultAmt,
      totalAdultQty,
      totalChildAmt,
      totalChildQty
    } = this.state
    const totalqty =
      qty.length > 0 &&
      qty
        .map(datum => datum !== '' && datum !== undefined && datum.count)
        .reduce((a, b) => parseInt(a) + b)

    const token = localStorage.getItem('settoken')
    const cityId = localStorage.getItem('cityId')
    const languageId = localStorage.getItem('languageId')
    if (token != '' && token != null) {
      if (totalqty == 0 || totalqty == undefined) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.common.qty_error
              : 'Please select atleast one ticket'
        })
        return false
      } else {
        this.setState({ errorMessage: '' })
      }
      if (name == '') {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.name
              : 'Please fill in your name'
        })
        return false
      }
      if (phone == '') {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.phone
              : 'Please fill in your phone number'
        })
        return false
      }
      if (
        this.state.ActivityData.ask_for_delivery_details == true &&
        (flat == '' || building == '' || area == '')
      ) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.phone
              : 'Please fill the mandatory fields'
        })
        return false
      }
      if (termCondition === false) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.terms
              : 'Please agree with the terms and conditions'
        })
        return false
      }
      if (
        this.state.ActivityData.ask_for_child_details == true &&
        this.childList.length == 0
      ) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.common.child_error
              : 'Please add the children information'
        })
      }

      if (
        (totalqty !== 0 || totalqty !== undefined) &&
        termCondition === 'on' &&
        name != '' &&
        phone != ''
      ) {
        let qidzDetailAttributes = []
        var totalChild = qty.filter(function (x) {
          return x !== undefined
        })
        totalChild &&
        totalChild.map((qidz, i) => {
            if (qidz.count > 0) {
              qidzDetailAttributes.push({
                total_adults: qidz.count,
                total_childs: 0,
                price_group_row_id: qidz.id,
                date_and_time: ''
              })
            }
          })
        console.log(qidzDetailAttributes, 'llllllllllllll',this.childList)
        let personal_details = []
        /**When the child details true in api */
        this.state.ActivityData.ask_for_child_details == true &&
          this.childList.map((child, c) => {
           
            let test = qidzDetailAttributes.some(
              qa => qa.price_group_row_id === child.priceGroupId
            )
           
            if (test == true) {
             
              var index = qidzDetailAttributes.findIndex(
                ch => ch.price_group_row_id === child.priceGroupId
              )  
              if(qidzDetailAttributes[index]['personal_details']==undefined){console.log(qidzDetailAttributes[index]);
                personal_details=[];
              }
              personal_details.push({
                firstname: child.firstname,
                lastname: child.lastname,
                date_of_birth: child.date_of_birth,
                gender: child.gender
              })
              qidzDetailAttributes[index]['personal_details'] = personal_details
            }
           
          })
        console.log(qidzDetailAttributes, 'qidzDetailAttributes')

        /* When the delivery details true in api*/
        let qidzDeliveryDetails = []
        this.state.ActivityData.ask_for_delivery_details == true
          ? qidzDeliveryDetails.push({
              country: country,
              city: deliveryCity,
              villa_number: flat,
              villa: building,
              street: street,
              area: area,
              additional_instructions: addInstruction
            })
          : qidzDeliveryDetails.push({
              country: '',
              city: '',
              villa_number: '',
              villa: '',
              street: '',
              area: '',
              additional_instructions: ''
            })
        let deliveryDetailsObj = {}
        Object.assign(deliveryDetailsObj, qidzDeliveryDetails)
        /**Send the body to api */
        let body = {
          reservation: {
            activity_id: params.activityId,
            reservation_date: whenDate
              ? moment(whenDate).format('YYYY-MM-DD')
              : null,
            email: email,
            status: 'to_be_defined',
            persons: totalqty,
            phone: phone,
            name: name,
            version_tag: '3rd time, show balance, home best buys',
            partner: 'qidz',
            use_wallet: walletPay,
            comment: '',
            price_adult_sell: totalAdultAmt,
            price_child_sell: totalChildAmt,
            price_total_sell: totalAmount,
            redirect_url: window.location.origin,
            qidz_details_attributes: qidzDetailAttributes,
            delivery_detail_attributes: deliveryDetailsObj[0]
          },
          user: {
            ages: ActivityData.ages,
            area_ids: [],
            categories: ActivityData.categories,
            authentication_token: token,
            code: promoCode ? promoCode : null
          }
        }
        this.setState({ loaded: false })
        axios
          .post(
            config.qidz.endpoints.reservation +
              '?tenantId=' +
              cityId +
              '&locale=' +
              languageId,
            {
              data: body
            }
          )
          .then(response => {
            if (response.data.error) {
              this.setState({
                errorMessage: "Payment can't be processed."
              })
            } else {
              this.setState({
                errorMessage: '',
                promoSuccessMessage: '',
                promoAmtMessage: '',
                relatedActivities: response.data.related_activities,
                paymentLink: response.data.payment_link,
                loaded: true,
                openLogin: false
              })
              window.open(response.data.payment_link, '_self')
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      this.showModal('login')
    }
  }
  reservation () {
    const {
      ActivityData,
      name,
      email,
      areaId,
      pickTime,
      phone,
      whenDate,
      personNUmber
    } = this.state

    const languageId = localStorage.getItem('languageId')
    const token = localStorage.getItem('settoken')
    if (token != '' && token != null) {
      if (personNUmber == null || personNUmber == '') {
        this.setState({
          personErrorMessage:
            languageId === config.lang
              ? staticLanguage.activity.common.select_people
              : 'Please enter number of people'
        })
        return false
      }
      if (whenDate == null || whenDate == '') {
        this.setState({
          whenDateErrorMessage:
            languageId == config.lang
              ? staticLanguage.common.whenDate_error
              : 'Please select a date'
        })
        return false
      }
      if (pickTime == null || pickTime == '') {
        this.setState({
          timeErrorMessage:
            languageId == config.lang
              ? staticLanguage.reservation.validation.time
              : 'Please select a time'
        })
        return false
      }
      if (phone === '') {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.phone
              : 'Please enter phone number'
        })
        return false
      }
      if (
        name != '' &&
        phone != '' &&
        whenDate != '' &&
        pickTime != '' &&
        personNUmber != ''
      ) {
        let options = {
          partner: 'reserveOut',
          email: email,
          name: name,
          countryId: '',
          phone: phone,
          placeId: ActivityData.reserve_out_id,
          areaId: areaId,
          date: moment(whenDate).format('YYYY-MM-DD'),
          time: pickTime,
          covers: personNUmber,
          waitingList: false,
          comment: '',
          smoking: 'NO',
          source: 'PARTNER',
          medium: 'API',
          partnerId: config.partnerId,
          partnerKey: config.partnerKey,
          remoteIdentifier: config.remoteIdentifier
        }
        this.setState({ loaded: false })
        axios
          .post(config.qidz.endpoints.hotelReservation, {
            data: options,
            headers: {
              accept: 'application/json'
            }
          })
          .then(response => {
            console.log(response, 'response')
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      this.showModal('login')
    }
  }

  getAvailability (date, placeId) {
    const token = localStorage.getItem('settoken')
    const times = [
      '8:30',
      '10:00',
      '11:30',
      '13:00',
      '14:30',
      '16:00',
      '17:30',
      '19:00',
      '20:30',
      '22:00',
      '23:30'
    ]
    let result = { availability: [], areaId: null }
    const format = ['previous', 'current', 'next']
    for (let i in times) {
      axios
        .get(
          config.qidz.endpoints.getAvailability +
            '?placeId=' +
            placeId +
            '&date=' +
            moment(date).format('YYYY-MM-DD') +
            '&covers=' +
            this.state.personNUmber +
            '&time=' +
            times[i] +
            '&token=' +
            token,
          {}
        )
        .then(response => {
          if (
            response.data.success &&
            response.data.result.results.length > 0
          ) {
            let results = response.data.result.results
            for (let i in results) {
              let data = results[0]
              if (!result['areaId']) {
                result['areaId'] = data['areaId']
              }
              for (let f in format) {
                let timeslot = data[format[f]]
                if (timeslot) {
                  let minutes =
                    timeslot['time'][1] == 0 ? '00' : timeslot['time'][1]

                  if (timeslot['available'] == 'AVAILABLE') {
                    if (
                      result.availability.indexOf(
                        `${timeslot['time'][0]}:${minutes}`
                      ) === -1
                    ) {
                      result.availability.push(
                        `${timeslot['time'][0]}:${minutes}`
                      )
                    }
                  }
                }
              }
            }
            this.setState({
              hotelTime: result.availability[0],
              areaId: result.areaId
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  raynaReservation () {
    const {
      ActivityData,
      termCondition,
      qty,
      phone,
      name,
      email,
      whenDate,
      walletPay,
      promoCode,
      totalAmount,
      totalAdultAmt,
      totalAdultQty,
      totalChildAmt,
      totalChildQty
    } = this.state
    const token = localStorage.getItem('settoken')
    if (token != '' && token != null) {
      const totalqty =
        qty.length > 0 &&
        qty
          .map(datum => datum !== '' && datum !== undefined && datum.count)
          .reduce((a, b) => parseInt(a) + b)

      const cityId = localStorage.getItem('cityId')
      const languageId = localStorage.getItem('languageId')
      if (totalqty == 0 || totalqty == undefined) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.common.qty_error
              : 'Please select atleast one ticket'
        })
        return false
      } else {
        this.setState({ errorMessage: '' })
      }
      if (phone === '') {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.phone
              : 'Please enter phone number'
        })
        return false
      }
      this.state.ActivityData.tour_items &&
        this.state.ActivityData.tour_items.map((tour, i) =>
          tour.price_groups.map((priceGrp, j) => {
            if (priceGrp.reservation_date_required == true && whenDate == '') {
              this.setState({
                whenDateErrorMessage:
                  languageId == config.lang
                    ? staticLanguage.common.whenDate_error
                    : 'Please select pick a date'
              })
              return false
            }
          })
        )
      if (termCondition === false) {
        this.setState({
          errorMessage:
            languageId === config.lang
              ? staticLanguage.reservation.validation.terms
              : 'Please accept terms and conditions'
        })
      }
      if (termCondition === 'on' && phone != '' && whenDate != '') {
        let raynaDetailAttributes = []
        this.state.qty &&
          this.state.qty.map((rayna, i) => {
            if (rayna != null && rayna != undefined) {
              raynaDetailAttributes.push({
                total_adults: rayna.member == 'Adults' ? rayna.count : 0,
                total_childs: rayna.member == 'Children' ? rayna.count : 0,
                rayna_id: rayna.rayna_id,
                price_group_row_id: rayna.id,
                event_id: rayna.price_rayna_id,
                date_and_time: ''
              })
            }
          })
        let body = {
          reservation: {
            activity_id: params.activityId,
            reservation_date: whenDate
              ? moment(whenDate).format('DD-MM-YYYY')
              : null,
            email: email,
            status: 'to_be_defined',
            persons: totalqty,
            phone: phone,
            name: name,
            version_tag: '3rd time, show balance, home best buys',
            partner: 'rayna',
            use_wallet: walletPay,
            comment: '',
            price_adult_sell: totalAdultAmt,
            price_child_sell: totalChildAmt,
            price_total_sell: totalAmount,
            redirect_url: window.location.origin,
            rayna_details_attributes: raynaDetailAttributes,
            delivery_detail_attributes: {
              country: '',
              city: ActivityData.city,
              villa_number: '',
              villa: '',
              street: ActivityData.address,
              area: '',
              additional_instructions: ''
            }
          },
          user: {
            ages: ActivityData.ages,
            area_ids: [],
            categories: ActivityData.categories,
            authentication_token: 'zzsTmfopaeuN9J7bj2z2',
            code: promoCode ? promoCode : null
          }
        }
        this.setState({ loaded: false })
        axios
          .post(
            config.qidz.endpoints.reservation +
              '?tenantId=' +
              cityId +
              '&locale=' +
              languageId,
            {
              data: body
            }
          )
          .then(response => {
            if (response.data.error) {
              this.setState({
                errorMessage:
                  languageId === config.lang
                    ? staticLanguage.reservation.common.payment_error
                    : "Payment can't be processed."
              })
            } else {
              this.setState({
                relatedActivities: response.data.related_activities,
                paymentLink: response.data.payment_link,
                loaded: true,
                openLogin: false
              })
              window.open(response.data.payment_link, '_self')
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      this.showModal('login')
    }
  }
  reservationRynaTimeSlot () {
    let body = {
      apiname: 'gettourtimeslot',
      payload: {
        TourId: 18,
        travelDate: this.state.whenDate,
        TourTimeOptionId: 1695
      },
      token: ''
    }
    axios
      .post(config.qidz.endpoints.reservationRynaTimeSlot, {
        data: body
      })
      .then(response => {
        this.setState({
          indoorOutdoorData: response.data.activities,
          loaded: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onHotelDateChange (date, placeId) {
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    this.setState({ whenDate: date, whenDateErrorMessage: '' })
    if (date && this.state.personNUmber) {
      this.getAvailability(date, placeId)
    } else {
      this.setState({
        personErrorMessage:
          languageId === config.lang
            ? staticLanguage.activity.common.select_people
            : 'Please enter number of people'
      })
    }
  }
  pickATime (time) {
    this.setState({ pickTime: time, timeErrorMessage: '' })
  }
  whenDateChange (date) {
    this.setState(
      { whenDate: date, whenDateErrorMessage: '' },
      this.reservationRynaTimeSlot
    )
  }
  onPersonChange (e) {
    this.setState({ personNUmber: e.target.value, personErrorMessage: '' })
  }

  onPhoneChange (mob_number) {
    this.setState({ mob_number: mob_number, errorMessage: '' })
  }
  ratingChangedForm1 (newRating) {
    this.setState({ starRatingForm1: newRating, reviewsRatingError1: '' })
  }

  ratingChangedForm2 (newRating) {
    this.setState({ starRatingForm2: newRating, reviewsRatingError2: '' })
  }
  PostComment (event) {
    this.setState({
      comment: event.target.value,
      reviewsCommentError1: '',
      reviewsCommentError2: ''
    })
  }
  PostReviewComment (event) {
    this.setState({
      commentReview: event.target.value,
      reviewsCommentError2: ''
    })
  }

  fileSelectedHandler (event, form) {
    let reader = new FileReader()
    let base64data = ''
    if (form == 'form1') {
      this.setState({
        selectedFile: event.target.files[0]
      })
      reader.readAsDataURL(event.target.files[0])
      reader.onloadend = () => {
        base64data = reader.result
        this.setState({
          reviewImage: base64data
        })
      }
    }
    if (form == 'form2') {
      this.setState({
        selectedFile: event.target.files[0]
      })
      reader.readAsDataURL(event.target.files[0])
      reader.onloadend = () => {
        base64data = reader.result
        this.setState({
          reviewPostImage: base64data
        })
      }
    }
  }
  fileUploadHandler (form) {
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    if (localStorage.getItem('settoken') != null) {
      if (form === 'form1') {
        this.setState({ errorMessage1: '', thankyouMessage1: '' })
        if (!this.state.starRatingForm1) {
          if (languageId === config.lang) {
            this.setState({
              reviewsRatingError1: staticLanguage.common.rating_error
            })
          } else {
            this.setState({
              reviewsRatingError1: 'Please Provide Star Rating!'
            })
          }
        }
        if (!this.state.comment) {
          if (languageId === config.lang) {
            this.setState({
              reviewsCommentError1: staticLanguage.common.comment_error
            })
          } else {
            this.setState({
              reviewsCommentError1: 'Please Provide Comment!'
            })
          }
        }
      }

      if (form === 'form2') {
        this.setState({ errorMessage2: '', thankyouMessage2: '' })
        if (!this.state.starRatingForm2) {
          if (languageId === config.lang) {
            this.setState({
              reviewsRatingError2: staticLanguage.common.rating_error
            })
          } else {
            this.setState({
              reviewsRatingError2: 'Please Provide Star Rating!'
            })
          }
        }
        if (!this.state.commentReview) {
          if (languageId === config.lang) {
            this.setState({
              reviewsCommentError2: staticLanguage.common.comment_error
            })
          } else {
            this.setState({
              reviewsCommentError2: 'Please Provide Comment!'
            })
          }
        }
      }

      if (
        (this.state.starRatingForm1 != '' &&
          this.state.comment != undefined &&
          this.state.comment != '') ||
        (this.state.starRatingForm2 != '' &&
          this.state.commentReview != undefined &&
          this.state.commentReview != '')
      ) {
        let body = ''
        if (form === 'form1') {
          this.setState({ isReviewloading: true })
          body = {
            image: this.state.selectedFile ? this.state.selectedFile.name : '',
            content: this.state.comment ? this.state.comment : '',
            stars: this.state.starRatingForm1 ? this.state.starRatingForm1 : '',
            activityId: params.activityId,
            authentication_token: localStorage.getItem('settoken')
          }
        }
        if (form === 'form2') {
          this.setState({ isPostReviewloading: true })
          body = {
            image: this.state.selectedFile ? this.state.selectedFile.name : '',
            content: this.state.commentReview ? this.state.commentReview : '',
            stars: this.state.starRatingForm2 ? this.state.starRatingForm2 : '',
            activityId: params.activityId,
            authentication_token: localStorage.getItem('settoken')
          }
        }
        axios
          .post(config.qidz.endpoints.addReviews, {
            data: body,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            //console.log(respone,'file');
            if (response.data.error && response.data.error !== '') {
              if (form === 'form1') {
                this.setState(
                  {
                    isErrorForm1:true,
                    isReviewloading: false,
                    errorMessage1: response.data.error,
                    reviewsRatingError1: '',
                    reviewsCommentError1: '',
                    starRatingForm1: '',
                    comment: ''
                  },
                  this.clearAllAddReview('form1')
                )
                // window.location.reload(false);
              }
              if (form === 'form2') {
                this.setState(
                  {
                    isErrorForm2:true,
                    isPostReviewloading: false,
                    errorMessage2: response.data.error,
                    reviewsRatingError2: '',
                    reviewsCommentError2: '',
                    starRatingForm2: '',
                    commentReview: '',
                    reviewPostImage: ''
                  },
                  this.clearAllAddReview('form2')
                )
              }
            } else {
              console.log(response.data, 'response.data')
              if (form === 'form1') {
                this.setState(
                  {
                    isReviewloading: false,
                    starRatingForm1: '',
                    comment: '',
                    reviewsRatingError1: '',
                    reviewsCommentError1: '',
                    thankyouMessage1:
                      languageId === config.lang
                        ? staticLanguage.common.thankyou_review
                        : 'Thank you so much for leaving a review for this actvity. Keep an eye out for it as it will be published within 48 hours.'
                  },
                  () => {
                    this.clearAllAddReview('form1')
                  }
                )
              }
              if (form === 'form2') {
                this.setState(
                  {
                    isPostReviewloading: false,
                    OpenReview1: false,
                    starRatingForm2: '',
                    commentReview: '',
                    reviewsRatingError2: '',
                    reviewsCommentError2: '',
                    thankyouMessage2:
                      languageId === config.lang
                        ? staticLanguage.common.thankyou_review
                        : 'Thank you so much for leaving a review for this actvity. Keep an eye out for it as it will be published within 48 hours.'
                  },
                  () => {
                    this.clearAllAddReview('form2')
                  }
                )
              }
              window.location.reload(false);
            }
            
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      this.showModal('login')
    }
  }
  clearAllAddReview (form) {
    if (form == 'form1') {
      this.setState({ starRatingForm1: 0, comment: '', reviewImage: '' })
    }
    if (form == 'form2') {
      this.setState({
        starRatingForm2: 0,
        commentReview: '',
        reviewPostImage: ''
      })
    }
  }

  addToFav (addFav) {
    const { staticLanguage } = this.state
    const token = localStorage.getItem('settoken')
    const userId = localStorage.getItem('userId')
    const tenant_id = localStorage.getItem('cityId')
    const languageId = localStorage.getItem('languageId')

    let favorite = []
    if (token !== null) {
      const favId = localStorage.getItem('favorite_activities')
        ? JSON.parse(localStorage.getItem('favorite_activities'))
        : []
      if (addFav === 'add') {
        favorite.push({ id: params.activityId })
      }
      favId.length > 0 &&
        favId.map((fav, i) => {
          if (fav.id != params.activityId) {
            favorite.push({ id: fav.id })
          }
        })
      // let activityId = '';
      // if (addFav === 'add') {
      //     activityId = params.activityId;
      // } else {
      //     activityId = '';
      // }
      // alert(params.activityId);
      let body = {
        user: {
          favorite_activities: JSON.stringify(favorite),
          authentication_token: token
        }
      }

      axios
        .post(
          config.qidz.endpoints.addFavourite +
            '?tenant_id=' +
            tenant_id +
            '&locale=' +
            languageId +
            '&userId=' +
            userId,
          {
            data: body,
            headers: {
              accept: 'application/json'
            }
          }
        )
        .then(response => {
          console.log(response.data.error, 'fav test')
          if (response.data.error != '') {
            this.setState({
              favErrorMessage:
                languageId == config.lang
                  ? staticLanguage.common.fav_error
                  : 'There is something wrong at admin'
            })
          } else {
            let favActivity = []
            response.data.favorite_activities.length > 0 &&
              response.data.favorite_activities.map((fav, i) => {
                favActivity.push({ id: fav.id })
              })
            localStorage.setItem(
              'favorite_activities',
              JSON.stringify(favActivity)
            )
            if (addFav === 'add') {
              this.setState({ favText: 'Remove Favorite' })
            } else {
              this.setState({ favText: 'Add to Favorite' })
            }
            this.setState({favErrorMessage:""})
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      this.showModal('login')
    }
  }

  onShareOpenModal () {
    this.setState({
      OpenSharePopUp: true
    })
  }
  onShareCloseModal () {
    this.setState({
      OpenSharePopUp: false
    })
  }
  homeClick () {
    window.open('/', '_self')
  }
  eventSlider () {
    return (
      <div className='events_slider'>
        <Carousel responsive={responsive} showDots={true}>
          {this.state.ActivityData.attachments
            ? this.state.ActivityData.attachments.map((attachment, i) => (
                <img src={attachment.replace('q_30', 'q_80')} />
              ))
            : ''}
        </Carousel>
      </div>
    )
  }
  addToFavourite () {
    const { ActivityData } = this.state
    const favActivity =
      localStorage.getItem('favorite_activities') &&
      JSON.parse(localStorage.getItem('favorite_activities'))
    let fav = favActivity
      ? favActivity.find(obj => obj.id === ActivityData.id)
      : ''
    let addFav = ''
    if (fav != undefined) {
      addFav = 'remove'
    } else {
      addFav = 'add'
    }
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    return (
      <div className='share_ui'>
        <a href onClick={() => this.addToFav(addFav)}>
          {fav != undefined && fav != '' ? (
            <img
              src={`/wp-content/themes/wpreactqidz/assets/img/event-dt/heart_ic_fill.png`}
            />
          ) : (
            <img
              src={`/wp-content/themes/wpreactqidz/assets/img/event-dt/heart_ic.png`}
            />
          )}
          <button>
            {fav != undefined && fav != ''
              ? languageId === config.lang
                ? staticLanguage.shared.remove_favorites
                : 'Remove favorite'
              : this.state.favText
              ? this.state.favText
              : languageId === config.lang
              ? staticLanguage.shared.add_favorites
              : 'Add to favourite'}
          </button>
        </a>       
      </div>
    )
  }
  addToCalender () {
    const { ActivityData, staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    const startDatetime = moment()
      .utc()
      .add(2, 'days')
    const endDatetime = startDatetime.clone().add(2, 'hours')
    const duration = moment.duration(endDatetime.diff(startDatetime)).asHours()
    let event = {
      description: ActivityData.excerpt,
      duration,
      endDatetime: endDatetime.format('YYYYMMDDTHHmmssZ'),
      location: ActivityData.location_name,
      startDatetime: startDatetime.format('YYYYMMDDTHHmmssZ'),
      title: ActivityData.name
    }
    var items = [{ outlook: 'Outlook' }, { google: 'Google' }]
    return (
      <div className='share_ui'>
        <a href>
          <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/g_calendar_ic.png' />
          <AddToCalendar
            event={event}
            buttonLabel={
              languageId == config.lang
                ? staticLanguage.activity.add_calendar.title
                : 'Add to my calender'
            }
          />
        </a>
      </div>
    )
  }
  addReview () {
    const { isReviewloading } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='share_ui'>
        <a href onClick={() => this.onOpenModalReview1()}>
          <img
            src={`/wp-content/themes/wpreactqidz/assets/img/event-dt/g_star_ic.png`}
          />
          <button>
            {languageId === config.lang
              ? staticLanguage.activity.add_review.title
              : 'Add Review'}
          </button>
        </a>
        <Modal
          open={this.state.OpenReview1}
          onClose={() => this.onCloseModalReview('form1')}
          center
        >
          <span className='thankyouMessage'>
            {this.state.thankyouMessage1 && (
              <span className=' alert alert-success'>
                {this.state.thankyouMessage1}
              </span>
            )}
          </span>
          <span className='validate_msg detail_review'>{this.state.errorMessage1}</span>
         
         <div className='reveiw_form_section'>
            <h3>{this.state.ActivityData.name}</h3>
            <div className='review_inputs d-flex'>
              <label>
                {languageId === config.lang
                  ? staticLanguage.common.your_review
                  : 'Your Review:'}
              </label>
              <div className='review'>
                <ReactStars
                  count={5}
                  value={
                    this.state.starRatingForm1 !== 0
                      ? this.state.starRatingForm1
                      : ''
                  }
                  onChange={this.ratingChangedForm1}
                  size={20}
                  isHalf={true}
                />
              </div>
              <span className='validate_msg'>
                {this.state.reviewsRatingError1
                  ? this.state.reviewsRatingError1
                  : ''}
              </span>
            </div>
            <div className='review_inputs d-flex'>
              <label>
                {languageId === config.lang
                  ? staticLanguage.common.your_photo
                  : 'Your Photos:'}
              </label>
              <div className='upload_sec'>
                <div className='upload_img'>
                  {this.state.reviewImage && (
                    <img
                      height='50px'
                      width='50px'
                      src={this.state.reviewImage}
                    />
                  )}
                </div>
                <div className='upload_input_main'>
                  <input
                    accept='image/gif,image/jpeg,image/jpg,image/png'
                    type='file'
                    onChange={e => this.fileSelectedHandler(e, 'form1')}
                  />
                  <div className='upload_btn'>
                    {languageId === config.lang
                      ? staticLanguage.common.upload_now
                      : 'Upload Now'}
                  </div>
                </div>
              </div>
            </div>
            <div className='review_inputs d-flex'>
              <label>
                {languageId === config.lang
                  ? staticLanguage.common.your_message
                  : 'Your Message:'}
              </label>
              <textarea
                id='comment'
                name='comment'
                onChange={e => this.PostComment(e)}
                value={this.state.comment ? this.state.comment : ''}
                placeholder={
                  languageId === config.lang
                    ? staticLanguage.common.type_here
                    : 'Type your message here...'
                }
              />
              <span className='validate_msg'>
                {this.state.reviewsCommentError1
                  ? this.state.reviewsCommentError1
                  : ''}
              </span>
            </div>

            {this.state.isErrorForm1==false && 
              <div className='review_inputs d-flex'>
              <button
                type='button'
                onClick={() => this.fileUploadHandler('form1')}
              >
                {isReviewloading && (
                  <span>
                    {languageId === config.lang
                      ? staticLanguage.common.loading
                      : 'Loading...'}
                  </span>
                )}
                {!isReviewloading && (
                  <span>
                    {languageId === config.lang
                      ? staticLanguage.activity.post_review
                      : 'Post Review'}
                  </span>
                )}
              </button>
              
            </div>
         }</div>
        </Modal>
      </div>
    )
  }
  modifiyActivity () {
    //this.setState({thankyouMessage:''})
    const { isModifyActivityloading } = this.state
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='share_ui'>
        <a href onClick={() => this.onOpenModifyModal()}>
          <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/g_modify_ic.png' />
          {/*<span>Modify Activity</span>*/}
          <button>
            {languageId === config.lang
              ? staticLanguage.common.modify_activity
              : 'Modify Activity'}
          </button>
        </a>
        <Modal
          open={this.state.Open}
          onClose={() => this.onCloseModal()}
          center
        >
          <div className='reveiw_form_section'>
            <h3>{this.state.ActivityData.name}</h3>
            <span className='thankyouMessage'>
              {this.state.thankyouMessage && (
                <span className=' alert alert-success'>
                  {this.state.thankyouMessage}
                </span>
              )}
            </span>
            <label>
              {languageId === config.lang
                ? staticLanguage.common.phone_number
                : 'Your Phone Number'}
            </label>
            <PhoneInput
              defaultCountry={`ae`}
              value={this.state.mob_number ? this.state.mob_number : ''}
              onChange={mob_number => this.onPhoneChange(mob_number)}
            />

            <label>
              {languageId === config.lang
                ? staticLanguage.shared.recommended_age
                : 'Recommended Ages'}
            </label>
            <input
              type='text'
              name='modal_age'
              id='modal_age'
              value={this.state.activityAge ? this.state.activityAge : ''}
              onChange={e => this.setAge(e)}
              placeholder={
                languageId === config.lang
                  ? staticLanguage.common.ages_recommded_for
                  : 'Ages you recommended activity for'
              }
            />

            <div className='review_inputs d-flex'>
              <label>
                {languageId === config.lang
                  ? staticLanguage.common.your_photo
                  : 'Your Photos:'}
              </label>
              {this.state.ModifyImage && (
                <img height='50px' width='50px' src={this.state.ModifyImage} />
              )}
              <input
                type='file'
                name='modal_file'
                multiple
                onChange={e => this.setActivityImg(e)}
                id='modal_file'
              />
              <div className='upload_btn'>
                {languageId === config.lang
                  ? staticLanguage.common.upload_now
                  : 'Upload Now'}
              </div>
            </div>
            <div className='review_inputs about_activity d-flex'>
              <label>
                {languageId === config.lang
                  ? staticLanguage.common.about_activity
                  : 'About The Activity'}
              </label>
              <textarea
                id='modal_activity'
                name='modal_activity'
                value={this.state.editActivity ? this.state.editActivity : ''}
                onChange={e => this.setActivity(e)}
                placeholder={
                  languageId === config.lang
                    ? staticLanguage.common.tell_us
                    : "Tell us about the activity (when it's taking place, where it's taking place, etc)"
                }
              />
              <span className='validate_msg'>
                {this.state.modifyActivityError}
              </span>
            </div>
            <button
              type='button'
              id='edit'
              onClick={e => this.modifyActivityForm()}
            >
              {' '}
              {isModifyActivityloading && (
                <span>
                  {languageId === config.lang
                    ? staticLanguage.common.loading
                    : 'Loading...'}
                </span>
              )}
              {!isModifyActivityloading && (
                <span>
                  {languageId === config.lang
                    ? staticLanguage.add_or_edit.suggest_an_edit
                    : 'Suggest an edit'}
                </span>
              )}
            </button>
          </div>
        </Modal>
      </div>
    )
  }
  shareActivity () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='share_ui'>
        <a href onClick={() => this.onShareOpenModal()}>
          <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/g_share_ic.png' />
          <button>
            {languageId === config.lang
              ? staticLanguage.common.share_activity
              : 'Share Activity'}
          </button>
        </a>
        <Modal
          open={this.state.OpenSharePopUp}
          onClose={() => this.onShareCloseModal()}
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
              url: window.location.href, // (defaults to current url)
              image: 'https://bit.ly/2CMhCMC', // (defaults to og:image or twitter:image)
              description: this.state.ActivityData.description[0], // (defaults to og:description or twitter:description)
              title: this.state.ActivityData.name,
              message: this.state.ActivityData.description[0], // (only for email sharing)
              subject: this.state.ActivityData.name
            }}
          />
        </Modal>
      </div>
    )
  }
  readDeals (deals) {
    this.setState({ readDeals: deals })
  }
  readActivityDescription () {
    const { readDeals } = this.state
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    return (
      <div className='read_more_content'>
        {readDeals == false && (
          <a
            className='read_more_link'
            // data-toggle='collapse'
            // href='#collapseExample'
            // aria-expanded='false'
            // aria-controls='collapseExample'
            onClick={() => this.readDeals(true)}
          >
            {languageId === config.lang
              ? staticLanguage.common.read_this_deal
              : 'Read these deals terms and conditions'}
          </a>
        )}
        {readDeals == true && (
          <a
            className='read_more_link'
            // data-toggle='collapse'
            // href='#collapseExample'
            // aria-expanded='false'
            // aria-controls='collapseExample'
            onClick={() => this.readDeals(false)}
          >
            {languageId === config.lang
              ? staticLanguage.common.read_this_deal
              : 'Hide these deals terms and conditions'}
          </a>
        )}

        {readDeals == true ? (
          <div>
            <div className='card card-body'>
              {this.state.ActivityData.tour_items
                ? this.state.ActivityData.tour_items.map((terms, i) => (
                    <div key={i} className='eve_tag tags'>
                      {ReactHtmlParser(terms.terms_and_conditions)}
                    </div>
                  ))
                : ''}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
  buyNowSection () {
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    return (
      <div className='event_secondry_detail'>
        <div className='event_discount_part d-flex'>
          <div className='event_dis_img'>
            <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/dis_img.png' />
          </div>
          <div className='event_dis_content'>
            {this.state.maxValue != 0 && this.state.maxValue != '-Infinity' && (
              <h3>
                {languageId === config.lang
                  ? staticLanguage.common.buy_now_get
                  : 'BUY NOW GET'}{' '}
                {this.state.maxValue} %{' '}
                {languageId === config.lang ? staticLanguage.common.off : 'OFF'}
              </h3>
            )}
            <span className='dis_sub_text'>
              {languageId === config.lang
                ? staticLanguage.common.buy_now_get
                : 'Prior Booking is required subject to availability.'}
            </span>
            {this.state.ActivityData.phone && (
              <a href={'tel:' + this.state.ActivityData.phone}>
                {languageId === config.lang
                  ? staticLanguage.common.off
                  : 'Call'}
                : {this.state.ActivityData.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
  activityDescription () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='event_widget_first'>
        <div className='widget_first'>
          <h3>
            {languageId === config.lang
              ? staticLanguage.common.acctivity_desc
              : 'Activity Description'}
          </h3>
          {this.state.ActivityData.description
            ? this.state.ActivityData.description.map((description, i) => (
                <p>{description}</p>
              ))
            : ''}
        </div>
      </div>
    )
  }
  getWhen () {
    const { ActivityData } = this.state
    const defaultProps = {
      center: {
        lat: ActivityData.latitude,
        lng: ActivityData.longitude
      },
      zoom: 11
    }
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='event_schedule_widget'>
        <div className='widget_third sche_icons'>
          <h3>
            {languageId === config.lang ? staticLanguage.form.when : 'When'}
          </h3>
          {/* schedule part start */}
          <div className='schedule_section text-center d-flex'>
            <div className='share_ui'>
              <a href>
                <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/g_calendar_ic.png' />
                <span>
                  {ActivityData.start_date &&
                  ActivityData.start_date === ActivityData.end_date
                    ? moment(ActivityData.start_date, 'YYYY-MM-DD').format(
                        'ddd MMM DD'
                      )
                    : ActivityData.available_days && ActivityData.available_days.length == 7
                    ? languageId === config.lang
                      ? staticLanguage.common.everyday_from
                      : 'Every day from ' +
                        ActivityData.available_days[0].start_time +
                        (languageId === config.lang
                          ? staticLanguage.shared.amount.to
                          : ' to ') +
                        ActivityData.available_days[0].end_time
                    : ActivityData.available_days && ActivityData.available_days.length < 7
                    ? ActivityData.available_days[0].day +
                      ' ' +
                      ActivityData.available_days[0].start_time +
                      (languageId === config.lang
                        ? staticLanguage.shared.amount.to
                        : ' to ') +
                      ActivityData.available_days[0].end_time +
                      ' - ' +
                      ActivityData.available_days[
                        ActivityData.available_days.length - 1
                      ].day +
                      ' ' +
                      ActivityData.available_days[
                        ActivityData.available_days.length - 1
                      ].start_time +
                      (languageId === config.lang
                        ? staticLanguage.shared.amount.to
                        : ' to ') +
                      ActivityData.available_days[
                        ActivityData.available_days.length - 1
                      ].end_time
                    : ActivityData.start_date != ActivityData.end_date
                    ? moment(ActivityData.start_date, 'YYYY-MM-DD').format(
                        'ddd MMM DD'
                      ) +
                      (languageId === config.lang
                        ? staticLanguage.shared.amount.to
                        : ' to ') +
                      moment(ActivityData.end_date, 'YYYY-MM-DD').format(
                        'ddd MMM DD'
                      )
                    : moment(ActivityData.start_date, 'YYYY-MM-DD').format(
                        'ddd MMM DD'
                      ) +
                      (languageId === config.lang
                        ? staticLanguage.shared.amount.to
                        : ' to ') +
                      moment(ActivityData.end_date, 'YYYY-MM-DD').format(
                        'ddd MMM DD'
                      )}
                </span>
              </a>
            </div>
            <div className='share_ui'>
              <a href onClick={() => this.openViewSchedule()}>
                <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/view_sch.png' />
                <span>
                  {languageId === config.lang
                    ? staticLanguage.shared.view_schedule
                    : 'View Schedule'}
                </span>
              </a>
              <Modal
                open={this.state.viewScheduleModal}
                onClose={() => this.onCloseModalSchedule()}
                center
              >
                <div className='schedule_info'>
                  <h3>
                    {languageId === config.lang
                      ? staticLanguage.form.when
                      : 'when'}
                  </h3>
                  <div>
                    {ActivityData.available_days.map((vs, i) => (
                      <div className='sch_td'>
                        <span className='sch_date'>
                          {vs.day},{' '}
                          {this.state.ActivityData.start_date &&
                            moment(
                              this.state.ActivityData.start_date,
                              'YYYY-MM-DD'
                            ).format('DD MMM YYYY')}
                        </span>
                        <span className='sch_time'>
                          {moment(vs.start_time, ['HH.mm']).format('hh:mm a')} -{' '}
                          {moment(vs.end_time, ['HH.mm']).format('hh:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Modal>
            </div>
            <div className='share_ui'>
              <a href>
                <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/call_ic.png' />
                <a href={'tel:' + ActivityData.phone}>
                  {languageId === config.lang
                    ? staticLanguage.common.call_orgnizer
                    : 'Call the Orgniser'}
                </a>
              </a>
            </div>
            <div className='share_ui'>
              <a href={ActivityData.website} target='_blank'>
                <img src='/wp-content/themes/wpreactqidz/assets/img/event-dt/web_ic.png' />
                <button>
                  {languageId === config.lang
                    ? staticLanguage.activity.website
                    : 'Website'}
                </button>
              </a>
            </div>
          </div>
          {/* schedule part end */}
          <div className='event-map' style={{ height: '55vh', width: '100%' }}>
            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.17851002438!2d55.272187715448844!3d25.197201837882634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sin!4v1612172805734!5m2!1sen!2sin" width="100%" height={276} frameBorder={0} style={{ border: 0 }} allowFullScreen aria-hidden="false" tabIndex={0} /> */}
            <GoogleMapReact
              bootstrapURLKeys={{ key: config.googlemapKey }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              onGoogleApiLoaded={({ map, maps }) =>
                this.renderMarkers(map, maps)
              }
            >
              <AnyReactComponent
                lat={ActivityData.latitude}
                lng={ActivityData.longitude}
                //img_src='<img src="test"/>'
                onChildClick={() => this.markerClicked(marker)}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    )
  }
  renderMarkers (map, maps) {
    let marker = new maps.Marker({
      position: {
        lat: this.state.ActivityData.latitude,
        lng: this.state.ActivityData.longitude
      },
      map,
      title: 'Hello World!'
    })
    return marker
  }
  openViewSchedule () {
    this.setState({
      viewScheduleModal: true
    })
  }
  onCloseModalSchedule () {
    this.setState({ viewScheduleModal: false })
  }
  displayReviews () {
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    return (
      <div className='user_review_sec'>
        {/* User reviews  section Start */}
        {this.state.ActivityData.reviews ? (
          <div className='user_reviews d-flex'>
            <div className='user_avtar'>
              <img
                src={
                  this.state.ActivityData
                    ? this.state.ActivityData.attachments
                      ? this.state.ActivityData.attachments[0]
                      : '/wp-content/themes/wpreactqidz/assets/img/event-dt/review_thumb.png'
                    : ''
                }
              />
            </div>
            <div className='user_comment'>
              <p>
                <ShowMoreText
                  /* Default options */
                  lines={3}
                  more='Read more'
                  less='Read less'
                  className='content-css'
                  anchorClass='my-anchor-css-class'
                  onClick={this.executeOnClick}
                  expanded={false}
                  // width={280}
                >
                  {this.state.ActivityData.reviews
                    ? this.state.ActivityData.reviews[0].content
                    : ''}
                </ShowMoreText>
              </p>
              <span className='user_name'>
                {this.state.ActivityData.reviews
                  ? this.state.ActivityData.reviews[0].user_name
                  : ''}
              </span>
              <div className='review'>
                {this.state.ActivityData.reviews &&
                  this.state.ActivityData.reviews[0].stars != undefined && (
                    <StarRatings
                      rating={parseInt(
                        this.state.ActivityData.reviews[0].stars
                      )}
                      starRatedColor='#ffd700'
                      numberOfStars={5}
                      name='rating'
                      starDimension='15px'
                      starSpacing='5px'
                    />
                  )}
              </div>
            </div>
          </div>
        ) : (
          config.noReview
        )}
        <div className='read_more_content'>
          {this.state.ActivityData.reviews ? (
            this.state.ActivityData.reviews.length > 1 ? (
              <a
                className='read_more_link'
                data-toggle='collapse'
                href='#activity_rm'
                aria-expanded='false'
                aria-controls='activity_rm'
              >
                {languageId === config.lang
                  ? staticLanguage.common.seemore
                  : 'See More...'}
              </a>
            ) : (
              ''
            )
          ) : (
            ''
          )}
          <div className='collapse' id='activity_rm'>
            {this.state.ActivityData.reviews
              ? this.state.ActivityData.reviews.length > 1
                ? this.state.ActivityData.reviews.slice(1).map((review, i) => (
                    <div className='card card-body review_body'>
                      {/* User reviews  section Start */}
                      <div className='user_reviews d-flex'>
                        <div className='user_avtar'>
                          <img
                            src={
                              review
                                ? review.attachments
                                  ? review.attachments[0]
                                  : '/wp-content/themes/wpreactqidz/assets/img/event-dt/review_thumb.png'
                                : ''
                            }
                          />
                        </div>
                        <div className='user_comment'>
                          <p>{review.content}</p>
                          <span className='user_name'>{review.user_name}</span>
                          <div className='review'>
                            <ReactStars
                              count={5}
                              value={review.stars}
                              size={20}
                              isHalf={true}
                              activeColor='#ffd700'
                            />
                          </div>
                        </div>
                      </div>
                      {/* User reviews  section End */}
                    </div>
                  ))
                : ''
              : ''}
          </div>
        </div>
        {/* User reviews  section End */}
      </div>
    )
  }
  postReviews () {
    const { isPostReviewloading } = this.state
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    return (
      <div className='reveiw_form_section'>
        <span className='thankyouMessage'>
          {this.state.thankyouMessage2 && (
            <span className=' alert alert-success'>
              {this.state.thankyouMessage2}
            </span>
          )}
        </span>
        {this.state.errorMessage2 && <span className='validate_msg one_review'>
            {this.state.errorMessage2}
          </span>}
        {this.state.isErrorForm2==false &&
        <>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.common.your_review
              : 'Your Review:'}
          </label>
          <div className='review'>
            <ReactStars
              count={5}
              value={
                this.state.starRatingForm2 ? this.state.starRatingForm2 : ''
              }
              onChange={this.ratingChangedForm2}
              size={20}
              isHalf={true}
              activeColor='#ffd700'
            />
          </div>
          <span className='validate_msg'>
            {this.state.reviewsRatingError2
              ? this.state.reviewsRatingError2
              : ''}
          </span>
        </div>
        <div className='review_inputs d-flex upload_inputs'>
          <label>
            {languageId === config.lang
              ? staticLanguage.common.your_photo
              : 'Your Photos:'}
          </label>
          {this.state.reviewPostImage && (
            <img height='50px' width='50px' src={this.state.reviewPostImage} />
          )}
          <input
            accept='image/gif,image/jpeg,image/jpg,image/png'
            type='file'
            onChange={e => this.fileSelectedHandler(e, 'form2')}
          />
          <div class='upload_btn review_upload'>
            {languageId === config.lang
              ? staticLanguage.common.upload_now
              : 'Upload Now'}
          </div>
        </div>
        <div className='review_inputs d-flex'>
          <label>
            {languageId === config.lang
              ? staticLanguage.common.your_message
              : 'Your Message:'}
          </label>
          <textarea
            id='comment'
            name='comment'
            onChange={e => this.PostReviewComment(e)}
            value={this.state.commentReview ? this.state.commentReview : ''}
            placeholder={
              languageId === config.lang
                ? staticLanguage.common.type_here
                : 'Type your message here...'
            }
          />
          <span className='validate_msg'>
            {this.state.reviewsCommentError2
              ? this.state.reviewsCommentError2
              : ''}
          </span>
          <br></br>
        </div>

        <div className='review_inputs d-flex'>
          <label />
          <button type='button' onClick={() => this.fileUploadHandler('form2')}>
            {isPostReviewloading && (
              <span>
                {languageId === config.lang
                  ? staticLanguage.common.loading
                  : 'Loading...'}
              </span>
            )}
            {!isPostReviewloading && (
              <span>
                {languageId === config.lang
                  ? staticLanguage.activity.post_review
                  : 'Post Review'}
              </span>
            )}
          </button>
        
        </div>
      </>}      
      </div>
    )
  }
  nameChange (event) {
    this.setState({ name: event.target.value, errorMessage: '' })
  }
  flatChange (event) {
    this.setState({ flat: event.target.value, errorMessage: '' })
  }
  buildingChange (event) {
    this.setState({ building: event.target.value, errorMessage: '' })
  }
  streetChange (event) {
    this.setState({ street: event.target.value, errorMessage: '' })
  }
  areaChange (event) {
    this.setState({ area: event.target.value, errorMessage: '' })
  }
  deliveryCityChange (event) {
    this.setState({ deliveryCity: event.target.value, errorMessage: '' })
  }
  countryChange (event) {
    this.setState({ country: event.target.value, errorMessage: '' })
  }
  additionalInstChange (event) {
    this.setState({ addInstruction: event.target.value, errorMessage: '' })
  }
  openWebsite (website) {
    window.open(website, '_blank')
  }
  getEventActivity () {
    const { isVisibleActivity, ActivityData } = this.state
    const languageId = localStorage.getItem('languageId')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const { staticLanguage } = this.state
    const activityData = ActivityData.tour_items
      ? ActivityData.tour_items.map((deals, i) => (
          <>
            {deals.price_groups.map((dealsDetail, j) =>
              dealsDetail.time_options
                .slice(0, isVisibleActivity)
                .map((timeOpt, k) => {
                  return (
                    <div key={i} className='event_activity_part d-flex'>
                      <div className='event_activity'>
                        <h3>{timeOpt.name}</h3>
                        <a
                          href={`booking?activityId=` + timeOpt.id}
                          className='event_buy_tag'
                          // onClick={() => this.booking(timeOpt.id)}
                        >
                          {languageId === config.lang
                            ? staticLanguage.common.buy_this_deal
                            : 'Buy this deal now!'}
                        </a>
                        <p>
                          {
                            <ShowMoreText
                              /* Default options */
                              lines={3}
                              more={
                                languageId === config.lang
                                  ? staticLanguage.common.readmore
                                  : 'Read More'
                              }
                              less={
                                languageId === config.lang
                                  ? staticLanguage.common.readless
                                  : 'Read Less'
                              }
                              className='content-css'
                              anchorClass='my-anchor-css-class'
                              onClick={this.executeOnClick}
                              expanded={false}
                              // width={280}
                            >
                              {timeOpt.description}
                            </ShowMoreText>
                          }
                        </p>
                      </div>
                      <div className='event_act_price'>
                        <div className='event_price'>
                          {timeOpt.original_price_adult && (
                            <span className='dis_price'>
                              {currency}{' '}
                              {timeOpt.original_price_adult.replace(
                                /\.?0+$/,
                                ''
                              )}
                            </span>
                          )}
                          {timeOpt.price_adult && (
                            <span className='main_price'>
                              {currency}{' '}
                              {timeOpt.price_adult.replace(/\.?0+$/, '')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
            )}
          </>
        ))
      : ''

    return (
      <div className='event_third_detail'>
        {activityData ? activityData : ''}
        {ActivityData &&
          ActivityData.tour_items &&
          isVisibleActivity <
            ActivityData.tour_items[0].price_groups[0].time_options.length && (
            <div className='read_more_content'>
              <a
                className='read_more_link'
                data-toggle='collapse'
                href='#activity_rm'
                onClick={e => this.seeMoreEventActivityResult(e)}
                aria-expanded='false'
                aria-controls='activity_rm'
              >
                {languageId === config.lang
                  ? staticLanguage.common.readmore
                  : 'Read More...'}
              </a>
            </div>
          )}
      </div>
    )
  }
  seeMoreEventActivityResult () {
    const { ActivityData, isVisibleActivity } = this.state
    if (ActivityData && ActivityData.length === isVisibleActivity) {
      this.setState({ isVisibleActivity: 2 })
    } else {
      this.setState(old => {
        return { isVisibleActivity: old.isVisibleActivity + 2 }
      })
    }
  }
  viewScheduleClose () {
    this.setState({ viewSchedule: false })
  }
  changeLanguage (event) {
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false, languageId: event.target.value })
    this.eventDetails()
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
    //localStorage.setItem('languageId', lang[0])
    this.setState({ loaded: false, languageId: lang[0] })
    this.eventDetails()
    if (lang.length == 1) {
      window.history.pushState(
        '',
        '',
        window.location.href.replace('/ar', '/en')
      )
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
                    id='myLanguageSelect'
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
  addChildren () {
    const { qty, staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')
    let childData = []
    var totalChild = qty.filter(function (x) {
      return x !== undefined
    })
    debugger;
    totalChild.length > 0 &&
    totalChild.map((child, k) => {
        for (var i = 0; i < child.count; i++) {
          childData.push(
            <div className='child_personal_info'>
              <span>
                {child.name} #{k + 1}
              </span>
              <button
              type="button"
              value={i}
                className='add-Child'
                onClick={(e) => this.addChildInfo(e, child.count, child.id,i)}
              >
                {languageId == config.lang
                  ? staticLanguage.common.child_info
                  : 'Add Child Information'}
              </button>
            </div>
          )
        }
      })
    return childData
  }
  addChildInfo (event, count, id) {console.log(event.target.value,'add child info');
    this.setState({
      openChildInfo: true,
      childCount: count,
      priceGroupId: id,
      index:event.target.value
    })
  }
  onCloseModalChildInfo () {
    this.setState({
      openChildInfo: false
    })
  }
  firstNameChange (event) {
    this.setState({ childFirstName: event.target.value, childErrorMessage: '' })
  }
  lastNameChange (event) {
    this.setState({ childLastName: event.target.value, childErrorMessage: '' })
  }
  dobChange (date) {
    this.setState({ childDOB: date, childErrorMessage: '' })
  }
  genderChange (event) {
    this.setState({ childGender: event.target.value, childErrorMessage: '' })
  }
  UpdateChildInfo () {
    const languageId = localStorage.getItem('languageId')
    const {
      staticLanguage,
      childFirstName,
      childLastName,
      childDOB,
      childGender,
      priceGroupId,
      index
    } = this.state
    if(childFirstName=='' || childLastName=='' || childDOB=='' || childGender==''){
      this.setState({childErrorMessage:languageId==config.lang?staticLanguage.common.childError:"Please enter all details of your child"});
      return false;
    }else{
      this.childList.push({
        firstname: childFirstName,
        lastname: childLastName,
        date_of_birth: moment(childDOB).format('YYYY-MM-DD'),
        gender: childGender,
        priceGroupId: priceGroupId
      })
      this.setState({
        childList:this.childList,
        openChildInfo: false,
        childFirstName: '',
        childLastName: '',
        childDOB: '',
        childGender: ''
      })
    }
    
  }
  render () {
    const {
      qty,
      walletPay,
      viewSchedule,
      totalAmount,
      totalAdultAmt,
      totalAdultQty,
      totalChildAmt,
      totalChildQty
    } = this.state
    const token = localStorage.getItem('settoken')

    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    const totalqty =
      qty.length > 0 &&
      qty
        .map(datum => datum !== '' && datum !== undefined && datum.count)
        .reduce((a, b) => parseInt(a) + b)
    return (
      <>
        {this.getHeader()}
        <section id='breadcrumb'>
          <div className='container'>
            <div className='breadcrumb_inner'>
              <span>
                <a href onClick={() => this.homeClick()}>
                  {languageId === config.lang
                    ? staticLanguage.tab.home
                    : 'Home'}
                  &nbsp;&nbsp;{'>>'}&nbsp;&nbsp;
                </a>
                {this.state.ActivityData.name}
              </span>
            </div>
          </div>
        </section>
        <Loader options={config.options} loaded={this.state.loaded}></Loader>
        {!this.state.isFetching ? (
          <main id='main'>
            <div id='page'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-7'>
                    <div className='events_details_main'>
                      <div className='events_details_inner'>
                        {this.eventSlider()}
                        <div className='events_content'>
                          <div className='events_primary_detail'>
                            <div className='primary_inner d-flex'>
                              <div className='eve_pri_headings'>
                                <h3>{this.state.ActivityData.name}</h3>
                                <span className='eve_location'>
                                  <span style={{ color: '#4bbfba' }}>
                                    {this.state.ActivityData.city
                                      ? this.state.ActivityData.city
                                      : ''}
                                  </span>
                                  ,{' '}
                                  {languageId === config.lang
                                    ? staticLanguage.common.explore_city
                                    : 'Explore The City'}{' '}
                                </span>
                                {this.state.ActivityData.ages ? (
                                  <div className='eve_tags d-flex'>
                                    <div className='eve_age tags'>
                                      &lt;
                                      {this.state.ActivityData.age && this.state.ActivityData.ages[0] === 0
                                        ? '0'
                                        : this.state.ActivityData.ages[0]}
                                      -{this.state.ageGroup} yrs
                                    </div>
                                    {this.state.ActivityData.categories
                                      ? this.state.ActivityData.categories.map(
                                          (category, i) => (
                                            <div
                                              key={i}
                                              className='eve_tag tags'
                                            >
                                              {' '}
                                              {category}
                                              {/* <a href onClick={()=>this.onCategoryClick()}> {category}</a> */}
                                            </div>
                                          )
                                        )
                                      : ''}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                              {/* <div className="eve_booking_btn">
                                                        <button type="button">Book Now!</button>
                                                    </div> */}
                            </div>
                            <div className='events_period'>
                              {languageId === config.lang
                                ? staticLanguage.common.limited_timeonly
                                : 'Limited time only!'}
                            </div>
                            <div className='share_section text-center d-flex'>
                              {this.addToFavourite()}
                              {this.addToCalender()}
                              {this.addReview()}
                              {this.modifiyActivity()}
                              {this.shareActivity()}
                             
                            </div>
                            <span className='error_message2'>{this.state.favErrorMessage}</span>
                            {this.state.ActivityData.tour_items
                              ? this.readActivityDescription()
                              : ''}
                          </div>
                          {this.buyNowSection()}
                          {this.state.ActivityData.tour_items
                            ? this.getEventActivity()
                            : ''}
                          {this.activityDescription()}

                          <div className='event_review_widget'>
                            <div className='widget_second'>
                              <h3>
                                {' '}
                                {languageId === config.lang
                                  ? staticLanguage.shared.review
                                  : 'Review'}
                              </h3>
                              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p> */}
                            </div>
                            {this.displayReviews()}
                            {this.postReviews()}
                          </div>
                          {this.getWhen()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-5'>
                    <div className='events_rt_sidebar'>
                      <div className='events_rt_inner'>
                        <div className='booking_info_sidebar'>
                        
                            <div className='widget_heading widget_head_red'>
                              <h3>
                              {this.state.ActivityData.tour_items ? (
                                languageId === config.lang
                                  ? staticLanguage.common.select_activity
                                  : 'Select Activity'
                                  ): languageId === config.lang
                                  ? staticLanguage.common.add_details
                                  : 'Add Details'}
                              </h3>
                            </div>
                         
                          <div className='booking_list row'>
                            {!this.state.ActivityData.tour_items && (
                              <div className='sch_sec col-md-6'>
                                <label>
                                  {' '}
                                  {languageId === config.lang
                                    ? staticLanguage.shared.view_schedule
                                    : 'View Schedule'}
                                </label>
                                {this.state.ActivityData.start_date && (
                                  <div className='schedule_date'>
                                    {this.state.ActivityData.start_date &&
                                    this.state.ActivityData.start_date ===
                                      this.state.ActivityData.end_date
                                      ? moment(
                                          this.state.ActivityData.start_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD')
                                      : this.state.ActivityData.available_days && this.state.ActivityData.available_days
                                          .length == 7
                                      ? languageId === config.lang
                                        ? staticLanguage.common.everyday_from
                                        : 'Every day from ' +
                                            this.state.ActivityData
                                              .available_days[0].start_time +
                                            languageId ===
                                          config.lang
                                        ? staticLanguage.shared.amount.to
                                        : ' to ' +
                                        this.state.ActivityData.available_days && this.state.ActivityData
                                            .available_days[0].end_time
                                      : this.state.ActivityData.start_date !=
                                        this.state.ActivityData.end_date
                                      ? moment(
                                          this.state.ActivityData.start_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD') +
                                        '-' +
                                        moment(
                                          this.state.ActivityData.end_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD')
                                      : moment(
                                          this.state.ActivityData.start_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD') +
                                        '-' +
                                        moment(
                                          this.state.ActivityData.end_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD')}
                                  </div>
                                )}
                                {this.state.ActivityData.start_date && (
                                  <span>
                                    {this.state.ActivityData.start_date ===
                                    this.state.ActivityData.end_date ? (
                                      <span>
                                        Starts{' '}
                                        {moment(
                                          this.state.ActivityData.start_date,
                                          'YYYY-MM-DD'
                                        ).format('ddd MMM DD')}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </span>
                                )}
                                <button
                                  type='button'
                                  className='sch_btn'
                                  onClick={() => this.viewSchedule()}
                                >
                                  {languageId === config.lang
                                    ? staticLanguage.shared.view_schedule
                                    : 'View Schedule'}
                                </button>
                              </div>
                            )}
                            {this.state.ActivityData.reserve_out_id != null && (
                              <div class='sch_sec person_input col-md-6'>
                                <label>
                                  {languageId === config.lang
                                    ? staticLanguage.common.select_people
                                    : 'Select Number of People'}
                                </label>
                                <div class='form-group'>
                                  <input
                                    type='text'
                                    className='form-control'
                                    value={
                                      this.state.personNUmber
                                        ? this.state.personNUmber
                                        : ''
                                    }
                                    onChange={e => this.onPersonChange(e)}
                                  />
                                </div>
                                <span className='error_message2'>
                                  {this.state.personErrorMessage}
                                </span>
                              </div>
                            )}
                            {viewSchedule && (
                              <div className='col-md-12'>
                                <div className='schedule_info'>
                                  <h3>
                                    {languageId === config.lang
                                      ? staticLanguage.form.when
                                      : 'When'}
                                  </h3>
                                  <div>
                                    <span
                                      className='icon icon-close'
                                      onClick={e =>
                                        this.viewScheduleClose(true)
                                      }
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
                                    {viewSchedule.map((vs, i) => (
                                      <div className='sch_td'>
                                        <span className='sch_date'>
                                          {vs.day}
                                          {this.state.ActivityData.start_date &&
                                            moment(
                                              this.state.ActivityData
                                                .start_date,
                                              'YYYY-MM-DD'
                                            ).format('DD MMM YYYY')}
                                        </span>
                                        <span className='sch_time'>
                                          {moment(vs.start_time, [
                                            'HH.mm'
                                          ]).format('hh:mm a')}{' '}
                                          -{' '}
                                          {moment(vs.end_time, [
                                            'HH.mm'
                                          ]).format('hh:mm a')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {this.state.ActivityData.reserve_out_id != null && (
                              <>
                                <div class='sch_sec col-md-6'>
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.common.desired_date
                                      : 'Select Desired Date & Time'}
                                  </label>
                                  <DatePicker
                                    onChange={date =>
                                      this.onHotelDateChange(
                                        date,
                                        this.state.ActivityData.reserve_out_id
                                      )
                                    }
                                    selected={
                                      this.state.whenDate
                                        ? this.state.whenDate
                                        : ''
                                    }
                                    dateFormat='yyyy-MM-d'
                                    placeholderText={
                                      languageId === config.lang
                                        ? staticLanguage.datepicker.title
                                        : 'Select Date'
                                    }
                                    minDate={moment().toDate()}
                                  />
                                  <span className='error_message2'>
                                    {this.state.whenDateErrorMessage}
                                  </span>
                                </div>
                                <div
                                  class={` col-md-6 ${
                                    this.state.pickTime ? 'sch_sec' : 'sch_sec_gray'
                                  }`}
                                >
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.reservation.pick_time
                                      : 'Pick a Time'}
                                  </label>
                                  <button
                                    className='pick_date_btn'
                                    type='button'
                                    onClick={() =>
                                      this.pickATime(
                                        this.state.hotelTime
                                          ? this.state.hotelTime
                                          : ''
                                      )
                                    }
                                  >
                                    {this.state.hotelTime
                                      ? this.state.hotelTime
                                      : languageId === config.lang
                                      ? staticLanguage.form.pick_date
                                      : 'Please pick a date first'}
                                  </button>
                                  <span className='error_message2'>
                                    {this.state.timeErrorMessage}
                                  </span>
                                </div>
                              </>
                            )}
                            {this.state.ActivityData.tour_items
                              ? this.state.ActivityData.tour_items
                                  .slice(0, 1)
                                  .map((tour, i) =>
                                    tour.price_groups.map((priceGrp, j) =>
                                      priceGrp.reservation_date_required ===
                                      true ? (
                                        <div className='sch_sec col-md-6'>
                                          <label>{languageId === config.lang ? staticLanguage.form.when : 'When'}</label>
                                          <DatePicker
                                            onChange={date =>
                                              this.whenDateChange(date)
                                            }
                                            selected={
                                              this.state.whenDate
                                                ? this.state.whenDate
                                                : ''
                                            }
                                            dateFormat='d-MM-yyyy'
                                            placeholderText={
                                              languageId == config.lang
                                                ? staticLanguage.form.pick_date
                                                : 'Pick a date'
                                            }
                                            minDate={moment().toDate()}
                                          />
                                          <span className='error_message2'>
                                            {this.state.whenDateErrorMessage}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )
                                    )
                                  )
                              : ''}
                          </div>

                          {this.state.ActivityData.tour_items
                            ? this.state.ActivityData.tour_items.map(
                                (tour, i) =>
                                  tour.price_groups.map((priceGrp, j) =>
                                    priceGrp.time_options.map(
                                      (timeOpt, k, l) => (
                                        <div className='booking_list row'>
                                          <div className='activity_detail'>
                                            <h2>{timeOpt.name}</h2>
                                            {tour.rayna_id != null ? (
                                              <div>
                                                <div className='quan_sec row'>
                                                  <div className='quan_left col-md-6'>
                                                    <div className='quantity-input'>
                                                      <div className='qty_label'>
                                                        Adults
                                                      </div>
                                                      <div className='qty_price'>
                                                        <span className=' main_price'>
                                                          {timeOpt.price_adult.replace(
                                                            /\.?0+$/,
                                                            ''
                                                          )}
                                                          {' '}{currency}
                                                        </span>
                                                        <span className='dis_price'>
                                                          {timeOpt.original_price_adult.replace(
                                                            /\.?0+$/,
                                                            ''
                                                          )}
                                                          {' '}{currency}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className='quan_right col-md-6'>
                                                    <div className='quantity-input'>
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--left'
                                                        value={timeOpt.id}
                                                        onClick={e =>
                                                          this.decrement(
                                                            timeOpt.id,
                                                            timeOpt.price_adult,
                                                            'Adults',
                                                            timeOpt.id,
                                                            timeOpt.rayna_id,
                                                            tour.rayna_id,
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-minus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                      <input
                                                        className='quantity-input__screen'
                                                        type='text'
                                                        value={
                                                          qty.length > 0
                                                            ? qty[timeOpt.id] !=
                                                              undefined
                                                              ? qty[timeOpt.id]
                                                                  .count
                                                              : 0
                                                            : 0
                                                        }
                                                        readonly
                                                      />
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--right'
                                                        value={timeOpt.id}
                                                        onClick={e =>
                                                          this.increment(
                                                            timeOpt.id,
                                                            timeOpt.price_adult,
                                                            'Adults',
                                                            timeOpt.id,
                                                            timeOpt.rayna_id,
                                                            tour.rayna_id,
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-plus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className='quan_sec row'>
                                                  <div className='quan_left col-md-6'>
                                                    <div className='quantity-input'>
                                                      <div className='qty_label'>
                                                        Children
                                                      </div>
                                                      <div className='qty_price'>
                                                        <span className=' main_price'>
                                                          {timeOpt.price_child.replace(
                                                            /\.?0+$/,
                                                            ''
                                                          )}
                                                          {' '}{currency}
                                                        </span>
                                                        <span className=' dis_price'>
                                                          {timeOpt.original_price_child.replace(
                                                            /\.?0+$/,
                                                            ''
                                                          )}
                                                          {' '}{currency}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className='quan_right col-md-6'>
                                                    <div className='quantity-input'>
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--left'
                                                        value={timeOpt.id + 10}
                                                        onClick={e =>
                                                          this.decrement(
                                                            timeOpt.id + 10,
                                                            timeOpt.price_adult,
                                                            'Children',
                                                            timeOpt.id,
                                                            timeOpt.rayna_id,
                                                            tour.rayna_id,
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-minus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                      <input
                                                        className='quantity-input__screen'
                                                        type='text'
                                                        value={
                                                          qty.length > 0
                                                            ? qty[
                                                                timeOpt.id + 10
                                                              ] != undefined
                                                              ? qty[
                                                                  timeOpt.id +
                                                                    10
                                                                ].count
                                                              : 0
                                                            : 0
                                                        }
                                                        readonly
                                                      />
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--right'
                                                        value={timeOpt.id_10}
                                                        onClick={e =>
                                                          this.increment(
                                                            timeOpt.id + 10,
                                                            timeOpt.price_child,
                                                            'Children',
                                                            timeOpt.id,
                                                            timeOpt.rayna_id,
                                                            tour.rayna_id,
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-plus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div>
                                                <div className='quan_sec row'>
                                                  <div className='quan_left col-md-6'>
                                                    {currency}{' '}
                                                    {timeOpt.price_adult.replace(
                                                      /\.?0+$/,
                                                      ''
                                                    )}
                                                  </div>
                                                  <div className='quan_right col-md-6'>
                                                    <div className='quantity-input'>
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--left'
                                                        value={
                                                          this.state
                                                            .ActivityData
                                                            .tour_items.length >
                                                          1
                                                            ? i
                                                            : k
                                                        }
                                                        onClick={e =>
                                                          this.decrement(
                                                            this.state
                                                              .ActivityData
                                                              .tour_items
                                                              .length > 1
                                                              ? i
                                                              : k,
                                                            timeOpt.price_adult,
                                                            'Adults',
                                                            timeOpt.id,
                                                            '',
                                                            '',
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-minus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                      <input
                                                        className='quantity-input__screen'
                                                        type='text'
                                                        value={
                                                          qty.length > 0
                                                            ? qty[
                                                                this.state
                                                                  .ActivityData
                                                                  .tour_items
                                                                  .length > 1
                                                                  ? i
                                                                  : k
                                                              ] != undefined
                                                              ? qty[
                                                                  this.state
                                                                    .ActivityData
                                                                    .tour_items
                                                                    .length > 1
                                                                    ? i
                                                                    : k
                                                                ].count
                                                              : 0
                                                            : 0
                                                        }
                                                        readonly
                                                      />
                                                      <button
                                                        className='quantity-input__modifier quantity-input__modifier--right'
                                                        value={
                                                          this.state
                                                            .ActivityData
                                                            .tour_items.length >
                                                          1
                                                            ? i
                                                            : k
                                                        }
                                                        onClick={e =>
                                                          this.increment(
                                                            this.state
                                                              .ActivityData
                                                              .tour_items
                                                              .length > 1
                                                              ? i
                                                              : k,
                                                            timeOpt.price_adult,
                                                            'Adults',
                                                            timeOpt.id,
                                                            '',
                                                            '',
                                                            timeOpt.name
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          class='fa fa-plus'
                                                          aria-hidden='true'
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class='total_act'>
                                                  <span class='total_label'>
                                                    {languageId === config.lang
                                                      ? staticLanguage.payment
                                                          .total
                                                      : 'Total'}
                                                  </span>
                                                  <span class='price_quan'>
                                                    {currency}{' '}
                                                    {qty.length > 0
                                                      ? qty[
                                                          this.state
                                                            .ActivityData
                                                            .tour_items.length >
                                                          1
                                                            ? i
                                                            : k
                                                        ] != undefined
                                                        ? qty[
                                                            this.state
                                                              .ActivityData
                                                              .tour_items
                                                              .length > 1
                                                              ? i
                                                              : k
                                                          ].price
                                                        : '0.00'
                                                      : '0.00'}
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )
                                  )
                              )
                            : ''}

                          {token != null || token != undefined ? (
                            <div className='personal_info'>
                              <div className='per_info_inner'>
                                <div className='widget_heading widget_head_blue'>
                                  <h3>
                                    {languageId === config.lang
                                      ? staticLanguage.reservation.personal
                                      : 'Personal Information'}
                                  </h3>
                                </div>
                                <div className='info_area'>
                                  <div className='form-group'>
                                    <label for='formGroupExampleInput'>
                                      {languageId === config.lang
                                        ? staticLanguage.register.title
                                        : 'Name'}
                                    </label>
                                    <input
                                      type='text'
                                      className='form-control'
                                      value={
                                        this.state.name ? this.state.name : ''
                                      }
                                      onChange={e => this.nameChange(e)}
                                    />
                                  </div>
                                  <div className='form-group'>
                                    <label for='formGroupExampleInput'>
                                      {languageId === config.lang
                                        ? staticLanguage.register.email_label
                                        : 'Email Address'}
                                    </label>
                                    <input
                                      type='text'
                                      readOnly
                                      className='form-control'
                                      value={
                                        this.state.email ? this.state.email : ''
                                      }
                                      // onChange={e => this.emailChange(e)}
                                    />
                                  </div>
                                  <div className='form-group'>
                                    <label for='formGroupExampleInput'>
                                      {languageId === config.lang
                                        ? staticLanguage.common.phone_number
                                        : 'Phone Number:'}
                                    </label>
                                    <PhoneInput
                                      className='form-control'
                                      placeholder='Enter Phone Number'
                                      country={'ae'}
                                      value={this.state.phone}
                                      onChange={phone =>
                                        this.setState({ phone })
                                      }
                                    />

                                    {/* <input type="text" className="form-control" placeholder="Enter Phone Number" /> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                          {(token != null || token != undefined) &&
                            this.state.ActivityData.ask_for_delivery_details ==
                              true && (
                              <div className='personal_info'>
                                <div className='per_info_inner'>
                                  <div className='widget_heading widget_head_blue'>
                                    <h3>
                                      {languageId === config.lang
                                        ? staticLanguage.reservation.personal
                                        : 'Delivery Address'}
                                    </h3>
                                  </div>
                                  <div className='info_area row'>
                                    <div className='form-group col-md-6'>
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.register.title
                                          : 'Flat/Villa No.'}
                                        {'*'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.flat ? this.state.flat : ''
                                        }
                                        onChange={e => this.flatChange(e)}
                                      />
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.register.title
                                          : 'Building/Villa'}
                                        {'*'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.building
                                            ? this.state.building
                                            : ''
                                        }
                                        onChange={e => this.buildingChange(e)}
                                      />
                                    </div>
                                    <div className='form-group col-md-6'>
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.register.email_label
                                          : 'Street'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.street
                                            ? this.state.street
                                            : ''
                                        }
                                        onChange={e => this.streetChange(e)}
                                      />
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.register.title
                                          : 'Area'}
                                        {'*'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.area ? this.state.area : ''
                                        }
                                        onChange={e => this.areaChange(e)}
                                      />
                                    </div>
                                    <div className='form-group col-md-6'>
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.common.phone_number
                                          : 'City:'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.deliveryCity
                                            ? this.state.deliveryCity
                                            : ''
                                        }
                                        onChange={e =>
                                          this.deliveryCityChange(e)
                                        }
                                      />
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.register.title
                                          : 'Country'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.country
                                            ? this.state.country
                                            : ''
                                        }
                                        onChange={e => this.countryChange(e)}
                                      />

                                      {/* <input type="text" className="form-control" placeholder="Enter Phone Number" /> */}
                                    </div>
                                    <div className='form-group col-md-6'>
                                      <label for='formGroupExampleInput'>
                                        {languageId === config.lang
                                          ? staticLanguage.common.phone_number
                                          : 'Additional Instructions'}
                                      </label>
                                      <input
                                        type='text'
                                        className='form-control'
                                        value={
                                          this.state.addInstruction
                                            ? this.state.addInstruction
                                            : ''
                                        }
                                        onChange={e =>
                                          this.additionalInstChange(e)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {this.state.ActivityData.ask_for_child_details ==
                              true &&
                              qty.length > 0 && (
                                <div className='personal_info'>
                                <div className='per_info_inner'>
                                  <div className='widget_heading widget_head_blue'>
                                    <h3>
                                    {languageId === config.lang
                                      ? staticLanguage.reservation.personal
                                      : 'Children Personal Information'}
                                    </h3>
                                  </div>                                  
                                  {this.addChildren()}
                                </div>
                                </div>
                              )}
                            <Modal
                              open={this.state.openChildInfo}
                              onClose={() => this.onCloseModalChildInfo()}
                              center
                            >
                              <div className='reveiw_form_section add_children_model'>
                                <h3>{this.state.ActivityData.name}</h3>
                                <div className='children_add_field'>
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.form.firstname
                                      : 'First Name'}
                                  </label>
                                  <input
                                    type='text'
                                    name='firstname'
                                    value={
                                      this.state.childFirstName
                                        ? this.state.childFirstName
                                        : ''
                                    }
                                    placeholder={
                                      languageId === config.lang
                                        ? staticLanguage.form.firstname
                                        : 'First Name'
                                    }
                                    onChange={e => this.firstNameChange(e)}
                                  />
                                  <span className='error_message2'></span>
                                </div>
                                <div className='children_add_field'>
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.form.lastname
                                      : 'Last Name'}
                                  </label>
                                  <input
                                    type='text'
                                    name='lastname'
                                    value={
                                      this.state.childLastName
                                        ? this.state.childLastName
                                        : ''
                                    }
                                    placeholder={
                                      languageId === config.lang
                                        ? staticLanguage.form.lastname
                                        : 'Last Name'
                                    }
                                    onChange={e => this.lastNameChange(e)}
                                  />
                                </div>
                                <div className='children_add_field'>
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.form.dob
                                      : 'Date Of Birth'}
                                  </label>
                                  <DatePicker
                                    onChange={date => this.dobChange(date)}
                                    selected={
                                      this.state.childDOB
                                        ? this.state.childDOB
                                        : ''
                                    }
                                    dateFormat='yyyy-MM-d'
                                    placeholderText={
                                      languageId === config.lang
                                        ? staticLanguage.form.dob
                                        : 'Date Of Birth'
                                    }
                                    maxDate={moment().toDate()}
                                  />
                                </div>
                                <div className='children_add_field'>
                                  <label>
                                    {languageId === config.lang
                                      ? staticLanguage.form.gender.title
                                      : 'Gender'}
                                  </label>
                                  <select
                                    id='mySelect'
                                    value={this.state.childGender}
                                    onChange={e => this.genderChange(e)}
                                  >
                                    <option value=''>{languageId === config.lang
                                      ? staticLanguage.form.gender.title
                                      : 'Select gender'}</option>
                                    <option value='female'> {languageId === config.lang
                                      ? staticLanguage.form.gender.f
                                      : 'Female'}</option>
                                    <option value='male'> {languageId === config.lang
                                      ? staticLanguage.form.gender.m
                                      : 'Male'}</option>
                                  </select>
                                </div>

                                <div className='children_add_field'>
                                  <button
                                    type='button'
                                    onClick={() => this.UpdateChildInfo()}
                                  >
                                    {languageId === config.lang
                                      ? staticLanguage.shared.save
                                      : 'Save'}
                                  </button>
                                  <span className='error_message2'>
                                    {this.state.childErrorMessage}
                                  </span>
                                </div>
                              </div>
                            </Modal>
                         
                          <div className='booking_btm_sec'>
                            <div className='promo_code'>
                              <label>
                                {languageId === config.lang
                                  ? staticLanguage.promo.title
                                  : 'Promo Code'}
                              </label>
                              <div className='promo_main'>
                                <div className='promo_input'>
                                  <input
                                    type='text'
                                    value={
                                      this.state.promocodeText
                                        ? this.state.promocodeText
                                        : ''
                                    }
                                    onChange={e => this.promoCodeText(e)}
                                    placeholder={
                                      languageId === config.lang
                                        ? staticLanguage.common.type_here
                                        : 'Type Here...'
                                    }
                                  />
                                </div>
                                <div className='promo_btn'>
                                  <button
                                    type='button'
                                    onClick={e => this.promoCode()}
                                  >
                                    {this.state.promoCodeLoading && (
                                      <span>
                                        {languageId === config.lang
                                          ? staticLanguage.common.loading
                                          : 'Loading...'}
                                      </span>
                                    )}
                                    {!this.state.promoCodeLoading && (
                                      <span>
                                        {languageId === config.lang
                                          ? staticLanguage.payment.apply
                                          : 'Apply'}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className='promo_message'>
                                <span className='thankyouMessage'>
                                  {this.state.promoAmtMessage}
                                </span>
                                <span className='thankyouMessage'>
                                  {this.state.promoSuccessMessage}
                                </span>
                                <span className='error_message2'>
                                  {this.state.errorMessagePromocode}
                                </span>
                              </div>
                            </div>
                            {this.state.ActivityData.reserve_out_id != null && (
                              <div className='promo_code'>
                                <label>
                                  {languageId === config.lang
                                    ? staticLanguage.promo.title
                                    : 'Comments(high chair required, dietary requirements)'}
                                </label>
                                <div className='promo_main'>
                                  <div className='promo_textarea'>
                                    <textarea
                                      id='comment'
                                      name='comment'
                                      placeholder={
                                        languageId === config.lang
                                          ? staticLanguage.common.type_here
                                          : 'Comment'
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            {this.state.ActivityData.tour_items ? (
                              <>
                                <div className='terms_condition'>
                                  {totalqty > 0 ? (
                                    <div className='custom-control custom-checkbox'>
                                      <input
                                        value={
                                          this.state.walletPay == 'on'
                                            ? true
                                            : false
                                        }
                                        type='checkbox'
                                        className='custom-control-input'
                                        onChange={e =>
                                          this.onChangeWalletPay(e)
                                        }
                                      />
                                      <label
                                        className='custom-control-label'
                                        for='defaultChecked'
                                      >
                                        {languageId === config.lang
                                          ? staticLanguage.common.pay_with
                                          : 'Pay with Wallet Credit'}
                                      </label>
                                      <span className='wallet_bal'>
                                        {this.state.walletBalance} {currency}
                                      </span>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                  <div className='custom-control custom-checkbox'>
                                    <input
                                      type='checkbox'
                                      className='custom-control-input'
                                      onChange={e => this.onChangeAccept(e)}
                                    />
                                    <label
                                      className='custom-control-label'
                                      for='defaultChecked'
                                    >
                                      {languageId === config.lang
                                        ? staticLanguage.common.accept
                                        : 'Accept'}{' '}
                                      <a
                                        href='/terms-and-conditions'
                                        target='_blank'
                                      >
                                        {languageId === config.lang
                                          ? staticLanguage.common
                                              .terms_condition
                                          : 'Terms & Conditions'}
                                      </a>{' '}
                                      {languageId === config.lang
                                        ? staticLanguage.common.to_process
                                        : ' to continue process.'}
                                    </label>
                                  </div>
                                </div>
                                {this.state.ActivityData.tour_items &&
                                  this.state.ActivityData.tour_items
                                    .slice(0, 1)
                                    .map(
                                      (tour, i) =>
                                        tour.rayna_id != null && (
                                          <div className='over_total'>
                                            <span className='o_total'>
                                              {languageId === config.lang
                                                ? staticLanguage.payment.total
                                                : 'Prices'}
                                            </span>
                                            <span className='adult_o_price'>
                                              {totalAdultQty
                                                ? totalAdultQty +
                                                  ' Adults: ' +
                                                  totalAdultAmt +
                                                  ' ' +
                                                  currency
                                                : ''}
                                            </span>
                                            <span className='child_o_price'>
                                              {totalChildQty
                                                ? totalChildQty +
                                                  ' Children: ' +
                                                  totalChildAmt +
                                                  ' ' +
                                                  currency
                                                : ''}
                                            </span>
                                          </div>
                                        )
                                    )}
                                <div className='over_total'>
                                  <span className='o_total'>
                                    {languageId === config.lang
                                      ? staticLanguage.payment.total
                                      : 'Total'}
                                  </span>
                                  <span className='o_price'>
                                    {currency} {totalAmount} {}
                                  </span>
                                </div>
                              </>
                            ) : (
                              ''
                            )}
                            <span className='error_message2'>
                              {this.state.errorMessage}
                            </span>
                            {/* {qty.length > 0 && qty && ( */}
                            <button
                              type='submit'
                              className='buy_btn'
                              onClick={() => this.buyNow()}
                            >
                              {languageId === config.lang
                                ? staticLanguage.common.buy_now
                                : 'Buy Now'}
                            </button>
                            {/* )} */}
                            <div className='login_links'>
                              {(token === null || token === undefined) && (
                                <div>
                                  <a
                                    href
                                    onClick={() => this.showModal('login')}
                                  >
                                    {languageId === config.lang
                                      ? staticLanguage.login.login
                                      : 'Log In'}
                                  </a>
                                  /{' '}
                                  {languageId === config.lang
                                    ? staticLanguage.register.register
                                    : 'Not Registered?'}{' '}
                                  <a
                                    href
                                    onClick={() => this.showModal('register')}
                                  >
                                    {languageId === config.lang
                                      ? staticLanguage.common.join
                                      : 'Sign Up!'}
                                  </a>
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
            </div>
          </main>
        ) : (
          ''
        )}
      </>
    )
  }
}
export default Booking
