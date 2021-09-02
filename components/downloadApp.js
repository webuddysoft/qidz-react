
import React, { Component } from "react";

class downloadApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null
        }
    }
    componentDidMount() {

    }

    render() {
        return (
                    <div class="download_app_main">
                        <div class="download_app_inner">
                            <div class="text-center color-wh">
                                <h1 class="main-heading-wh">Download QiDZ Now!</h1>
                                <p>Find Plan and book the most kid-friendly activities about town.</p>
                            </div>
                            <div class="download_buttons">
                                <div class="download_btn first_btn">
                                    <img class="down_ic" src="assets/img/apple_ic.png"/>
                                        <a href="#"><img src="../../assets/img/apple_btn.png"/></a>
                                </div>
                                <div class="download_btn">
                                    <img class="down_ic" src="assets/img/android_icon.png"/>
                                    <a href="#"><img src="assets/img/android_btn.png"/></a>
                                </div>                                
                            </div>
                        </div>
                    </div>
                                   
        )
    }
}
export default downloadApp;