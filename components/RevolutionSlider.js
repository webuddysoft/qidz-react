import React, { Component } from 'react';
import * as $ from 'jquery';
import sliderBg1 from "../assets/images/slide/home-page-slider.jpg";
import sliderBg2 from "../assets/images/slide/slide-6-2.jpg";
import sliderBg3 from "../assets/images/slide/slide-3.jpg";

class RevolutionSlider extends Component {
  componentDidMount() {
    if (window.setREVStartSize!==undefined) window.setREVStartSize(
      {c: '#rev_slider_3_1', responsiveLevels: [1240,1024,778,480], gridwidth: [1240,1024,778,320], gridheight: [620,650,650,600], sliderLayout: 'auto', minHeight:'600px'});

      var revapi3,
      tpj;	
      (function() {			
      if (!/loaded|interactive|complete/.test(document.readyState)) document.addEventListener("DOMContentLoaded",onLoad); else onLoad();	
      function onLoad() {				
      if (tpj===undefined) { tpj = window.jQuery; if("off" == "on") tpj.noConflict();}
      if(tpj("#rev_slider_3_1").revolution == undefined){
      console.log('revslider_showDoubleJqueryError("#rev_slider_3_1")');
      }else{
      revapi3 = tpj("#rev_slider_3_1").show().revolution({
      sliderType:"standard",
      jsFileLocation:"//lc.qidzproject.com/wp-content/plugins/revslider/public/assets/js/",
      sliderLayout:"auto",
      dottedOverlay:"none",
      delay:9000,
      navigation: {
        keyboardNavigation:"off",
        keyboard_direction: "horizontal",
        mouseScrollNavigation:"off",
              mouseScrollReverse:"default",
        onHoverStop:"off",
        bullets: {
          enable:true,
          hide_onmobile:false,
          style:"ares",
          hide_onleave:false,
          direction:"vertical",
          h_align:"left",
          v_align:"center",
          h_offset:60,
          v_offset:20,
          space:5,
          tmp:'<span class="tp-bullet-title">{{title}}</span>'
        }
      },
      responsiveLevels:[1240,1024,778,480],
      visibilityLevels:[1240,1024,778,480],
      gridwidth:[1240,1024,778,320],
      gridheight:[620,650,650,600],
      lazyType:"none",
      minHeight:"600px",
      shadow:0,
      spinner:"spinner0",
      stopLoop:"off",
      stopAfterLoops:-1,
      stopAtSlide:-1,
      shuffle:"off",
      autoHeight:"off",
      disableProgressBar:"on",
      hideThumbsOnMobile:"off",
      hideSliderAtLimit:0,
      hideCaptionAtLimit:0,
      hideAllCaptionAtLilmit:0,
      debugMode:false,
      fallbacks: {
        simplifyAll:"off",
        nextSlideOnWindowFocus:"off",
        disableFocusListener:false,
      }
      });
      }; /* END OF revapi call */

      }; /* END OF ON LOAD FUNCTION */
      }()); /* END OF WRAPPING FUNCTION */
  }
  render() {
      return (
          <div id="rev_slider_3_1_wrapper" className="rev_slider_wrapper fullwidthbanner-container" data-source="gallery" style={{margin:"0px auto", background:"transparent",padding:"0px", marginTop:"0px", marginBottom: "0px"}}>
              <div id="rev_slider_3_1" className="rev_slider fullwidthabanner" style={{display:"none"}} data-version="5.4.8">
                  <ul>	
                      <li data-index="rs-11" data-transition="slideleft" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off"  data-easein="default" data-easeout="default" data-masterspeed="default"   data-rotate="0"  data-saveperformance="off"  data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description="">
                          <img src={sliderBg1}  alt="" title="home page slider"  width="1920" height="869" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" className="rev-slidebg" data-no-retina />
                      </li>
                      <li data-index="rs-21" data-transition="slideleft" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off"  data-easein="default" data-easeout="default" data-masterspeed="default"  data-rotate="0"  data-saveperformance="off"  data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description="">
                          <img src={sliderBg2}  alt="" title="slide-6"  width="1920" height="869" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" className="rev-slidebg" data-no-retina />
                      </li>
                      <li data-index="rs-20" data-transition="slideleft" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off"  data-easein="default" data-easeout="default" data-masterspeed="default"  data-thumb=""  data-rotate="0"  data-saveperformance="off"  data-title="Slide" data-param1="" data-param2="" data-param3="" data-param4="" data-param5="" data-param6="" data-param7="" data-param8="" data-param9="" data-param10="" data-description="">
                          <img src={sliderBg3}  alt=""  width="1920" height="1080" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" className="rev-slidebg" data-no-retina />
                      </li>
                  </ul>
                  <div className="tp-bannertimer tp-bottom" style={{visibility: "hidden !important"}}></div>	
              </div>
          </div>
      )
  };
}

export default RevolutionSlider;