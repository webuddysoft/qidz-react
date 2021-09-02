import { Component } from "react";
import appleBtn from "../assets/images/apple_btn.png";
import androidBtn from "../assets/images/android_btn.png";
import logo1 from "../assets/images/As-Featured-in.png";
import logo2 from "../assets/images/dubaieye-kidsactivities-dubai_dark.png";
import logo3 from "../assets/images/abouther-kidsactivities-dubai_dark.png";
import logo4 from "../assets/images/gulftoday-kidsactivities-dubai_dark.png";
import logo5 from "../assets/images/motherbabychild-kidsactivities-dubai_dark.png";
import logo6 from "../assets/images/thenational-kidsactivities-dubai_dark.png";

class FamilySectionMain extends Component {
  componentDidMount()
  {
    window.jQuery('body').find('.wpcp-carousel-section.wpcp-preloader').each(function () {
      var carousel_id         = window.jQuery(this).attr('id'),
            parents_class       = window.jQuery('#' + carousel_id).parent('.wpcp-carousel-wrapper'),
            parents_siblings_id = parents_class.find('.wpcp-carousel-preloader').attr('id');
      // window.jQuery(window).load(function () {
        window.jQuery('#' + parents_siblings_id).animate({ opacity: 0 }, 600).remove();
        window.jQuery('#' + carousel_id).animate({ opacity: 1 }, 600)
      // })
    });

    window.jQuery('body').find('.wpcp-carousel-section.wpcp-standard').each(function () {
      var carousel_id = window.jQuery(this).attr('id');
      if (window.jQuery().slick) {
          window.jQuery('#' + carousel_id).slick({
              prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left"></i></div>',
              nextArrow: '<div class="slick-next"><i class="fa fa-angle-right"></i></div>',
              lazyLoad: 'ondemand',
          });
      }
    });
  }
    render() {
       return ( 
         <>
    <section id="family_section_main">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="family_carousel_main">
              <div className="wpcp-carousel-wrapper wpcp-wrapper-4152">
                <div id="wpcp-preloader-4152" className="wpcp-carousel-preloader">
                    <img src="/images/ajax-loader.gif "/>
                  </div>
                  <div id="sp-wp-carousel-free-id-4152" className="wpcp-carousel-section sp-wpcp-4152 nav-vertical-center wpcp-image-carousel wpcp-preloader wpcp-standard" data-slick='{ "accessibility":true, "arrows":false, "autoplay":true, "autoplaySpeed":3000, "dots":false, "infinite":true, "speed":600, "pauseOnHover":true, "slidesToShow":1, "responsive":[ { "breakpoint":1200, "settings": { "slidesToShow":1 } }, { "breakpoint":980, "settings":{ "slidesToShow":1 } }, { "breakpoint":736, "settings": { "slidesToShow":1 } }, {"breakpoint":480, "settings":{ "slidesToShow":1, "arrows": false, "dots": false } } ], "swipe": true, "draggable": true, "swipeToSlide":false }'  dir="ltr">
                    <div className="wpcp-single-item">
                      <div className="wpcp-slide-image">
                        <img src="/images/kids-activities-in-dubai_qidz-2.png" alt="kids-activities-in-dubai_qidz" width='320' height='612' />
                      </div>
                    </div>
                    <div className="wpcp-single-item">
                      <div className="wpcp-slide-image">
                        <img src="/images/kids-activities-in-dubai_qidz_search-3.png" alt="kids-activities-in-dubai_qidz_search" width='320' height='612' />
                      </div>
                    </div>
                    <div className="wpcp-single-item">
                      <div className="wpcp-slide-image">
                        <img src="/images/kidzania-dubai-offers_things-to-do-in-dubai-with-kids_qidz-3.png" alt="kidzania-dubai-offers_things-to-do-in-dubai-with-kids_qidz" width='320' height='612' />
                      </div>
                    </div>
                    <div className="wpcp-single-item">
                      <div className="wpcp-slide-image">
                        <img src="/images/qidz-reviews_kids-activities-in-dubai_qidz-3.png" alt="qidz-reviews_kids-activities-in-dubai_qidz" width='320' height='612' />
                      </div>
                    </div>
                    <div className="wpcp-single-item">
                      <div className="wpcp-slide-image">
                        <img src="/images/create-family-memories.png" alt="create-family-memories" width='320' height='612' />
                      </div>
                    </div>
                  </div>
                </div>            
              </div>
            </div>
            <section id="text-6" className="widget widget_text">			
              <div className="textwidget">
                <div className="col-md-6">
                  <div className="family_content">
                    <div className="family_sub_text">Find, plan &#038; book the best activities in town.</div>
                    <div className="family_cont_point">
                      <h3>1. Download QiDZ &amp; Register</h3>
                      <p>It’s easy! Download QiDZ and quickly register to access the best deals, ideas and inspiration on kid’s activities, family activities and things to do in your city.</p>
                      <h3>2. Be In The Know</h3>
                      <p>QiDZ is updated daily with the latest DIY activities, games, online resources and more for kids! You&#8217;ll also find family entertainment and outings. Get the the best deals, ideas and inspiration all in one place.</p>
                      <h3>3. Create Memories</h3>
                      <p>Give your family brilliant memories that they will cherish. Whether you&#8217;re looking for ideas for days at home or inspiration for days out, there’s something for everyone. Download QiDZ now.</p>
                      <div className="play_store_buttons d-flex"><a href="https://apps.apple.com/gb/app/qidz-uae-family-activities/id1265147563?utm_source=qidz_website&amp;utm_medium=download_button&amp;utm_campaign=qidz">
                        <img src={appleBtn} />
                      </a><br />
                      <a href="https://play.google.com/store/apps/details?id=com.qidz&amp;referrer=utm_source%3Dqidz_website%26utm_medium%3Ddownload_button%26utm_campaign%3Dqidz">
                        <img src={androidBtn} /></a></div>
                    </div>
                  </div>
                </div>
              </div>
                </section> 
          </div>
        </div>
      </section>
      <section id="logo_section">
        <div className="container">
      <div className="logo-section">
        <div className="row">
          <div className="col-md-2 first_logo">
            <img src={logo1} />
          </div>
          <div className="col-md-2">
            <img src={logo2} />
          </div>
          <div className="col-md-2">
            <img src={logo3} />
          </div>
          <div className="col-md-2">
            <img src={logo4} />
          </div>
          <div className="col-md-2">
            <img src={logo5} />
          </div>
          <div className="col-md-2">
            <img src={logo6} />
          </div>
        </div>
      </div>
      </div>
      </section>
      </>
       );
    }
}

export default FamilySectionMain;