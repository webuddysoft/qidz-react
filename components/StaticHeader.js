import React, { Component } from "react";
import LoginMobileSection from "./LoginMobileSection";
import logoPng from '../assets/images/qidz-logo.png';
import logoPng150 from '../assets/images/qidz-logo-150x150.png';
import logoPng300 from '../assets/images/qidz-logo-300x124.png';
import logoPng750 from '../assets/images/qidz-logo-750x328.png';
import logoPng768 from '../assets/images/qidz-logo-768x318.png';
class StaticHeader extends Component
{
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div className="header-menu-area">
            <nav className="navbar mainmenu-area static" data-spy="affix" data-offset-top="100">
                <div className="container">
                    <div className="equal-height">
                        <div className="site-branding">
                        <a href="http://lc.qidzproject.com/en/" className="custom-logo-link" rel="home" aria-current="page">
                            <img width='792' height='328' src={logoPng} className="custom-logo" alt="QiDZ" srcSet={`${logoPng} 792w, ${logoPng300} 300w, ${logoPng768} 768w`} sizes="(max-width: 792px) 100vw, 792px" />
                          </a>                    					
					
                        </div>
                    
                        <div className="primary-menu"><ul id="menu-primary-menu" className="nav"><li id="menu-item-1674" className="blog_ic menu-item menu-item-type-post_type menu-item-object-page menu-item-1674"><a href="/blog/">Our Blog</a></li>
                  <li id="menu-item-4342" className="cont_ic menu-item menu-item-type-custom menu-item-object-custom current-menu-item menu-item-4342"><a>Alerts</a></li>
                  <li id="menu-item-4080" className="mobile_menu menu-item menu-item-type-custom menu-item-object-custom menu-item-4080"><a href="#">Login</a></li>
                  <li id="menu-item-4081" className="mobile_menu menu-item menu-item-type-custom menu-item-object-custom menu-item-4081"><a href="#">Register</a></li>
                  <li id="menu-item-4082" className="mobile_menu menu-item menu-item-type-custom menu-item-object-custom menu-item-4082"><a href="#">Partner With Us</a></li>
                  </ul></div>             
                    <div id="show" style={{display: "none"}}>
                            <div id="title"></div>
                            <div id="description"></div>
                            <div id="button"></div>
                        </div>
                        <div className="menu-side">
                                                <div className="header-search">
                                <button type="button" className="search-popup-button"><i className="icofont-search"></i></button>
                                <div className="popup-search-form">
                                    <div className="v-center">
                                        <form role="search" method="get" className="searchform" action="/"><div className="search-box">
                                          <input type="search" name="s" className="search" placeholder="Type Keywords" defaultValue="" /><button type="submit" className="search-bttn"><i className="icofont-search"></i></button></div></form>                                <div className="info">
                                            Press Enter to begin your search.                                </div>
                                        <button type="button" className="close-form"><i className="icofont-close"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="login-root">
                        <LoginMobileSection staticLanguage={this.props.staticLanguage}/>
                    </div>
                </div>
            </nav>
          </div>
        )
    }
}

export default StaticHeader;