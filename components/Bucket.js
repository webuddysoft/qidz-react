import React, { Component } from 'react'
import Carousel from 'react-multi-carousel'
import config from '../config'
import 'react-multi-carousel/lib/styles.css'
// import ReactStars from "react-rating-stars-component";
import StarRatings from 'react-star-ratings'
let ads = []
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3
  },
  mobilemedium: {
    breakpoint: { max: 768, min: 600 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1
  }
}

class Bucket extends Component {
  constructor (props) {
    super(props)
    this.state = {
      Buckets: props.bucketData.buckets,
      adBanners: props.bucketData.ad_banners,
      AdBanner: [],
      staticLanguage: this.props.staticLanguage
    }
  }
  componentDidMount () {
    this.addBanners()
  }
  addBanners () {
    const { Buckets, adBanners } = this.state
    return Buckets.map((b, i) => {
      let data = []
      adBanners.map((ad, j) => {
        if (ad.bucket === i + 1) {
          const adUrl = ad.url.split('/')
          data.push({
            bucket: ad.bucket,
            title: ad.title,
            image: ad.image,
            urlId: adUrl[4]
          })
        }
      })
      ads.push({ data, id: b.id, name: b.name, activities: b.activities })
      this.setState({ AdBanner: ads })
    })
  }

  booking (activityId) {
    const url = window.location.pathname
    var parts = url.split('/')
    var last_part = parts[parts.length - 2]
    window.open('/' + last_part + '/booking?activityId=' + activityId, '_self')
  }
  ticketUrl (ticket_url) {
    window.open(ticket_url, '_blank')
  }
  eventDetails (activityId) {
    const url = window.location.pathname
    var parts = url.split('/')
    var last_part = parts[parts.length - 2]
    window.location.href = last_part + '/event-details?activityId=' + activityId
    // window.open("event-details?activityId=" + activityId, '_self');
  }

  eventList (adId) {
    window.open('/event-list?bannerId=' + adId)
    // if (name === 'bucket') {
    //     window.open("event-list?bucketId=" + bucketId + '&adId=' + adId, '_self');
    // }
    // if (name === 'banner') {
    //     window.open("event-list?bannerId=" + bucketId, '_self');
    // }
  }

  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    // const { AdBanner } = this.state;
    const { bucketData } = this.props
    console.log(bucketData, 'test')
    const currency = localStorage.getItem('currency')
      ? localStorage.getItem('currency')
      : 'AED'
    let ads = []
    bucketData.buckets.map((b, i) => {
      let data = []
      bucketData.ad_banners.map((ad, j) => {
        if (ad.bucket === i + 1) {
          const adUrl = ad.url.split('/')
          data.push({
            bucket: ad.bucket,
            title: ad.title,
            image: ad.image,
            urlId: adUrl[4],
            activity: adUrl[3]
          })
        }
      })
      ads.push({ data, id: b.id, name: b.name, activities: b.activities })
      //this.setState({ AdBanner: ads });
    })

    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='second_events_section'>
            <div className='second_event_section_inner'>
              <div className='sec_event_carousel'>
                {ads &&
                  ads.map((bucketData, i) => (
                      <div className="bucket_carousel" key={i}>
                        <div key={i} className='events_main_heading'>
                          <h1>{bucketData.name}</h1>
                          {/* <a href="javascript:void(0)" onClick={(e) => this.eventList(e,bucketData.id,bucketData.data[0].bucket,'bucket')}>See All</a> */}
                          <a href={`event-list?bucketId=${bucketData.id}`}>
                            {languageId === config.lang
                              ? staticLanguage.common.seeall
                              : 'See All'}
                          </a>
                        </div>
                        <Carousel
                          responsive={responsive}
                          infinite={true}
                          autoPlay={true}
                          autoPlaySpeed={5000}
                        >
                          {bucketData.data.map((ad, k) => (
                            <div
                              key={k + 1}
                              className='event_box null_description'
                            >
                              <div className='events_des_image'>
                                <a
                                  href={
                                    ad.activity === 'activities'
                                      ? `event-details?activityId=${ad.urlId}`
                                      : `event-list?bannerId=${ad.urlId}`
                                  }
                                >
                                  <img
                                    src={ad.image.replace('q_30', 'q_80')}
                                    alt='EditorPickWeekly'
                                  />
                                </a>
                                {/* <div className="event_code">{ad.title}</div> */}
                              </div>
                              <div className='ad_banner_read_more'>
                                {ad.activity === 'activities' ? (
                                  <button
                                    type='button'
                                    onClick={() => this.eventDetails(ad.urlId)}
                                    className='btn rm_btn'
                                  >
                                    {languageId === config.lang
                                      ? staticLanguage.common.readmore
                                      : 'Reed More'}
                                  </button>
                                ) : (
                                  <button
                                    type='button'
                                    onClick={() => this.eventList(ad.urlId)}
                                    className='btn rm_btn'
                                  >
                                    {languageId === config.lang
                                      ? staticLanguage.common.seemore
                                      : 'See More'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {bucketData.activities.map((activity, j) => (
                            <div key={j + 1} className='event_box'>
                              <div className='events_des_image'>
                                <a
                                  href={`event-details?activityId=${activity.id}`}
                                >
                                  <img
                                    src={activity.attachment_large.replace(
                                      'q_30',
                                      'q_80'
                                    )}
                                    alt='EditorPickWeekly'
                                  />
                                </a>
                              </div>
                              <div className='event_description'>
                                <a
                                  href={`event-details?activityId=${activity.id}`}
                                >
                                  <h3>{activity.name}</h3>
                                </a>
                                <div className='event_btm_des'>
                                  <div className='event_list_cat_section'>
                                    <span className='small_text'>
                                      {activity.location_name}
                                    </span>
                                    <div className='review'>
                                      {activity.average_rating &&
                                      activity.average_rating != undefined ? (
                                        <StarRatings
                                          rating={parseInt(
                                            activity.average_rating
                                          )}
                                          starRatedColor='#ffd700'
                                          numberOfStars={5}
                                          name='rating'
                                          starDimension='15px'
                                          starSpacing='5px'
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                  <div className='event_list_price'>
                                    <div className='search_price'>
                                      {activity.original_price && (
                                        <span className='dis_price'>
                                          {currency}{' '}
                                          {activity.original_price.replace(
                                            /\.?0+$/,
                                            ''
                                          )}
                                        </span>
                                      )}
                                      {activity.price && (
                                        <span className='main_price'>
                                          {currency}{' '}
                                          {activity.price.replace(/\.?0+$/, '')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className='event_list_btn home_btn'>
                                    {activity.ticket_url != null ? (
                                      <button
                                        type='button'
                                        onClick={() =>
                                          this.ticketUrl(activity.ticket_url)
                                        }
                                        className='btn bn_btn'
                                      >
                                        {activity.book_now_button}!
                                      </button>
                                    ) : activity.original_price ||
                                      activity.price ? (
                                      <button
                                        type='button'
                                        onClick={() =>
                                          this.booking(activity.id)
                                        }
                                        className='btn bn_btn'
                                      >
                                        {activity.book_now_button}!
                                      </button>
                                    ) : (
                                      ''
                                    )}
                                    <button
                                      type='button'
                                      onClick={() =>
                                        this.eventDetails(activity.id)
                                      }
                                      className='btn rm_btn'
                                    >
                                      {languageId === config.lang
                                        ? staticLanguage.common.readmore
                                        : 'Read More'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Carousel>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Bucket
