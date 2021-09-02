import React, { Component } from 'react'
import config from '../config'
import axios from 'axios'
import Carousel from 'react-multi-carousel'
import ReactStars from 'react-rating-stars-component'
import ReactHtmlParser from 'react-html-parser'
import GoogleMapReact from 'google-map-react'
import AddToCalendar from 'react-add-to-calendar'
import moment from 'moment/moment'
import ModalService from './services/modal.service'
import LoginModal from './LoginModal'
// import ApiCalendar from 'react-google-calendar-api';
import { InlineShareButtons } from 'sharethis-reactjs'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import Loader from 'react-loader'
import ShowMoreText from 'react-show-more-text'
import LoginSection from './LoginSection'
import DownloadSection from './DownloadSection'
import StarRatings from 'react-star-ratings'
import PhoneInput from 'react-phone-input-2'

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon
} from 'react-share'

const AnyReactComponent = ({ img_src, onChildClick }) => (
  <div onClick={onChildClick}>
    <img src={img_src} className='YOUR-CLASS-NAME' style={{}} />
  </div>
)

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

class EventDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cityId: localStorage.getItem('cityId'),
      language: localStorage.getItem('lang')
        ? JSON.parse(localStorage.getItem('lang'))
        : '',

      city: localStorage.getItem('city'),
      languageId: localStorage.getItem('languageId'),
      staticLanguage: this.props.staticLanguage,
      ActivityData: [],
      isErrorForm1:false,
      isErrorForm2:false,
      isFetching: true,
      percentageArr: [],
      reviewImage: '',
      reviewPostImage: '',
      maxValue: 0,
      ageGroup: '',
      commentReview: '',
      commentForm1: '',
      starRatingForm1: 0,
      commentForm2: '',
      starRatingForm2: 0,
      commentForm3: '',
      starRatingForm3: 0,
      selectedFile: null,
      Open: false,
      OpenReview: false,
      OpenReview1: false,
      OpenSharePopUp: false,
      displayName: 'Example',
      event: {},
      mob_number: localStorage.getItem('phone')
        ? localStorage.getItem('phone')
        : 0,
      activityAge: 0,
      editActivity: '',
      modalImage: '',
      favErrorMessage:'',
      reviewsCommentError: '',
      reviewsRatingError: '',
      reviewsRatingError1: '',
      reviewsCommentError2: '',
      reviewsRatingError2: '',
      modifyActivityError: '',
      thankyouMessage1: '',
      thankyouMessage2: '',
      isVisibleActivity: 2,
      errorMessage: '',
      viewScheduleModal: false,
      favText: '',
      loaded: false,
      events: [],
      readDeals: false,
      isReviewloading: false,
      isPostReviewloading: false,
      items: [{ google: 'Google' }],
      defaultProps: {
        center: {
          lat: 59.95,
          lng: 30.33
        },
        zoom: 11
      }
    }

    this.ratingChangedForm1 = this.ratingChangedForm1.bind(this)
    this.ratingChangedForm2 = this.ratingChangedForm2.bind(this)
    this.modifyActivityForm = this.modifyActivityForm.bind(this)
  }

  onOpenModifyModal () {
    this.setState({
      Open: true,
      thankyouMessage: ''
    })
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
      console.log(base64data, 'event.target.files[0]')
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
        console.log(base64data, 'event.target.files[0]')
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
        console.log(base64data, 'event.target.files[0]')
        this.setState({
          reviewPostImage: base64data
        })
      }
    }
  }

  otherEventDetails (activityId) {
    window.open('event-details?activityId=' + activityId, '_self')
  }

  ratingChangedForm1 (newRating) {
    this.setState({ starRatingForm1: newRating, reviewsRatingError1: '' })
  }

  ratingChangedForm2 (newRating) {
    this.setState({ starRatingForm2: newRating, reviewsRatingError2: '' })
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
             // window.location.reload(false);
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

  addToFav (addFav) {
    const {staticLanguage}=this.state;
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
      console.log(body, 'add to fav', favorite)

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
            // + "?latitude=37.33233141&longitude=-122.0312186&ad_banners=true&tenant_id=1&locale='en'&level0=true", {
            data: body,
            headers: {
              accept: 'application/json'
            }
          }
        )
        .then(response => {
          console.log(response, 'fav')
          if (response.data.error != undefined) {
            this.setState({favErrorMessage:(languageId==config.lang?staticLanguage.common.fav_error:"There is something wrong at admin")});
          }else{
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
          }          
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      this.showModal('login')
    }
  }

  componentDidMount () {
    this.eventDetails()
    this.cities()
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
        console.log(response.data,'aaaaaaaaaaaa');
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
  homeClick () {
    window.open('/', '_self')
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
                : this.state.ActivityData.description}
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
    //alert(this.state.maxValue);
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
                  : 'BUY NOW GET'}
                {this.state.maxValue}%{' '}
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
  openViewSchedule () {
    this.setState({
      viewScheduleModal: true
    })
  }
  onCloseModalSchedule () {
    this.setState({ viewScheduleModal: false })
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
                          languageId ===
                        config.lang
                      ? staticLanguage.shared.amount.to
                      : ' to ' + ActivityData.available_days[0].end_time
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
                    {ActivityData.available_days && ActivityData.available_days.map((vs, i) => (
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
    console.log(map, 'map')
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
  markerClicked (marker) {
    console.log('clicked...')
    console.log('The marker that was clicked is', marker)
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
                {/* <ReactStars
                                    count={5}
                                    value={this.state.ActivityData.reviews ? this.state.ActivityData.reviews[0].stars : ''}
                                    size={20}
                                    isHalf={true}
                                    activeColor="#ffd700"
                                /> */}
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
        ) : languageId === config.lang ? (
          staticLanguage.common.no_review
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
  shareExperience () {
    const { staticLanguage } = this.state
    const languageId = localStorage.getItem('languageId')

    return (
      <div className='share_widget'>
        <div className='widget_heading widget_head_red'>
          <h3>
            {languageId === config.lang
              ? staticLanguage.common.share_exp
              : 'Share the Experience'}
          </h3>
        </div>
        <div className='media_share'>
          <ul>
            <li className='share_ic fb_share'>
              <a href='#'>
                <FacebookShareButton url={window.location.href}>
                  <FacebookIcon size={36} />
                </FacebookShareButton>
              </a>
            </li>
            <li className='share_ic wt_share'>
              <a href='#'>
                <WhatsappShareButton url={window.location.href}>
                  <WhatsappIcon size={36} />
                </WhatsappShareButton>
              </a>
            </li>
            <li className='share_ic tw_share'>
              <a href='#'>
                <TwitterShareButton url={window.location.href}>
                  <TwitterIcon size={36} />
                </TwitterShareButton>
              </a>
            </li>
            {/* <li className='share_ic tg_share'>
              <a href='#'>
                <TelegramShareButton url={window.location.href}>
                  <TelegramIcon size={36} />
                </TelegramShareButton>
              </a>
            </li> */}
            <li className='share_ic li_share'>
            <a href='#'>
                <LinkedinShareButton url={window.location.href}>
                  <LinkedinIcon size={36} />
                </LinkedinShareButton>
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
  relatedActivities () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div className='related_act_widget'>
        <div className='widget_heading widget_head_blue'>
          <h3>
            {languageId === config.lang
              ? staticLanguage.activity.related_activities
              : 'Related Activities'}
          </h3>
        </div>
        <div className='related_events_list'>
          {this.state.ActivityData.more_activities_with_same_category
            ? this.state.ActivityData.more_activities_with_same_category.map(
                (ra, i) => (
                  <a href={`event-details?activityId=` + ra.id}>
                    <div className='rel_events'>
                      <div className='sidebar_widget_img'>
                        <img
                          src={ra.attachment_large.replace('q_30', 'q_80')}
                        />
                      </div>
                      <div className='rel_details'>
                        <h4>{ra.name}</h4>
                        <a href={`event-details?activityId=` + ra.id}>
                          {ra.location_name}, {ra.area_name}
                        </a>
                      </div>
                    </div>
                  </a>
                )
              )
            : ''}
        </div>
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
        {/* <span className="error_message2">{this.state.favErrorMessage}</span> */}
      </div>
    )
  }
  addToCalender () {
    const { ActivityData, staticLanguage } = this.state
    const languageId = localStorage.getItem('cityId')
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
    return (
      <div className='share_ui'>
        <a href>
          <img
            src={`/wp-content/themes/wpreactqidz/assets/img/event-dt/g_calendar_ic.png`}
          />
          {/* <button>Add To Calender</button> */}
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
              onChange={mob_number => this.setState({ mob_number })}
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
              description:
                this.state.ActivityData.description &&
                this.state.ActivityData.description[0], // (defaults to og:description or twitter:description)
              title:
                this.state.ActivityData.name && this.state.ActivityData.name,
              message:
                this.state.ActivityData.description &&
                this.state.ActivityData.description[0], // (only for email sharing)
              subject:
                this.state.ActivityData.name && this.state.ActivityData.name
            }}
          />
        </Modal>
      </div>
    )
  }
  booking (activityId) {
    window.open('booking?activityId=' + activityId, '_self')
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
  changeLanguage (event) {
    localStorage.setItem('languageId', event.target.value)
    this.setState({ loaded: false, languageId: event.target.value })
    // this.eventDetails()
    const nextTitle = 'My new page title'
    const nextState = { additionalInformation: 'Updated the URL with JS' }

    if (event.target.value === config.lang) {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('en', 'ar')
      )
    } else {
      window.history.pushState(
        nextState,
        nextTitle,
        window.location.href.replace('ar', 'en')
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
    // this.eventDetails()
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
                      this.state.cityData.map(
                        (cities, i) => (
                          console.log(
                            cities.names.en,
                            'cccccccc',
                            cities.names.ar
                          ),
                          (
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
                          )
                        )
                      )}
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
  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
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
                  &nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
                </a>
                {this.state.ActivityData.name}
              </span>
            </div>
          </div>
        </section>
        <Loader options={config.options} loaded={this.state.loaded}></Loader>
        {!this.state.isFetching ? (
          <main>
            {/* ======= Filter Section start ======= */}
            <div id='page'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-8'>
                    <div className='events_details_main'>
                      <div className='events_details_inner'>
                        {this.eventSlider()}
                        <div className='events_content'>
                          {/* event first heading section start */}
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
                                      {this.state.ActivityData.ages[0] === 0
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
                                              {category}
                                            </div>
                                          )
                                        )
                                      : ''}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                              <div className='eve_booking_btn'>
                                {this.state.ActivityData.tour_items ? (
                                  <button
                                    type='button'
                                    onClick={() =>
                                      this.booking(this.state.ActivityData.id)
                                    }
                                  >
                                    {this.state.ActivityData.book_now_button}!
                                  </button>
                                ) : (
                                  ''
                                )}
                                {this.state.ActivityData.reserve_out_id !=
                                  null && (
                                  <button
                                    type='button'
                                    onClick={() =>
                                      this.booking(this.state.ActivityData.id)
                                    }
                                  >
                                    {this.state.ActivityData.book_now_button}!
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className='events_period'>
                              {languageId === config.lang
                                ? staticLanguage.common.limited_timeonly
                                : 'Limited time only!'}
                            </div>
                            {/* share part start */}
                            <div className='share_section text-center d-flex'>
                              {this.addToFavourite()}
                              {this.addToCalender()}
                              {this.addReview()}
                              {this.modifiyActivity()}
                              {this.shareActivity()}
                              {/* <button onClick={(e) => this.handleItemClick(e, 'sign-in')}>sign-in</button> */}
                            </div>
                            <span className='error_message2'>{this.state.favErrorMessage}</span>
                            {/* share part end */}
                            {/* terms and condition start */}
                            {this.readActivityDescription()}
                            {/* terms and condition start */}
                          </div>
                          {/* event first heading section End */}
                          {/* event Ad banner section start */}
                          {this.buyNowSection()}
                          {/* event Ad banner section End */}
                          {/* event Activity  section start */}

                          {this.state.ActivityData.tour_items
                            ? this.getEventActivity()
                            : ''}
                          {/* event Activity  section end */}
                          {/* event Activity Description section start */}
                          {this.activityDescription()}
                          {/* event Activity Description section End */}

                          {/* event reviews  section Start */}
                          <div className='event_review_widget'>
                            <div className='widget_second'>
                              <h3>
                                {languageId === config.lang
                                  ? staticLanguage.shared.review
                                  : 'Review'}
                              </h3>
                              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p> */}
                            </div>
                            {this.displayReviews()}
                            {this.postReviews()}
                          </div>
                          {/* Event Reviews Section End */}
                          {this.getWhen()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='events_rt_sidebar'>
                      <div className='events_rt_inner'>
                        {/* share widget start */}
                        {this.shareExperience()}
                        {/* share widget End */}
                        {/* Related Activity widget start */}
                        {this.relatedActivities()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ======= Filter Section End ======= */}
            {/* ======= Ad Carousel Section start ======= */}
          </main>
        ) : (
          ''
        )}
      </>
    )
  }
}

export default EventDetails
